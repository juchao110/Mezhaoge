<template>
    <div class="content">
        <TitleHead :title="pageTitle"></TitleHead>
        <div class="find_password">
            <div class="phone_info">
                请重新设置<span>{{phone | hidden-tel}}</span>的密码
            </div>
            <div class="col_1">
                <label>
                    <div class="left_col">
                        新密码
                    </div>
                    <div class="right_col">
                        <input type="password" v-model="pswOne" class="long" placeholder="请输入密码">
                    </div>
                </label>
            </div>
            <div class="col_1">
                <label>
                    <div class="left_col">
                    确认密码
                    </div>
                    <div class="right_col">
                        <input type="password" v-model="pswTwo" class="long" placeholder="请再次输入密码">
                    </div>
                </label>
            </div>
            <button type="button" class="submit" @click="submit">提交</button>
        </div>
    </div>
</template>

<script>
import TitleHead from '../common/titleHead.vue'
import {Toast} from 'mint-ui'
var qs = require('qs')
export default {
  components: {
    TitleHead,
    Toast
  },
  data () {
    return {
      pageTitle: '修改密码',
      pswOne: '',
      pswTwo: '',
      phone: ''
    }
  },
  created: function () {
  },
  beforeMount: function () {

  },
  mounted: function () {
    console.log(this.$route)

    this.phone = this.$route.params.phone
  },
  methods: {
    submit () {
      if (!this.pswOne) {
        Toast({
          message: '请输入密码',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.pswTwo) {
        Toast({
          message: '请再次输入密码',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testPassword(this.pswTwo) || this.$store.state.testPassword(this.pswOne)) {
        Toast({
          message: '密码必须是6-20位数字和英文',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.pswTwo != this.pswOne) {
        Toast({
          message: '两次密码输入不一致',
          position: 'middle',
          duration: 3000
        })
        return
      }
      console.log('提交')
      this.$http.post('auth/forgot', qs.stringify({
        mobile: this.phone,
        password1: this.pswOne,
        password2: this.pswTwo
      })).then((data) => {
        if (data.data.data.code == 200) {
          if (this.$route.params.type == 'find') {
            this.$router.push({path: '/login'})
          } else if (this.$route.params.type == 'change') {
            this.$router.push({path: '/user'})
          }
        } else {
          Toast({
            message: data.data.data.msg,
            position: 'middle',
            duration: 3000
          })
        }
      })
    }
  }
}
</script>
