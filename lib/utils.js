'use strict';

const is = require('is-type-of');
const assert = require('assert');

/**
 * format proxy config
 *   1. 将 errorAsNull, responseTimeout 放到 service 中
 *   2. api.key 对象化， dep 数组化
 * @param  {Object} config config
 * @return {Object}        format result
 */
function formatProxyConfig(config) {
  const res = Object.assign({}, config);

  const serviceConfig = {};
  const SERVICE_CONFIG = [ 'errorAsNull', 'responseTimeout' ];

  for (const key in config) {
    if (SERVICE_CONFIG.indexOf(key) > -1) {
      serviceConfig[key] = config[key];
    }
  }
  res.services = !res.services ? [] : res.services.map(service => {
    const target = Object.assign({}, serviceConfig, service);
    assert(target.appName, '[egg-rpc-generator] service.appName is required in proxy.js');
    return normalizeService(target);
  });
  return res;
}

/**
 * api: {key: value} -> {key: {interface: value}}  dependency: {} -> [{}]
 * @param  {Object} service    proxy config service
 * @return {Object}         format service
 */
function normalizeService(service) {
  const api = service.api;
  Object.keys(api).forEach(function(key) {
    // 支持简化配置
    if (is.string(api[key])) {
      const strArr = api[key].split(':');
      api[key] = {
        interfaceName: strArr[0],
        version: strArr[1],
      };
    }
    const item = api[key];
    item.name = key;
    item.method = item.method || {};

  });
  return service;
}

exports.formatProxyConfig = formatProxyConfig;
exports.normalizeService = normalizeService;
