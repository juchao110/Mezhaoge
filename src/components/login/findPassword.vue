<template>
    <div class="content">
        <TitleHead :title="pageTitle"></TitleHead>
        <div class="find_password">
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
            <div class="col_1" v-if="showImg">
                <label>
                    <div class="left_col">
                        图片验证
                    </div>
                    <div class="right_col">
                        <input type="text" v-model="imgCodeVal" class="small" placeholder="请输入图片验证码">
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
                        <button type="button" v-if="!time" class="msg_code" :disabled="sendVal=='发送中'" @click="sendMsg">{{sendVal}}</button>
                        <span class="again" v-if="time"><em class="time_color">{{time}}s</em>后重新发</span>
                    </div>
                </label>
            </div>
            <button type="button" class="submit" @click="submit">提交</button>
        </div>
    </div>
</template>

<script>
import TitleHead from '../common/titleHead.vue'
import {Toast, Indicator} from 'mint-ui'
var qs = require('qs')
export default {
  components: {
    TitleHead,
    Toast,
    Indicator
  },
  data () {
    return {
      pageTitle: '',
      phone: '',
      imgCode: '',
      msgCode: '',
      time: '',
      showImg: false,
      imgCodeVal: '',
      sendVal: '获取验证码',
      uuid: ''
    }
  },
  created: function () {
    console.log(this.$route)
  },
  beforeMount: function () {
    if (this.$route.params.type === 'change') {
      this.pageTitle = '修改密码'
      console.log(this.pageTitle, 'pageTitle')
    } else if (this.$route.params.type === 'find') {
      this.pageTitle = '找回密码'
    }
  },
  mounted: function () {
    this.uuid = localStorage.getItem('uuid') ? localStorage.getItem('uuid') : ''
    this.$http.get(`captcha/has/requested?uuid=${this.uuid}`).then((data) => {
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
        return
      }
      let need = ''
      if (this.showImg) {
        need = 1
        if (!this.imgCodeVal) {
          Toast({
            message: '请输入图形验证码',
            duration: 3000
          })
          return
        }
      } else {
        need = 0
      }
      this.sendVal = '发送中'
      this.$http.get(`captcha/sms?mobile=${this.phone}&code=${this.imgCodeVal}&need=${need}&uuid=${this.uuid}`).then((data) => {
        console.log(data)
        this.sendVal = '获取验证码'
        if (data.data.data.code == 200) {
          Toast({
            message: '发送成功，请查收',
            position: 'middle',
            duration: 3000
          })
          this.timeOut()
        } else if (data.data.data.code == 300) {
          this.imgCode = data.data.data.img
          this.showImg = true
        } else {
          Toast({
            message: data.data.data.msg,
            position: 'middle',
            duration: 3000
          })
          this.refreshImgCode()
        }
        this.isSend = false
      }).catch(data => {
        this.sendVal = '获取验证码'
      })
    },
    submit () {
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
      if (!this.msgCode) {
        Toast({
          message: '请输入短信验证码',
          position: 'middle',
          duration: 3000
        })
        return
      }
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.post('captcha/check/sms', qs.stringify({
        mobile: this.phone,
        code: this.msgCode
      })).then((data) => {
        Indicator.close()
        console.log(data)
        if (data.data.data.code == 200) {
          this.$router.push({path: `/login/setpassword/${this.$route.params.type}/${this.phone}`})
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
        Indicator.close()
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
