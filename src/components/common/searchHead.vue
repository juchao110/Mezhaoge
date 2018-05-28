/*
 * @Author: juchao
 * @Date: 2018-03-21 16:37:58
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-07 13:26:57
 * 带搜索的头部
 */
<template>
    <div class="search_head clearfloat">
        <div class="white_bg" v-show="showWhite"></div>
        <img src="../../assets/images/index/logo.png" class="logo_img" v-if="showLogo" />
        <i class="iconfont back" @click="goBack" v-if="!showLogo">&#xe60d;</i>
        <div class="input_box">
            <i class="iconfont search_icon">&#xe60a;</i>
            <div class="input" v-if=" !statusText " @click="goSearch">请输入产品</div>
            <div class="input_text" v-if=" statusText" @click="goSearch">{{statusText}}</div>
            <router-link tag="i" to="/index/imgsearch" class="iconfont photo_icon">&#xe652;</router-link>
        </div>
        <div class="go_purchase" @click="goPurchase">
            <i class="iconfont">&#xe626;</i><br>发求购
        </div>
    </div>
</template>

<script>
import '../../assets/sass/header.sass'

export default {
  props: {
    status: '',
    statusText: ''
  },
  data () {
    return {
      showLogo: false
    }
  },
  computed: {
    showWhite () {
      if (this.status == true) {
        return true
      } else {
        return false
      }
    }
  },
  mounted: function () {
    if (this.$route.path == '/index') {
      this.showLogo = true
    }
  },
  methods: {
    goBack () {
      console.log('后退')
      this.$store.state.purchaseLobbyBy.orderBy = ''
      this.$store.state.purchaseLobbyBy.filter = {}
      if (this.$route.path == '/productlist/productlista') {
        this.$store.state.tabStatus = 0
        this.$store.state.sortData = {
          'sales': 0,
          'goods_id': 3,
          'price': 3
        }
        this.$store.state.shopListopenData = {
          popupData: false,
          goodsNumer: '0',
          goodsTypeId: '',
          navId: '',
          selectData: {},
          classId: '',
          siteId: '',
          goodsType: ''
        },
        this.$store.state.shopListkeyData = ''
        this.$store.state.shopListGoodsType = ''
        this.$store.state.shopListStatus = false
      } else if (this.$route.path == '/index/searchlist') {
        this.$store.state.orderValue = 'sale'
        this.$store.state.sortText = 'desc'
        this.$store.state.searchTabStatus = 0
        this.$store.state.searchSortData = {
          'sales': 0,
          'goods_id': 3,
          'sell_price': 3
        }
        this.$store.state.shopListopenData = {
          popupData: false,
          goodsNumer: '0',
          goodsTypeId: '',
          navId: '',
          selectData: {},
          classId: '',
          siteId: '',
          goodsType: ''
        },
        this.$store.state.shopListkeyData = ''
        this.$store.state.shopListGoodsType = ''
        this.$store.state.shopListStatus = false
        this.$store.state.searchListopenData = { // 给子组件传值
          popupData: false,
          goodsNumer: '0',
          goodsType: 0,
          navData: '',
          provinceData: 0,
          classChildId: [],
          pidDataObj: {},
          cat_id_list: ''
        }
        this.$store.state.searchListStatus = false
      }
      if (this.$store.state.goBack()) {
        this.$router.go(-1)
      } else {
        this.$router.push({path: '/index'})
      }
    },
    goSearch () {
      this.$router.push({path: '/index/wordsearch'})
    },
    goPurchase () {
      this.$router.push({path: '/sendpurchase'})
      this.$store.state.purchaseLobbyBy.orderBy = ''
      this.$store.state.purchaseLobbyBy.filter = {}
      this.$store.state.tabStatus = 0
      this.$store.state.sortData = {
        'sales': 0,
        'goods_id': 3,
        'price': 3
      }
      this.$store.state.orderValue = 'sale'
      this.$store.state.sortText = 'desc'
      this.$store.state.searchTabStatus = 0
      this.$store.state.searchSortData = {
        'sales': 0,
        'goods_id': 3,
        'sell_price': 3
      }
      this.$store.state.shopListopenData = {
        popupData: false,
        goodsNumer: '0',
        goodsTypeId: '',
        navId: '',
        selectData: {},
        classId: '',
        siteId: '',
        goodsType: ''
      },
      this.$store.state.shopListkeyData = ''
      this.$store.state.shopListGoodsType = ''
      this.$store.state.shopListStatus = false
      this.$store.state.searchListopenData = {
        popupData: false,
        goodsNumer: '0',
        goodsType: 0,
        navData: '',
        provinceData: 0,
        classChildId: [],
        pidDataObj: {},
        cat_id_list: ''
      }
      this.$store.state.searchListStatus = false
    },
    closeWhite () {
      this.status = false
      this.$emit('bottomStatus', false)
    }
  }
}
</script>
