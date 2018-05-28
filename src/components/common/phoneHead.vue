/*
 * @Author: juchao
 * @Date: 2018-03-21 16:37:28
 * @Last Modified by: juchao
 * @Last Modified time: 2018-03-21 16:37:53
 * 带有拨号的头部
 */
<template>
    <div class="phone_head">
        <i class="iconfont back" @click="goBack">&#xe60d;</i>
        {{ownTitle}}
        <i class="iconfont phone" @click="phone">&#xe628;</i>
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
      if (this.$store.state.goBack()) {
        this.$router.go(-1)
      } else {
        this.$router.push({path: '/index'})
      }
    },
    phone () {
      this.$emit('showLayer', true)
    }
  }
}
</script>
