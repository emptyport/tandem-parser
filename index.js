var xmlConverter = require('xml-js');
var fs = require('fs');

const PROTON = 1.007276466812;

module.exports.parse = function(fileText) {
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
      return extractInfo(idObj, filename);}
    );

  return psmList;
};

extractInfo = (idObj, filename) => {
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

  var modifications = {};
  if(peptide.domain.hasOwnProperty('aa')) {
    let mods = peptide.domain.aa;
    if(Array.isArray(mods)) {

    }
    else {
      modifications = {
        'residue': mods._attributes.type,
        'mass': mods._attributes.modified,
        'position': parseInt(mods._attributes.at) - parseInt(peptide.domain._attributes.start)
      };
    }
  }

  var scan_title = '';
  group.forEach(function(g) {
    if(g['_attributes']['label'] === 'fragment ion mass spectrum') {
      scan_title = g['note']['_text'];
    }
  });

  let psm = {
    'sequence': peptide['domain']['_attributes']['seq'],
    'sequence_pre': peptide['domain']['_attributes']['pre'][3],
    'sequence_post': peptide['domain']['_attributes']['post'][0],
    'charge': parseInt(attributes['z']),
    'retention_time': parseFloat(attributes['rt']),
    'precursor_mass': parseFloat(attributes['mh']) - PROTON,
    'mass_err': parseFloat(peptide['domain']['_attributes']['delta']),
    'theoretical_mass': parseFloat(attributes['mh']) - PROTON - parseFloat(peptide['domain']['_attributes']['delta']),
    'modifications': modifications,
    'filename': filename,
    'scan_title': scan_title,
    'scan_id': attributes['id'],
    'score': parseFloat(peptide['domain']['_attributes']['hyperscore']),
    'expect': parseFloat(attributes['expect']),
    'is_decoy': '',
    'rank': 1,
    'search_engine': 'tandem'
  };

  console.log(psm);
  console.log(modifications);

  return psm;
}