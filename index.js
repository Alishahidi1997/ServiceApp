/* eslint-disable import/no-extraneous-dependencies */

process.chdir(__dirname);

require('@babel/register/lib');
require('./src/server');
