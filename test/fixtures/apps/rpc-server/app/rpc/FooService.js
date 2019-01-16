'use strict';

/**
 * 获取用户信息
 * @param {String} login - 用户域账号
 * @return {Object} 完整用户信息
 * @rpc
 */
exports.getUser = function*(login) {
  return {
    login,
    name: 'foo user',
  };
};

/**
 * [*testType description]
 * @param {int} i - [description]
 * @param {integer} it - [description]
 * @param {number} n - [description]
 * @param {boolean} bl - [description]
 * @param {bool} b - [description]
 * @param {long} l - [description]
 * @param {string} s - [description]
 * @param {object} o - [description]
 * @param {map} map - [description]
 * @param {array} array - [description]
 * @param {list} list - [description]
 * @return {String} [description]
 * @rpc
 */
exports.testType = function*(i, it, n, bl, b, l, s, o, map, array, list) {
  return 'ok';
};
