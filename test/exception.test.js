'use strict';

const path = require('path');
const assert = require('assert');
const analyzeInterface = require('../lib/analyzer/interface');
const analyzeTypeDef = require('../lib/analyzer/typedef');

describe('test/exception.test.js', () => {

  it('should throw if missing comment.name', () => {
    assert.throws(
      () => {
        analyzeTypeDef({ comment: '123' }, {}, {});
      },
      /类型定义缺少名字: \n123/
    );

    assert.throws(
      () => {
        analyzeInterface({ comment: '123' }, {}, {});
      },
      /接口定义缺少函数名: \n123/
    );
  });

  it('should throw if comment.name is duplicate', () => {
    assert.throws(
      () => {
        analyzeTypeDef({
          name: 'key',
          comment: '123',
          meta: {
            path: path.join(__dirname, 'fixtures/xxx'),
            filename: 'yyy',
          },
        }, {
          root: 'app/rpc',
          rpcserver: {
            namespace: 'com.eggjs',
          },
        }, {
          yyy: {
            objects: {
              key: {},
            },
          },
        });
      },
      /类 \[key\] 重复定义/
    );
    assert.throws(
      () => {
        analyzeInterface({
          name: 'key',
          meta: {
            filename: 'xxx',
            path: path.join(__dirname, 'fixtures/xxx'),
          },
        }, {
          rpcserver: {
            namespace: 'com.eggjs',
          },
        }, {
          xxx: {
            interfaces: {
              key: {},
            },
          },
        });
      },
      /接口 \[key\] 重复定义/
    );
  });

  it('should throw if property invalid', () => {
    assert.throws(
      () => {
        analyzeTypeDef({
          name: 'key',
          comment: '123',
          properties: [{}],
          meta: {
            filename: 'xxx',
            path: path.join(__dirname, 'fixtures/xxx'),
          },
        }, { rpcserver: { namepace: 'com.eggjs.x' }, root: '123' }, { xxx: { namepace: 'com.eggjs.x' } });
      },
      /类 \[key\] 属性格式错误:\n 123/
    );
  });

  it('should throw if interface param invalid', () => {
    assert.throws(
      () => {
        analyzeInterface({
          name: 'key',
          meta: {
            filename: 'xxx',
            path: path.join(__dirname, 'fixtures/xxx'),
          },
          params: [{}],
        }, { rpcserver: { namepace: 'com.eggjs.x' }, root: '123' }, { xxx: { namepace: 'com.eggjs.x' } });
      },
      /参数格式错误/
    );
    assert.throws(
      () => {
        analyzeInterface({
          name: 'key',
          meta: {
            filename: 'xxx',
            path: path.join(__dirname, 'fixtures/xxx'),
          },
          params: [{
            name: '123',
            type: {
              names: [ 'string' ],
            },
          }],
        }, { rpcserver: { namepace: 'com.eggjs.x' }, root: '123' }, {});
      },
      /必须有一个返回类型/
    );
    assert.throws(
      () => {
        analyzeInterface({
          name: 'key',
          meta: {
            filename: 'xxx',
            path: path.join(__dirname, 'fixtures/xxx'),
          },
          params: [{
            name: '123',
            type: {
              names: [ 'string' ],
            },
          }],
          returns: [{}],
        }, { rpcserver: { namepace: 'com.eggjs.x' }, root: '123' }, {});
      },
      /返回类型格式错误/
    );
  });
});
