// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/* eslint-disable no-new */
import {
  Toast
} from 'mint-ui'
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import router from './router'
import '../build/apiAddress.js'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import './assets/filter/filter.js'
import './assets/js/rem.js'
import './assets/sass/style.sass'
import VuePreview from 'vue-preview'
import photoswipe from 'photoswipe'
import getToken from './config/getToken'
import store from './store/'
import './assets/directive/directive.js'
import {
  isWeixin,
  isIos,
  isQQ
} from './config/checkEnvironment'
// require('./assets/js/vconsole.js')
var qs = require('qs')
Vue.use(MintUI)
Vue.use(VuePreview)
Vue.use(VueRouter)

// 全局路由守卫
Vue.prototype.$weixin = isWeixin
Vue.prototype.$isqq = isQQ
Vue.prototype.$ios = isIos
if (!localStorage.getItem('uuid')) {
  Vue.prototype.$http.get('users/get_default_uuid').then(data => {
    console.log(data)
    localStorage.setItem('uuid', data.data.data)
  })
}
router.beforeEach((to, from, next) => {
  getToken()
  if (Vue.prototype.$weixin) {
    // 配置微信jssdk接口
    Vue.prototype.$http.post('wechat/JssdkConfig', qs.stringify({
      url: location.href.split('#')[0]
    })).then(data => {
      let weData = data.data.config
      window.wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: weData.appId, // 必填，公众号的唯一标识
        timestamp: weData.timestamp, // 必填，生成签名的时间戳
        nonceStr: weData.nonceStr, // 必填，生成签名的随机串
        signature: weData.signature, // 必填，签名
        jsApiList: [
          'checkJsApi', // 判断是否支持js接口
          'getNetworkType', // 获取网络状态
          'onMenuShareTimeline', // 分享到朋友圈
          'onMenuShareAppMessage', // 分享给朋友
          'onMenuShareQQ', // 分享到QQ
          'chooseImage', // 拍照或从手机相册中选图
          'uploadImage', // 上传图片接口
          'downloadImage', // 下载图片接口
          'openLocation', // 使用微信内置地图查看位置接口
          'getLocation', // 获取地理位置接口
          'getLocalImgData'

        ] // 必填，需要使用的JS接口列表
      })
      window.wx.checkJsApi({
        jsApiList: ['getNetworkType',
          'onMenuShareTimeline',
          'onMenuShareAppMessage',
          'onMenuShareQQ',
          'uploadImage',
          'downloadImage',
          'chooseImage',
          'openLocation',
          'getLocation',
          'getLocalImgData'
        ], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function (res) {}
      })
    })
  }
  if (to.matched.some(record => record.meta.requireAuth)) { // 判断该路由是否需要登录权限
    if (localStorage.token) { // 判断当前的token是否存在
      console.log('当前token存在')
      // 判断当前用户的token是否有效
      Vue.prototype.$http.get('check/token', Vue.prototype.$token).then(data => {
        if (data.data.error_code == 401) {
          console.log('当前token存在但无效')
          localStorage.removeItem('token')
          next({
            path: '/login',
            query: {
              redirect: to.fullPath
            } // 将跳转的路由path作为参数，登录成功后跳转到该路由
          })
        } else {
          console.log('当前token存在且有效')
          if (to.matched.some(record => record.meta.requireJoin)) {
            console.log('ssss')
            Vue.prototype.$http.get('match/business/enter?device=wechat', Vue.prototype.$token).then(data => {
              if (data.data.data && data.data.data.verify_status == 1) {
                next()
              } else if (data.data.data && data.data.data.verify_status == 2) {
                Toast({
                  message: '入驻审核中',
                  duration: 3000
                })
                next({
                  path: '/user/join',
                  query: {
                    is_from: 'one'
                  }
                })
              } else if (data.data.data && data.data.data.verify_status == 3) {
                Toast({
                  message: '入驻审核不通过',
                  duration: 3000
                })
                next({
                  path: '/user/join',
                  query: {
                    is_from: 'one'
                  }
                })
              } else if (data.data.data && data.data.data.verify_status == 4) {
                Toast({
                  message: '请先入驻卖家',
                  duration: 3000
                })
                next({
                  path: '/user/join',
                  query: {
                    is_from: 'one'
                  }
                })
              }
            }).catch(() => {
              Toast({
                message: '网络错误，请稍后再试',
                duration: 3000
              })
            })
          } else {
            next()
          }
        }
      })
    } else {
      console.log('当前token不存在')
      next({
        path: '/login',
        query: {
          redirect: to.fullPath
        } // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  } else {
    console.log('不需要验证登录')
    if (localStorage.token) {
      if (to.path == '/login/loginin') {
        next({
          path: '/index'
        })
      } else {
        next()
      }
    } else {
      next()
    }
  }
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
