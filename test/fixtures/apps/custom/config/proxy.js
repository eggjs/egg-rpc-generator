'use strict';

module.exports = {
  group: 'SOFA',
  errorAsNull: false,
  services: [{
    appName: 'pb',
    responseTimeout: 100,
    api: {
      CustomService: {
        interfaceName: 'com.alipay.sofa.rpc.test.ProtoService',
        version: '1.0',
        method: {
          echoObj: {
            responseTimeout: 3000,
          },
        },
      },
    },
  }],
};
