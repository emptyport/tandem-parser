var xmlConverter = require('xml-js');
var fs = require('fs');

const PROTON = 1.007276466812;

module.exports.parse = function(fileText) {
  let psmList = [];

  var xmlDoc = xmlConverter.xml2json(fileText, {compact: true, spaces: 2});
  var xmlObj = JSON.parse(xmlDoc);

  let idObjList = xmlObj.bioml.group;

  psmList = idObjList
    .filter(function(idObj) {
      return idObj['_attributes']['type'] === 'model';
    })
    .map(extractInfo);

  return psmList;
};

extractInfo = (idObj) => {
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

  var scan_title = '';
  group.forEach(function(g) {
    if(g['_attributes']['type'] === 'fragment ion mass spectrum') {
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
    'theoretical_mass': '',
    'modifications': '',
    'filename': '',
    'scan_title': scan_title,
    'scan_id': attributes['id'],
    'score': parseFloat(peptide['domain']['_attributes']['hyperscore']),
    'expect': parseFloat(attributes['expect']),
    'is_decoy': '',
    'rank': 1,
    'search_engine': 'tandem'
  };

  return psm;
}