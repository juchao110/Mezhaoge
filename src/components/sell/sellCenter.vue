<template>
    <div class="content" :class="{disable_scroll:bottomShow}">
        <SearchHead :status="bottomShow"></SearchHead>
        <div class="sell_center" v-if="userInfo">
            <div class="user_info">
                <img src="../../assets/images/sell/sell_logo.png" v-if="!userInfo.m_logo_image_url" />
                <img :src="userInfo.m_logo_image_url" v-if="userInfo.m_logo_image_url" />
                <p class="name">{{userInfo.company_name}}</p>
                <p class="phone">{{userInfo.user_name}}</p>
            </div>
            <ul class="center_list clearfloat">
                <router-link tag="li" to="choosetype">
                    <i class="iconfont list_1">&#xe631;</i>发布产品
                </router-link>
                <router-link tag="li" to="myproductlist">
                    <span class="list_2">
                        <img src="../../assets/images/sell/sell_icon_01.png" alt="">
                    </span>产品管理
                </router-link>
                <router-link tag="li" to="offerlist">
                    <span class="list_3">
                        <img src="../../assets/images/sell/sell_icon_02.png" alt="">
                    </span>报价管理
                </router-link>
                <router-link tag="li" to="setstore">
                    <span class="list_4">
                        <img src="../../assets/images/sell/sell_icon_03.png" alt="">
                    </span>店铺设置
                </router-link>
            </ul>
        </div>
        <BottomNav @bottomStatus="getBottom"></BottomNav>
    </div>
</template>

<script>
import BottomNav from '../common/bottomNav.vue'
import SearchHead from '../common/searchHead.vue'
import '../../assets/sass/sell/sellCenter.sass'
import {Toast, Indicator} from 'mint-ui'

export default {
  components: {
    BottomNav,
    SearchHead,
    Indicator,
    Toast
  },
  data () {
    return {
      userInfo: '',
      bottomShow: false // 底部导航弹框

    }
  },
  mounted: function () {
    console.log('卖家中心')
    Indicator.open({
      spinnerType: 'fading-circle'
    })
    // this.getJoinStatus()
    this.getUserInfo()
  },
  methods: {
    getJoinStatus () {
      this.$http.get('match/business/enter?device=wechat', this.$token).then(data => {
        Indicator.close()
        if (data.data.data && data.data.data.verify_status != 1) {
          Toast({
            message: '请先成为入驻商家',
            duration: 3000
          })
          this.$router.push({path: '/user/join'})
        } else {
          this.getUserInfo()
        }
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络异常，请稍后再试',
          duration: 3000
        })
      })
    },
    getUserInfo () {
      this.$http.get('users/user_info', this.$token).then(data => {
        console.log(data)
        this.userInfo = data.data.data
        Indicator.close()
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络异常，请稍后再试',
          duration: 3000
        })
      })
    },
    getBottom (data) {
      this.bottomShow = data
    }
  }
}
</script>
