<template>
    <div class="wei_code" @click="hidePop">
        <mt-popup
            v-model="show"
            position="middle">
          <div class="img_code">
              <img :src="imgUrl" alt="">
              <p>识别二维码图案，添加微信好友</p>
          </div>
        </mt-popup>
    </div>
</template>

<script>
import { Popup } from 'mint-ui'
import '../../assets/sass/code.sass'
export default {
  components: {
    Popup
  },
  props: {
    parentData: {}
  },
  data () {
    return {
      show: false,
      imgUrl: ''
    }
  },
  mounted: function () {
    this.imgUrl = this.parentData.img
    this.show = this.parentData.status
  },
  methods: {
    hidePop () {
      this.show = false
      this.$emit('cancel', false)
    }
  }
}
</script>
