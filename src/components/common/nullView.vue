/*
 * @Author: YorkeD 
 * @Date: 2018-04-16 14:47:22 
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-04-17 13:56:24
 * 空页面组件
 */
<template>
    <div class="null_box">
        <div class="null_img_text">
            <img src="../../assets/images/user/none.png" class="null_img">
            <p class="null_text">暂无相关数据</p>
        </div>
        <div class="null_btn" v-if="btnStatus != -1" @click="goMatch">
            找不到符合的商品？去求购一个
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            btnStatus:-1,    // 控制按钮显示隐藏
        }
    },
    beforeMount(){
        let pathName = 'searchlist';
        let pathData = this.$route.path;
        this.btnStatus = pathData.indexOf(pathName);
    },
    methods:{
        goMatch(){
            this.$router.push({path: '/sendpurchase'})
        }
    }
}
</script>

<style scoped>
.null_box{
    width: 100%;
    margin-top: .2rem;
    background: #fff;
    height: calc(100vh - .9rem - .8rem);
}  
.null_box .null_img_text{
    width: 2.5rem;
    height: 3.4rem;
    margin: 0 auto;
    padding-top:3.2rem;
}
.null_box .null_img_text .null_img{
    width: 2.5rem;
    height: 2.4rem;
}
.null_box .null_img_text .null_text{
    font-size: .3rem;
    width: 100%;
    height: .6rem;
    line-height: .6rem;
    text-align: center;
}
.null_box .null_btn{
    position: fixed;
    width:100%;
    bottom: 0px;
    height: .98rem;
    line-height: .98rem;
    text-align: center;
    color: #fff;
    background: #09e;
    font-size: .3rem;
}
</style>

