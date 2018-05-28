<template>
    <div class="login">
        <div class="login_close" @click="goBack">
            <i class="iconfont">&#xe60d;</i>
        </div>
        <img src="../../assets/images/login/logo.png" alt="" class="login_logo">
        <div class="user_name">
            <i class="iconfont icon">&#xe601;</i>
            <input type="text" class="need_focus" placeholder="请输入手机号/用户名" v-model="userName">
        </div>
        <div class="login_password">
            <i class="iconfont icon">&#xe649;</i>
            <input type="password" class="need_focus" placeholder="请输入登录密码" v-model="userPassword" v-if="hiddenPassword">
            <input type="text" class="need_focus" placeholder="请输入登录密码" v-model="userPassword" v-if="!hiddenPassword">
            <i class="iconfont show" @click="showPassword" v-if="hiddenPassword">&#xe619;</i>
            <i class="iconfont show" @click="hidePassword" v-if="!hiddenPassword">&#xe611;</i>
        </div>
        <button type="button" class="login_btn" :disabled="loginBtn" @click="login">{{loginVal}}</button>
        <div class="or" v-if="$weixin">
            或
        </div>
        <div class="we_login" @click="weChatLogin" v-if="$weixin">
            <i class="iconfont">&#xe73b;</i>
            微信登录
        </div>
        <div class="go_another">
            <router-link tag="span" to="findpassword/find">找回密码</router-link>
            |
            <router-link tag="span" to="register">快速注册</router-link>
        </div>
    </div>
</template>

<script>
import '../../assets/sass/login/login.sass'
import { Indicator, Toast } from 'mint-ui'
var qs = require('qs')
export default {
  components: {
    Indicator,
    Toast
  },
  data () {
    return {
      pageTitle: '登录',
      userName: '',
      userPassword: '',
      fromUrl: '',
      loginVal: '登  录',
      loginBtn: false,
      hiddenPassword: true,
      wechatCode: ''
    }
  },
  mounted: function () {
    console.log(location.href)
    console.log(this.$route)
    console.log(this.$route.query.redirect, '跳转登录页之前的页面路由')
    this.fromUrl = this.$route.query.redirect
    localStorage.setItem('redirect', this.fromUrl)
    let url = window.location.search
    console.log(url, 'url')
    let urlArr = url.split('')
    this.wechatCode = (urlArr.slice(6, urlArr.indexOf('&'))).join('')
    console.log(this.wechatCode, '---')
    if (this.$route.query.redirect) {
      localStorage.setItem('redirect', this.$route.query.redirect)
    }
    if (this.wechatCode) {
      this.$http.post('wechat/bind', qs.stringify({
        code: this.wechatCode,
        state: 'ezhaoge'
      })).then(data => {
        console.log(data)
        if (data.data.code == 200) {
          localStorage.setItem('token', data.data.token)
          localStorage.setItem('userId', data.data.userInfo.id)
          this.$router.push({path: '/index'})
          location.reload()
        } else if (data.data.code == 302) {
          // location.href = `${window.location.origin}/#/login/bindaccount?code=${this.wechatCode}`
          this.$router.push({path: 'bindaccount', query: {code: this.wechatCode}})
        } else {
          // Toast({
          //   message: data.data.msg,
          //   duration: 3000
          // })
        }
      })
    }
  },
  methods: {
    weChatLogin () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      console.log(window.location.href)
      this.$http.get(`wechat/code`).then(data => {
        console.log(data)
        Indicator.close()
        location.href = data.data.url
      })
    },
    goBack () {
      localStorage.removeItem('redirect')
      this.$router.go(-1)
    },
    showPassword () {
      this.hiddenPassword = false
    },
    hidePassword () {
      this.hiddenPassword = true
    },
    login () {
      if (!this.userName) {
        Toast({
          message: '请输入账号',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.userPassword) {
        Toast({
          message: '请输入密码',
          position: 'middle',
          duration: 3000
        })
        return
      }
      this.loginVal = '登录中..'
      this.loginBtn = true
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.post('auth/login', qs.stringify({
        username: this.userName,
        password: this.userPassword,
        client_name: 'mobile_app'
      })).then((data) => {
        this.loginBtn = false
        this.loginVal = '登  录'
        Indicator.close()
        console.log(data)
        if (data.data.error_code == 200) {
          Toast({
            message: '登录成功',
            position: 'middle',
            duration: 3000
          })
          localStorage.setItem('token', data.data.data.token)
          localStorage.setItem('userId', data.data.data.user_id)
          if (localStorage.getItem('redirect')) {
            this.$router.push({path: localStorage.getItem('redirect')})
          } else {
            this.$router.push({path: '/user/usercenter'})
            location.reload()
          }
        } else {
          Toast({
            message: '账号或密码错误，请重试',
            position: 'middle',
            duration: 3000
          })
        }
      }).catch(() => {
        Toast({
          message: '网络异常，请稍后再试',
          position: 'middle',
          duration: 3000
        })
        this.loginVal = '登  录'
        this.loginBtn = false
        Indicator.close()
      })
    }
  }
}
</script>
