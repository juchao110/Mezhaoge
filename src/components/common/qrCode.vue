<template>
    <div class="qr_box" @click="clearFun">
        <div class="canvas_bg">
            <canvas id="canvas_box"></canvas>
        </div>
    </div>
</template>
<script>
import QRCode from 'qrcode';
export default {
    props:['urlData'],
    data (){
        return{
            codes:'',
            canvasTop:false
        }
    },
    mounted(){
        console.log(this.urlData,"子组件接收");
        let urlsite = this.urlData.urlSite;
        this.canvasTop = this.$weixin;
        this.useqrcode(urlsite);
    },
    methods:{
        useqrcode(url){
            var canvas = document.getElementById('canvas_box');
            QRCode.toCanvas(canvas,url, function (error) {
                if (error) 
                console.error(error)
            })
        },
        clearFun(){
            this.$emit("UrlLayer",0);
        }
    }
}
</script>
<style scoped>
.qr_box{
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, .8);
    z-index: 2999;
}
.canvas_bg{
    width: 5.9rem;
    height: 7rem;
    background: url(../../assets/images/qrcode_img.png) no-repeat;
    background-size: cover;
    position: absolute;
    top:50%;
    margin-top: -4rem;
    left:50%;
    margin-left:-3rem;
    position: relative;
}
.canvas_bg #canvas_box{
    width: 2.6rem !important;
    height: 2.6rem !important;
    position: absolute;
    top: 50%;
    margin-left:-1.2rem;
    left:50%;
    margin-top: -.2rem;
}
</style>
