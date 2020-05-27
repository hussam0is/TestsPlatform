var convert = require('xml-js');
const fs = require('fs')
var parser = require('xml2json');
var path = require('path')

var file = path.win32.basename('C:\\Program Files (x86)\\Jenkins\\jobs\\Hello world 2\\config.xml')
console.log(file)

fs.readFile('/Program Files (x86)/Jenkins/jobs/Hello world 2/config.xml', function (err, data) {

    const json = parser.toJson(data.toString(), {'object':true});
    console.log("to json ->", json);

});

/*

var xml =
    '<?xml version="1.0" encoding="utf-8"?>' +
    '<note importance="high" logged="true">' +
    '    <title>Happy</title>' +
    '    <todo>Work</todo>' +
    '    <todo>Play</todo>' +
    '</note>';
const result1 = convert.xml2js(xml, {compact: true, spaces: 4});
const result2 = convert.xml2js(xml, {compact: false, spaces: 4});
console.log(result1, '\n', result2);
console.log(result1['note']['todo'][0]['_text'])
*/
