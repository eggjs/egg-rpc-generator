'use strict';

const maven = require('maven');
const Base = require('sdk-base');
const Analyzer = require('../analyzer');
const generatePom = require('../pom_generator');
const getConfig = require('../config').getConfig;

class Jsdoc2JarPlugin extends Base {
  get baseDir() {
    return this.options.baseDir;
  }

  async execute() {
    const config = getConfig(this.baseDir);

    if (config.rpcserver.services.length === 0) return;

    const analyzer = new Analyzer(config);
    const analyzed = analyzer.analyze();
    const distPath = generatePom(config, analyzed);

    const mvn = maven.create({
      cwd: distPath,
    });
    await mvn.execute([ 'clean', 'install' ], { skipTests: true });
    console.log(`
[jsdoc2jar] 1. Java 代码在 ${this.baseDir}/src 目录下
[jsdoc2jar] 2. 生成的 jar 包在 ${this.baseDir}/target 目录下
`);
  }
}

module.exports = Jsdoc2JarPlugin;
