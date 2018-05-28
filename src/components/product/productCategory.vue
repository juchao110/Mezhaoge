<template>
    <div class="content">
        <SearchHead :status="bottomShow"></SearchHead>
        <div class="product_category" v-if="list">
            <ul class="clearfloat">
                <router-link tag="li" :to='`/productlist/productlista?id=${c.id}&goodsType=${c.goods_type}`' v-for="c in list">
                    <span>
                        <img :src="c.icon_url" alt="">
                    </span>
                    {{c.title}}
                </router-link>
            </ul>
        </div>
        <BottomNav @bottomStatus="getBottom"></BottomNav>
    </div>
</template>

<script>
import BottomNav from '../common/bottomNav.vue'
import SearchHead from '../common/searchHead.vue'
import '../../assets/sass/productlist/category.sass'
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
      list: {},
      bottomShow: false
    }
  },
  mounted: function () {
    console.log('产品分类')
    this.getList()
  },
  methods: {
    getList () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('wap/goods/nav').then(data => {
        Indicator.close()
        this.list = data.data.data
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
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
