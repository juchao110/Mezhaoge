/*
 * @Author: juchao
 * @Date: 2018-03-20 09:24:01
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-15 17:30:09
 * 列表一行一个
 */
<template>
    <div class="purchase_list_a" v-bind:class="{disable_scroll:scrollStatus === true}">
        <div class="purchase_list_tab">
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
                    <i class="iconfont tab_icon l" v-if="sortData.price == 3 || sortData.price == 0 ">&#xe733;</i>
                    <i class="iconfont tab_icon l" v-if="sortData.price == 1">&#xe730;</i>
                </li>
                <li class="list_tab_icon r">
                    <i class="iconfont tab_icon l" @click="filterBtn">&#xe647;</i>
                </li>
                <!-- <li class="list_tab_icon r">
                    <i class="iconfont tab_icon l" v-if="styleStatus == 0" @click="iconBtn">&#xe69e;</i>
                    <i class="iconfont tab_icon_list l" v-if="styleStatus == 1" @click="iconBtn">&#xe639;</i>
                </li> -->
            </ul>
        </div>
        <mt-loadmore :top-method="loadTop" v-if="listData != '' " :auto-fill="autoFill" :bottom-all-loaded="allLoaded" ref="loadmore">
            <div class="loadconent"v-infinite-scroll="loadMore" infinite-scroll-immediate-check="true" infinite-scroll-disabled="loading" infinite-scroll-distance="5">
                <div class="purchase_list_content">
                    <div class="list_content_box_a" @click="goDetail(goodsData.goods_id)" v-for="(goodsData,index) in listData" v-bind:class="{list_content_box_b:0==styleStatus}">
                        <dl class="list_content_info_a" v-bind:class="{list_content_info_b:0==styleStatus}">
                            <dt class="list_img_box">
                                <img class="list_img" :src="goodsData.goods_img">
                                <span class="activity_box" v-if="goodsData.is_discount == 1">限时折扣</span>
                            </dt>
                            <dd class="list_text_box">
                                <h5 class="text_title">{{goodsData.goods_name}}</h5>
                                <p class="text_gps">
                                    <i class="iconfont l">&#xe616;</i>
                                    <span class="gps_site l">{{goodsData.location}}</span>
                                </p>
                                <p class="text_price">
                                    <span class="text_red_price">￥{{goodsData.min_price}}</span>
                                    <span class="text_price_unit">/{{goodsData.unit}}<span v-if="goodsData.is_discount == 1"> 起</span></span>
                                </p>
                                <span class="company_name">{{goodsData.company}}</span>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </mt-loadmore>
        <NullView v-if="listData == '' "></NullView>
        <PopupSelect v-if="openData.popupData" v-bind:upData="openData" v-on:PopupLayer="PopupLayerFun"></PopupSelect>
    </div>
