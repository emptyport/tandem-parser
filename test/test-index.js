var fs = require('fs');
var test = require('tape');
var tandem = require('../index');

var filename = "output.xml";

test('Basic parsing', function(t) {
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;

    let psmList = tandem.parse(data, 'decoy');
    let spectrumID = psmList[0];

    t.equal(spectrumID['search_engine'], 'tandem', 'Search engine is correct');
    t.equal(spectrumID['sequence'], 'SIVPSGASTGVHEALEMR', 'Sequence is correct');
    t.equal(spectrumID['sequence_pre'], 'R', 'Sequence pre is correct');
    t.equal(spectrumID['sequence_post'], 'D', 'Sequence post is correct');
    t.equal(spectrumID['missed_cleavages'], 0, 'Missed cleavages is correct');
    t.equal(spectrumID['protein'], 'YGR254W_decoy', 'Protein is correct');
    t.equal(spectrumID['charge'], 1, 'Charge is correct');
    t.equal(spectrumID['retention_time'], 10.2, 'Retention time is correct');
    t.equal(spectrumID['precursor_mass'], 1839.9187235331879, 'Precursor mass is correct');
    t.equal(spectrumID['mass_err'], 0.0038, 'Mass err is correct');
    t.equal(spectrumID['theoretical_mass'], 1839.914923533188, 'Theoretical mass is correct');
    t.equal(spectrumID['modifications'].length, 0, 'Modifications are correct (there are none)');
    t.equal(spectrumID['filename'], 'test_spectra.mgf', 'Spectra filename is correct');
    t.equal(spectrumID['scan_title'], 'Label: W933, Spot_Id: 159969, Peak_List_Id: 184764, MSMS Job_Run_Id: 14047, Comment:', 'Scan title is correct');
    t.equal(spectrumID['scan_id'], '581', 'Scan ID is correct');
    t.equal(spectrumID['score'], 66.8, 'Hyperscore is correct');
    t.equal(spectrumID['expect'], 3.3e-12, 'Expect value is correct');
    t.equal(spectrumID['is_decoy'], true, 'Is a decoy');
    t.equal(spectrumID['rank'], 1, 'Rank is correct');
    t.end();
  });
});
