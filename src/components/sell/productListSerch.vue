/*
 * @Author: YorkeD 
 * @Date: 2018-04-15 16:55:04 
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-04-16 17:36:09
 * 产品管理筛选组件
 */

<template>
    <div class="popup_select_content">
        <div class="popup_box_bg" @click="clearBtn"></div>
        <div class="popup_box" v-show="popupVisible">
            <div class="popup_title_box">筛选</div>
            <ul class="popup_select_box">
                <li class="select_text" @click="goodsClassFun">
                    <span class="text_title l">产品类目</span>
                    <i class="iconfont arrow_icon r">&#xe635;</i>
                    <span class="text_content r">{{goodsClassTitle}}</span>
                </li>
                <li class="select_text" @click="storClassFun">
                    <span class="text_title l">店铺分类</span>
                    <i class="iconfont arrow_icon r">&#xe635;</i>
                    <span class="text_content r">{{storClassTitle}}</span>
                </li>
                <li class="select_text" @click="goodsTypeFun">
                    <span class="text_title l">产品类型</span>
                    <i class="iconfont arrow_icon r">&#xe635;</i>
                    <span class="text_content r">{{goodsTypeTitle}}</span>
                </li>
            </ul>
            <div class="popup_all_btn" v-if="popupVisibleNo2">
                <span class="clear_btn l" @click="clearPopup">清空</span>
                <span class="confirm_btn l" @click="confirmPopup">确定</span>
            </div>
        </div>
        <div class="popup_box_no1" v-show="popupVisibleGoodsClass">
            <div class="popup_title_box">
                <i class="iconfont go_back" @click="goBack(0)">&#xe60d;</i>
                <span class="title_text">产品类目</span>
            </div>
            <ul class="popup_select_box">
                <li class="select_text" v-for="(GoodsClassData,index) in GoodsClassSelectData" @click="goodsClassBtn(index,GoodsClassData)">
                    <span class="text_title l">{{GoodsClassData}}</span>
                </li>
            </ul>
        </div>
        <div class="popup_box_no1" v-show="popupVisibleStorClass">
            <div class="popup_title_box">
                <i class="iconfont go_back" @click="goBack(1)">&#xe60d;</i>
                <span class="title_text">店铺分类</span>
            </div>
            <ul class="popup_select_box">
                <li class="select_text" v-for="(StorClassData,index) in StorClassSelectData" @click="storClassBtn(StorClassData.shop_cate_id,StorClassData.name)">
                    <span class="text_title l">{{StorClassData.name}}</span>
                </li>
            </ul>
        </div>
        <div class="popup_box_no1" v-show="popupVisibleGoodsType">
            <div class="popup_title_box">
                <i class="iconfont go_back" @click="goBack(2)">&#xe60d;</i>
                <span class="title_text">产品类型</span>
            </div>
            <ul class="popup_select_box">
                <li class="select_text" v-for="(GoodsTypeData,index) in GoodsTypeSelectData" @click="goodsTypeBtn(index,GoodsTypeData)">
                    <span class="text_title l">{{GoodsTypeData}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { Popup } from 'mint-ui';
import '../../assets/sass/product/popupSelect.sass';
export default {
    props:['upData'],
    data(){
        return{
            fatherData:[],                    // 父组件传到子组件的数据存放

            popupVisible:true,                // 弹层

            popupVisibleGoodsClass:false,     // 产品类目子目录
            popupVisibleStorClass:false,      // 店铺分类子目录
            popupVisibleGoodsType:false,      // 产品分类子目录

            goodsClassTitle:'全部',           // 产品类目title
            storClassTitle:'全部',            // 店铺分类title
            goodsTypeTitle:'全部',            // 产品类型title

            GoodsClassSelectData:[],          // 产品类目子目录渲染数据
            StorClassSelectData:[],           // 店铺分类子目录渲染数据
            GoodsTypeSelectData:[],           // 产品分类子目录渲染数据

            popupVisibleNo2:1,                // 用于判断清空和确定按钮的显示和隐藏，在二级弹层中隐藏掉
            
            childSelect:{},                   // **传给父组件，并给后端
        }
    },
    beforeCreate(){

    },
    beforeMount(){
        this.fatherData = this.upData.selectData;
    },
    methods:{
        // 产品类目按钮
        goodsClassFun(){
            let vm = this;
            vm.GoodsClassSelectData = vm.fatherData[1];
            vm.popupVisibleGoodsClass = true;
            vm.popupVisibleNo2 = 0;
        },
        // 店铺分类按钮
        storClassFun(){
            let vm = this;
            vm.StorClassSelectData = vm.fatherData[2];
            vm.popupVisibleStorClass = true;
            vm.popupVisibleNo2 = 0;
        },
        // 产品分类按钮
        goodsTypeFun(){
            let vm = this;
            vm.GoodsTypeSelectData = vm.fatherData[0];
            vm.popupVisibleGoodsType = true;
            vm.popupVisibleNo2 = 0;
        },
        // 弹层产品类目按钮
        goodsClassBtn(index,name){
            let vm = this;
            if(index == 0){
                vm.goodsClassTitle = "全部";
            }else{
                vm.goodsClassTitle = name;
            }
            vm.childSelect['nav_type'] = index;
            vm.popupVisibleGoodsClass = false; 
            vm.popupVisibleNo2 = 1;
        },
        // 弹层店铺分类按钮
        storClassBtn(cate_id,name){
            let vm = this;
            vm.storClassTitle = name;
            vm.childSelect['shop_cate_id'] = cate_id;
            vm.popupVisibleStorClass = false; 
            vm.popupVisibleNo2 = 1;
        },
        // 弹层产品分类按钮
        goodsTypeBtn(index,name){
            let vm = this;
            for(let item in vm.GoodsTypeSelectData){
                if(item == 0){
                    vm.goodsTypeTitle = "全部";
                    vm.childSelect['goods_type'] = item;
                    vm.popupVisibleGoodsType = false; 
                    vm.popupVisibleNo2 = 1;
                }else if(vm.GoodsTypeSelectData[item] == name){
                    vm.goodsTypeTitle = name;
                    vm.childSelect['goods_type'] = item;
                    vm.popupVisibleGoodsType = false; 
                    vm.popupVisibleNo2 = 1;
                }
            }
        },
        // 第二级返回按钮
        goBack(status){
            let vm = this;
            if(status == 0){
                vm.popupVisibleGoodsClass = false; 
                vm.popupVisibleNo2 = 1;
            }else if(status == 1){
                vm.popupVisibleStorClass = false;
                vm.popupVisibleNo2 = 1;
            }else if(status == 2){
                vm.popupVisibleGoodsType = false;
                vm.popupVisibleNo2 = 1;
            }
        },
        // 清空筛选
        clearPopup(){
            let vm = this;
            vm.goodsClassTitle = '全部';
            vm.storClassTitle = '全部';     
            vm.goodsTypeTitle = '全部';   
            vm.childSelect = {}; 
        },
        // 确定筛选
        confirmPopup(){
            let childData = {
                layer:false,
                key:this.childSelect
            }
            this.$emit("PopupLayer",childData);
        },
        clearBtn(){
            let vm = this;
            console.log('clear');
            let childData = {
                layer:false,
                key:'',
            }
            vm.$emit("PopupLayer",childData);
        }
    },
    components:{
        Popup,
    }
}
</script>