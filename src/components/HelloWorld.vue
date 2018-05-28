<template>
    <div class="hello">
        {{dataList.title}}
        <!-- <button @click="share">分享</button> -->
    </div>
  
</template>

<script>
import '../assets/sass/index.sass'
var wx = require('weixin-js-sdk');
export default {
    name: 'HelloWorld',
    data () {
        return {
            msg: 'Welcome to Your Vue.js App',
            dataList:'',
        }
    },
    mounted:function(){
        console.log(location.href.split('#')[0])
        this.$http.get('dz/list',this.$token).then((data)=>{
            console.log(data)
            this.dataList=data.data.data;
        })
    },
    methods:{
        share(){
            console.log("分享")
            wx.onMenuShareTimeline({
                title: '', // 分享标题
                link: '', // 分享链接，该链接域名必须与当前企业的可信域名一致
                imgUrl: '', // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                    console.log("分享成功")
                },
                cancel: function () {
                    console.log("分享失败")
                    // 用户取消分享后执行的回调函数
                }
            });
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
