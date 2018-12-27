'use strict';

const debug = require('debug')('egg-rpc-tool');
const fs = require('mz/fs');
const path = require('path');
const antpb = require('antpb');
const chalk = require('chalk');
const Base = require('sdk-base');
const utils = require('../utils');
const mkdirp = require('mz-modules/mkdirp');
const Handlebars = require('../handlebars');
const Root = antpb.protobuf.Root;

class ProtoRPCPlugin extends Base {
  get baseDir() {
    return this.options.baseDir;
  }

  get keepCase() {
    return this.options.keepCase;
  }

  async generateProxy(tpl, service) {
    try {
      const content = tpl(service);
      const proxyfile = path.join(this.baseDir, 'app', 'proxy', `${service.name}.js`);
      await fs.writeFile(proxyfile, content);
    } catch (err) {
      console.error(chalk.red(err.stack));
    }
  }

  async execute(units) {
    const allProxies = new Map();
    const root = new Root();
    let source = await fs.readFile(path.join(__dirname, '..', 'tpl', 'pb_proxy.js.tpl'), 'utf8');

    for (const unit of units) {
      const dir = path.isAbsolute(unit.path) ? unit.path : path.resolve(process.cwd(), unit.path);

      // 1. 加载 ${base}/proto 目录里的 *.proto 文件
      const protoDir = path.join(dir, 'proto');
      let exists = await fs.exists(protoDir);
      if (exists) {
        console.log(this.keepCase);
        const proto = antpb.loadAll(protoDir, { keepCase: this.keepCase });
        Root.fromJSON(proto.toJSON(), root);
      }

      // 2. 读取 proxy.js 配置
      const proxyConfigFile = path.join(dir, 'config', 'proxy.js');
      exists = await fs.exists(proxyConfigFile);
      if (exists) {
        const proxyConfig = utils.formatProxyConfig(require(proxyConfigFile));
        const services = proxyConfig.services;
        for (const service of services) {
          for (const name in service.api) {
            const api = service.api[name];
            const interfaceName = api.dataId || api.interfaceName;
            let serviceProto;
            try {
              serviceProto = root.lookupService(interfaceName);
              console.log('[ProtoRPCPlugin] found "%s" in proto file', chalk.green(interfaceName));
            } catch (err) {
              debug('[ProtoRPCPlugin] not found interfaceName:%s in proto file, errMsg: %s', interfaceName, err.message);
              continue;
            }
            allProxies.set(name, {
              name,
              interfaceName,
              version: api.version || '1.0',
              group: api.group || 'SOFA',
              uniqueId: api.uniqueId,
              appName: service.appName,
              errorAsNull: api.errorAsNull != null ? api.errorAsNull : !!service.errorAsNull,
              responseTimeout: api.responseTimeout || service.responseTimeout,
              vip: service.vip,
              methods: serviceProto.methodsArray.map(m => ({
                methodName: m.name,
                extConfig: api.method[m.name] || {},
              })),
            });
          }
        }
      }

      // 3. 加载自定义模板
      const proxyTplFile = path.join(dir, 'config', 'pb_proxy.js.tpl');
      exists = await fs.exists(proxyTplFile);
      if (exists) {
        source = await fs.readFile(proxyTplFile, 'utf8');
      }
    }

    await mkdirp(path.join(this.baseDir, 'app', 'proxy'));
    const tpl = Handlebars.compile(source);
    await Promise.all(Array.from(allProxies.values()).map(service => {
      return this.generateProxy(tpl, service);
    }));

    // 将所有 *.proto 文件信息合并以后以 json 形式保存在 run 目录下
    const jsonStr = JSON.stringify(root.toJSON(), null, '  ');
    const runFolder = path.join(this.baseDir, 'run');
    const protoFile = path.join(runFolder, 'proto.json');
    await mkdirp(runFolder);
    await fs.writeFile(protoFile, jsonStr);
    console.log('[ProtoRPCPlugin] save all proto info into "%s"', protoFile);
  }
}

module.exports = ProtoRPCPlugin;
