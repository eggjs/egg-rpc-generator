'use strict';

const fs = require('mz/fs');
const path = require('path');
const assert = require('assert');
const rimraf = require('mz-modules/rimraf');
const EggRpcGenerator = require('../lib');

describe('test/jsdoc2jar.test.js', () => {
  after(async function() {
    await Promise.all([
      rimraf(path.join(__dirname, 'fixtures/apps/rpc-server/pom.xml')),
      rimraf(path.join(__dirname, 'fixtures/apps/rpc-server/src')),
      rimraf(path.join(__dirname, 'fixtures/apps/rpc-server/target')),
    ]);
  });

  it('should generate ok', async function() {
    const generator = new EggRpcGenerator({
      baseDir: path.join(__dirname, 'fixtures/apps/rpc-server'),
    });
    await generator.execute();

    const items = [
      'src/main/java/com/eggjs/x/common/GenericResult.java',
      'src/main/java/com/eggjs/x/common/HelloError.java',
      'src/main/java/com/eggjs/x/common/HelloResponse.java',
      'src/main/java/com/eggjs/x/common/HelloService.java',
      'src/main/java/com/eggjs/x/common/Request.java',
      'src/main/java/com/eggjs/x/common/Response.java',
      'src/main/java/com/eggjs/x/common/Sub.java',
      'src/main/java/com/eggjs/FooService.java',
      'src/main/java/com/eggjs/NodeTRException.java',
      'pom.xml',
    ];

    for (const item of items) {
      const actual = await fs.readFile(path.join(__dirname, 'fixtures/apps/rpc-server', item), 'utf8');
      const expect = await fs.readFile(path.join(__dirname, 'fixtures/expect/rpc-server', item), 'utf8');
      assert.deepEqual(actual, expect);
    }

    assert(await fs.exists(path.join(__dirname, 'fixtures/apps/rpc-server/target/rpc-server-facade-1.0.0.jar')));
    assert(await fs.exists(path.join(__dirname, 'fixtures/apps/rpc-server/target/rpc-server-facade-1.0.0-sources.jar')));
  });
});
