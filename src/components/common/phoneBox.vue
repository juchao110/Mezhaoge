/*
 * @Author: juchao
 * @Date: 2018-03-21 16:37:02
 * @Last Modified by: juchao
 * @Last Modified time: 2018-03-21 16:37:22
 * 撮合客服弹框
 */
<template>
    <div class="phone_box">
        <mt-popup v-model="showBox" position="middle" :closeOnClickModal="false">
            <div class="phone_content">
                <p>专属撮合交易员</p>
                <p class="orange">{{service.name}}</p>
                <p class="blue">{{service.phone}}</p>
                <p class="info">全程为您提供撮合相关顾问服务</p>
                <div class="checkout clearfloat">
                    <div class="cancel" @click="cancel">取消</div>
                    <div class="submit" @click="cancel">
                        <a :href="`tel:${service.phone}`">拨打电话</a>
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import { Popup } from 'mint-ui';

export default {
    props:{
        show:'',
        service:{}
    },
    watch:{
        show:function(newVal,oldVal){
            this.showBox = newVal
        }
    },
    data(){
        return{
            showBox:false
        }
    },
    mounted:function(){
        this.showBox = this.show
        console.log(1212)
    },
    methods:{
        cancel(){
            this.$emit('cancelShow',false)
        }
    }
}
</script>
<style lang="sass" scoped>
.phone_box
    .mint-popup
        border-radius: .1rem
    .phone_content
        width: 6rem
        padding: .3rem .3rem .1rem .3rem
        p
            height: .4rem
            line-height: .4rem
            font-size: .3rem
            color: #333
            text-align: center
            &.orange
                color: #f60
            &.blue
                color: #09e
            &.info
                color: #999
                font-size: .24rem
        .checkout
            height: .9rem
            line-height: .8rem
            padding-top: .1rem
            font-size: 14px
            color: #09e
            border-top: 1px solid #e5e5e5
            margin-top: .4rem
        .checkout
            div
                width: 50%
                float: left
                text-align: center
                font-size: .3rem
                &.cancel
                    color: #999
                    border-right: 1px solid #e5e5e5
        .submit
            a
                color: #09e
</style>
