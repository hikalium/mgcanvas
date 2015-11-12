// http://tmlife.net/programming/javascript/javascript-compression-uglifyjs-usage.html
var fs      = require("fs");
var uglify  = require("uglify-js");
var outputFile = fs.createWriteStream("www/mgcanvas.min.js");
var min = uglify.minify("./mgcanvas.js");
// 出力
outputFile.write(min.code);
