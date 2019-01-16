'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const nunjucks = require('nunjucks');

const mapReg = /^(map|object)<(.*?),(.*?)>$/i;
const listReg = /^(list|array)<(.*?)>$/i;
const resultReg = /^(result)<(.*?)>$/i;
const genericReg = /^(\w+)<(.*?)>$/i;

const engine = nunjucks.configure({ autoescape: false, watch: false });
const classTpl = fs.readFileSync(path.join(__dirname, './tpl/class.java.tpl'), 'utf8');
const interfaceTpl = fs.readFileSync(path.join(__dirname, './tpl/interface.java.tpl'), 'utf8');
const pomTpl = fs.readFileSync(path.join(__dirname, './tpl/pom.xml.tpl'), 'utf8');
const exceptionTpl = fs.readFileSync(path.join(__dirname, './tpl/NodeTRException.java.tpl'), 'utf8');

module.exports = function generatePom(config, analyzed) {
  const distPath = config.baseDir;
  rimraf.sync(path.join(distPath, 'src'));
  rimraf.sync(path.join(distPath, 'target'));
  const javaroot = path.join(distPath, 'src/main/java');
  const pom = config.rpcserver.pom || {};
  const pomVersion = pom.version || '1.0.0';
  const artifactId = pom.artifactId || config.name + '-facade';
  const groupId = pom.groupId || 'com.eggjs.facade';
  const apiMeta = {};
  // classMaps 应该用唯一的一个, 如果开发者在不同的文件中定义同一个类, 就应该出错
  const classMaps = {};

  for (const className in analyzed) {
    const namespace = analyzed[className].namespace;
    const interfaces = analyzed[className].interfaces;

    // java interface
    const methods = [];
    for (const method in interfaces) {
      methods.push(interfaces[method]);
    }

    // Service.java
    // 这里接口定义需要 <T>
    const content = engine.renderString(interfaceTpl, {
      namespace,
      className,
      methods,
    });

    const filepath = path.join(javaroot, namespace.replace(/\./g, '/'),
      className + '.java');
    mkdirp.sync(path.dirname(filepath));
    fs.writeFileSync(filepath, content);

    // java class
    const objects = analyzed[className].objects || {};
    for (const key in objects) {
      const obj = objects[key];
      const classPath = path.join(javaroot, namespace.replace(/\./g, '/'));
      mkdirp.sync(classPath);
      const content = engine.renderString(classTpl, obj);
      const classFileName = normalizeClassFileName(obj.name) + '.java';
      fs.writeFileSync(path.join(classPath, classFileName), content);

      const { typeName, generics } = getClassInfo(key);
      const props = {};
      for (const prop of obj.properties) {
        props[prop.name] = getFullType(prop.type.type, namespace, generics);
      }
      const clazzName = `${namespace}.${typeName}`;
      // 类型不允许重复的定义
      assert(!classMaps[clazzName], `${clazzName} 已经定义过了, 请只保留一个定义。`);
      classMaps[clazzName] = props;
    }

    // eslint-disable-next-line no-loop-func
    const apiMethods = methods.map(method => {
      // 方法的入参, 不需要 typeAliasIndex
      const rt = getFullType(method.response.name, namespace, []);
      return {
        name: method.name,
        parameterTypes: method.request.map(param => getFullType(param.type.names[0], namespace, []).type),
        returnType: rt.type,
        generic: rt.generic,
      };
    });

    apiMeta[`${namespace}.${className}`] = {
      appName: config.name,
      canonicalName: `${namespace}.${className}`,
      codeSource: `${artifactId}-${pomVersion}.jar`,
      methods: apiMethods,
      classMaps,
    };
  }

  // NodeTRException.java
  const namespace = config.rpcserver.namespace;
  const exceptionFilepath = path.join(javaroot, namespace.replace(/\./g, '/'), 'NodeTRException.java');
  if (!fs.existsSync(exceptionFilepath)) {
    const exceptionContent = engine.renderString(exceptionTpl, { namespace });
    mkdirp.sync(path.dirname(exceptionFilepath));
    fs.writeFileSync(exceptionFilepath, exceptionContent);
  }

  // apiMeta.json
  mkdirp.sync(path.join(distPath, 'config'));
  fs.writeFileSync(path.join(distPath, 'config/apiMeta.json'), JSON.stringify(apiMeta, null, '  '));

  // pom.xml
  const pomContent = engine.renderString(pomTpl, {
    artifactId,
    groupId,
    pomVersion,
  });
  fs.writeFileSync(path.join(distPath, 'pom.xml'), pomContent);
  return distPath;
};

const maps = {
  Integer: 'java.lang.Integer',
  double: 'double',
  Boolean: 'java.lang.Boolean',
  Long: 'java.lang.Long',
  String: 'java.lang.String',
  Map: 'java.util.Map',
  List: 'java.util.List',
  Date: 'java.util.Date',
};

function getClassInfo(typeName) {
  const genericMatch = typeName.match(genericReg);
  // let className = typeName;
  let generics = [];
  // const className = classNameMatch ? classNameMatch[0] : key;
  if (genericMatch) {
    typeName = genericMatch[1].trim();
    generics = genericMatch[2].split(',').map(t => t.trim());
  }
  return {
    typeName,
    generics,
  };
}

function getFullType(type, namespace, genericTypes) {
  type = type.trim();
  const map = mapReg.exec(type);
  // Map<String, Int>
  if (map) {
    return {
      type: 'java.util.Map',
      generic: [
        getFullType(map[2], namespace, genericTypes),
        getFullType(map[3], namespace, genericTypes),
      ],
    };
  }
  const list = listReg.exec(type);
  // List<String>
  if (list) {
    return {
      type: 'java.util.List',
      generic: [
        getFullType(list[2], namespace, genericTypes),
      ],
    };
  }
  const result = resultReg.exec(type);
  // Result<T>
  if (result) {
    return {
      type: 'com.alipay.common.error.Result',
      generic: [
        getFullType(result[2], namespace, genericTypes),
      ],
    };
  }
  const genericClazz = genericReg.exec(type);
  // GenericResult<HelloResponse, HelloError> ->
  // {
  //   type: 'com.alipay.x.common.GenericResult',
  //   generic:  [{
  //     type: 'com.alipay.x.common.HelloResponse',
  //   },{
  //     type: 'com.alipay.x.common.HelloError',
  //   }]
  // }
  if (genericClazz) {
    const generics = genericClazz[2].split(',')
      .map(t => {
        return getFullType(t.trim(), namespace, genericTypes);
      });
    return {
      type: `${namespace}.${genericClazz[1]}`,
      generic: generics,
    };
  }
  if (maps[type]) {
    return { type: maps[type] };
  }

  /**
   * class Request<T> {
   *   T field1
   * } -->
   *
   * com.alipay.egg.Request: {
   *  "req": {
   *    "type": "T",
   *    "typeAliasIndex": 0
   *  }
   * }
   */
  const typeAliasIndex = genericTypes.indexOf(type);
  if (typeAliasIndex !== -1) {
    return {
      type: genericTypes[typeAliasIndex],
      typeAliasIndex,
    };
  }
  return { type: `${namespace}.${type}` };
}

function normalizeClassFileName(name) {
  return name.replace(/<.*>/, '');
}
