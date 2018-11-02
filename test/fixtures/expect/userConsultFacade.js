// Don't modified this file, it's auto created by jar2proxy

'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = function (app) {
  const appName = 'provider';
  let version = '1.0.0';
  if (app.config.proxy && app.config.proxy.envVersion) {
    version = app.config.proxy.envVersion[appName] || version;
  }
  const rpcClient = app.rpcClient;
  if (!rpcClient) return;
  const consumer = rpcClient.createConsumer({
    interfaceName: 'com.ali.jar2proxy.extend.facade.UserConsultFacade',
    version,
    targetAppName: appName,
    group: 'DUBBO',
    proxyName: 'userConsultFacade',
    responseTimeout: 5000,
  });

  /**
   * @author coolme200
   */
  class UserConsultFacade extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }

    // java source code:  public UserConsultResult calcConsultVoucher(UccUserCalcConsultRequest voucherCalcConsultRequest);
    // returnType: com.ali.jar2proxy.extend.model.UserConsultResult
    async calcConsultVoucher(voucherCalcConsultRequest) {
      const args = [
        {
          $class: 'com.ali.jar2proxy.extend.model.UccUserCalcConsultRequest',
          $: voucherCalcConsultRequest,
        }
      ];
      return await consumer.invoke('calcConsultVoucher', args, {
        ctx: this.ctx,
      });
    }

    // java source code:  public UserConsultResult fetchUser(UserConsultRequest voucherConsultRequest);
    // returnType: com.ali.jar2proxy.extend.model.UserConsultResult
    async fetchUser(voucherConsultRequest) {
      const args = [
        {
          $class: 'com.ali.jar2proxy.extend.model.UserConsultRequest',
          $: voucherConsultRequest,
        }
      ];
      return await consumer.invoke('fetchUser', args, {
        ctx: this.ctx,
      });
    }
  }
  return UserConsultFacade;
};

/* eslint-enable */

