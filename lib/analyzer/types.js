'use strict';

const mapReg = /^(map|object)\.<(.*?),(.*?)>$/i;
const listReg = /^(list|array)\.<(.*?)>$/i;
const resultReg = /^(result)\.<(.*?)>$/i;
const genericReg = /^(\w+)\.<(.*?)>$/i;

const maps = {
  int: 'Integer',
  integer: 'Integer',
  number: 'double',
  boolean: 'Boolean',
  bool: 'Boolean',
  long: 'Long',
  string: 'String',
  object: 'Map',
  map: 'Map',
  array: 'List',
  list: 'List',
};

function getType(type) {
  type = type.trim();
  const map = mapReg.exec(type);
  // Map<String, Int>
  if (map) {
    return `Map<${getType(map[2])}, ${getType(map[3])}>`;
  }
  const list = listReg.exec(type);
  // List<String>
  if (list) {
    return `List<${getType(list[2])}>`;
  }
  const result = resultReg.exec(type);
  // Result<T>
  if (result) {
    return `Result<${getType(result[2])}>`;
  }
  // GenericClass.<T> -> GenericClass<T>
  const genericClazz = genericReg.exec(type);
  if (genericClazz) {
    const genericClazzs = genericClazz[2].split(',')
      .map(t => getType(t))
      .join(',');
    return `${genericClazz[1]}<${genericClazzs}>`;
  }

  return maps[type.toLowerCase()] || type;
}

exports.get = getType;
