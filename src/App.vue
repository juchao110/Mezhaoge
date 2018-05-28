<template>
    <div id="app">
        <router-view/>
        <div class="add_to_home" v-if="addBox==1&&$weixin==false">
            <div class="add_to_home_content">
                <i class="iconfont close_add_box" @click="closeAddBox">&#xe607;</i>
                <img src="./assets/images/index/add_home_01.png" alt="" class="add_logo">
                <p>您可以将“一革网”安装到手机上，请先按<span>&equiv;</span>，然后找到并点选添加到手机桌面</p>
            </div>
        </div>
        <GoTop v-if="showTop"></GoTop>
    </div>
</template>

<script>
import GoTop from './components/common/goTop.vue'
var qs = require('qs')
export default {
  components: {
    GoTop
  },
  name: 'App',
  data () {
    return {
      showTop: false,
      addBox: 1
    }
  },
  mounted: function () {
    // 回到顶部
    window.addEventListener('scroll', this.handleScroll)
    this.addBox = localStorage.getItem('addBox') ? Number(localStorage.getItem('addBox')) : 1
  },
  methods: {
    // 回到顶部
    handleScroll () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 2000) {
        this.showTop = true
      } else {
        this.showTop = false
      }
    },
    closeAddBox () {
      this.addBox = 0
      localStorage.setItem('addBox', 0)
    }
  }

}
</script>

<style lang="sass">
@import './assets/sass/common.sass'
#app
    width: 100%
    overflow: hidden
.add_to_home
    position: fixed
    bottom: .3rem
    left: .8rem
    z-index: 9999
    width: 5.6rem
    @include border_radius(.1rem)
    background: $whiteColor
    @include box_shadow(0,1px,.1rem,#ddd)
    @include padding_a(.4rem,.7rem,.4rem,1.8rem)
    &:after
        content: ''
        display: block
        width: .3rem
        height: .3rem
        background: $whiteColor
        transform: rotateZ(-45deg)
        border-left: 1px solid #eee
        border-bottom: 1px solid #eee
        position: absolute
        bottom: -.15rem
        left: 2.7rem
    .add_to_home_content
        z-index: 9999
        .close_add_box
            position: absolute
            right: .1rem
            top: 0
            @include padding(.1rem)
            font-size: .2rem
        .add_logo
            height: 1.2rem
            position: absolute
            left: .4rem
            top: .4rem
        p
            font-size: .24rem
            color: $fontColor
            span
                @include padding_a(0,.04rem,0,.04rem)
                font-size: .28rem
                color: $orangeColor
</style>
