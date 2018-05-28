<!-- 属性多选带搜索 -->
<template>
    <div class="more_choose_com">
        <div class="title">
            <i class="iconfont back" @click="goBack">&#xe60d;</i>
            {{list.type}}
        </div>
        <ul class="choose_list" v-if="myList">
            <li v-for="(data,index) in myList.list" :class="{on:checkId.indexOf(data.id)>-1}" @click="choose(data.title,data.id,index)">
                {{data.title}}
                <i class="iconfont uncheck" v-if="checkId.indexOf(data.id)==-1">&#xe61d;</i>
                <i class="iconfont check" v-if="checkId.indexOf(data.id)>-1">&#xe604;</i>
            </li>
        </ul>
        <button type="button" @click="check">确定</button>
    </div>
</template>

<script>
import '../../assets/sass/select.sass'
import {Toast} from 'mint-ui'
export default {
  components: {
    Toast
  },
  props: {
    list: ''
  },
  watch: {
    list: function (newVal, oldVal) {
      this.list = newVal
    }
  },
  data () {
    return {
      myList: '',
      onId: '',
      myChoose: '',
      checkName: [],
      checkId: []
    }
  },
  mounted: function () {
    this.myList = this.list
    console.log(this.myList, 'list')
    console.log(this.myList.choosedList, 'chooseList')
    this.checkName = this.myList.choosedList.name
    this.checkId = this.myList.choosedList.id
  },
  methods: {
    goBack () {
      this.$emit('moreChooseBox', {status: false})
    },
    choose (val, id, index) {
      if (this.checkId.indexOf(id) > -1) {
        this.checkName.splice(this.checkName.indexOf(id), 1)
        this.checkId.splice(this.checkId.indexOf(id), 1)
      } else {
        this.checkName.push(val)
        this.checkId.push(id)
      }
    },
    check () {
      if (this.myList.require && this.checkId.length == 0) {
        Toast({
          message: '请至少选择一项',
          duration: 3000
        })
      } else if (this.myList.require && this.checkId.length > 10) {
        Toast({
          message: '最多选择十项',
          duration: 3000
        })
      } else {
        this.$emit('moreChooseBox', {status: false, pId: this.myList.pId, type: this.myList.type, data: {name: this.checkName, id: this.checkId}})
      }
    }
  }
}
</script>
