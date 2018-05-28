<template>
    <div class="share_layer" @click="hideLayer">
        <img src="../../assets/images/share_01.png" class="share_img" alt="">
    </div>
</template>
<script>
import {Popup} from 'mint-ui'
export default {
  components: {
    Popup
  },
  data () {
    return {
    }
  },
  mounted: function () {
  },
  methods: {
    hideLayer () {
      this.$emit('getShareStatus', false)
    }
  }
}
</script>
<style lang="sass" scoped>
    @import '../../assets/sass/common.sass'
    .share_layer
        width: 100%
        height: 100vh
        position: fixed
        left: 0
        top: 0
        background: rgba(0,0,0,0.4)
        z-index: 9999
        @include animation(show,1s)
        .share_img
            height: 5.6rem
            margin: 2.5rem auto 0
    @keyframes show
        from
            opacity: 0
        to
            opacity: 1

</style>
