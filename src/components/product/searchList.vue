/*
 * @Author: juchao
 * @Date: 2018-03-20 09:24:01
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-22 14:15:39
 * 图、文搜索结果页
 */
<template>
    <div class="purchase_list_a" v-bind:class="{disable_scroll:scrollStatus === true}">
        <SearchHeader v-bind:statusText="textData"></SearchHeader>
        <div class="search_img_box" v-if="searchStatus">
            <dl class="search_info_box">
                <dt class="search_img l">
                    <img :src="searchImg" class="img_box">
                </dt>
                <dl class="search_text_box l">
                    <p class="hint_text">结果不满意？重新上传图片试试~~~</p>
                    <span class="updata_btn" @click="upImg">重新上传</span>
                </dl>
            </dl>
        </div>
        <div class="purchase_list_tab" v-if="searchImg == '' ">
            <ul class="list_tab_box">
                <li class="list_tab_text l" @click="tabsSelectBtn(0)" v-bind:class="{tab_select_font:0==tabStatus}">
                    <span class="tab_text l">销量</span>
                    <i class="iconfont tab_icon l" v-if=" sortData.sales == 3 || sortData.sales == 0 ">&#xe733;</i>
                    <i class="iconfont tab_icon l" v-if=" sortData.sales == 1">&#xe730;</i>
                </li>
                <li class="list_tab_text l" @click="tabsSelectBtn(1)" v-bind:class="{tab_select_font:1==tabStatus}">
                    <span class="tab_text l">新品</span>
                    <i class="iconfont tab_icon l" v-if="sortData.goods_id == 3 || sortData.goods_id == 0 ">&#xe733;</i>
                    <i class="iconfont tab_icon l" v-if=" 1 == tabStatus && sortData.goods_id == 1">&#xe730;</i>
                </li>
                <li class="list_tab_text l" @click="tabsSelectBtn(2)" v-bind:class="{tab_select_font:2==tabStatus}">
                    <span class="tab_text l">价格</span>
                    <i class="iconfont tab_icon l" v-if="sortData.sell_price == 3 || sortData.sell_price == 0 ">&#xe733;</i>
                    <i class="iconfont tab_icon l" v-if="sortData.sell_price == 1">&#xe730;</i>
                </li>
                <li class="list_tab_icon r">
                    <i class="iconfont tab_icon l" @click="filterBtn">&#xe647;</i>
                </li>
                <!-- <li class="list_tab_icon r">
                    <i class="iconfont tab_icon l" v-if="styleStatus == 0" @click="styleStatus = 1">&#xe69e;</i>
                    <i class="iconfont tab_icon_list l" v-if="styleStatus == 1" @click="styleStatus = 0">&#xe639;</i>
                </li> -->
            </ul>
        </div>
        <mt-loadmore :top-method="loadTop" v-show="listData != '' " :auto-fill="autoFill"  :bottom-all-loaded="allLoaded" ref="loadmore">
            <div class="loadconent" v-infinite-scroll="loadMore" infinite-scroll-immediate-check="true" infinite-scroll-disabled="loading" infinite-scroll-distance="5">
                <div class="purchase_list_content">
                    <div class="list_content_box_a" @click="goDetail(goodsData.goods_id)" v-for="(goodsData,index) in listData" v-bind:class="{list_content_box_b:0==styleStatus}">
                        <dl class="list_content_info_a" v-bind:class="{list_content_info_b:0==styleStatus}">
                            <dt class="list_img_box">
                                <img class="list_img" :src="goodsData.goods_img_url">
                                <!-- <span class="activity_box" v-if="goodsData.is_discount == 1">限时折扣</span> -->
                            </dt>
                            <dd class="list_text_box">
                                <h5 class="text_title">{{goodsData.goods_name}}</h5>
                                <p class="text_gps">
                                    <i class="iconfont">&#xe616;</i>
                                    <span class="gps_site">{{goodsData.region}}</span>
                                </p>
                                <p class="text_price">
                                    <span class="text_red_price">￥{{goodsData.price}}</span>
                                    <span class="text_price_unit">/{{goodsData.unit}}<span v-if="goodsData.is_discount == 1"> 起</span></span>
                                </p>
                                <span class="company_name">{{goodsData.shop_name}}</span>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </mt-loadmore>
        <PopupSelect v-if="openData.popupData" v-bind:upData="openData" v-on:PopupLayer="PopupLayerFun"></PopupSelect>
        <NullView v-if=" listData == '' "></NullView>
    </div>
