'use strict';

const path = require('path');
const is = require('is-type-of');
const Base = require('sdk-base');
const utils = require('egg-utils');

const internalPlugins = {
  protobuf: require('./plugin/protobuf'),
  jar2proxy: require('./plugin/jar2proxy'),
};

const defaultOptions = {
  baseDir: process.cwd(),
  plugin: [ 'protobuf', 'jar2proxy' ],
  keepCase: false,
};

class EggRpcGenerator extends Base {
  constructor(options = {}) {
    super(Object.assign({}, defaultOptions, options));

    this.baseDir = path.isAbsolute(this.options.baseDir) ?
      this.options.baseDir :
      path.resolve(process.cwd(), this.options.baseDir);
  }

  async execute() {
    const framework = utils.getFrameworkPath({
      baseDir: this.baseDir,
      framework: this.options.framework,
    });
    console.info('[EggRpcGenerator] framework: %s, baseDir: %s', framework, this.baseDir);
    const units = utils.getLoadUnits({
      baseDir: this.baseDir,
      framework,
    });
    const plugins = this.options.plugin || [];
    const baseDir = this.baseDir;
    const keepCase = this.options.keepCase;
    const opts = { baseDir, keepCase };

    for (const plugin of plugins) {
      const mod = internalPlugins[plugin] || require(plugin);
      let pluginModule;
      if (is.class(mod)) {
        pluginModule = new mod(opts);
        await pluginModule.execute(units);
      } else {
        await mod(units, { baseDir, keepCase });
      }
    }
  }
}

module.exports = EggRpcGenerator;
