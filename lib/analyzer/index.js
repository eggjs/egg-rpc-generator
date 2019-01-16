'use strict';

const execSync = require('child_process').execSync;
const jsdoc = require.resolve('jsdoc/jsdoc.js');

class Analyzer {
  /**
   * 接口分析器
   *
   * @param {String} options
   *  - {String} name - 应用名
   *  - {String} root - app/rpc 目录
   *  - {String} baseDir - 应用根目录
   *  - {Object} rpcserver - rpc 的相关配置，最主要是 namespace
   * @constructor
   */
  constructor(options) {
    this.options = options;
    this.logger = options.logger || console;
  }

  analyze() {
    const parsed = this.parse();
    const analyzed = {};

    for (const comment of parsed) {
      if (this.ignore(comment)) {
        continue;
      }
      switch (comment.kind) {
        case 'function':
          require('./interface')(comment, this.options, analyzed);
          break;
        case 'typedef':
          require('./typedef')(comment, this.options, analyzed);
          break;
        default:
          break;
      }
    }
    return analyzed;
  }

  parse() {
    const scripts = `node ${jsdoc} -X ${this.options.root}`;
    this.logger.info(`[jsdoc-analyzer] run command: ${scripts}`);
    try {
      const parsed = execSync(scripts);
      return JSON.parse(parsed.toString().trim());
    } catch (err) {
      err.code = 'JSDOC PARSE ERROR';
      throw err;
    }
  }

  ignore(comment) {
    if (comment.kind === 'typedef') {
      return false;
    }
    if (!comment.tags || !comment.tags.length) {
      return true;
    }
    return comment.tags.every(tag => tag.title !== 'rpc');
  }
}

module.exports = Analyzer;
