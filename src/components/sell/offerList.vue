<template>
    <div class="content">
        <PhoneHead :title="pageTitle" @showLayer="getShowStatus"></PhoneHead>
        <div class="offer_list">
            <div class="top_nav">
                <div class="nav_list" :class="{on:type==1}" @click="changeType(1)">
                    待报价
                </div>
                <div class="nav_list" :class="{on:type==2}" @click="changeType(2)">
                    已报价
                </div>
                <div class="nav_list" :class="{on:type==3}" @click="changeType(3)">
                    已忽略
                </div>
                <div class="nav_list" :class="{on:type==4}" @click="changeType(4)">
                    已过期
                </div>
            </div>
            <mt-loadmore :top-method="loadTop" :bottom-all-loaded="allLoaded" ref="loadmore">
                <div v-if="listDataList"
                    v-infinite-scroll="loadMore"
                    infinite-scroll-immediate-check="true"
                    infinite-scroll-disabled="loading"
                    infinite-scroll-distance="1">
                    <div class="empty" v-if="listDataList.length==0">
                        <img src="../../assets/images/user/none.png" alt="">
                        <p>暂无相关数据</p>
                    </div>
                    <ul class="offer_list_ul clearfloat" v-if="listDataList.length!=0">
                        <li v-for="(data,index) in listDataList">
                            <router-link tag="div" :to="`/purchasedetail/${data.buy_id}/${listData.source}?user_id=${listData.user_id}`" class="offer_list_item">
                                <img :src="data.wenlu_img" alt="" class="main_img">
                                <p class="title">
                                    <em v-for="p in data.cate_name">{{p}}</em>
                                </p>
                                <p class="address">交货地：{{data.province_name}}</p>
                                <p class="offer_number">已有<span>{{data.offerCount}}</span>家报价</p>
                                <p class="offer_time">报价截止：{{data.endtime | time}}</p>
                            </router-link>
                            <router-link tag="div" class="offer_info" :to="`/offerdetail/${data.offerObj.offer_id}/${data.offerObj.source}`"  v-if="data.offerObj.ignore==0 && type==2">
                                <img :src="data.offerObj.main_img?data.offerObj.main_img:data.wenlu_img" class="img" alt="">
                                <p class="price">单价：<span>￥{{data.offerObj.price}}</span>/{{data.sku}}</p>
                                <p class="address">产地：{{data.offerObj.province_name}}</p>
                                <p class="remark">备注：{{data.offerObj.remark}}</p>
                            </router-link>
                            <div class="no_offer" v-if="data.offerObj.ignore==1 && type==3">
                                忽略，暂无供货计划！
                            </div>
                        </li>
                    </ul>
                    <p class="no_more" v-if="listDataList.length!=0">老板，没有更多了</p>
                </div>
            </mt-loadmore>
        </div>
        <PhoneBox :show="isShow" :service="serviceData" @cancelShow="cancelLayer"></PhoneBox>
    </div>

</template>

<script>
import PhoneHead from '../common/phoneHead.vue'
import PhoneBox from '../common/phoneBox.vue'
import '../../assets/sass/sell/offerList.sass'
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
      pageTitle: '报价管理',
      isShow: false, // 是否显示弹框
      serviceData: {},
      type: 1, // 报价类型
      listData: '',
      listDataList: '',
      currentPage: 1,
      allLoaded: true,
      loading: false
    }
  },
  mounted: function () {
    console.log('报价管理列表')
    this.getListData(this.type)
    this.getService()
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
    // 获取列表数据
    getListData (type, page) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/offer/match_offer?type=${type}&page=${page}`, this.$token).then(data => {
        console.log(data)
        Indicator.close()
        this.listData = data.data.data
        this.listDataList = data.data.data.list
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
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
    changeType (type) {
      if (this.type == type) {
        return
      }
      this.currentPage = 1
      this.loading = false
      this.type = type
      this.$store.state.backTop()
      this.getListData(type, this.currentPage)
    },
    // 下拉刷新
    loadTop () {
      this.loading = false
      this.currentPage = 1
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/offer/match_offer?type=${this.type}&page=${this.currentPage}`, this.$token).then((data) => {
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
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.currentPage = this.currentPage + 1
      this.$http.get(`wap/match/offer/match_offer?type=${this.type}&page=${this.currentPage}`, this.$token).then((data) => {
        Indicator.close()
        if (data.data.data.list.length == 0) {
          this.loading = true
          console.log('无数据了')
        }
        this.purchaseData = data.data.data
        this.listDataList = [...this.listDataList, ...data.data.data.list]
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
    }
  }
}
</script>
