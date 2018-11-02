'use strict';

module.exports = {
  responseTimeout: 5000,
  group: 'DUBBO',
  version: '1.0.0',
  services: [{
    appName: 'provider',
    api: {
      UserConsultFacade: {
        interfaceName: 'com.ali.jar2proxy.extend.facade.UserConsultFacade',
      },
    },
    dependency: [{
      groupId: 'com.alibaba.jar2proxy.facade',
      artifactId: 'jar2proxy-facade',
      version: '1.0.0',
    }],
  }, {
    appName: 'dubbo',
    api: {
      UserService: {
        interfaceName: 'org.eggjs.dubbo.UserService',
      },
    },
    dependency: [{
      groupId: 'eggjs',
      artifactId: 'dubbo-demo-api',
      version: '1.0-SNAPSHOT',
    }],
  }],
};
