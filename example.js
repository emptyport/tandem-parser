var fs = require('fs');
var tandem = require('./index');

var filename = "output.xml";

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;

    psmList = tandem.parse(data);
    //console.log(psmList);
});