</template>
<script>
import PopupSelect from '../common/searchPopupSelect';
import SearchHeader from '../common/searchHead';
import NullView from '../common/nullView.vue';
import { Indicator, Loadmore , InfiniteScroll , Toast} from 'mint-ui';
import '../../assets/sass/product/productlist.sass'
var qs = require('qs');
export default {
    data(){
        return{
            tabStatus:4,                    // tab切换控制样式 0是销量 1是新品 2是价格
            styleStatus:0,                  // 用于控制样式，是大图还是小图 1是小图 0是大图
            openData:{                      // 给子组件传值
                popupData: false,
                goodsNumer:'0',
                goodsType:0,                // goodsType
                navData:'',                 // *分类id
                provinceData:0,             // *省份id
                classChildId:[],            // +子分类id
                pidDataObj:{},              // +存放pid + title
                cat_id_list:'',             // *已选择的分类  12_13_14
            },
            listData:[],                   // 列表数据
            pageData:1,                     // 页码
            allLoaded:true,
            autoFill:false,
            sortData:{                      // 排序     0是倒序，1是正序
                'sales':0,
                'goods_id':3,
                'sell_price':3,
            },
            textData:'',                    // 给头部组件传参
            searchStatus:0,                 // 0代表文字搜索，1代表图片搜索
            orderValue:'',                  // *排序的字段  price new sale
            sortText:'desc',                // *排序类型 desc or asc
            valueData:'',                   // *文字搜索的文字

            nullData:1,                     // 当翻页没有数据时为0，有数据是1
            loading:true,
            scrollStatus:false,              // 固定页面
            // 图片搜索结果
            searchImg:'',                   // 原图
            imgData:'',                     // 图片搜索

        }
    },
    beforeCreate(){

    },
    beforeRouteLeave (to, from, next) {
        let vm = this;
        let toPath = to.path;
        if(toPath.indexOf('/productdetail') == 0 || toPath.indexOf('/index/wordsearch') == 0){
            next();
        }else{
            vm.$store.state.searchListStatus = false;       // 如果Status为true 就取这里的数据，反之不取    
            vm.$store.state.searchListopenData = {          // 给子组件传值
                popupData: false,
                goodsNumer:'0',
                goodsType:0,
                navData:'',
                provinceData:0,
                classChildId:[],
                pidDataObj:{},
                cat_id_list:''
            };
            vm.$store.state.orderValue = 'sale';
            vm.$store.state.sortText = 'desc';
            vm.$store.state.searchTabStatus = 0;
            vm.$store.state.searchSortData = {
                'sales': 0,
                'goods_id': 3,
                'price': 3
            };
            next();
        }
        
    },
    beforeMount(){
        let vm = this;
        let valueData = vm.$route.query.value;
        let textData = vm.$route.query.text;
        vm.sortData = vm.$store.state.searchSortData;
        vm.sortText = vm.$store.state.sortText;
        vm.orderValue = vm.$store.state.orderValue;
        vm.tabStatus = vm.$store.state.searchTabStatus;
        // 先判断vuex中是否有保存的状态
        if(vm.$store.state.searchListStatus){
            vm.openData = vm.$store.state.searchListopenData;
        }
        if(valueData == "word"){
            vm.searchStatus = 0;
            vm.textData = textData;
            vm.textreqData(textData);
        }else{
            vm.searchStatus = 1;
            vm.imgData = textData;
            vm.imgtreqData(textData);
        }
    },
    methods:{
        // text req data
        textreqData(text){
            let vm = this;
            vm.listData = [];
            vm.valueData = text;
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.get(`search/keywords?keywords=${text}&size=20&nav=${vm.openData.navData}&province=${vm.openData.provinceData}&cat_id_list=${vm.openData.cat_id_list}&order=${vm.orderValue}&sort=${vm.sortText}`,vm.$token).then((req)=>{
                Indicator.close();
                console.log(req,"文字搜索请求");
                let code = req.data.error_code;
                let msg = req.data.data;
                if(code == 200){
                    vm.listData = req.data.data.goods_list;
                    this.$refs.loadmore.onTopLoaded();
                    vm.openData.goodsNumer = req.data.data.total;
                    if(vm.listData.length == 0 || vm.listData.length < 20 ){
                        console.log('false');
                        vm.loading = true;
                    }else{
                        console.log('true')
                        vm.loading = false;
                    }
                }else{
                    Toast({
                        message:msg,
                        duration:3000
                    })
                }
            })
        },
        imgtreqData(img){
            let vm = this;
            vm.listData = [];
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.get(`search/image?search_key=${img}`,vm.$token).then((req)=>{
                Indicator.close();
                console.log(req,"图片搜索请求");
                let code = req.data.error_code;
                let msg = req.data.data;
                if(code == 200){
                    this.$refs.loadmore.onTopLoaded();
                    vm.searchImg = req.data.data.search_file;
                    vm.listData = req.data.data.goods_list;
                    vm.openData.goodsNumer = req.data.data.total;
                }else{
                    Toast({
                        message:msg,
                        duration:3000
                    })
                }
            })
        },
        // 重新上传图片事件
        upImg(){
            this.$router.push({path:"imgsearch"})
        },
        // tabs切换  销量 新品 价格
        tabsSelectBtn(index){
            console.log(index);
            let vm = this;
            vm.nullData = 1;
            if(vm.searchStatus == 0){
                vm.pageData = 1;
                vm.tabStatus = index;
                vm.$store.state.searchTabStatus = vm.tabStatus;
                if(index == 0 && vm.sortData.sales != 0 ){
                    vm.sortData.sales = 0;
                    vm.sortData.goods_id = 3;
                    vm.sortData.sell_price = 3;
                    vm.orderValue = 'sale';
                    vm.sortText = 'desc';
                    vm.$store.state.searchSortData = vm.sortData;
                    vm.$store.state.sortText = vm.sortText;
                    vm.$store.state.orderValue = vm.orderValue;
                    vm.textreqData(vm.textData);
                }else if(index == 0 && vm.sortData.sales == 0){
                    vm.sortData.sales = 1;
                    vm.sortData.goods_id = 3;
                    vm.sortData.sell_price = 3;
                    vm.orderValue = 'sale';
                    vm.sortText = 'asc';
                    vm.$store.state.searchSortData = vm.sortData;
                    vm.$store.state.sortText = vm.sortText;
                    vm.$store.state.orderValue = vm.orderValue;
                    vm.textreqData(vm.textData);
                }else if(index == 1 && vm.sortData.goods_id != 0){
                    vm.sortData.goods_id = 0;
                    vm.sortData.sales = 3;
                    vm.sortData.sell_price = 3;
                    vm.orderValue = 'new';
                    vm.sortText = 'desc';
                    vm.$store.state.searchSortData = vm.sortData;
                    vm.$store.state.sortText = vm.sortText;
                    vm.$store.state.orderValue = vm.orderValue;
                    vm.textreqData(vm.textData);
                }else if(index == 1 && vm.sortData.goods_id == 0){
                    vm.sortData.goods_id = 1;
                    vm.sortData.sales = 3;
                    vm.sortData.sell_price = 3;
                    vm.orderValue = 'new';
                    vm.sortText = 'asc';
                    vm.$store.state.searchSortData = vm.sortData;
                    vm.$store.state.sortText = vm.sortText;
                    vm.$store.state.orderValue = vm.orderValue;
                    vm.textreqData(vm.textData);
                }else if(index == 2 && vm.sortData.sell_price != 0){
                    vm.sortData.sell_price = 0;
                    vm.sortData.sales = 3;
                    vm.sortData.goods_id = 3;
                    vm.orderValue = 'sell_price';
                    vm.sortText = 'desc';
                    vm.$store.state.searchSortData = vm.sortData;
                    vm.$store.state.sortText = vm.sortText;
                    vm.$store.state.orderValue = vm.orderValue;
                    vm.textreqData(vm.textData);
                }else if(index == 2 && vm.sortData.sell_price == 0){
                    vm.sortData.sell_price = 1;
                    vm.sortData.sales = 3;
                    vm.sortData.goods_id = 3;
                    vm.orderValue = 'sell_price';
                    vm.sortText = 'asc';
                    vm.$store.state.searchSortData = vm.sortData;
                    vm.$store.state.sortText = vm.sortText;
                    vm.$store.state.orderValue = vm.orderValue;
                    vm.textreqData(vm.textData);
                }
            }else{
                Toast({
                    message:'图片搜索暂不支持排序',
                    duration: 3000
                })
            }

        },
        // 筛选事件
        filterBtn(){
            console.log('筛选事件');
            if(this.searchStatus != 1){
                this.openData.popupData = true;
                this.scrollStatus = true;
            }
        },
        // 监听子组件传参事件
        PopupLayerFun(data){
            let vm = this;
            vm.openData.popupData = data.layer;
            vm.scrollStatus = data.layer;
            vm.openData.navData = data.nav;
            vm.openData.goodsType = data.goodsType;
            vm.openData.provinceData = data.province;
            vm.openData.cat_id_list = data.cat_id_list;
            vm.openData.classChildId = data.classChildId;
            vm.openData.pidDataObj = data.pidDataObj;
            vm.$store.state.searchListopenData = vm.openData;
            vm.$store.state.searchListStatus = true;
            vm.pageData = 1;
            vm.textreqData(vm.textData);
        },
        // 下拉刷新  清空数据，并重新渲染DOM
        loadTop(){
            console.log('1111')
            let vm = this;
            vm.pageData = 1;
            vm.nullData = 1;
            if(vm.searchImg == ''){
                vm.loading = false;
                return
                vm.textreqData(vm.textData);
            }else{
                vm.loading = true;
                vm.imgtreqData(vm.imgData);
            }

        },
        // 上拉加载更多
        loadMore(){
            console.log('++++++')
            let vm = this;
            vm.pageData++;
            if(vm.searchImg != ''){
                console.log('bukong')
                vm.loading = true;
                return
            }else{
                if(!vm.nullData){
                    Toast({
                        message:'大佬，没有更多内容了~',
                        duration: 3000
                    })
                    return false
                }
                // if(vm.searchImg == ''){
                //     return false
                // }
                console.log('axios')
                Indicator.open({
                    spinnerType:'fading-circle'
                });
                vm.$http.get(`search/keywords?keywords=${vm.valueData}&size=20&nav=${vm.openData.navData}&province=${vm.openData.provinceData}&cat_id_list=${vm.openData.cat_id_list}&order=${vm.orderValue}&sort=${vm.sortText}&page=${vm.pageData}`,vm.$token).then((req)=>{
                    Indicator.close();
                    let code = req.data.error_code;
                    let msg = req.data.data;
                    let goods_list = req.data.data.goods_list;
                    if(code == 200){
                        this.$refs.loadmore.onTopLoaded();
                        vm.listData = [...vm.listData,...req.data.data.goods_list];
                        vm.openData.goodsNumer = req.data.data.total;
                        if(goods_list.length == 0 || goods_list.length < 20){
                            vm.nullData = 0;
                            vm.loading = true;
                        }
                    }else{
                        Toast({
                            message:msg,
                            duration:3000
                        })
                    }
                })
            }   
        },
        // go 详情按钮
        goDetail(id){
            this.$router.push('/productdetail/' + id);
        }
    },
    components:{
        PopupSelect,
        Loadmore,
        InfiniteScroll,
        SearchHeader,
        NullView
    }
}
</script>
