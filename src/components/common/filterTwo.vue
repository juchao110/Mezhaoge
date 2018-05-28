<!-- 筛选组件 -->
<template>
    <div class="filter">
        <div class="filter_title">
            <i class="iconfont back" @click="hideFilterTwo">&#xe60d;</i>
            {{parentList.title}}
        </div>
        <div class="filter_search" v-if="listId.id!='area'">
            <div class="search_box">
                <i class="iconfont search_icon">&#xe60a;</i>
                <input type="text" placeholder="请输入名称/拼音字母" v-model="key">
            </div>
        </div>
        <ul class="filter_list">
            <li v-for="(data,index) in list" @click="choose(data.id,data.title)">
                <p class="filter_name" :class="{on:data.id==filterChoosedList[parentList.id]}">{{data.title}}</p>
            </li>
        </ul>
    </div>
</template>

<script>
import '../../assets/sass/filter.sass'
import {Indicator, Toast} from 'mint-ui'

export default {
  components: {
    Indicator,
    Toast
  },
  props: {
    listId: {},
    choosedList: {},
    areaId: '',
    cate: []
  },
  watch: {
    key: function (newVal, oldVal) {
      console.log(newVal, oldVal)
      this.keySearch(newVal)
    }
  },
  data () {
    return {
      parentList: '',
      list: {},
      filterChoosedList: {},
      key: '',
      count: '',
      area: '',
      cateIdList: ''
    }
  },
  mounted: function () {
    this.parentList = this.listId
    console.log(this.parentList, 'this.parentList')
    this.filterChoosedList = this.choosedList
    this.area = this.areaId
    console.log(this.area, 'area')
    this.cateIdList = this.cate ? this.cate : ''
    console.log(this.cateIdList, 'cateIdList')
    console.log(this.parentList)
    if (this.parentList.id === 'area') {
      this.getArea()
    } else {
      this.getCate(this.parentList.id, '', '')
    }
  },
  methods: {
    getArea () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('wap/area/list').then(data => {
        console.log(data)
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
    getCate (id, cateArr, kw) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/buy/child_cate?pid=${id}&kw=${kw}`).then(data => {
        Indicator.close()
        this.list = data.data.data.list
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
      })
    },
    keySearch (word) {
      this.getCate(this.parentList.id, this.cateIdList, word)
    },
    hideFilterTwo () {
      this.$emit('hideSecondFilter', false)
    },
    choose (id, title) {
      this.filterChoosedList[this.parentList.id] = id
      this.filterChoosedList[this.parentList.title] = title
      this.filterChoosedList.status = false
      console.log(this.filterChoosedList)
      this.$emit('choosed', this.filterChoosedList)
    }
  }
}
</script>
