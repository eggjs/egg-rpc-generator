'use strict';

const fs = require('mz/fs');
const path = require('path');
const assert = require('assert');
const rimraf = require('mz-modules/rimraf');
const EggRpcGenerator = require('../lib');

describe('test/index.test.js', () => {
  after(async function() {
    await Promise.all([
      rimraf(path.join(__dirname, 'fixtures/apps/rpc/app/proxy')),
      rimraf(path.join(__dirname, 'fixtures/apps/rpc/run')),
      rimraf(path.join(__dirname, 'fixtures/apps/rpc/app/proxy')),
      rimraf(path.join(__dirname, 'fixtures/apps/rpc/run')),
      rimraf(path.join(__dirname, 'fixtures/apps/keepCase/run')),
    ]);
  });

  it('should generate ok', async function() {
    const generator = new EggRpcGenerator({
      baseDir: path.join(__dirname, 'fixtures/apps/rpc'),
    });
    await generator.execute();

    let isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/rpc/app/proxy/ProtoService.js'));
    assert(isExist);
    isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/rpc/app/proxy/ProtoService2.js'));
    assert(isExist);
    isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/rpc/app/proxy/NotExistService.js'));
    assert(!isExist);
    isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/rpc/run/proto.json'));
    assert(isExist);

    const actual = await fs.readFile(path.join(__dirname, 'fixtures/apps/rpc/app/proxy/ProtoService.js'), 'utf8');
    const expect = await fs.readFile(path.join(__dirname, 'fixtures/expect/ProtoService.js'), 'utf8');

    assert(actual === expect);
  });

  it('should support custom tpl', async function() {
    const generator = new EggRpcGenerator({
      baseDir: path.join(__dirname, 'fixtures/apps/custom'),
    });
    await generator.execute();

    let isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/custom/app/proxy/CustomService.js'));
    assert(isExist);
    isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/custom/run/proto.json'));
    assert(isExist);

    const actual = await fs.readFile(path.join(__dirname, 'fixtures/apps/custom/app/proxy/CustomService.js'), 'utf8');
    const expect = await fs.readFile(path.join(__dirname, 'fixtures/expect/CustomService.js'), 'utf8');

    assert(actual === expect);
  });

  it('should custom plugin', async function() {
    const generator = new EggRpcGenerator({
      baseDir: path.join(__dirname, 'fixtures/apps/custom'),
      plugin: [ path.join(__dirname, 'custom_plugin.js') ],
    });
    await generator.execute();

    const isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/custom/run/foo.bar'));
    assert(isExist);
    const actual = await fs.readFile(path.join(__dirname, 'fixtures/apps/custom/run/foo.bar'), 'utf8');
    assert(actual === 'hello');
  });

  it('should support relative baseDir', () => {
    const generator = new EggRpcGenerator({
      baseDir: './',
    });
    assert(generator.baseDir === process.cwd());
  });

  it('should support keep case', async function() {
    const generator = new EggRpcGenerator({
      baseDir: path.join(__dirname, 'fixtures/apps/keepCase'),
      keepCase: true,
    });
    await generator.execute();

    let isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/keepCase/app/proxy/ProtoService.js'));
    assert(isExist);
    isExist = await fs.exists(path.join(__dirname, 'fixtures/apps/keepCase/run/proto.json'));
    assert(isExist);

    const actual = await fs.readFile(path.join(__dirname, 'fixtures/apps/keepCase/run/proto.json'), 'utf8');
    const expect = await fs.readFile(path.join(__dirname, 'fixtures/expect/keepCaseProto.json'), 'utf8');

    assert(actual === expect);
  });
});
