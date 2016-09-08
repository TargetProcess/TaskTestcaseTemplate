const shell = require('shelljs');
const outputPath = 'build/library';
shell.rm('-rf', outputPath);
shell.exec(`webpack --config webpack-library.config.js --output-path ${outputPath}`);
shell.cp('docs/README.md', `${outputPath}/README.mkd`);
shell.cp('docs/*.png', `${outputPath}/`);
