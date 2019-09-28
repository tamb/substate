const rimraf = require('rimraf');

console.log('beginning clean');
rimraf('*.tgz', {}, ()=>console.log('removed pack'));
rimraf('/dist', {}, ()=>console.log('removed rollup dist'));
rimraf('browser-test/node_modules', {}, ()=>console.log('removed example node_modules'));
rimraf('browser-test/.cache', {}, ()=>console.log('removed example cache'));
rimraf('browser-test/package-lock.json', {}, ()=>console.log('removed example package-lock.json'));