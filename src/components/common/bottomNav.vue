/*
 * @Author: juchao
 * @Date: 2018-03-21 16:38:50
 * @Last Modified by:   juchao
 * @Last Modified time: 2018-03-21 16:38:50
 * 底部导航
 */
<template>
    <div class="bottom_nav">
        <ul class="clearfloat">
            <router-link tag="li" to='/index'>
                <span class="home"></span>
                首页
            </router-link>
            <router-link tag="li" to='/productcategory'>
                <span class="categroy"></span>
                分类
            </router-link>
            <li class="add_icon">
                <div class="circle" v-if="!layer" @click="showMore">
                    <img src="../../assets/images/bottom/bottom_09.png" alt="">
                </div>
                <div class="circle on" v-if="layer" @click="hideMore">
                    <img src="../../assets/images/bottom/bottom_09.png" alt="">
                </div>
            </li>
            <!-- <li :class="getUrl()" @click="goSell">
                <span class="store"></span>
                我的店铺
            </li> -->
            <router-link tag="li" to='/sell'>
                <span class="store"></span>
                我的店铺
            </router-link>
            <router-link tag="li" to='/user'>
                <span class="my"></span>
                我的
            </router-link>
        </ul>
        <div class="white_bg" v-if="layer"></div>
        <div class="layer_item" v-if="layer">
            <router-link tag="div" class="item_1" to="/index/imgsearch">
                <img src="../../assets/images/bottom/bottom_10.png" alt="">
                识图找货
            </router-link>
            <router-link tag="div" class="item_2" to="/sendpurchase">
                <img src="../../assets/images/bottom/bottom_11.png" alt="">
                发布求购
            </router-link>
        </div>
    </div>
</template>

<script>
import '../../assets/sass/bottomNav.sass'
import {Toast, Indicator} from 'mint-ui'
export default {
  components: {
    Toast
  },
  data () {
    return {
      layer: false
    }
  },
  mounted: function () {
    console.log('底部菜单')
  },
  methods: {
    showMore () {
      this.layer = true
      this.$emit('bottomStatus', true)
    },
    hideMore () {
      this.layer = false
      this.$emit('bottomStatus', false)
    },
    getUrl () {
      if (this.$route.path == '/sell/sellcenter') {
        return 'router-link-active'
      } else {
        return ' '
      }
    },
    goSell () {
      if (localStorage.getItem('token')) {
        this.$http.get('match/business/enter?device=wechat', this.$token).then(data => {
          Indicator.close()
          if (data.data.data && data.data.data.verify_status == 1) {
            this.$router.push({path: '/sell'})
          } else if (data.data.data && data.data.data.verify_status == 2) {
            Toast({
              message: '入驻审核中',
              duration: 3000
            })
            this.$router.push({path: '/user/join'})
          } else if (data.data.data && data.data.data.verify_status == 3) {
            Toast({
              message: '入驻审核不通过',
              duration: 3000
            })
            this.$router.push({path: '/user/join'})
          } else if (data.data.data && data.data.data.verify_status == 4) {
            Toast({
              message: '请先入驻卖家',
              duration: 3000
            })
            this.$router.push({path: '/user/join'})
          }
        }).catch(() => {
          Indicator.close()
          Toast({
            message: '网络异常，请稍后再试',
            duration: 3000
          })
        })
      } else {
        this.$router.push({path: '/login', query: {redirect: this.$route.path}})
      }
    }

  }
}
</script>
