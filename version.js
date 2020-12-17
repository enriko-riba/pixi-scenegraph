const pkg = require('./package.json');
const fs = require('fs');
fs.writeFile('./src/_version.ts', 'export const VERSION = "' + pkg.version + '";', function (err) {
    if (err) {
        return console.log(err);
    }

    console.log('VERSION.ts -> ' + pkg.version);
});