</template>
<script>
import PopupSelect from '../common/popupSelect'
import NullView from '../common/nullView.vue';
import { Indicator, Loadmore , InfiniteScroll , Toast} from 'mint-ui';
import '../../assets/sass/product/productlist.sass'
var qs = require('qs');
export default {
    data(){
        return{
            tabStatus:0,        // tab切换控制样式 0是销量 1是新品 2是价格
            styleStatus:0,      // 用于控制样式，是大图还是小图 0是大图 1是小图
            openData:{          // 给子组件传值
                popupData: false,
                goodsNumber:'0',
                goodsTypeId:'',
                navId:'',
                selectData:{},  // 存放用户选择的内容，当用户再次点击筛选传值过去
                classId:'',     // 存放用户选择的类目ID，当用户再次点击筛选传值过去
                childId:[],     // 存放用户选择的分类的子id，当用户在次点击筛选传值过去
                siteId:'',      // 存放用户选择的地区ID，当用户再次点击筛选传值过去
                goodsType:'',   // 存放用户选择的goodsType，当用户再次点击筛选传值过去
            },
            listData:[],        // 列表数据
            pageData:1,         // 页码
            scrollStatus:false, // 固定页面
            allLoaded:true,
            autoFill:false,
            keyData:'',         // 存放子组件传的key值
            sortData:{          // 排序     0是倒序，1是正序
                'sales':0,
                'goods_id':3,
                'price':3,
            },
            loading:true
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
            vm.$store.state.shopListStatus = false;       // 如果Status为true 就取这里的数据，反之不取    
            vm.$store.state.shopListopenData = {          // 给子组件传值
                popupData: false,
                goodsNumber:'0',
                goodsTypeId:'',
                navId:'',
                childId:[],
                selectData:{},
                classId:'',
                siteId:'',
                goodsType:'',
            };
            vm.$store.state.shopListkeyData = '';
            vm.$store.state.shopListGoodsType = '';
            vm.$store.state.tabStatus = 0;
            vm.$store.state.sortData = {
                'sales': 0,
                'goods_id': 3,
                'price': 3
            };
            next();
        }
        
    },
    beforeMount(){
        window.scrollTo(0,0);
        let vm = this;
        vm.openData.navId = vm.$route.query.id;
        // 获取vuex中的goodstype，如果为空就取页面url的goods_type，如果不是空就直接用vuex中存放的值
        if(!vm.$store.state.shopListStatus){
            vm.openData.goodsTypeId = vm.$route.query.goodsType;
            vm.openData.goodsType = vm.$route.query.goodsType;
        }else{
            vm.openData.goodsTypeId = vm.$store.state.shopListGoodsType;
            vm.openData.goodsType = vm.$store.state.shopListGoodsType;
            vm.openData = vm.$store.state.shopListopenData;
            vm.keyData = vm.$store.state.shopListkeyData;
        }
        vm.sortData = vm.$store.state.sortData;
        vm.tabStatus = vm.$store.state.tabStatus;
        console.log(vm.openData.goodsType,"vm.openData.goodsType")
        vm.reqData();
    },
    methods:{
        // req data
        reqData(){
            let vm = this;
            vm.listData = [];
            let data = {
                key:vm.keyData,
                page:vm.pageData,
                order:vm.sortData,
                pageSize:20,
                nav_id:vm.openData.navId,
                goods_type:vm.openData.goodsTypeId
            }
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.post('wap/goods/list',qs.stringify(data),vm.$token).then((req)=>{
                Indicator.close();
                console.log(req,"1111");
                let code = req.data.data.code;
                if(code == 200){
                    vm.listData = req.data.data.list;
                    // this.$refs.loadmore.onTopLoaded();
                    vm.openData.goodsNumber = req.data.data.total_count;
                    if(vm.openData.goodsNumber > 20 && vm.listData.length > 19){
                        this.loading = false
                    }else{
                        this.loading = true;
                    }
                }
            })
        },
        // tabs切换  销量 新品 价格
        tabsSelectBtn(index){
            let vm = this;
            window.scrollTo(0,0);
            vm.pageData = 1;
            vm.tabStatus = index;
            vm.$store.state.tabStatus = vm.tabStatus;
            if(index == 0 && vm.sortData.sales != 0 ){
                vm.sortData.sales = 0;
                vm.sortData.goods_id = 3;
                vm.sortData.price = 3;
                vm.$store.state.sortData = vm.sortData;
                vm.reqData();
            }else if(index == 0 && vm.sortData.sales == 0){
                vm.sortData.sales = 1;
                vm.sortData.goods_id = 3;
                vm.sortData.price = 3;
                vm.$store.state.sortData = vm.sortData;
                vm.reqData();
            }else if(index == 1 && vm.sortData.goods_id != 0){
                vm.sortData.goods_id = 0;
                vm.sortData.sales = 3;
                vm.sortData.price = 3;
                vm.$store.state.sortData = vm.sortData;
                vm.reqData();
            }else if(index == 1 && vm.sortData.goods_id == 0){
                vm.sortData.goods_id = 1;
                vm.sortData.sales = 3;
                vm.sortData.price = 3;
                vm.$store.state.sortData = vm.sortData;
                vm.reqData();
            }else if(index == 2 && vm.sortData.price != 0){
                vm.sortData.price = 0;
                vm.sortData.sales = 3;
                vm.sortData.goods_id = 3;
                vm.$store.state.sortData = vm.sortData;
                vm.reqData();
            }else if(index == 2 && vm.sortData.price == 0){
                vm.sortData.price = 1;
                vm.sortData.sales = 3;
                vm.sortData.goods_id = 3;
                vm.$store.state.sortData = vm.sortData;
                vm.reqData();
            }
        },
        // 筛选事件
        filterBtn(){
            this.openData.popupData = true;
            this.scrollStatus = true;
        },
        // 切换列表样式按钮
        iconBtn(){
            let vm = this;
            if(vm.styleStatus == 1){
                vm.styleStatus = 0;
            }else{
                vm.styleStatus = 1;
            }
        },
        // 监听子组件传参事件
        PopupLayerFun(data){
            console.log(data,'data');
            let vm = this;
            if(data.key == ''){
                vm.openData.popupData = data.layer;
                vm.scrollStatus = data.layer;
            }else{
                vm.keyData = data.key;
                vm.openData.popupData = data.layer;
                vm.scrollStatus = data.layer;
                vm.openData.selectData = data.selectData;
                vm.openData.classId = data.class_id;
                vm.openData.goodsNumber = data.goods_number;
                vm.openData.siteId = data.site_id;
                vm.openData.childId = data.childId;
                vm.openData.goodsType = data.goods_type;
                vm.openData.goodsTypeId = data.goods_type;
                vm.openData.navId = data.class_id;;
                vm.pageData = 1;
                vm.$store.state.shopListopenData = vm.openData;
                vm.$store.state.shopListkeyData = data.key;
                vm.$store.state.shopListStatus = true;
                console.log(vm.$store.state.shopListopenData,"vm.$store.state.shopListopenData");
                vm.reqData();
            }
            
        },
        // 下拉刷新  清空数据，并重新渲染DOM
        loadTop(){
            let vm = this;
            vm.pageData = 1;
            vm.reqData();
        },
        // 上拉加载更多
        loadMore(){
            let vm = this;
            vm.pageData++;
            let data = {
                key:vm.keyData,
                page:vm.pageData,
                order:vm.sortData,
                pageSize:20,
                nav_id:vm.openData.navId,
                goods_type:vm.openData.goodsTypeId
            }
            Indicator.open({
                spinnerType:'fading-circle'
            });
            vm.$http.post('wap/goods/list',qs.stringify(data),vm.$token).then((req)=>{
                Indicator.close();
                this.$refs.loadmore.onTopLoaded();
                let code = req.data.data.code;
                let msg = req.data.data.msg;
                let list = req.data.data.list;
                if(code == 200){
                    if(list.length < 20){
                        vm.listData =[...vm.listData,...req.data.data.list];
                        vm.loading = true;
                    }else{
                        vm.listData =[...vm.listData,...req.data.data.list];
                    }
                }else{
                    Toast({
                        message:msg,
                        duration:3000
                    })
                }
            })
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
        NullView
    }
}
</script>
