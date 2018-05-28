import Vue from 'vue'
import axios from 'axios'
const config = require('../config')

// console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === "development") {
  Vue.prototype.$imgCode = 'http://sapi.seekleather.cn/api/';
  Vue.prototype.$http = axios.create({
    baseURL: 'http://sapi.seekleather.cn/api/v1/',
    timeout: 15000
  });
} else {
  Vue.prototype.$imgCode = 'http://sapi.ezhaoge.com/api/';
  Vue.prototype.$http = axios.create({
    baseURL: 'https://sapi.ezhaoge.com/api/v1/',
    timeout: 15000
  });
}
