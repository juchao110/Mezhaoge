<!-- 属性单选 -->
<template>
    <div class="choose_one">
        <div class="title">
            <i class="iconfont back" @click="goBack">&#xe60d;</i>
            {{list.type}}
        </div>
        <ul class="choose_list" v-if="myList">
            <li v-for="(data,index) in myList.list" @click="choose(data.title,data.id)"><span :class="{on:data.id==onId}">{{data.title}}</span></li>
        </ul>
    </div>
</template>

<script>
import '../../assets/sass/select.sass'
export default {

  props: {
    list: ''
  },
  watch: {
    list: function (newVal, oldVal) {
      this.list = newVal
      console.log('watch')
    }
  },
  data () {
    return {
      myList: '',
      onId: ''
    }
  },
  mounted: function () {
    window.scrollTo(0, 0)
    this.myList = this.list
    console.log(this.myList, 'list')
    this.onId = this.myList.choosedId
  },
  methods: {
    goBack () {
      this.$emit('chooseBox', false)
    },
    choose (val, id) {
      let newData = {}
      newData.status = false
      newData.type = this.myList.type
      newData[this.myList.id] = {title: val, id: id}
      this.$emit('chooseBox', newData)
    }
  }
}
</script>
