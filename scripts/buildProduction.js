const shell = require('shelljs');
const outputPath = 'build';
shell.exec(`webpack --config webpack-production.config.js --output-path ${outputPath}`);
shell.mv('build/index.js', 'build/release.js');
