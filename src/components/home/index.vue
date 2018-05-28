<template>
    <div class="content home_body" :class="{disable_scroll:bottomShow}">
        <div class="home_top">
            <SearchHead :class="{scroll:scrollTop&&bottomLayer}" :status="bottomShow"></SearchHead>
        </div>
        <div class="banner_circle">
            <mt-swipe :auto="4000" class="banner">
                <mt-swipe-item v-for="(img,index) in indexData.banner_list">
                    <img class="image" :src="img.pic" @click="goUrl(img.pic_url)">
                </mt-swipe-item>
            </mt-swipe>
            <div class="circle_bg">
                <img src="../../assets/images/index/index_15.png" alt="">
            </div>
        </div>
        <div class="home_content">
            <div class="top_info">
                <img src="../../assets/images/index/index_01.png" alt="">
                <ul class="info_list" :style='{top}'>
                    <router-link v-for="(l,index) in indexData.announcement_list" tag="li" :to="`/information/${l.id}`" >{{l.title}}</router-link>
                </ul>
            </div>
            <div class="top_quick">
                <router-link tag="div" to="/productlist/productlista?id=1&goodsType=3" class="item">
                    <img src="../../assets/images/index/index_02.png" alt="">
                    尾货清仓
                </router-link>
                <router-link tag="div" to="/purchaselobby" class="item">
                    <img src="../../assets/images/index/index_03.png" alt="">
                    求购大厅
                </router-link>
                <router-link tag="div" to="/sendpurchase" class="item">
                    <img src="../../assets/images/index/index_04.png" alt="">
                    发布求购
                </router-link>
                <router-link tag="div" to="/index/imgsearch" class="item">
                    <img src="../../assets/images/index/index_05.png" alt="">
                    识图找货
                </router-link>
            </div>
            <div class="good_sale">
                <!-- <div class="good_sale_title">
                    <img src="../../assets/images/index/index_16.jpeg" alt="">
                </div> -->
                <div class="good_sale_list">
                    <mt-swipe :auto="4000" class="good_sale_list_banner">
                        <mt-swipe-item v-for="(list,index) in indexData.poopList">
                            <router-link tag="div" :to='`/productdetail/${data.goods_id}`' class="good_sale_item" v-for="data in list">
                                <!-- <div class="tip">
                                    <img src="../../assets/images/index/index_14.png"  class="tip_img">
                                </div> -->
                                <img :src="data.main_img" alt="" class="main_img">
                                <p class="title">{{data.goods_name}}</p>
                                <div class="price">
                                    ￥<span class="big_font">{{data.sell_price}}</span>
                                    <!-- <span class="sku">/{{data.unit_name}}</span> -->
                                </div>
                                <!-- <div class="old_price">
                                    原价：￥{{data.min_cost_price}}
                                </div> -->
                            </router-link>
                        </mt-swipe-item>
                    </mt-swipe>
                </div>
            </div>
            <div class="hot_part">
                <div class="hot_title">
                    <img src="../../assets/images/index/index_07.png" alt="">
                </div>
                <ul class="hot_list clearfloat">
                    <router-link to="/productlist/productlista?id=1&goodsType=3" tag="li" class="cate_1">
                        <h5>皮革尾货</h5>
                        <h6>热卖好货放心挑</h6>
                    </router-link>
                    <router-link to="/productlist/productlista?id=4&goodsType=0" tag="li" class="cate_2">
                        <p class="cate_name">纹路</p>
                        <p class="cate_info">热卖好货放心挑</p>
                        <img src="../../assets/images/index/index_08.jpg" alt="">
                    </router-link>
                    <router-link to="/productlist/productlista?id=1&goodsType=1" tag="li" class="cate_3">
                        <p class="cate_name">皮革现货</p>
                        <p class="cate_info">热卖好货放心挑</p>
                        <img src="../../assets/images/index/index_11.jpg" alt="">
                    </router-link>
                    <router-link to="/productlist/productlista?id=5&goodsType=0" tag="li" class="cate_4">
                        <p class="cate_name">聚氨酯/树脂</p>
                        <p class="cate_info">热卖好货放心挑</p>
                        <img src="../../assets/images/index/index_09.jpg" alt="">
                    </router-link>
                    <router-link to="/productlist/productlista?id=7&goodsType=0" tag="li" class="cate_5">
                        <p class="cate_name">色料</p>
                        <p class="cate_info">热卖好货放心挑</p>
                        <img src="../../assets/images/index/index_10.jpg" alt="">
                    </router-link>
                </ul>
            </div>
            <div class="home_purchase" v-if="indexData.buyList">
                <div class="home_purchase_title">
                    <img src="../../assets/images/index/index_12.png" alt="">
                </div>
                <div v-for="(list,index) in indexData.buyList">
                    <PurchaseItemA :purchaseData="list" v-if="list.buy_imgs.length>1"></PurchaseItemA>
                    <PurchaseItemB :purchaseData="list" v-if="list.buy_imgs.length==1"></PurchaseItemB>
                </div>
                <router-link tag="div" to="/purchaselobby" class="more_purchase">
                    更多求购
                    <i class="iconfont">&#xe635;</i>
                </router-link>
            </div>
            <div class="copyright">
                <p>一革网  版权所有</p>
                <p>Copyright © 2017 Ezhaoge.com All Rights Reserved</p>
            </div>
        </div>
        <BottomNav @bottomStatus="getBottom"></BottomNav>
    </div>
</template>

<script>
import BottomNav from '../common/bottomNav.vue'
import SearchHead from '../common/searchHead.vue'
import ImageSwiper from '../common/imageSwiper.vue'
import PurchaseItemA from '../common/purchaseItemA.vue'
import PurchaseItemB from '../common/purchaseItemB.vue'
import '../../assets/sass/index.sass'
import {Swipe, SwipeItem, Indicator, Toast} from 'mint-ui'
export default {
  components: {
    BottomNav,
    SearchHead,
    ImageSwiper,
    Swipe,
    SwipeItem,
    PurchaseItemA,
    PurchaseItemB,
    Indicator,
    Toast
  },
  data () {
    return {
      bottomShow: false, // 底部导航弹框
      activeIndex: 0,
      indexData: {},
      scrollTop: false,
      bottomLayer: true
    }
  },
  computed: {
    top () {
      return -this.activeIndex * 0.8 + 'rem'
    }
  },
  watch: {
    bottomShow: function (newValue, oldValue) {
      console.log(newValue, 'new')
      console.log(oldValue, 'old')
      if (newValue == true) {
        console.log('delete')
        this.bottomLayer = false
        window.removeEventListener('scroll', this.handleScrollTop)
      } else {
        console.log('add')
        this.bottomLayer = true
        window.addEventListener('scroll', this.handScrollTop)
      }
    }
  },
  mounted: function () {
    window.addEventListener('scroll', this.handScrollTop)
    console.log(this.$weixin, 'weixin')
    this.getData()
    setInterval(_ => {
      if (this.activeIndex < this.indexData.announcement_list.length - 1) {
        this.activeIndex += 1
      } else {
        this.activeIndex = 0
      }
    }, 3000)
  },
  methods: {
    handScrollTop () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      if (scrollTop > 0) {
        this.scrollTop = true
      } else {
        this.scrollTop = false
      }
    },
    getData () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('wap/index').then(data => {
        Indicator.close()
        this.indexData = data.data.data
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
      })
    },
    goUrl (url) {
      location.href = url
    },
    getBottom (data) {
      this.bottomShow = data
    }
  }
}
</script>
<style media="screen">

</style>
