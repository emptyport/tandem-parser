var xmlConverter = require('xml-js');
var fs = require('fs');

const PROTON = 1.007276466812;

module.exports.parse = function(fileText) {
  let psmList = [];

  var xmlDoc = xmlConverter.xml2json(fileText, {compact: true, spaces: 2});
  var xmlObj = JSON.parse(xmlDoc);

  let idObjList = xmlObj.bioml.group;
  
  idObjList = idObjList.filter(function(idObj) {
    return idObj['_attributes']['type'] === 'model';
  });

  psmList = idObjList.map(extractInfo);

  return psmList;
};

extractInfo = (idObj) => {
  let attributes = idObj['_attributes'];
  let protein = idObj['protein'];
  let group = idObj['group'];

  var scan_title = '';

  
  group.forEach(function(g) {
    if(g['_attributes']['type'] === 'fragment ion mass spectrum') {
      scan_title = g['note']['_text'];
    }
  });

  let psm = {
    'sequence': '',
    'sequence_pre': '',
    'sequence_post': '',
    'charge': parseInt(attributes['z']),
    'retention_time': parseFloat(attributes['rt']),
    'precursor_mass': parseFloat(attributes['mh']) - PROTON,
    'mass_err': '',
    'theoretical_mass': '',
    'modifications': '',
    'filename': '',
    'scan_title': scan_title,
    'scan_id': attributes['id'],
    'score': '',
    'expect': parseFloat(attributes['expect']),
    'is_decoy': '',
    'rank': '',
    'search_engine': 'tandem'
  };

  return psm;
}