/*
 * @Author: juchao
 * @Date: 2018-03-20 10:04:41
 * @Last Modified by: juchao
 * @Last Modified time: 2018-03-21 11:31:26
 * 详情页图片轮播
 */
<template>
    <div>
        <div class="img_swiper">
            <mt-swipe :auto="4000">
                <mt-swipe-item v-for="(img,index) in imgList">
                    <img class="preview-img image" :src="img.src" @click="showBig(index)">
                </mt-swipe-item>
            </mt-swipe>
        </div>
    </div>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'
import photoswipe from 'photoswipe'

export default {
  props: {
    img: '',
    close: ''
  },
  data () {
    return {
      imgList: [],
      bigPic: false
    }
  },
  mounted: function () {
    this.imgList = this.img
    console.log(this.close, 'close')
  },
  watch: {
    close: function (newv, oldv) {
      console.log(this.close, 'sccc')
      if (newv) {
        this.$preview.close()
        this.$emit('preview', false)
      }
    }
  },
  methods: {
    handleClose () {

    },
    showBig (index) {
      this.$emit('preview', true)
      this.$preview.open(index, this.imgList)
    }
  }
}
</script>
<style scoped>
    .img_swiper{
        height: 7.5rem;
    }
    .mint-swipe-item{
        overflow: hidden;
    }
    .img_swiper .image{
        /* width: 100%; */
        height: 100%;
        display: block;
        margin: 0 auto;
    }
</style>
