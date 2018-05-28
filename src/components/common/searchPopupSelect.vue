/*
 * @Author: YorkeD 
 * @Date: 2018-04-04 17:09:35 
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-23 13:55:59
 * 筛选组件
 */
<template>
    <div class="popup_select_content">
        <div class="popup_box_bg" @click="clearBtn"></div>
        <div class="popup_box" v-show="popupVisible">
            <div class="popup_title_box">筛选</div>
            <ul class="popup_select_box">
                <li class="select_text" @click="siteDataFun">
                    <span class="text_title l">地区</span>
                    <i class="iconfont arrow_icon r">&#xe635;</i>
                    <span class="text_content r">{{siteData}}</span>
                </li>
                <li class="select_text" @click="classDataFun">
                    <span class="text_title l">类目</span>
                    <i class="iconfont arrow_icon r">&#xe635;</i>
                    <span class="text_content r">{{classData}}</span>
                </li>
                <li class="select_text" @click="classInfoFun(data.id,data.title)" v-if="no1SelectData != []" v-for="(data,index) in no1SelectData">
                    <span class="text_title l">{{data.title}}</span>
                    <i class="iconfont arrow_icon r">&#xe635;</i>
                    <span class="text_content r">{{pidDataObj[data.id] | default('全部')}}</span>
                </li>
            </ul>
            <div class="popup_all_btn" v-if="!popupVisibleNo2">
                <span class="clear_btn l" @click="clearPopup">清空</span>
                <span class="confirm_btn l" @click="confirmPopup">确定（{{upData.goodsNumer}}条）</span>
            </div>
        </div>
        <div class="popup_box_no1" v-show="popupVisibleNo2">
            <div class="popup_title_box">
                <i class="iconfont go_back" @click="goBack">&#xe60d;</i>
                <span class="title_text">类目</span>
            </div>
            <ul class="popup_select_box">
                <li class="select_text" v-show="!popupVisibleNo2Arrow" v-for="(data,index) in no2SelectData" @click="no3SelectFun(data.name,data.id,0)">
                    <span class="text_title l" v-bind:class = "{blue_text:siteId == data.id}" v-if="data.name != undefined">{{data.name}}</span>
                    <i class="iconfont arrow_icon r" v-if="popupVisibleNo2Arrow">&#xe635;</i>
                    <span class="text_content r" v-if="popupVisibleNo2Arrow">{{siteData}}</span>
                </li>
                    <li class="select_text" v-show="popupVisibleNo2Class" v-for="(data,index) in no2SelectData" @click="no3SelectFun(data.title,data.id,data.goods_type)">
                    <span class="text_title l" v-bind:class = "{blue_text:classId == data.id && goodsType == data.goods_type}" v-if="data.title != undefined">{{data.title}}</span>
                    <i class="iconfont arrow_icon r" v-if="!popupVisibleNo2Class">&#xe635;</i>
                    <span class="text_content r" v-if="!popupVisibleNo2Class">{{siteData}}</span>
                </li>
            </ul>
        </div>
        <div class="popup_box_no1" v-show="popupVisibleNo3">
            <div class="popup_title_box">
                <i class="iconfont go_back" @click="goBackNo3">&#xe60d;</i>
                <span class="title_text">{{no3TitleData}}</span>
            </div>
            <div class="popup_search_box">
                <div class="popup_search_box1">
                    <i class="iconfont search_icon l">&#xe60a;</i>
                    <input type="text" v-model="searchData" @keyup="searchFun" placeholder="请输入名称/拼音首字母" class="search_input">
                </div>
            </div>
            <ul class="popup_select_box">
                <li class="select_text" @click="selectPushClass(data.id,data.title)" v-for="(data,index) in no3SelectData">
                    <span class="text_title l" v-bind:class = "{blue_text:childId[pidData] == data.id}">{{data.title}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { Popup } from 'mint-ui';
import { Toast } from 'mint-ui';
import { Indicator } from 'mint-ui';
import '../../assets/sass/product/popupSelect.sass';
var qs = require('qs');
export default {
    props:['upData'],
    data(){
        return{
            popupVisible:true,                // 弹层
            popupVisibleNo2:false,            // 第二级目录
            popupVisibleNo2Arrow:1,           // 用于判断二级目录箭头和内容的显示
            popupVisibleNo2Class:1,           // 用于判断二级目录箭头和内容的显示   类目
            popupVisibleNo3:false,            // 第三级目录
            siteData:'全部',                  // 地区名称数据存储
            siteId:0,                        // 地区ID数据存储      这个是要给后台发的参数~！！！
            classData:'全部',                 // 类目数据存储
            no1SelectData:[],                 // 存放第一级目录返回数据
            no2SelectData:[],                 // 存放第二级目录返回数据
            no3SelectData:[],                 // 存放第三级目录返回数据
            no3TitleData:'',                  // 存放第三层数据title
            goodsType:0,                      // 3 尾货 1或者2 现货  默认0    这个是要给后台发的参数~！！！
            childId:[],                       // 子分类id 数组    这个是要给后台发的参数~！！！
            classId:'',                        // 类目id      这个是要给后台发的参数~！！！
            keyId:'',                         // 用于传给列表并重新渲染数据使用
            searchData:'',                    // 搜索双向数据绑定
            pidData:0,                        // pid数据
            pidDataObj:{},                    // 用于渲染第一层筛选用
            pidPushId:[],                     // 用于渲染第一层筛选用 --- 数据要循环创建对象用的
            pidPushTitle:[],                  // 用于渲染第一层筛选用 --- 数据要循环创建对象用的
            StatusData:0,

            textData:'',                      // 文字搜索
            cat_id_list:'',                   // 分类ID  ： 10_12_13这种格式
        }
    },
    beforeCreate(){

    },
    beforeMount(){
        let vm = this;
        vm.textData = vm.$route.query.text;
        vm.siteId = vm.upData.provinceData;
        vm.goodsType = vm.upData.goodsType;
        vm.classId = vm.upData.navData;
        vm.pidDataObj = vm.upData.pidDataObj;
        vm.cat_id_list = vm.upData.cat_id_list;
        if(vm.siteId != 0){
            vm.siteDataFun();
            vm.getGoodsNumber(vm.textData)
        }
        if(vm.classId != ''){
            vm.classDataFun();
            vm.getGoodsClass();
            vm.getGoodsNumber(vm.textData)
        }
    },
    methods:{
        // 接收一个参数id，根据ID 搜索 当前类目下的数据
        getGoodsClass(){
            let vm = this;
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.get('wap/goods/nav?id=' + vm.classId + "&goods_type=" + vm.goodsType ,vm.$token).then((req)=>{
                console.log(req,"req,req")
                let code = req.data.data.code;
                Indicator.close();
                if(code == 200){
                    vm.no1SelectData = req.data.data.list;
                    vm.upData.goodsNumer = req.data.data.count;
                    vm.getGoodsNumber(vm.textData);
                }
            })
        },
        // 获取商品数量
        getGoodsNumber(text){
            let vm = this;
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.get(`search/keywords?keywords=${text}&size=20&province=${vm.siteId}&cat_id_list=${vm.cat_id_list}&nav=${vm.classId}&goods_type=${vm.goodsType}`,vm.$token).then((req)=>{
                Indicator.close();
                console.log('111111111111111111111111111111')
                let code = req.data.error_code;
                let msg = req.data.data;
                if(code == 200){
                    vm.upData.goodsNumer = req.data.data.total;
                    vm.popupVisibleNo2 = false;
                    vm.StatusData = 1;
                }else{
                    Toast({
                        message:msg,
                        duration:3000
                    })
                }
            })
        },
        // 获取地区数据并渲染列表
        siteDataFun(){
            let vm = this;
            vm.popupVisibleNo2 = true;
            vm.popupVisibleNo2Arrow = 0; 
            vm.popupVisibleNo2Class = 0; 
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.get('wap/area/list',vm.$token).then((req)=>{
                Indicator.close();
                vm.no2SelectData = req.data.data;
                vm.searchData = '';
                if(vm.siteId != 0){
                    for(let site in vm.no2SelectData){
                        let site_id = vm.no2SelectData[site].id;
                        if(site_id == vm.siteId){
                            vm.siteData = vm.no2SelectData[site].name;
                        }
                    }
                }
            })
        },
        // 获取类目数据并渲染列表
        classDataFun(){
            let vm = this;
            vm.pidPushId = [];
            vm.no2SelectData = [];
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.get('wap/goods/nav',vm.$token).then((req)=>{
                Indicator.close();
                vm.popupVisibleNo2Arrow = 1;
                vm.popupVisibleNo2Class = 1; 
                vm.no2SelectData = req.data.data;
                if(vm.StatusData != 0){

                }else{
                    for(let type in vm.no2SelectData){
                        let navId = vm.no2SelectData[type].id;
                        if(vm.classId == navId){
                            vm.classData = vm.no2SelectData[type].title;
                            console.log(vm.classData,'classData')
                            vm.popupVisibleNo2 = false;
                            vm.goodsType = vm.GtypeId;
                            vm.getGoodsClass();
                            vm.getGoodsNumber(vm.textData);
                            return
                        }
                    }
                }
            })
            vm.popupVisibleNo2 = true;
        },
        // 获取分类的方法 跳第三层
        classInfoFun(pid,name){
            let vm = this;
            vm.pidData = pid;
            vm.no3SelectData = [];
            let data = {
                nav_id:vm.classId,
                pid:vm.pidData,
                cat_id:vm.childId,
                goods_type:vm.goodsType,
                kw:vm.searchData
            }
            vm.pidPushId.push(pid);
            vm.no3TitleData = name;
            vm.popupVisibleNo3 = true;
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.post('wap/goods/cate',qs.stringify(data),vm.$token).then((req)=>{
                let code = req.data.data.code;
                let text = req.data.data.msg;
                if(code == 200){
                    vm.no3SelectData = req.data.data.list;
                }else{
                    vm.no3SelectData = [];
                    this.$toast({
                        position:'middle',
                        message:text,
                        duration: 3000
                    });
                }
                Indicator.close();
            })
        },
        // 第二层列表点击事件
        no3SelectFun(name,id,goods_type){
            let vm = this;
            if(vm.popupVisibleNo2Arrow == 0 && vm.popupVisibleNo2Class == 0){
                vm.siteData = name;
                vm.siteId = id;
                vm.goodsType = goods_type;
                vm.popupVisibleNo2 = false;
                vm.popupVisibleNo2Class = 1;
                vm.getGoodsNumber(vm.textData);
            }else{
                vm.childId = [];
                vm.pidDataObj = {};
                vm.searchData = '';
                vm.pidPushId = [];
                vm.no2SelectData = [];
                vm.cat_id_list = '';
                vm.pidPushTitle = [];
                vm.no1SelectData = [];
                vm.classData = name;
                vm.classId = id;
                vm.goodsType = goods_type;
                vm.popupVisibleNo2Arrow = 1;
                vm.popupVisibleNo2Class = 1;
                vm.popupVisibleNo2 = false;
                vm.getGoodsClass(vm.textData);
            }
        },
        // 搜索keyup的方法
        searchFun(){
            let vm = this;
            console.log(vm.searchData);
            let data = {
                nav_id:vm.classId,
                pid:vm.pidData,
                cat_id:vm.childId,
                goods_type:vm.goodsType,
                kw:vm.searchData
            }
            vm.popupVisibleNo3 = true;
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.post('wap/goods/cate',qs.stringify(data),vm.$token).then((req)=>{
                let code = req.data.data.code;
                let text = req.data.data.msg;
                if(code == 200){
                    vm.no3SelectData = req.data.data.list;
                }else{
                    vm.no3SelectData = [];
                    Toast({
                        message:text,
                        duration:3000
                    })
                }
                Indicator.close();
            })
        },
        // 最后一级筛选后把id push 到childId里 
        selectPushClass(id,title){
            let vm = this;
            vm.searchData = '';
            vm.childId[vm.pidData] = id;
            vm.pidPushTitle.push(title);
            for(let i = 0; i<vm.pidPushId.length; i++){
                let push_id = vm.pidPushId[i];
                let push_title = vm.pidPushTitle[i];
                vm.pidDataObj[push_id] = push_title;
                vm.popupVisibleNo3 = false;
            }
            vm.cat_id_list = vm.childId.join('_');
            vm.getGoodsNumber(vm.textData);
        },
        // 第二级返回按钮
        goBack(){
            let vm = this;
            vm.popupVisibleNo2 = false;
            vm.popupVisibleNo2Arrow = 1;
        },
        // 第三季返回按钮
        goBackNo3(name){
            let vm = this;
            vm.searchData = '';
            vm.popupVisibleNo3 = false; 
            for(let pidIndex in vm.pidPushId){
                let pidData = vm.pidPushId[pidIndex]
                if(pidData == vm.pidData){
                    vm.pidPushId.splice(pidIndex,1);
                }
            }
           
        },
        // 清空筛选
        clearPopup(){
            console.log('清空筛选');
            let vm = this;
            vm.siteData = '全部';
            vm.siteId = 0;
            vm.classData = '全部';
            vm.no1SelectData = [];
            vm.no2SelectData = [];
            vm.no3SelectData = [];
            vm.no3TitleData = '';
            vm.goodsType = 0;
            vm.childId = [];
            vm.classId = 0;
            vm.searchData = '';
            vm.keyId = '';
            vm.pidDataObj = {};
            vm.pidPushId = [];
            vm.pidPushTitle = [];
            vm.cat_id_list = '';
            vm.getGoodsNumber(vm.textData);
        },
        // 确定筛选
        confirmPopup(){
            console.log('确定筛选');
            let vm = this;
            let childData = {
                layer: false,
                nav: vm.classId,
                province: vm.siteId,
                cat_id_list: vm.cat_id_list,
                goods_type: vm.goodsType,
                classChildId: vm.childId,
                pidDataObj: vm.pidDataObj
            }
            vm.$emit("PopupLayer",childData);
        },
        clearBtn(){
            let vm = this;
            console.log('clear');
            vm.searchData = '';
            let childData = {
                layer: false,
                nav: vm.classId,
                province: vm.siteId,
                cat_id_list: vm.cat_id_list,
                goods_type: vm.goodsType,
                classChildId: vm.childId,
                pidDataObj: vm.pidDataObj
            }
            vm.$emit("PopupLayer",childData);
        }
    },
    components:{
        Popup,
    }
}
</script>