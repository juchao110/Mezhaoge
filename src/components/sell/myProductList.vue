/*
 * @Author: YorkeD
 * @Date: 2018-04-02 13:53:05
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-07 17:34:51
 * 产品管理列表
 */
<template>
    <div class="content" v-bind:class="{disable_scroll:scrollStatus === true}">
        <PhoneHead :title="pageTitle" @showLayer="getShowStatus"></PhoneHead>
        <div class="my_product_list">
            <div class="product_list_tab_box">
                <ul class="tab_box_content">
                    <li class="tab_text l" @click="tabsSelectFun(index)" v-for="(tabtext,index) in tabsData" v-bind:class="{tab_select_border: index == tabSelectData }">{{tabtext}}</li>
                </ul>
            </div>
            <div class="product_list_search">
                <div class="list_search_box">
                    <i class="iconfont search_icon l">&#xe60a;</i>
                    <span class="l">|</span>
                    <input type="search" class="search_input l" @keyup="searchBlurFun($event)" v-model="searchInput" placeholder="请输入产品名、产品编号、货号">
                    <i class="iconfont more_icon r" @click="searchMoreBtn">&#xe609;</i>
                </div>
            </div>
            <mt-loadmore :top-method="loadTop" :bottom-all-loaded="allLoaded" ref="loadmore">
                <div class="loadconent"v-infinite-scroll="loadMore" v-if=" listData != '' " infinite-scroll-immediate-check="true" infinite-scroll-disabled="loading" infinite-scroll-distance="5">
                    <div class="product_list_content">
                        <div class="product_list_box" v-for="(list,list_index) in listData">
                            <dl class="goods_info" @click="removeBtn">
                                <dt class="goods_img_box l">
                                    <img class="goods_img" :src="list.main_img">
                                </dt>
                                <dd class="goods_text_box l">
                                    <h5 class="goods_text_title">{{list.goods_name}}</h5>
                                    <p class="goods_text_info" v-if="list.code != '' && list.code != null ">货号：{{list.code}}</p>
                                    <p class="goods_text_price">
                                        <span class="goods_price_red l" v-if="list.max_cost_price == list.min_cost_price">￥{{list.max_sell_price}}</span>
                                        <span class="goods_price_red l" v-if="list.max_cost_price != list.min_cost_price">￥{{list.min_cost_price}}</span>
                                        <span class="goods_unit_text l">/{{list.unit}}<span v-if="list.max_cost_price != list.min_cost_price"> 起</span></span>
                                    </p>
                                </dd>
                            </dl>
                            <div class="all_btn_box">
                                <span class="more_btn r" v-if="tabSelectType != 0" @click="moerBtn(list_index)">
                                    <i class="iconfont">&#xe60b;</i>
                                    <div class="more_box" v-if="moerIndex == list_index">
                                        <ul class="more_info_box">
                                            <li class="more_info_text" v-if="!wechet" @click="shareBtn">
                                                <i class="iconfont no1_icon">&#xe624;</i>
                                                <span class="text_name">分享</span>
                                            </li>
                                            <li class="more_info_text" @click="qrCodeBtn(list.wechat_url)">
                                                <i class="iconfont no2_icon">&#xe6c8;</i>
                                                <span class="text_name">二维码</span>
                                            </li>
                                            <li class="more_info_text">
                                                <i class="iconfont no3_icon">&#xe61c;</i>
                                                <input class="copy_btn" type="button" :data-clipboard-text="list.wechat_url" @click="copyLink()" value="链接" />
                                            </li>
                                        </ul>
                                    </div>
                                </span>
                                <router-link tag="span" :to="`/productdetail/${list.goods_id}?preview=1`" class="other_btn r">预览</router-link>
                                <span class="other_btn r" v-if="tabSelectType == 0" @click="delGoods(list.goods_id)">删除</span>
                                <span class="other_btn r" v-if="tabSelectType == 1 || tabSelectType == 2" @click="downGoods(list.status,list.goods_id,2,list.status)">下架</span>
                                <span class="other_btn r" v-if="tabSelectType == 0" @click="downGoods(list.status,list.goods_id,1,list.status)">上架</span>
                                <span class="other_btn r" v-if="list.can_recommend == 1 || list.can_recommend == 1" @click="setRecommend(list.is_recommend,list.goods_id,3,list.status)">设为推荐</span>
                                <span class="other_btn r" v-if="list.can_recommend == 11 || list.can_recommend == 12" @click="setRecommend(list.is_recommend,list.goods_id,4,list.status)">取消推荐</span>
                                <span class="revise_btn r" @click="editBtn(list.goods_id,list.nav_id,list.goods_type,list.status)">修改</span>
                            </div>
                        </div>
                    </div>
                </div>
            </mt-loadmore>
            <NullView v-if=" listData == '' "></NullView>
            <div class="add_goods_btn" @click="goPublish">
                <i class="iconfont add_icon">&#xe726;</i>
                发布产品
            </div>
        </div>
        <PhoneBox :show="isShow" :service="serviceData" @cancelShow="cancelLayer"></PhoneBox>
        <SearchMore v-if="openData.popupData" v-bind:upData="openData" v-on:PopupLayer="PopupLayerFun"></SearchMore>
        <QRcode v-if="urlAllData.urlStatus" v-bind:urlData="urlAllData" v-on:UrlLayer="UrlLayerFun"></QRcode>
        <ShareLayer v-if="shareLayerStatus" :isShow='shareLayerStatus' @getShareStatus="hideShare"></ShareLayer>
    </div>
