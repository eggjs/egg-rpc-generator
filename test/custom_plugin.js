'use strict';

const fs = require('mz/fs');
const path = require('path');

module.exports = async (units, opts) => {
  const { baseDir } = opts;
  await fs.writeFile(path.join(baseDir, 'run', 'foo.bar'), 'hello');
};
