'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '""'
  // BASE_API: '"https://www.easy-mock.com/mock/5bfca0b4b1ac3702023120f5/FarmVue"',
  // BASE_API: '"http://localhost:46344/api"',
  // BASE_API: '"http://123.207.110.57:5000/api"'
})
