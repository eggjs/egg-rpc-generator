'use strict';

const fs = require('mz/fs');
const path = require('path');
const assert = require('assert');
const rimraf = require('mz-modules/rimraf');
const EggRpcGenerator = require('../lib');

describe('test/jar2proxy.test.js', () => {
  after(async function() {
    await Promise.all([
      rimraf(path.join(__dirname, 'fixtures/apps/jar2proxy/app/proxy')),
      rimraf(path.join(__dirname, 'fixtures/apps/jar2proxy/app/proxy_class')),
    ]);
  });

  it('should generate ok', async function() {
    const generator = new EggRpcGenerator({
      baseDir: path.join(__dirname, 'fixtures/apps/jar2proxy'),
    });
    await generator.execute();

    await Promise.all([
      'app/proxy/userConsultFacade.js',
      'app/proxy_class/index.js',
      'app/proxy_class/com/ali/jar2proxy/extend/model/BusinessContext.js',
      'app/proxy_class/com/ali/jar2proxy/generic/enums/TOPIC_TYPE.js',
      'app/proxy_class/com/ali/jar2proxy/generic/model/CommunityCommonResult.js',
      'app/proxy_class/com/ali/jar2proxy/normal/model/AbstractUser.js',
    ].map(async function(file) {
      return fs.exists(path.join(__dirname, 'fixtures/apps/jar2proxy', file));
    }));

    const actual = await fs.readFile(path.join(__dirname, 'fixtures/apps/jar2proxy/app/proxy/userConsultFacade.js'), 'utf8');
    const expect = await fs.readFile(path.join(__dirname, 'fixtures/expect/userConsultFacade.js'), 'utf8');

    assert(actual === expect);
  });
});
