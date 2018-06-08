'use strict';

const Handlebars = require('handlebars');

function upperFirst(className) {
  return className[0].toUpperCase() + className.slice(1);
}

Handlebars.registerHelper('normalizeName', interfaceName => {
  return upperFirst(interfaceName.split('.').pop());
});

module.exports = Handlebars;
