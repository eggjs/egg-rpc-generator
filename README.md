# egg-rpc-generator

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-rpc-generator.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-rpc-generator
[travis-image]: https://img.shields.io/travis/eggjs/egg-rpc-generator.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-rpc-generator
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-rpc-generator.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-rpc-generator?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-rpc-generator.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-rpc-generator
[snyk-image]: https://snyk.io/test/npm/egg-rpc-generator/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-rpc-generator
[download-image]: https://img.shields.io/npm/dm/egg-rpc-generator.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-rpc-generator

RPC tools for egg framework

## Install

```bash
$ npm i egg-rpc-generator -g
```

## Usage

### 1. Command-line interface (cli) usage

```bash
$ egg-rpc-generator -h

  Usage: egg-rpc-generator [options]

  Options:

    -b, --base [base]            the base directory of the project
    -p, --plugin [plugin]        the plugins used in generation process
    -f, --framework [framework]  specify framework that can be absolute path or npm package
    -k, --keep-case              keeps field casing instead of converting to camel case
    -h, --help                   output usage information
```

- `-b, --base` the egg project root folder, default is `process.cwd()`
- `-p, --plugin` the plugins will be used in generation process, by default `protobuf` plugin will be activated
- `-f, --framework` specify the custom egg framework name or path
- `-k, --keep-case` keeps field casing instead of converting to camel case


run `egg-rpc-generator` under the egg project root folder

```bash
$ egg-rpc-generator

Create /home/admin/project proxy
[ProtoRPCPlugin] found "com.rpc.test.ProtoService" in proto file
[ProtoRPCPlugin] save all proto info into "/home/admin/project/run/proto.json"
------------------------------------------------
All done
```

### 2. Usage with `package.json` scripts

```js
{
  "scripts": {
    "rpc": "egg-rpc-generator"
  }
}
```

Run arbitrary package scripts

```bash
$ npm run rpc

Create /home/admin/project proxy
[ProtoRPCPlugin] found "com.rpc.test.ProtoService" in proto file
[ProtoRPCPlugin] save all proto info into "/home/admin/project/run/proto.json"
------------------------------------------------
All done
```

## Build-in Plugin

### Protobuf Plugin
to generate rpc schema and proxy files from *.proto files

- step 1: put your *.proto files into `$base/proto` folder

```
.
├── app
├── config
│   ├── config.default.js
│   └── proxy.js
├── package.json
└── proto
    └── ProtoService.proto
```

`proto/ProtoService.proto`

```proto
syntax = "proto3";

package com.alipay.sofa.rpc.test;

// 可选
option java_multiple_files = false;

service ProtoService {
  rpc echoObj (EchoRequest) returns (EchoResponse) {}
}

message EchoRequest {
  string name = 1;
  Group group = 2;
}

message EchoResponse {
  int32 code = 1;
  string message = 2;
}

enum Group {
  A = 0;
  B = 1;
}
```

- step 2: config the config/proxy.js

```js
module.exports = {
  group: 'SOFA',
  errorAsNull: false,
  services: [{
    appName: 'pb',
    responseTimeout: 100,
    api: {
      ProtoService: {
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
```

- step 3: run `egg-rpc-generator` under the project folder

will generate `app/rpc/ProtoService.js` and `run/proto.json`
```bash
.
├── app
│   └── rpc
│       └── ProtoService.js
├── config
│   ├── config.default.js
│   └── proxy.js
├── package.json
├── proto
│   └── ProtoService.proto
└── run
    └── proto.json
```

`app/rpc/ProtoService.js`
```js
// Don't modified this file, it's auto created by egg-rpc-generator

'use strict';

const path = require('path');

/* eslint-disable */
/* istanbul ignore next */
module.exports = app => {
  const consumer = app.rpcClient.createConsumer({
    interfaceName: 'com.alipay.sofa.rpc.test.ProtoService',
    targetAppName: 'pb',
    version: '1.0',
    group: 'SOFA',
    proxyName: 'ProtoService',
    responseTimeout: 100,
  });

  if (!consumer) {
    // `app.config['pb.rpc.service.enable'] = false` will disable this consumer
    return;
  }

  app.beforeStart(async() => {
    await consumer.ready();
  });

  class ProtoService extends app.Proxy {
    constructor(ctx) {
      super(ctx, consumer);
    }

    async echoObj(req) {
      return await consumer.invoke('echoObj', [ req ], {
        ctx: this.ctx,
        responseTimeout: 3000,
      });
    }
  }

  return ProtoService;
};
/* eslint-enable */
```



## Write Your Plugin

You can write your own egg-rpc-generator plugin.

- Write a plugin, and publish it to NPM.

```js
module.exports = async (units, { baseDir }) => {
  // do something
};
```

- Use plugin:

install plugin from NPM, then use it with egg-rpc-generator:

```
$ egg-rpc-generator -p pluginName1,pluginName2,...
```

## License

[MIT](LICENSE)
