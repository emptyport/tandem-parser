# tandem-parser
A parser for the output of the [X! tandem](https://www.thegpm.org/tandem/) peptide identification software.

> This module works correctly in the limited cases I've tested it in, but it should be considered in a beta state until it's been proven against more input files.

> The peptide-spectrum-match module is also under active development, so there may be changes in the objects returned by the parser.

## Installation
npm install tandem-parser --save

## Usage

### Quickstart
```javascript
var fs = require('fs');
var tandem = require('tandem-parser');

var filename = "output.xml";

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;

    let psmList = tandem.parse(data);
    console.log(psmList);
});
```
Output:
```
[
    peptideSpectrumMatch {
        sequence: 'AEAPKPEVPEDEPEGEPDVK',
        sequence_pre: 'K',
        sequence_post: 'D',
        missed_cleavages: 0,
        protein: 'YCR088W',
        charge: 1,
        retention_time: 23.56,
        precursor_mass: 2161.005723533188,
        mass_err: -0.0005,
        theoretical_mass: 2161.006223533188,
        modifications: [],
        filename: 'test_spectra.mgf',
        scan_title: 'Label: W545, Spot_Id: 158779, Peak_List_Id: 184473, MSMS Job_Run_Id: 14047, Comment:',
        scan_id: '660',
        search_engine: 'tandem',
        hyperscore: 67.1,
        nextscore: 14.1,
        expect: 9e-13,
        is_decoy: false,
        rank: 1 
    },
  ... 101 more items ]
```

All spectra are saved as [peptide-spectrum-match](https://www.npmjs.com/package/peptide-spectrum-match) objects. In this case the `score` of the peptide-spectrum-match object will be X! tandem's hyperscore.

---
#### parse(xmlString, decoyTag=undefined)
This is the only function in this module. The first argument is the XML string that you wish to parse. The second, optional argument is the text tag that indicates a sequence is a decoy. The parser will look in the description line of the FASTA entry to determine whether or not it is a decoy. In the below FASTA example, a decoy tag of "reversed_decoy" would match the first but not the second entry. Any matches to the first sequence will be considered a decoy when the file is parsed.

> \>sequence-1_reversed_decoy
>
> ASDFGHKL
> 
> \>sequence-2
> 
> ELVISLIVES

## Tests
You can run `npm test` to run the tests after installing the development dependencies.

## Future functionality
X! tandem doesn't use named modifications in the output files (e.g. it uses 57.02 instead of calling it carbamidomethylation). Right now the plan is to try to map the modifications back to Unimod and use "Unknown" or "Custom" for any custom modifications.

## License
This software is released under the MIT license.

## Support this project!

[![Support this project on Patreon!](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/MikeTheBiochem)
