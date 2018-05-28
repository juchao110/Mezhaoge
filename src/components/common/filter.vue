/*
 * @Author: juchao
 * @Date: 2018-03-21 16:39:43
 * @Last Modified by:   juchao
 * @Last Modified time: 2018-03-21 16:39:43
 * 筛选组件
 */
<template>
    <div>
        <div class="filter" v-if="!showFilter">
            <div class="filter_title">
                筛选
            </div>
            <ul class="filter_list">
                <li @click="goFilterTwo('地区','area')">
                    <p class="filter_name">地区</p>
                    <p class="filter_value">{{areaName | default('全部')}}</p>
                    <i class="iconfont go">&#xe635;</i>
                </li>
                <li v-for="(data,index) in filterList.list" @click="goFilterTwo(data.title,data.id)" v-if="data.title!='工艺'&& data.title!='规格'">
                    <p class="filter_name">{{data.title}}</p>
                    <p class="filter_value">{{chooseCateList[data.title] | default('全部')}}</p>
                    <i class="iconfont go">&#xe635;</i>
                </li>
            </ul>
            <div class="bottom_btn">
                <div class="clear" @click="clear">
                    清空
                </div>
                <div class="filter_submit" @click="check">
                    确定（{{counts | default(defaultTotle)}}条）
                </div>
            </div>
        </div>
        <FilterTwo :areaId="areaId" :cate="cateId" :listId="filterId" :overChoose="cateId" :choosedList='chooseCateList' v-if="showFilter" @choosed="getChoosedId" @hideSecondFilter="getSecondFilter"></FilterTwo>
    </div>
</template>

<script>
import '../../assets/sass/filter.sass'
import FilterTwo from './filterTwo.vue'
var qs = require('qs')
export default {
  components: {
    FilterTwo
  },
  props: {
    filter: {},
    totle: '',
    defaultTot: '',
    overFilter: {},
    orderby: ''
  },
  data () {
    return {
      filterList: {},
      filterId: {},
      pId: [],
      cateId: [],
      showFilter: false,
      chooseCateList: {},
      areaId: '',
      areaName: '',
      counts: '',
      over: {},
      defaultTotle: '',
      orderType: ''
    }
  },
  mounted: function () {
    this.filterList = this.filter
    this.counts = this.totle
    this.orderType = this.orderby
    this.defaultTotle = this.defaultTot
    console.log(this.$store.state.totleAmount, 'this.$store.state.totleAmount')
    this.over = this.overFilter
    console.log(this.over, 'over')
    if (this.over.area) {
      this.areaName = this.over.area.name
      this.areaId = this.over.area.id
    }
    if (this.over.cateList) {
      this.chooseCateList = this.over.cateList
      for (let i in this.chooseCateList) {
        for (let j in this.over.pId) {
          if (this.over.pId[j] == i) {
            this.cateId.push(this.chooseCateList[this.over.pId[j]])
          }
        }
        console.log(this.cateId, 'cateid')
      }
    }
    console.log(this.filterList, 'this.filterList')
  },
  methods: {
    goFilterTwo (title, id) {
      if (title === '地区') {

      } else {
        if (this.pId.indexOf(id) > -1) {

        } else {
          this.pId.push(id)
        }
      }
      console.log(id)
      this.filterId = {'title': title, 'id': id}
      this.showFilter = true
    },
    getSecondFilter (data) {
      console.log(data, 'data')
      this.showFilter = data
    },
    getChoosedId (data) {
      this.cateId = []
      this.counts = data.counts
      this.showFilter = data.status
      this.chooseCateList = data
      console.log(this.chooseCateList)
      for (let i in this.chooseCateList) {
        if (i === '地区') {
          this.areaName = this.chooseCateList[i]
        }
        if (i === 'area') {
          this.areaId = this.chooseCateList[i]
        }
        for (let j in this.pId) {
          if (this.pId[j] == i) {
            this.cateId.push(this.chooseCateList[this.pId[j]])
          }
        }
        console.log(this.cateId, 'cateid')
      }
      let cateString = this.cateId.join(',')
      console.log(cateString, 'cateString')
      this.$http.get(`wap/match/buy/buy_count?province_id=${this.areaId}&goodscate=${cateString}&orderby=${this.orderType}`).then(data => {
        this.counts = data.data.data.counts
        console.log(this.cateId)
      })
    },
    check () {
      this.$emit('filter', {area: this.areaId, areaName: this.areaName, cateList: this.chooseCateList, pId: this.pId, cate: this.cateId, status: false})
    },
    clear () {
      this.chooseCateList = {}
      this.areaId = ''
      this.areaName = ''
      this.cateId = []
      this.counts = ''
    }

  }
}
</script>
