'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const InteropRequire = require('interop-require');

function getConfig(baseDir) {
  const root = path.join(baseDir, 'app/rpc');
  const pkg = require(path.join(baseDir, 'package.json'));
  const services = [];
  const config = {
    name: pkg.name,
    pkg,
    baseDir,
    root,
    rpcserver: { services },
  };

  if (!fs.existsSync(root)) {
    return config;
  }

  let configFile = path.join(baseDir, 'config/config.default.js');
  if (!fs.existsSync(configFile)) {
    configFile = path.join(baseDir, 'config/config.js');
  }
  if (!fs.existsSync(configFile)) {
    return config;
  }

  let appConfig = InteropRequire(configFile);
  if (typeof appConfig === 'function') {
    appConfig = appConfig({
      HOME: baseDir,
      root: baseDir,
      baseDir,
    });
  }

  config.rpcserver = appConfig.rpc && appConfig.rpc.server || {};
  const names = fs.readdirSync(root);
  for (const name of names) {
    const filepath = path.join(root, name);
    if (!name.endsWith('.js') || !fs.statSync(filepath).isFile()) {
      continue;
    }
    const key = path.parse(name).name;
    services.push(key);
  }

  config.rpcserver.services = services;
  assert(config.rpcserver.namespace, 'config.rpc.server.namespace required');

  return config;
}

exports.getConfig = getConfig;
