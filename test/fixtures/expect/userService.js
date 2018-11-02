// Don't modified this file, it's auto created by jar2proxy

'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = function (app) {
  const appName = 'dubbo';
  let version = '1.0.0';
  if (app.config.proxy && app.config.proxy.envVersion) {
    version = app.config.proxy.envVersion[appName] || version;
  }
  const rpcClient = app.rpcClient;
  if (!rpcClient) return;
  const consumer = rpcClient.createConsumer({
    interfaceName: 'org.eggjs.dubbo.UserService',
    version,
    targetAppName: appName,
    group: 'DUBBO',
    proxyName: 'userService',
    responseTimeout: 5000,
  });

  /**
   * 用户服务
   */
  class UserService extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }

    // java source code:  String sayHello(String name);
    // returnType: java.lang.String
    /**
     * 打招呼
     * @param name
     * @return
     */
    async sayHello(name) {
      const args = [
        {
          $class: 'java.lang.String',
          $: name,
        }
      ];
      return await consumer.invoke('sayHello', args, {
        ctx: this.ctx,
      });
    }

    // java source code:  User echoUser(User user);
    // returnType: org.eggjs.dubbo.User
    /**
     * 返回 user
     * @param user
     * @return
     */
    async echoUser(user) {
      const args = [
        {
          $class: 'org.eggjs.dubbo.User',
          $: user,
        }
      ];
      return await consumer.invoke('echoUser', args, {
        ctx: this.ctx,
      });
    }
  }
  return UserService;
};

/* eslint-enable */

