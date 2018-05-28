/*
 * @Author: juchao
 * @Date: 2018-03-20 10:19:07
 * @Last Modified by: juchao
 * @Last Modified time: 2018-03-20 16:35:05
 * 我的求购管理列表
 */
<template>
    <div class="content">
        <PhoneHead :title="pageTitle" @showLayer="getShowStatus"></PhoneHead>
        <div class="my_purchase_list">
            <div class="top_nav">
                <div class="nav" :class="{on:type==1}" @click="changNav(1)">
                    今日求购
                </div>
                <div class="nav" :class="{on:type==2}" @click="changNav(2)">
                    历史求购
                </div>
            </div>
            <mt-loadmore :top-method="loadTop" :bottom-all-loaded="allLoaded" ref="loadmore">
                <div
                    v-infinite-scroll="loadMore"
                    infinite-scroll-immediate-check="true"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="1">
                    <div class="empty" v-if="purchaseDataList.length==0">
                        <img src="../../assets/images/user/none.png" alt="">
                        <p>暂无相关数据</p>
                    </div>
                    <ul class="list" v-if="purchaseDataList.length!=0">
                        <router-link tag="li" class="item" :to="`/purchasedetail/${data.buy_id}/1`" v-for="(data,index) in purchaseDataList">
                            <img :src="data.buy_imgs" alt="" class="main_img">
                            <div class="title">
                                <span v-for="p in data.cate_name">{{p}}</span>
                            </div>
                            <div class="time">
                                报价截止：{{data.endtime | time}}
                            </div>
                            <div class="number">
                                当前报价：<span>{{data.push_count}}人</span>
                            </div>
                            <div class="see_detail">
                                查看详情
                                <i class="iconfont">&#xe635;</i>
                            </div>
                            <div class="status status_1" v-if="data.status==1"></div>
                            <div class="status status_2" v-if="data.status==2"></div>
                            <div class="status status_3" v-if="data.status==3"></div>
                            <div class="status status_4" v-if="data.status==4"></div>
                        </router-link>
                    </ul>
                </div>
            </mt-loadmore>
            <PhoneBox :show="isShow" :service="serviceData" @cancelShow="cancelLayer"></PhoneBox>
        </div>
    </div>
</template>

<script>
import PhoneHead from '../common/phoneHead.vue'
import PhoneBox from '../common/phoneBox.vue'
import '../../assets/sass/user/myPurchaseList.sass'
import {Indicator, InfiniteScroll, Toast} from 'mint-ui'
export default {
  components: {
    PhoneHead,
    PhoneBox,
    Indicator,
    InfiniteScroll,
    Toast
  },
  data () {
    return {
      pageTitle: '求购管理',
      isShow: false, // 是否显示弹框
      serviceData: {},
      type: 1, // 1今日求购  2历史求购
      purchaseData: '',
      purchaseDataList: [], // 列表数据
      currentPage: 1,
      allLoaded: true,
      loading: false
    }
  },
  created: function () {
    this.getService()
  },
  mounted: function () {
    console.log('我的求购管理列表')
    // this.getShowStatus()
    this.getData(1, 1)
  },
  methods: {
    // 从子组件中获取显示弹框的状态
    getShowStatus (data) {
      this.isShow = data
    },
    // 隐藏弹框事件
    cancelLayer (data) {
      this.isShow = data
    },
    changNav (type) {
      if (this.type == type) {
        return
      }
      this.loading = false
      this.currentPage = 1
      this.type = type
      this.$store.state.backTop()
      this.getData(type, this.currentPage)
    },
    // 获取求购列表数据
    getData (type, page) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/buy/buy_list?type=${type}&page=${this.currentPage}`, this.$token).then((data) => {
        Indicator.close()
        this.purchaseData = data.data.data
        this.purchaseDataList = data.data.data.list
      }).catch(() => {
        Indicator.close()
      })
    },
    // 获取客服信息
    getService () {
      this.$http.get('match/offer/match_dealer', this.$token).then(data => {
        console.log(data)
        this.serviceData.name = data.data.data.obj.name
        this.serviceData.phone = data.data.data.obj.mobile
      })
    },
    // 加载更多
    loadMore () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.currentPage = this.currentPage + 1
      this.$http.get(`wap/match/buy/buy_list?type=${this.type}&page=${this.currentPage}`, this.$token).then((data) => {
        Indicator.close()
        if (data.data.data.list == 0) {
          this.loading = true
          console.log('无数据了')
          Toast({
            message: '没有更多数据了',
            duration: 3000
          })
        }
        this.purchaseData = data.data.data
        this.purchaseDataList = [...this.purchaseDataList, ...data.data.data.list]
        console.log(this.purchaseDataList, 'purchaseDataList')
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
    // 下拉刷新
    loadTop () {
      this.loading = false
      this.currentPage = 1
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/buy/buy_list?type=${this.type}&page=${this.currentPage}`, this.$token).then((data) => {
        this.$refs.loadmore.onTopLoaded()	// 结束下拉刷新Loading
        Indicator.close()
        this.purchaseData = data.data.data
        this.purchaseDataList = data.data.data.list
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
    }
  }
}
</script>
<style>
    .mint-loadmore{
        min-height: calc( 100vh - 1.9rem)
    }
</style>
