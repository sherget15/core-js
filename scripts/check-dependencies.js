'use strict';
/* eslint-disable no-console -- output */
const { readdir, readFile } = require('fs').promises;
const { join } = require('path');
const { promisify } = require('util');
const { cyan, green } = require('chalk');
const eq = require('semver/functions/eq');
const coerce = require('semver/functions/coerce');
const minVersion = require('semver/ranges/min-version');
const getDependencies = promisify(require('david').getDependencies);

async function checkDependencies(path, title) {
  const pkg = JSON.parse(await readFile(join('.', path, 'package.json')));
  const dependencies = await getDependencies(pkg);
  const devDependencies = await getDependencies(pkg, { dev: true });
  Object.assign(dependencies, devDependencies);
  for (const name of Object.keys(dependencies)) {
    const { required, stable, warn } = dependencies[name];
    if (/^(?:git|file)/.test(required) || warn || eq(minVersion(required), coerce(stable))) {
      delete dependencies[name];
    }
  }
  if (Object.keys(dependencies).length) {
    console.log(cyan(`${ title || pkg.name }:`));
    console.table(dependencies);
  }
}

(async () => {
  await checkDependencies('', 'root');
  await Promise.all((await readdir('./packages')).map(path => checkDependencies(join('packages', path))));
  console.log(green('dependencies checked'));
})();
