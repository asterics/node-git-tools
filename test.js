var path = require("path");
var { getReferenceInPath } = require("./index.js");

let location = path.join(process.cwd(), ".");

console.log(getReferenceInPath(location, "AsTeRICS"));
console.log(getReferenceInPath(location, "asterics-docs"));
console.log(getReferenceInPath(location, "Bobo"));
