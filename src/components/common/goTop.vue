<template>
    <div class="go_top" @click="goTop">
        <i class="iconfont">&#xe661;</i>
        <p>顶部</p>
    </div>

</template>

<script>

export default {
  data () {
    return {

    }
  },
  methods: {
    goTop () {
      this.$store.state.backTop()
    }
  }
}
</script>

<style media="screen" scoped>
    .go_top{
        width: 1rem;
        height:1rem;
        background: #fff;
        box-shadow: 0 0 5px #ccc;
        position: fixed;
        border-radius: 50%;
        text-align: center;
        bottom: 2rem;
        right: .6rem;
        z-index: 20
    }
    .go_top i{
        color: #09e
    }
    .go_top p{
        color: #09e;
        font-size: .3rem;
        position:relative;
        top: -.1rem
    }
</style>
