'use strict';

const debug = require('debug')('egg-rpc-generator:analyze');
const path = require('path');
const types = require('./types');
const utils = require('../utils');

module.exports = function analyzeTypeDef(comment, config, analyzed) {
  if (!comment.name) {
    throw new Error(`类型定义缺少名字: \n${comment.comment}`);
  }
  const filepath = path.join(comment.meta.path, comment.meta.filename);
  const info = utils.getServiceInfo(filepath, config);
  const className = info.className;
  const namespace = info.namespace;

  if (!analyzed[className]) {
    analyzed[className] = { namespace };
  }
  const objects = analyzed[className].objects = analyzed[className].objects || {};

  if (objects.hasOwnProperty(comment.name)) {
    throw new Error(`类 [${comment.name}] 重复定义`);
  }

  debug(`parse typedef ${comment.name}`);
  // @typedef {Object} TestClass 这种方式定义的会有 type: { names: [ 'Object' ] }
  // 如果指定 Type, name 用 Type 替换
  let name = comment.name;
  if (comment.type && comment.type.names) {
    const typeName = comment.type.names[0];
    if (typeName) {
      name = typeName.replace(/\./g, '');
    }
  }
  const def = {
    name,
    namespace,
    description: comment.description || '',
    properties: [],
    className: getClassName(comment, config.root),
  };

  const properties = comment.properties || [];
  for (const property of properties) {
    if (!property.name || !property.type || !property.type.names || property.type.names.length !== 1) {
      throw new Error(`类 [${comment.name}] 属性格式错误:\n ${comment.comment}`);
    }

    def.properties.push({
      name: property.name,
      type: { type: types.get(property.type.names[0]) },
      description: property.description || '',
    });
  }
  objects[def.name] = def;
};

function getClassName(comment, root) {
  let str = path.join(comment.meta.path, comment.meta.filename);
  str = path.relative(root, str);
  // 转换成驼峰
  str = str.replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
  str = str.replace(/\.js$/, '').replace(path.sep, '.');
  return str;
}
