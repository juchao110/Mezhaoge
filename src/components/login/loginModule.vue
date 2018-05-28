<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
  data(){
      return{

      }
  },
  mounted:function(){
      console.log('loginModule')
  },
  methods:{
      goRouter(url){
          this.$router.push({path:`${url}`})
      },
      goIndex(){
          this.$router.push({path:'/index/wordsearch'})
      }
  }
}
</script>
