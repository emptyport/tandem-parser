var xmlConverter = require('xml-js');

module.exports.parse = function(fileText) {
  let psmList = [];

  var xmlDoc = xmlConverter.xml2json(fileText, {compact: false, spaces: 2});
  var xmlObj = JSON.parse(xmlDoc);

  let idObjList = xmlObj.elements[1].elements;
  let psm = {
    'sequence': '',
    'sequence_pre': '',
    'sequence_post': '',
    'charge': '',
    'retention_time': '',
    'precursor_mass': '',
    'mass_err': '',
    'theoretical_mass': '',
    'modifications': '',
    'filename': '',
    'scan_title': '',
    'scan_id': '',
    'score': '',
    'expect': '',
    'is_decoy': '',
    'rank': ''
  };
  console.log(idObjList[0]);
  console.log(idObjList[0].elements[0]);


  return psmList;
};