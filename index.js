require('./env');
require('babel-polyfill');
require('babel-core/register');
require('./src/server').start();
