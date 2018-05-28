<template>
    <div class="content">
        <TitleHead :title="pageTitle"></TitleHead>
        <div class="register">
            <div class="col_1">
                <label>
                    <div class="left_col">
                        手机号
                    </div>
                    <div class="right_col">
                        <input type="tel" v-model="phone" class="long" placeholder="请输入手机号">
                    </div>
                </label>
            </div>
            <div class="col_1">
                <label>
                    <div class="left_col">
                        联系人
                    </div>
                    <div class="right_col">
                        <input type="text" v-model="user" class="long" placeholder="请输入联系人">
                    </div>
                </label>
            </div>
            <div class="col_1">
                <label>
                    <div class="left_col">
                        公司名
                    </div>
                    <div class="right_col">
                        <input type="text" v-model="company" class="long" placeholder="请输入公司名">
                    </div>
                </label>
            </div>
            <div class="col_1" v-if="showImg">
                <label>
                    <div class="left_col">
                        图片验证
                    </div>
                    <div class="right_col">
                        <input type="text" v-model="imageCode" class="small" placeholder="请输入图片验证码">
                        <div class="img_code" @click="refreshImgCode">
                            <img :src="imgCode">
                        </div>
                    </div>
                </label>
            </div>
            <div class="col_1">
                <label>
                    <div class="left_col">
                        短信验证
                    </div>
                    <div class="right_col">
                        <input type="tel" v-model="msgCode" class="small" placeholder="请输入短信验证码">
                        <button type="button" v-if="!time" :disabled="isSend" class="msg_code" @click="sendMsg">获取验证码</button>
                        <span class="again" v-if="time"><em class="time_color">{{time}}s</em>后重新发</span>
                    </div>
                </label>
            </div>
            <div class="agreement">
                <label @click="changeAgree">
                    <i class="iconfont" v-if="!agree">&#xe61d;</i>
                    <i class="iconfont" v-if="agree">&#xe604;</i>
                    我已阅读并同意《一革网用户协议》
                </label>
            </div>
            <button type="button" class="agree_register" @click="goRegist">同意协议并注册</button>
            <div class="go_login">
                已有账号，
                <router-link tag="span" to="loginin">立即登录</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import TitleHead from '../common/titleHead.vue'
import { Toast } from 'mint-ui'
var qs = require('qs')
export default {
  components: {
    TitleHead
  },
  data () {
    return {
      pageTitle: '注册',
      imgCode: '',
      msgCode: '',
      user: '',
      phone: '',
      company: '',
      agree: true,
      time: '',
      imageCode: '',
      showImg: false,
      isSend: false,
      uuid: ''
    }
  },
  mounted: function () {
    console.log(this.$route)
    this.uuid = localStorage.getItem('uuid') ? localStorage.getItem('uuid') : ''
    // this.imgCode = `${this.$imgCode}match/captcha`
    this.$http.get(`captcha/has/requested?uuid=${this.uuid}`).then((data) => {
      console.log(data)
      if (data.data.data.code == 200) {
        this.showImg = true
        this.imgCode = data.data.data.img
      }
    })
  },
  methods: {
    timeOut () {
      this.time = 120
      let interval = window.setInterval(() => {
        if ((this.time--) <= 0) {
          this.time = ''
          window.clearInterval(interval)
        }
      }, 1000)
    },
    refreshImgCode () {
      this.imgCode = `${this.imgCode}&${Math.random()}`
    },
    sendMsg () {
      if (!this.phone) {
        Toast({
          message: '请输入手机号',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testPhone(this.phone)) {
        Toast({
          message: '请输入正确的手机号',
          position: 'middle',
          duration: 3000
        })
      }
      let need = ''
      if (this.showImg) {
        need = 1
        if (!this.imageCode) {
          Toast({
            message: '请输入图形验证码',
            duration: 3000
          })
          return
        }
      } else {
        need = 0
      }
      this.isSend = true
      this.$http.get(`captcha/sms?mobile=${this.phone}&code=${this.imageCode}&need=${need}&type=register&uuid=${this.uuid}`).then((data) => {
        console.log(data)
        if (data.data.data.code == 200) {
          Toast({
            message: '发送成功，请查收',
            position: 'middle',
            duration: 3000
          })
          this.timeOut()
        } else {
          Toast({
            message: data.data.data.msg,
            position: 'middle',
            duration: 3000
          })
          this.refreshImgCode()
        }
        this.isSend = false
      }).catch((data) => {
        this.isSend = false
        Toast({
          message: '网络 异常，请稍后再试',
          position: 'middle',
          duration: 3000
        })
        this.refreshImgCode()
      })
    },
    changeAgree () {
      this.agree = !this.agree
    },
    goRegist () {
      if (!this.phone) {
        Toast({
          message: '请输入手机号',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testPhone(this.phone)) {
        Toast({
          message: '请输入正确的手机号',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.user) {
        Toast({
          message: '请输入联系人',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testName(this.user)) {
        Toast({
          message: '请填写真实姓名',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.company) {
        Toast({
          message: '请输入公司名',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testCompanyName(this.company)) {
        Toast({
          message: '请填写真实公司名',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.msgCode) {
        Toast({
          message: '请输入短信验证码',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.agree) {
        Toast({
          message: '请同意一革网协议',
          position: 'middle',
          duration: 3000
        })
        return
      }
      this.$http.post(`/auth/wap/register`, qs.stringify({
        mobile: this.phone,
        company: this.company,
        real_name: this.user,
        smsCode: this.msgCode,
        imgCode: this.imageCode
      })).then((data) => {
        console.log(data)
        if (data.data.data.code == 200) {
          Toast({
            message: '注册成功，请登录',
            position: 'middle',
            duration: 3000
          })
          this.$router.push({path: 'loginin'})
        } else {
          Toast({
            message: data.data.data.msg,
            position: 'middle',
            duration: 3000
          })
          this.showImg = true
          this.imgCode = data.data.data.img
        }
      }).catch((data) => {
        Toast({
          message: '网络错误，请稍后再试',
          position: 'middle',
          duration: 3000
        })
      })
    }
  }
}
</script>
