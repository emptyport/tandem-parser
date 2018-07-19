var xmlConverter = require('xml-js');
var peptideSpectrumMatch = require('peptide-spectrum-match');

const PROTON = 1.007276466812;

module.exports.parse = function(fileText, decoyTag=undefined) {
  let psmList = [];

  var xmlDoc = xmlConverter.xml2json(fileText, {compact: true, spaces: 2});
  var xmlObj = JSON.parse(xmlDoc);

  let idObjList = xmlObj.bioml.group;
  let modelString = xmlObj.bioml._attributes.label;
  let filename = modelString.match(/'([^']+)'/)[1];

  psmList = idObjList
    .filter(function(idObj) {
      return idObj['_attributes']['type'] === 'model';
    })
    .map(function(idObj) {
      return extractInfo(idObj, filename, decoyTag);}
    );

  return psmList;
};

extractInfo = (idObj, filename, decoyTag) => {
  let attributes = idObj['_attributes'];
  let protein = idObj['protein'];
  let group = idObj['group'];
  
  var best_match;
  if(Array.isArray(protein)) {
    best_match = protein[0];
  }
  else {
    best_match = protein;
  }

  let peptide = best_match['peptide'];

  var modifications = [];
  if(peptide.domain.hasOwnProperty('aa')) {
    let mods = peptide.domain.aa;
    if(Array.isArray(mods)) {
      mods.forEach(function(mod) {
        modifications.push({
          'residue': mod._attributes.type,
          'mass': mod._attributes.modified,
          'position': parseInt(mod._attributes.at) - parseInt(peptide.domain._attributes.start)
        });
      });
    }
    else {
      modifications = [
        {
          'residue': mods._attributes.type,
          'mass': mods._attributes.modified,
          'position': parseInt(mods._attributes.at) - parseInt(peptide.domain._attributes.start)
        }
      ];
    }
  }

  var scan_title = '';
  group.forEach(function(g) {
    if(g['_attributes']['label'] === 'fragment ion mass spectrum') {
      scan_title = g['note']['_text'].trim();
    }
  });

  var isDecoy = false;
  if(attributes['label'].includes(decoyTag)) {
    isDecoy = true;
  }

  let psm = {
    'sequence': peptide['domain']['_attributes']['seq'],
    'sequence_pre': peptide['domain']['_attributes']['pre'][3],
    'sequence_post': peptide['domain']['_attributes']['post'][0],
    'missed_cleavages': parseInt(peptide['domain']['_attributes']['missed_cleavages']),
    'protein': attributes['label'],
    'charge': parseInt(attributes['z']),
    'retention_time': parseFloat(attributes['rt']),
    'precursor_mass': parseFloat(attributes['mh']) - PROTON,
    'mass_err': parseFloat(peptide['domain']['_attributes']['delta']),
    'theoretical_mass': parseFloat(attributes['mh']) - PROTON - parseFloat(peptide['domain']['_attributes']['delta']),
    'modifications': modifications,
    'filename': filename,
    'scan_title': scan_title,
    'scan_id': attributes['id'],
    'hyperscore': parseFloat(peptide['domain']['_attributes']['hyperscore']),
    'nextscore': parseFloat(peptide['domain']['_attributes']['nextscore']),
    'expect': parseFloat(attributes['expect']),
    'is_decoy': isDecoy,
    'rank': 1,
    'search_engine': 'tandem'
  };

  var psmObj = new peptideSpectrumMatch(psm);

  return psmObj;
}