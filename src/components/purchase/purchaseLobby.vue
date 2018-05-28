<template>
    <div :class="{disable_scroll:showFilter}">
        <SearchHead></SearchHead>
        <div class="purchase_lobby">
            <div class="search_type">
                <div class="start_time" :class="{on:type==1}" @click="changeData(1)">
                    最新发布
                </div>
                <div class="over_time" :class="{on:type==2}" @click="changeData(2)">
                    即将截止
                </div>
                <i class="iconfont more_type" :class="{is_filt:filter}" @click="goFilter">&#xe647;</i>
            </div>
            <mt-loadmore :top-method="loadTop" :bottom-all-loaded="allLoaded" ref="loadmore" style="width:7.5rem">
                <div v-if="listDataList"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-immediate-check="true"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="1">
                    <ul>
                        <li v-for="(data,index) in listDataList">
                            <PurchaseItemA :purchaseData="data" v-if="data.buy_imgs.length>1"></PurchaseItemA>
                            <PurchaseItemB :purchaseData="data" v-if="data.buy_imgs.length==1"></PurchaseItemB>
                        </li>
                    </ul>
                </div>
            </mt-loadmore>
            <p class="no_more">老板，没有更多了</p>
            <div class="black_bg" @click="hideFilter" v-if="showFilter"></div>
        </div>
        <FilterComponent :totle="counts" :orderby='type' :defaultTot="totleAmount" :overFilter="overFilter" :filter="filterData" v-if="showFilter" @filter="getFilter"></FilterComponent>
    </div>
</template>

<script>
import SearchHead from '../common/searchHead.vue'
import PurchaseItemA from '../common/purchaseItemA.vue'
import PurchaseItemB from '../common/purchaseItemB.vue'
import FilterComponent from '../common/filter.vue'
import '../../assets/sass/purchase/purchaseLobby.sass'
import {Indicator, InfiniteScroll, Toast} from 'mint-ui'

export default {
  components: {
    SearchHead,
    PurchaseItemA,
    PurchaseItemB,
    FilterComponent,
    Indicator,
    InfiniteScroll,
    Toast
  },
  data () {
    return {
      type: '',
      listData: {},
      listDataList: '',
      currentPage: 1,
      allLoaded: true,
      loading: false,
      showFilter: false,
      filterData: '',
      overFilter: {},
      filter: false,
      selectArea: '',
      selectCate: '',
      totleAmount: ''
    }
  },
  mounted: function () {
    console.log(this.$store.state.purchaseLobbyBy)
    this.selectArea = this.$store.state.purchaseLobbyBy.filter.choosedArea ? this.$store.state.purchaseLobbyBy.filter.choosedArea : ''
    this.overFilter.area = this.$store.state.purchaseLobbyBy.filter.areaList ? this.$store.state.purchaseLobbyBy.filter.areaList : ''
    this.selectCate = this.$store.state.purchaseLobbyBy.filter.choosedCate ? this.$store.state.purchaseLobbyBy.filter.choosedCate : []
    this.overFilter.cateList = this.$store.state.purchaseLobbyBy.filter.cateList ? this.$store.state.purchaseLobbyBy.filter.cateList : {}
    this.overFilter.pId = this.$store.state.purchaseLobbyBy.filter.pId ? this.$store.state.purchaseLobbyBy.filter.pId : ''
    if (this.overFilter.area || this.overFilter.cateList.length > 0) {
      console.log('已筛选')
      this.filter = true
    }
    this.type = this.$store.state.purchaseLobbyBy.orderBy ? this.$store.state.purchaseLobbyBy.orderBy : ''
    this.getData(this.type, this.selectArea, this.selectCate, 1)
  },
  beforeRouteLeave (to, from, next) {
    if (to.name != 'MyPurchaseDetail' && to.path != '/index/wordsearch' && to.path != '/index/imgsearch') {
      this.$store.state.purchaseLobbyBy.orderBy = ''
      this.$store.state.purchaseLobbyBy.filter = {}
    }
    next()
  },
  methods: {
    getData (type, id, cate, page) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/buy/purchase_list?orderby=${type}&province_id=${id}&goodscate=${cate}&page=${page}`).then(data => {
        Indicator.close()
        this.listData = data.data.data
        this.listDataList = data.data.data.list
        this.counts = this.listData.totalItem
        if (!this.totleAmount) {
          this.totleAmount = this.listData.totalItem
        }
      }).catch(data => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
      })
    },
    changeData (type) {
      this.currentPage = 1
      this.type = type
      this.$store.state.purchaseLobbyBy.orderBy = type
      this.loading = false
      this.$store.state.backTop()
      this.getData(type, this.selectArea, this.selectCate, this.currentPage)
    },
    // 下拉刷新
    loadTop () {
      this.loading = false
      this.currentPage = 1
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/buy/purchase_list?orderby=${this.type}&province_id=${this.selectArea}&goodscate=${this.selectCate}&page=${this.currentPage}`, this.$token).then((data) => {
        this.$refs.loadmore.onTopLoaded()	// 结束下拉刷新Loading
        Indicator.close()
        this.listData = data.data.data
        this.listDataList = data.data.data.list
      }).catch(data => {
        Indicator.close()
        this.$refs.loadmore.onTopLoaded()
        Toast({
          message: '网络错误，请稍后再试',
          position: 'middle',
          duration: 3000
        })
        this.loading = false
      })
    },
    // 加载更多
    loadMore () {
      console.log('加载更多')
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.currentPage = this.currentPage + 1
      this.$http.get(`wap/match/buy/purchase_list?orderby=${this.type}&province_id=${this.selectArea}&goodscate=${this.selectCate}&page=${this.currentPage}`, this.$token).then((data) => {
        Indicator.close()
        if (data.data.data.list.length == 0) {
          this.loading = true
          Toast({
            message: '没有更多数据了',
            duration: 3000
          })
        }
        this.purchaseData = data.data.data
        this.listDataList = [...this.listDataList, ...data.data.data.list]
      }).catch(data => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          position: 'middle',
          duration: 3000
        })
        this.loading = false
      })
    },
    // 打开筛选弹窗
    goFilter () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('wap/goods/nav?id=1').then(data => {
        console.log(data)
        Indicator.close()
        this.filterData = data.data.data
        this.showFilter = true
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
      })
    },

    hideFilter () {
      this.showFilter = false
    },
    getFilter (data) {
      this.loading = false
      console.log(data)
      if (data.area || data.cate.length != 0) {
        this.filter = true
      } else {
        this.filter = false
      }
      this.showFilter = data.status
      this.currentPage = 1
      this.filterArea = data.area
      this.filterCate = data.cate
      this.overFilter.area = {name: data.areaName, id: data.area}
      this.overFilter.cateList = data.cateList
      this.overFilter.pId = data.pId
      this.selectArea = data.area
      this.selectCate = data.cate
      this.listDataList = ''
      this.$store.state.purchaseLobbyBy.filter.areaList = {name: data.areaName, id: data.area}
      this.$store.state.purchaseLobbyBy.filter.cateList = data.cateList
      this.$store.state.purchaseLobbyBy.filter.pId = data.pId
      this.$store.state.purchaseLobbyBy.filter.choosedArea = data.area
      this.$store.state.purchaseLobbyBy.filter.choosedCate = data.cate
      this.getData(this.type, data.area, data.cate, this.currentPage)
    }
  }
}
</script>
