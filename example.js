var fs = require('fs');
var tandem = require('./index');

var filename = "output.xml";

fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;

    let psmList = tandem.parse(data);
    //console.log(psmList);
    console.log(psmList[8].getHeader());
    console.log(psmList[8].getDelimited());
});