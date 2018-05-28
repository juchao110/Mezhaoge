/*
 * @Author: juchao
 * @Date: 2018-03-20 09:21:20
 * @Last Modified by: juchao
 * @Last Modified time: 2018-03-20 09:21:42
 * 求购列表数据  图片是多张的组件
 */

<template>
    <router-link tag="div" :to="`/purchasedetail/${data.buy_id}/${data.source}?user_id=${userId}`" class="purchase_item_a">
        <div class="user_info">
            <img :src="data.avatar" alt="" class="logo">
            <p>{{data.user_name}} 求购</p>
            <div class="time" v-if="time&&data.status==1">
                剩余{{time}}天
            </div>
            <div class="is_over" v-if="data.status!=1">
                已截止
            </div>
            <div class="over_offer">
                <span>{{data.push_count}}</span>家已报价
            </div>
        </div>
        <ul class="img_list clearfloat">
            <li v-for="(img,index) in data.buy_imgs" v-if="index<=2">
                <img :src="img" alt="">
            </li>
        </ul>
        <div class="good_info">
            <span v-for="cate in data.cate_name">{{cate}}</span>
        </div>
        <div class="amount">
            采购{{data.count}}{{data.sku_name}}  {{data.province_name}}收货
        </div>
        <div class="offer_time">
            {{data.s_created_at | current(data.status)}}
        </div>
    </router-link>
</template>

<script>
export default {
  props: {
    purchaseData: {}
  },
  data () {
    return {
      data: {},
      time: '',
      userId: ''
    }
  },
  watch: {
    purchaseData: function (newValue, oldValue) {
      this.data = newValue
      let s_time = this.data.s_endtime - this.data.now_time
      if (s_time > 86400) {
        this.time = parseInt(s_time / 60 / 60 / 24)
      } else if (s_time < 86400 && s_time > 0) {
        this.time = 1
      } else {
        this.time = ''
      }
    }
  },
  mounted: function () {
    this.userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : ''
    this.data = this.purchaseData
    let s_time = this.data.s_endtime - this.data.now_time
    if (s_time > 86400) {
      this.time = parseInt(s_time / 60 / 60 / 24)
    } else if (s_time < 86400 && s_time > 0) {
      this.time = 1
    } else {
      this.time = ''
    }
  },
  methods: {

  }
}
</script>
