var xmlConverter = require('xml-js');
var fs = require('fs');

module.exports.parse = function(fileText) {
  let psmList = [];

  var xmlDoc = xmlConverter.xml2json(fileText, {compact: true, spaces: 2});
  var xmlObj = JSON.parse(xmlDoc);

  let idObjList = xmlObj.bioml.group;
  psmList = idObjList.map(extractInfo);

  return psmList;
};

extractInfo = (idObj) => {

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
    'rank': '',
    'search_engine': 'tandem'
  };

  return psm;
}