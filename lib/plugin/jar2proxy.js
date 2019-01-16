'use strict';

const fs = require('mz/fs');
const path = require('path');
const Base = require('sdk-base');
const sleep = require('mz-modules/sleep');

class Jar2proxy extends require('jar2proxy/lib/jar2proxy') {}

class Jar2ProxyPlugin extends Base {
  get baseDir() {
    return this.options.baseDir;
  }

  async execute(units) {
    const proxyConfigPath = 'config/proxy.js';
    const isExist = await fs.exists(path.join(this.baseDir, proxyConfigPath));
    if (!isExist) return;

    const jar2proxy = new Jar2proxy({
      baseDir: this.baseDir,
      tpl: path.join(__dirname, '../tpl/proxy.js.tpl'),
      proxyConfigPath,
      isProduction: process.env.NODE_ENV === 'production',
      units,
    });

    await jar2proxy.run();

    console.log('[Jar2ProxyPlugin] Generated completed.');
    console.log('[Jar2ProxyPlugin] You can see detail at %s/logs/jar2proxy-*.log', jar2proxy.config.baseDir);

    await sleep(1000);
  }
}

module.exports = Jar2ProxyPlugin;
