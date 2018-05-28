<template>
    <div class="content" :class="{disable_scroll:bottomShow}">
        <SearchHead :status="bottomShow"></SearchHead>
        <div class="user_center" v-if="userInfo">
            <div class="user_info">
                <img src="../../assets/images/user_logo.png" v-if="!userInfo.m_avatar" />
                <img :src="userInfo.m_avatar" alt="" v-if="userInfo.m_avatar">
                <p class="name">{{userInfo.user_name}}</p>
                <p class="phone">{{userInfo.mobile_send}}</p>
            </div>
            <ul class="center_list clearfloat">
                <router-link tag="li" to="/sendpurchase">
                    <i class="iconfont list_1">&#xe631;</i>发布求购
                </router-link>
                <router-link tag="li" to="mypurchaselist">
                    <i class="iconfont list_2">&#xe678;</i>求购管理
                </router-link>
                <router-link tag="li" to="join" v-if="showJoin">
                    <i class="iconfont list_3">
                        <img src="../../assets/images/user/icon_01.png" alt="">
                    </i>卖家入驻
                </router-link>
                <router-link tag="li" to="changepassword/change">
                    <i class="iconfont list_4">&#xe618;</i>修改密码
                </router-link>
                <router-link tag="li" to="service">
                    <i class="iconfont list_5">&#xe620;</i>在线客服
                </router-link>
                <li>
                    <a href="tel:4001116660">
                        <i class="iconfont list_6">&#xe608;</i>热线电话
                    </a>
                </li>
                <!-- <router-link tag="li" to="">
                    <i class="iconfont list_7">&#xe673;</i>服务中心
                </router-link> -->
                <router-link tag="li" to="aboutus">
                    <i class="iconfont list_8">&#xe61e;</i>关于我们
                </router-link>
            </ul>
            <button type="button" class="login_out" @click="loginOut">退出登录</button>
        </div>
        <BottomNav @bottomStatus="getBottom"></BottomNav>
    </div>
</template>

<script>
import BottomNav from '../common/bottomNav.vue'
import SearchHead from '../common/searchHead.vue'
import '../../assets/sass/user/userCenter.sass'
import {Indicator} from 'mint-ui'

export default {
  components: {
    BottomNav,
    SearchHead,
    Indicator
  },
  data () {
    return {
      showJoin: true, // 显示卖家入驻入口
      userInfo: '',
      bottomShow: false
    }
  },
  mounted: function () {
    Indicator.open({
      spinnerType: 'fading-circle'
    })
    console.log('买家中心')
    this.getJoinStatus()
    this.getUserInfo()
  },
  methods: {
    getJoinStatus () {
      this.$http.get('match/business/enter?device=wechat', this.$token).then(data => {
        console.log(data)
        if (data.data.data && data.data.data.verify_status == 1) {
          this.showJoin = false
          Indicator.close()
        }
      })
    },
    getUserInfo () {
      this.$http.get('users/user_info', this.$token).then(data => {
        console.log(data)
        this.userInfo = data.data.data
        Indicator.close()
      })
    },
    // 退出登录
    loginOut () {
      console.log(window.location.origin)
      location.href = `${window.location.origin}/#/index`
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      // location.reload()
    },
    getBottom (data) {
      this.bottomShow = data
    }
  }
}
</script>
