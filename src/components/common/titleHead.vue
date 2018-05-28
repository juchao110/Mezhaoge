/*
 * @Author: juchao
 * @Date: 2018-03-21 16:38:15
 * @Last Modified by:   juchao
 * @Last Modified time: 2018-03-21 16:38:15
 * 纯文本的头部
 */
<template>
    <div class="title_head">
        <i class="iconfont back" @click="goBack">&#xe60d;</i>
        {{ownTitle}}
    </div>
</template>

<script>
import '../../assets/sass/header.sass'

export default {
  props: {
    title: ''
  },
  data () {
    return {
      ownTitle: ''
    }
  },
  mounted: function () {
    this.ownTitle = this.title
  },
  methods: {
    goBack () {
      localStorage.removeItem('purchaseData')
      if (this.$store.state.goBack()) {
        this.$router.go(-1)
      } else {
        this.$router.push({path: '/index'})
      }
    }
  }
}
</script>
