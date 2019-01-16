'use strict';

const debug = require('debug')('egg-rpc-generator:analyze');
const path = require('path');
const types = require('./types');
const utils = require('../utils');

module.exports = function analyzeInterface(comment, config, analyzed) {
  if (!comment.name) {
    throw new Error(`接口定义缺少函数名: \n${comment.comment}`);
  }

  const filepath = path.join(comment.meta.path, comment.meta.filename);
  const key = `${filepath}:${comment.name}`;
  debug(`parse interface ${key}`);

  const info = utils.getServiceInfo(filepath, config);
  const className = info.className;
  const namespace = info.namespace;

  if (!analyzed[className]) {
    analyzed[className] = { namespace };
  }
  const interfaces = analyzed[className].interfaces = analyzed[className].interfaces || {};

  if (interfaces.hasOwnProperty(comment.name)) {
    throw new Error(`接口 [${comment.name}] 重复定义`);
  }

  const api = {
    description: comment.description,
    name: comment.name,
    request: null,
    response: null,
  };
  const params = comment.params || [];
  api.request = [];
  for (const param of params) {
    if (checkRequestType(param)) {
      throw new Error(`接口 [${key}] 参数格式错误`);
    }
    param.type.names[0] = types.get(param.type.names[0]);
    api.request.push(param);
  }
  const returns = comment.returns;
  if (!returns || returns.length !== 1) {
    throw new Error(`接口 [${key}] 必须有一个返回类型`);
  }
  const r = returns[0];
  if (checkResponseType(r)) {
    throw new Error(`接口 [${key}] 返回类型格式错误`);
  }
  api.response = {
    description: r.description,
    name: types.get(r.type.names[0]),
  };
  interfaces[comment.name] = api;
};

function checkRequestType(param) {
  return !param.name || !param.type || !param.type.names || param.type.names.length !== 1;
}

function checkResponseType(result) {
  return !result.type || !result.type.names || result.type.names.length !== 1;
}