</template>

<script>
import PhoneHead from '../common/phoneHead.vue';
import PhoneBox from '../common/phoneBox.vue';
import SearchMore from './productListSerch.vue';
import QRcode from '../common/qrCode.vue';
import ShareLayer from '../common/shareLayer.vue';
import NullView from '../common/nullView.vue'
import Clipboard from 'clipboard';
import { MessageBox , Indicator , Loadmore , InfiniteScroll ,Toast } from 'mint-ui';
var qs = require("qs");
import '../../assets/sass/sell/myProductList.sass';
export default {
    data(){
        return{
            tabsData:["出售","仓库","推荐"],     // tab标签
            pageTitle:'产品管理',               // 公共头部传参名称
            tabSelectData:0,                   // tab样式
            tabSelectType:1,                   // 用于判断出售、仓库、推荐 1是出售，0是仓库，2是推荐
            isShow: false,                     // 是否显示弹框
            allLoaded:true,                    // 加载
            serviceData: {
                name: '赵四',
                phone: '15021212121'
            },
            listData:[],                        // 列表数据

            pageData:1,                         // 页数

            goodsLength:1,                      // 是否还有更多数据

            moerIndex:-1,                       // ...弹层控制显示隐藏变量

            openData:{                          // 给筛选子组件传值
                popupData: false,
                selectData:[]
            },

            urlAllData:{                        // url数据   urlStatus 控制弹层显示和隐藏,  urlSite url地址
                urlSite:'',
                urlStatus:0,
            },

            SelectChild:{                       // 接收子组件传值
                goods_type:0,
                nav_type:0,
                shop_cate_id:''
            },

            searchInput:'',                     // 搜索内容

            wechet:'',                          // 根据当前环境改变值，并控制分享按钮的隐藏和显示

            shareLayerStatus:false,                 // 控制分享弹层的隐藏和显示

            scrollStatus:false,                 // 控制滚动

        }
    },
    beforeCreate(){

    },
    beforeMount () {
        let vm = this;
        vm.reqData(1,1,vm.searchInput);
        vm.wechet = vm.$weixin;
        window.scroll(0,0);
        vm.$http.get('match/offer/match_dealer',vm.$token).then((req)=>{
            vm.serviceData.name = req.data.data.obj.name;
            vm.serviceData.phone = req.data.data.obj.mobile;
        })
    },
    methods:{
        // 公共调用接口方法
        reqData(status,page,search){
            let vm = this;
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.tabSelectType = status;
            vm.$http.get(`goods/onsale?page_limit=20&goods_status=${status}&page=${page}&keyword_name_sn_code=${search}&goods_type=${vm.SelectChild.goods_type}&nav_type=${vm.SelectChild.nav_type}&shop_cate_id=${vm.SelectChild.shop_cate_id}`,vm.$token).then((req)=>{
                console.log(req,"dddd")
                Indicator.close();
                vm.$refs.loadmore.onTopLoaded();
                let code = req.data.error_code;
                let msg = req.data.data;
                if(code == 200){
                    vm.listData = req.data.data.goods.data;
                    let goods_type = req.data.data.goods_type;
                    vm.openData.selectData.push(goods_type)
                    let nav_type = req.data.data.nav_type;
                    vm.openData.selectData.push(nav_type)
                    let shop_cate_list = req.data.data.shop_cate_list;
                    vm.openData.selectData.push(shop_cate_list)
                }else{
                    Toast({
                        message:msg,
                        duration:3000
                    })
                }
            })

        },
        // tab 选择事件
        tabsSelectFun(index){
            let vm = this;
            window.scroll(0,0)
            vm.SelectChild = {
                goods_type:0,
                nav_type:0,
                shop_cate_id:''
            };
            vm.pageData = 1;
            vm.goodsLength = 1;
            if(index == 0){
                vm.tabSelectType = 1;
                vm.tabSelectData = index;
            }else if(index == 1){
                vm.tabSelectType = 0;
                vm.tabSelectData = index;
            }else if(index == 2){
                vm.tabSelectType = index;
                vm.tabSelectData = index;
            }
            vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput);
        },
        // 修改按钮
        editBtn(goods_id,nav_id,goods_type,status){
            if(status == 4){
                Toast({
                    message: '产品已锁定',
                    duration: 3000
                })
                return false
            }else{
                this.$router.push({path:'releaseproduct',query:{goods_id:goods_id,id:nav_id,goods_type:goods_type}});
            }

        },
        // 搜索监听回车事件
        searchBlurFun(ev){
            let vm = this;
            if(ev.keyCode == 13){
                vm.pageData = 1;
                vm.SelectChild = {
                    goods_type:0,
                    nav_type:0,
                    shop_cate_id:''
                };
                vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput)
                document.activeElement.blur();
            }
        },
        // 从子组件中获取显示弹框的状态
        getShowStatus (data) {
            this.isShow = data
        },
        // 隐藏弹框事件
        cancelLayer (data) {
            this.isShow = data
        },
        removeBtn(){
            this.moerIndex = -1;
        },
        // 分享
        shareBtn(){
            let vm = this;
            // vm.moerIndex = -1;
            vm.shareLayerStatus = true;
            vm.scrollStatus = true;
            vm.$set(vm.moerIndex,-1);
        },
        // 分享弹层 接收子组件
        hideShare(data){
            if(data == false){
                this.headerMoreStatus = 0;
                this.shareLayerStatus = data;
                this.scrollStatus = false;
                this.moerIndex = -1;
            }
        },
        // 二维码
        qrCodeBtn(url){
            let vm = this;
            let urlsite = url;
            vm.scrollStatus = true;
            vm.urlAllData.urlStatus = 1;
            vm.urlAllData.urlSite = urlsite;
            vm.$set(vm.moerIndex,-1);
        },
        // 链接
        copyLink(){
            let vm = this;
            const clipboard = new Clipboard('.copy_btn')
            clipboard.on('success', e => {
                Toast({
                    message: '复制链接成功',
                    duration: 3000
                })
                vm.moerIndex = -1;
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                Toast({
                    message: '浏览器不支持自动复制功能',
                    duration: 3000
                })
                vm.moerIndex = -1;
                // 释放内存
                clipboard.destroy()
            })
        },
        // 更多
        moerBtn(index){
            let vm = this;
            console.log(index);
            if(vm.moerIndex == index){
                vm.moerIndex = -1;
            }else{
                vm.moerIndex = index;
            }

        },
        // 上、下架商品   presentStatus: 0是没有上架，1是已经上架  editStatus: 1是上架，2是下架
        downGoods(presentStatus,id,editStatus,status){
            console.log(presentStatus,"presentStatus")
            let vm = this;
            let data = {
                operate:editStatus,
                goods_id:id
            }
            vm.moerIndex = -1;
            vm.pageData = 1;
            if(status == 4){
                Toast({
                    message: '产品已锁定',
                    duration: 3000
                })
                return false
            }
            if(editStatus == 1){
                MessageBox.confirm('是否要上架商品?',"").then(action => {
                    Indicator.open({
                        spinnerType:'fading-circle'
                    });
                    vm.$http.post("goods/onsale_request",qs.stringify(data),vm.$token).then((req)=>{
                        Indicator.close();
                        console.log(req,"xia")
                        let code = req.data.error_code;
                        let msg  = req.data.data;
                        if(code == 200){
                            Toast({
                                message:msg,
                                duration:3000
                            })
                            vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput);
                        }else{
                            Toast({
                                message:msg,
                                duration:3000
                            })
                        }
                    })
                }).catch(err => {
                    console.log("点击取消")
                });
            }else{
                MessageBox.confirm('是否要下架商品?',"").then(action => {
                    Indicator.open({
                        spinnerType:'fading-circle'
                    });
                    vm.$http.post("goods/onsale_request",qs.stringify(data),vm.$token).then((req)=>{
                        Indicator.close();
                        console.log(req,"xia")
                        let code = req.data.error_code;
                        let msg  = req.data.data;
                        if(code == 200){
                            Toast({
                                message:msg,
                                duration:3000
                            })
                            vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput);
                        }else{
                            Toast({
                                message:msg,
                                duration:3000
                            })
                        }
                    })
                }).catch(err => {
                    console.log("点击取消")
                });
            }
        },
        // 设置推荐   presentStatus: 0是没有推荐，1是已经被推荐  editStatus: 3是推荐，4是取消推荐
        setRecommend(presentStatus,id,editStatus,status){
            let vm = this;
            let data = {
                operate:editStatus,
                goods_id:id
            }
            vm.pageData = 1;
            vm.moerIndex = -1;
            if(status == 4){
                Toast({
                    message: '产品已锁定',
                    duration: 3000
                })
                return false
            }
            if(presentStatus == 0){
                MessageBox.confirm('是否要将此商品设为推荐?',"").then(action => {
                    Indicator.open({
                        spinnerType:'fading-circle'
                    });
                    vm.$http.post("goods/onsale_request",qs.stringify(data),vm.$token).then((req)=>{
                        Indicator.close();
                        let code = req.data.error_code;
                        let msg  = req.data.data;
                        if(code == 200){
                            Toast({
                                message:msg,
                                duration:3000
                            })
                            vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput);
                        }else{
                            Toast({
                                message:msg,
                                duration:3000
                            })
                        }
                    })
                }).catch(err => {
                    console.log("点击取消");
                });
            }else{
                MessageBox.confirm('是否要将此商品取消推荐?',"").then(action => {
                    Indicator.open({
                        spinnerType:'fading-circle'
                    });
                    vm.$http.post("goods/onsale_request",qs.stringify(data),vm.$token).then((req)=>{
                        Indicator.close();
                        let code = req.data.error_code;
                        let msg  = req.data.data;
                        if(code == 200){
                            Toast({
                                message:msg,
                                duration:3000
                            })
                            vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput);
                        }else{
                            Toast({
                                message:msg,
                                duration:3000
                            })
                        }
                    })
                }).catch(err => {
                    console.log("点击取消");
                });
            }
        },
        // 删除商品操作
        delGoods(id){
            let vm = this;
            let data = {
                operate:5,
                goods_id:id
            }
            vm.moerIndex = -1;
            vm.pageData = 1;
            MessageBox.confirm('是否要将此商品删除?',"").then(action => {
                Indicator.open({
                    spinnerType:'fading-circle'
                });
                vm.$http.post("goods/onsale_request",qs.stringify(data),vm.$token).then((req)=>{
                    Indicator.close();
                    let code = req.data.error_code;
                    let msg  = req.data.data;
                    if(code == 200){
                        Toast({
                            message:msg,
                            duration:3000
                        })
                        vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput);
                    }else{
                        Toast({
                            message:msg,
                            duration:3000
                        })
                    }
                })
            }).catch(err => {
                console.log("点击取消");
            });
        },
        // 下拉刷新
        loadTop(){
            let vm = this;
            vm.pageData = 1;
            vm.goodsLength = 1;
            vm.moerIndex = -1;
            vm.SelectChild = {
                goods_type:0,
                nav_type:0,
                shop_cate_id:''
            };
            vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput);
        },
        // 上拉加载更多
        loadMore(){
            let vm = this;
            vm.moerIndex = -1;
            vm.pageData++;
            if(vm.goodsLength == 0){

            }else{
                Indicator.open({
                    spinnerType:'fading-circle'
                });
                vm.$http.get("goods/onsale?page_limit=20&goods_status="+ vm.tabSelectType +"&page=" + vm.pageData + "&keyword_name_sn_code=" + vm.searchInput,vm.$token).then((req)=>{
                    Indicator.close();
                    let goods = req.data.data.goods.data;
                    vm.goodsLength = goods.length;
                    if(goods.length <= 0){
                        Toast({
                            message:"大佬，已经到底了",
                            duration:3000
                        })
                        return
                    }else{
                        vm.listData = [...vm.listData,...req.data.data.goods.data];
                    }
                })
            }
        },
        // 发布商品
        goPublish(){
            let vm = this;
            vm.moerIndex = -1;
            vm.$router.push({path:'choosetype'});
        },
        // 筛选更多按钮
        searchMoreBtn(){
            console.log('筛选更多按钮');
            let vm = this;
            vm.openData.popupData = true;
            vm.moerIndex = -1;
        },
        // 筛选子组件
        PopupLayerFun(data){
            let vm = this;
            vm.openData.popupData = data.layer;
            let keys = data.key;
            if( keys != ''){
                if(JSON.stringify(keys) == '{}'){
                    console.log("空")
                }else{
                    vm.pageData = 1;

                    if(JSON.stringify(keys.goods_type) == '{}' || keys.goods_type == undefined){

                    }else if(keys.goods_type != undefined){
                        vm.SelectChild.goods_type = keys.goods_type;
                    }

                    if(JSON.stringify(keys.nav_type) == '{}' || keys.nav_type == undefined){

                    }else if(keys.nav_type != undefined){
                        vm.SelectChild.nav_type = keys.nav_type;
                    }

                    if(JSON.stringify(keys.shop_cate_id) == '{}' || keys.shop_cate_id == undefined){

                    }else if(keys.shop_cate_id != undefined){
                        vm.SelectChild.shop_cate_id = keys.shop_cate_id;
                    }

                    vm.reqData(vm.tabSelectType,vm.pageData,vm.searchInput);
                }
            }
        },
        // url Layer
        UrlLayerFun(data){
            if(data == 0){
                this.urlAllData.urlStatus = data;
                this.scrollStatus = false;
                this.moerIndex = -1;
            }
        },
    },
    components: {
        PhoneHead,
        PhoneBox,
        Loadmore,
        InfiniteScroll,
        SearchMore,
        QRcode,
        NullView,
        ShareLayer
    }
}
</script>
