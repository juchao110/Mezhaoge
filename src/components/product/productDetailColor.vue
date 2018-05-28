/*
 * @Author: YorkeD 
 * @Date: 2018-04-06 16:27:14 
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-05 14:19:42
 * 详情页面选择色号功能
 */
<template>
    <div class="detail_color_content">
        <div class="detail_color_box">
            <div class="detail_color_top">
                规格
                <i class="iconfont clear_icon r" @click="clearBtn">&#xe607;</i>
            </div>
            <div class="detail_color_title">
                <ul class="color_title_box">
                    <li class="color_title_number l">编号</li>
                    <li class="color_title_dyestuff l" v-for="(skuTitle,index) in goodsSkuTitle">{{skuTitle}}</li>
                </ul>
            </div>
            <div class="detail_color_number">
                <ul class="color_number_box">
                    <li class="color_number_info" v-for="(skyData,index) in goodsSkuData">
                        <ul class="color_info_box">
                            <li class="color_info_img l" v-if="skyData.pic != '' && skyData.pic != null ">
                                <img class="color_img_box" :src="skyData.pic">
                            </li>
                            <li class="color_info_img l" v-if="skyData.pic == '' || skyData.pic == null ">
                                <span class="null_img"></span>
                            </li>
                            <li class="color_sell_price l" v-if="skyData.color_number != '' && skyData.color_number != null">
                                <p class="color_stor_text">{{skyData.color_number}}</p>
                                <p class="color_stor_price">￥{{skyData.price}}</p>
                            </li>
                            <li class="color_sell_price_null l" v-if="skyData.color_number == '' || skyData.color_number == null ">
                                <p class="color_stor_price_null">￥{{skyData.price}}</p>
                            </li>
                            <li class="color_info_dyestuff l" v-for="skuAttr in skyData.sku_attr">{{skuAttr.value}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import '../../assets/sass/product/productDetailColor.sass';
import { Indicator , Toast } from 'mint-ui';
export default {
    data(){
        return{
            goodsSkuData:{},         // sky列表数据
            goodsSkuTitle:[],        // sku title
        }
    },
    beforeCreate(){
        console.log('进入色号选择')
    },
    beforeMount () {
        let vm = this;
        let idData = vm.$route.params.id;
        Indicator.open({
            spinnerType:'fading-circle'
        });
        vm.$http.get('wap/goods/sku?id=' + idData,vm.$token).then((req)=>{
            Indicator.close();
            console.log(req,'detailColor');
            let code = req.data.data.code;
            let msg = req.data.data.msg;
            if(code == 200){
                vm.goodsSkuData = req.data.data.goods_skus;
                for(let id in vm.goodsSkuData){
                    let obj_data = vm.goodsSkuData[id];
                    if(id == obj_data.id){
                        let skuAttr = obj_data.sku_attr;
                        for(let skuIndex in skuAttr){
                            let sku_obj = skuAttr[skuIndex]
                            vm.goodsSkuTitle[skuIndex] = sku_obj.title;
                        }
                        return
                    }
                }
            }else{
                Toast({
                    message:msg,
                    duration:3000
                })
            }
        })
    },
    methods:{
        // 关闭按钮
        clearBtn(){
            this.$emit('detailColor',0);
        },
    },
    components: {
        
    }
}
</script>
