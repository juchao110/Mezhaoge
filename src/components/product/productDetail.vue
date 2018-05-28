/*
 * @Author: YorkeD
 * @Date: 2018-04-06 10:54:42
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-08 18:00:38
 * 商品详情
 */
<template>
    <div class="content" v-bind:class="{disable_scroll:scrollStatus === true}">
        <div v-if="unknowGood==false&&dataOk">
            <div class="detail_header">
                <i class="iconfont go_back_icon l" @click="goBack">&#xe60d;</i>
                <span class="header_text l">产品</span>
                <span class="header_text l" v-bind:class="{blue_color:detailBlue == 1}" @click="goDetailScroll">详情</span>
                <span class="header_text l" @click="bigImg(0)">大图</span>
                <i class="iconfont more_icon r" @click="moreBtn">&#xe60b;</i>
                <div class="more_box" v-if="headerMoreStatus">
                    <ul class="more_btn_box">
                        <li class="check_btn_box" @click="goIndex">
                            <i class="iconfont home_icon">&#xe62e;</i>
                            首页
                        </li>
                        <li class="check_btn_box" @click="goServe">
                            <i class="iconfont serve_icon">&#xe61f;</i>
                            在线客服
                        </li>
                        <li class="check_btn_box" @click="goSearch">
                            <i class="iconfont search_icon">&#xe60a;</i>
                            搜索
                        </li>
                        <li v-if="!wechet" class="check_btn_box" @click="goShare">
                            <i class="iconfont share_icon">&#xe624;</i>
                            分享
                        </li>
                        <li class="check_btn_box" @click="goMatch(salesInfoData.shop_id)">
                            <i class="iconfont match_icon">&#xe64b;</i>
                            发布求购
                        </li>
                    </ul>
                </div>
            </div>
            <div class="purchase_detail" @click="headerMoreStatus = 0">
                <div class="detail_swiper_box">
                    <mt-swipe :auto="0">
                        <mt-swipe-item v-for="(imgData,index) in goodsInfoData.imgs">
                            <img :src="imgData" class="img_box preview-img" @click="bigImg(index)">
                        </mt-swipe-item>
                    </mt-swipe>
                </div>
                <div class="detail_time_box" v-if="discountDataStatus">
                    <ul class="time_box">
                        <li class="time_title_box l">
                            <i class="iconfont time_icon">&#xe61b;</i>
                            <span class="title_text">限时折扣</span>
                        </li>
                        <li class="time_info_box l">
                            <span class="time_title l">距结束仅剩</span>
                            <span class="time_text l">{{endDays}}</span>
                            <span class="time_title l">天</span>
                            <span class="time_text l">{{endHours}}</span>
                            <span class="time_title l">时</span>
                            <span class="time_text l">{{endMinutes}}</span>
                            <span class="time_title l">分</span>
                            <span class="time_text l">{{endSeconds}}</span>
                            <span class="time_title l">秒</span>
                        </li>
                    </ul>
                </div>
                <div class="detail_title_box">
                    <ul class="title_info_box">
                        <li class="info_text_box l">
                            <h5 class="info_title_text" v-bind:class="{no_border: wechet}">{{goodsInfoData.goods_name}}</h5>
                            <p class="info_price_text" v-if="goodsInfoData.min_price == goodsInfoData.max_price ">￥{{goodsInfoData.min_price}}<span class="price_unit">/{{goodsInfoData.unit}}</span></p>
                            <p class="info_price_text" v-if="goodsInfoData.min_price != goodsInfoData.max_price ">￥{{goodsInfoData.min_price}}~{{goodsInfoData.max_price}}<span class="price_unit"> /{{goodsInfoData.unit}}</span></p>
                            <p class="original_cost_text" v-if="goodsInfoData.hasSkus == 0 && goodsInfoData.min_cost_price == goodsInfoData.max_cost_price">￥{{goodsInfoData.min_cost_price}} /{{goodsInfoData.unit}}</p>
                            <p class="original_cost_text" v-if="goodsInfoData.hasSkus == 0 && goodsInfoData.min_cost_price != goodsInfoData.max_cost_price">￥{{goodsInfoData.min_cost_price}}~{{goodsInfoData.max_cost_price}} /{{goodsInfoData.unit}}</p>
                        </li>
                        <li class="info_icon_box l" v-if="!wechet" @click="goShare">
                            <i class="iconfont share_icon">&#xe621;</i>
                            <p class="share_text">分享</p>
                        </li>
                    </ul>
                    <ul class="goods_info_box">
                        <li class="goods_info_text">
                            <i class="iconfont info_icon">&#xe616;</i>
                            <span class="info_title_text">发货地：</span>
                            <span class="info_content_text">{{goodsInfoData.location}}</span>
                        </li>
                        <li class="goods_info_text">
                            <i class="iconfont info_icon">&#xe810;</i>
                            <span class="info_title_text">发货期限：</span>
                            <span class="info_content_text" v-if="goodsInfoData.delivery_date != 0">自买家付款之日起<span class="color_text">{{goodsInfoData.delivery_date}}</span>天内发货</span>
                            <span class="info_content_text" v-if="goodsInfoData.delivery_date == 0">面议</span>
                        </li>
                        <li class="goods_info_text" v-if="isOutside == 1">
                            <i class="iconfont info_icon">&#xe726;</i>
                            <span class="info_title_text">供应总量：</span>
                            <span class="info_content_text">{{goodsInfoData.count}} {{goodsInfoData.unit}}</span>
                        </li>
                        <li class="goods_info_text" v-if="isOutside != 1 && hasSkusStatus == 0">
                            <i class="iconfont info_icon">&#xe726;</i>
                            <span class="info_title_text">供应总量：</span>
                            <span class="info_content_text">{{goodsInfoData.count}} {{goodsInfoData.unit}}</span>
                        </li>
                        <li class="goods_info_text">
                            <i class="iconfont info_icon">&#xe613;</i>
                            <span class="info_title_text">已成交：</span>
                            <span class="info_content_text"><span class="color_text">{{goodsInfoData.sale_count}}</span> {{goodsInfoData.unit}}</span>
                        </li>
                    </ul>
                </div>
                <div class="detail_color_info" v-if="hasSkusStatus" @click="openDetailColor">
                    <i class="iconfont color_icon">&#xe64c;</i>
                    规格颜色
                    <i class="iconfont arrow_icon r">&#xe635;</i>
                </div>
                <div class="detail_info_box" @click="detailInfoBtn">
                    <i class="iconfont color_icon">&#xe625;</i>
                    基本信息
                    <i class="iconfont arrow_icon r" v-if="detailInfoStatus == 1">&#xe661;</i>
                    <i class="iconfont arrow_icon r" v-if="detailInfoStatus == 0">&#xe679;</i>
                </div>
                <div class="detail_info_box2" v-if="detailInfoStatus">
                    <ul class="goods_detail_info">
                        <li class="goods_detail_text_box" v-for="(baseData,index) in baseInfoData">
                            <div class="detail_text_info">
                                <span class="text_title l">{{baseData.title}}</span>
                                <span class="text_info l">
                                    {{baseData.value}}
                                    <input type="button" class="copy_btn" value="复制" :data-clipboard-text="baseData.value" @click="copyFun(baseData.value)" v-if="baseData.title == '产品编号'">
                                </span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="detail_sell_box" @click="sellInfoBtn">
                    <i class="iconfont color_icon">&#xe61a;</i>
                    卖家信息
                    <i class="iconfont arrow_icon r" v-if="sellInfoStatus == 1">&#xe661;</i>
                    <i class="iconfont arrow_icon r" v-if="sellInfoStatus == 0">&#xe679;</i>
                </div>
                <div class="detail_stor_info" v-if="sellInfoStatus">
                    <dl class="stor_info_box">
                        <dt class="stor_img_box l">
                            <img :src="salesInfoData.logo_image_url" class="stor_img">
                        </dt>
                        <dd class="stor_text_box l">
                            <p class="stor_title_box">{{salesInfoData.company}}</p>
                            <ul class="stor_contact_box">
                                <li class="contact_name l">联系人：{{salesInfoData.real_name}}</li>
                                <li class="contact_phone l" v-if="salesInfoData.mobile != '' && salesInfoData.mobile != null" @click="showPhoneCall = true">
                                    <i class="iconfont phone_icon">&#xe623;</i>
                                    电话
                                </li>
                                <a class="contact_qq l" v-if=" salesInfoData.qq != '' && salesInfoData.qq != null && !wechet" :href="`mqqwpa://im/chat?chat_type=wpa&uin=${salesInfoData.qq}&version=1&src_type=web&web_src=oicqzone.com`">
                                    <i class="iconfont qq_icon">&#xe62a;</i>
                                    QQ
                                </a>
                                </li>
                                <li class="contact_wx l" @click="openWeixin(salesInfoData.weixin)" v-if="salesInfoData.weixin && wechet ">
                                    <i class="iconfont wx_icon">&#xe69a;</i>
                                    微信
                                </li>
                            </ul>
                        </dd>
                    </dl>
                </div>
                <div class="detail_img_text_box" @click="imgTextDetailBtn">
                    <i class="iconfont color_icon">&#xe6ee;</i>
                    图文详情
                    <i class="iconfont arrow_icon r" v-if="imgTextDetailStatus == 1">&#xe661;</i>
                    <i class="iconfont arrow_icon r" v-if="imgTextDetailStatus == 0">&#xe679;</i>
                </div>
                <div class="detail_img_box" v-html="contentData" v-if="imgTextDetailStatus">
                    {{contentData}}
                </div>
                <div class="detail_color_box" @click="detailColorBtn" v-if="colorCardsData != '' ">
                    色卡图片
                    <i class="iconfont arrow_icon r" v-if="colorStatus == 1">&#xe661;</i>
                    <i class="iconfont arrow_icon r" v-if="colorStatus == 0">&#xe679;</i>
                </div>
                <div class="detail_color_img" v-html="colorCardsData" v-if="colorStatus">
                    {{colorCardsData}}
                </div>
                <div class="detail_footer_box">
                    <ul class="detail_footer_info">
                        <li class="detail_phone_box l" @click="showPhoneCall = true">
                            <i class="iconfont phone_big_icon">&#xe623;</i>
                            <p class="footer_title">电话联系</p>
                        </li>
                        <li class="detail_match_box l" @click="goMatch(salesInfoData.shop_id)">
                            发布求购
                        </li>
                        <li class="detail_sample_box l" @click="sampleBtn">
                            免费拿样
                        </li>
                    </ul>
                </div>
                <mt-popup
                  v-model="showLayer"
                  popup-transition="popup-fade"
                  :closeOnClickModal="false">
                    <div class="layer_box">
                        <p class="big_font">进<span class="font_1">货</span><span class="font_2">先</span>拿<span class="font_3">样</span></p>
                        <p class="normal_font">生意有保障</p>
                        <p class="small_font">触屏站暂未开放该功能</p>
                        <p class="small_font">请到官网<span>ezhaoge.com</span>申请拿样</p>
                        <div class="btn" @click="showLayerBtn">
                            知道了
                        </div>
                    </div>
                </mt-popup>
            </div>
            <DetailColor v-if="detailColorStatus" v-on:detailColor="detailColorFun"></DetailColor>
            <TelePhone :service="phoneNumber" :show="showPhoneCall" @cancelPhone="cancelPhoneCall"></TelePhone>
            <WeiXinLayer :parentData="wechatImg" v-if="showWeiXin" @cancel="cancelWeiXin"></WeiXinLayer>
            <ShareLayer v-if="shareLayerStatus" :isShow='shareLayerStatus' @getShareStatus="hideShare"></ShareLayer>
        </div>
        <div class="unknow_good" v-if="unknowGood&&dataOk">
            <TitleHead :title="pageTitle"></TitleHead>
            <img src="../../assets/images/product/product_01.png" alt="">
            <h4>很抱歉，该产品不存在</h4>
            <p>
                <span>{{goHomeTime}}s</span>后自动返回首页
            </p>
        </div>
    </div>
</template>

<script>
import '../../assets/sass/product/productDetail.sass';
import '../../assets/js/openqq';
import WeiXinLayer from '../common/code.vue';
import DetailColor from './productDetailColor.vue';
import TelePhone from '../common/telephone.vue';
import ShareLayer from '../common/shareLayer.vue';
import TitleHead from '../common/titleHead.vue';
import Clipboard from 'clipboard';
import photoswipe from 'photoswipe';
import { Indicator, Toast, SwipeItem, Swipe, Popup, MessageBox } from 'mint-ui';
export default {
    data () {
        return {
            detailColorStatus: 0,                   // 用于判断色号组件的隐藏和显示
            baseInfoData: [],                       // 分类信息数组
            discountData: {},                       // 活动数据对象
            discountDataStatus:0,                   // 控制活动的DOM显示或隐藏
            goodsInfoData: [],                      // 商品信息数据
            salesInfoData: [],                      // 卖家信息数据
            imgListData: [],                        // 详情轮播图片数据
            contentData: '',                        // 图文详情数据
            colorCardsData: '',                     // 色号数据
            endDays: '',                            // 折扣倒计时天数据
            endHours: '',                           // 折扣倒计时时数据
            endMinutes: '',                         // 折扣倒计时分数据
            endSeconds: '',                         // 折扣倒计时秒数据
            endTimeData: 0,                         // 结束时间
            hasSkusStatus: 0,                       // 是否有sku  1是   0否
            isOutside:0,                            // 是否是爬虫采集商品 1 是  0 否
            headerMoreStatus: 0,                    // 判断header 更多dom是否显示
            showLayer: false,                       // 免费拿样弹层控制
            sellInfoStatus: 1,                      // 卖家信息部分展示或隐藏
            detailInfoStatus: 1,                    // 基本信息部分展示或隐藏
            imgTextDetailStatus: 1,                 // 图文详情部分展示或隐藏
            colorStatus: 1,                         // 色卡图片部分展示或隐藏
            phoneNumber: '',                        // 电话号码
            showPhoneCall: false,                   // 电话弹窗是否显示
            showWeiXin:false,                       // 微信弹层是否显示
            wechatImg:{                             // 微信图片弹层传参到子组件
                status:false,
            },
            wechet:false,                           // 根据当前环境改变值，并控制分享按钮的隐藏和显示
            shareLayerStatus:false,                 // 控制分享弹层的隐藏和显示
            detailBlue:0,                           // 控制头部详情文字颜色
            scrollStatus:false,                     // scroll控制
            bigStatus:false,                        // 图片是否放大'
            urlData:'',                             // 存放地址参数
            shareDoc:'我在一革网发现这件产品卖的很火，赶快来看看吧！',                            // 分享描述
            unknowGood:false,                       //不存在的产品
            dataOk:false,                           //数据加载完成
            pageTitle:'产品详情',
            goHomeTime:3,                           //回首页倒计时时间
            interval:''                             //倒计时的方法
        }
    },
    beforeCreate () {

    },
    beforeRouteLeave (to, from, next) {
        let vm  = this;
        window.clearInterval(vm.interval)
        if (this.bigStatus && localStorage.getItem('preview') !== 'false') {
            vm.$preview.close();
            setTimeout(() => {
                next(false)
                this.bigStatus = false;
                localStorage.removeItem('preview')
            }, 100)
        } else {
            localStorage.removeItem('preview')
            next()
        }
    },
    beforeMount () {
        let previewStatus = this.$route.query.preview?this.$route.query.preview:''
        let vm = this
        let idData = vm.$route.params.id;
        vm.urlData = window.location.hash;
        vm.wechet = vm.$weixin;
        Indicator.open({
            spinnerType: 'fading-circle'
        })
        window.scroll(0, 0);
        vm.$nextTick(function () {
            window.addEventListener('scroll', vm.onScroll)
        })
        vm.$http.get(`wap/goods/details?id=${idData}&preview=${previewStatus}`, vm.$token).then((req) => {
            Indicator.close()
            console.log(req, 'detail')
            let code = req.data.data.code
            let msg = req.data.data.msg
            vm.dataOk = true
            if (code == 200) {
                vm.baseInfoData = req.data.data.base_info
                vm.goodsInfoData = req.data.data.goods_info
                vm.getData();
                vm.hasSkusStatus = req.data.data.goods_info.hasSkus
                vm.isOutside = req.data.data.goods_info.is_outside;
                let imgarr = req.data.data.goods_info.imgs
                let imgarr2 = req.data.data.goods_info.main_img
                if (imgarr == undefined) {
                    for (let i = 0; i < imgarr2.length; i++) {
                        vm.imgListData.push({
                        'src': imgarr2[i],
                        'w': 1200,
                        'h': 800
                        })
                    }
                } else {
                    for (let i = 0; i < imgarr.length; i++) {
                        vm.imgListData.push({
                        'src': imgarr[i],
                        'w': 1200,
                        'h': 800
                        })
                    }
                }
                vm.salesInfoData = req.data.data.sales_info
                vm.phoneNumber = req.data.data.sales_info.mobile
                vm.contentData = req.data.data.content
                vm.colorCardsData = req.data.data.color_cards
                vm.discountData = req.data.data.discount
                if (vm.discountData != '') {
                    vm.discountDataStatus = 1;
                    vm.endTimeData = req.data.data.discount.endTime
                    vm.discountTimes(vm.endTimeData)
                }
            } else {
                // Toast({
                // message: msg,
                // duration: 3000
                // })
                vm.unknowGood=true
                vm.interval = window.setInterval(() => {
                  if ((this.goHomeTime--) <= 1) {
                    this.$router.push({path:'/index'})
                    window.clearInterval(vm.interval)
                  }
                }, 1000)
            }
        }).then((err) => {
            Indicator.close()
        })
    },
    mounted () {

    },
    methods: {
        // 头部返回按钮
        goBack () {
            let vm = this;
            if(this.bigStatus){
                vm.$preview.close();
                this.bigStatus = false;
                setTimeout(() => {
                    this.$router.go(-1)
                }, 1000);
            }else{
                this.$router.go(-1)
            }
        },
        // 头部 ··· 按钮
        moreBtn () {
            if (this.headerMoreStatus == 0) {
                this.headerMoreStatus = 1
            } else {
                this.headerMoreStatus = 0
            }
        },
        onScroll(){
            let distance = document.documentElement.scrollTop || document.body.scrollTop
            if(distance < 820){
                this.detailBlue = 0;
            }else if(distance > 1000){
                this.detailBlue = 1;
            }
        },
        // 跳转至详情部分的锚点方法
        goDetailScroll () {
            this.jump()
        },
        // go 在线客服
        goServe () {
            this.$router.push({path:'/user/service'});
        },
        // go 首页
        goIndex () {
            this.$router.push('/index')
        },
        // go 搜索
        goSearch () {
            this.$router.push('/index/wordsearch')
        },
        // go 分享
        goShare () {
            let vm = this;
            vm.shareLayerStatus = true;
            vm.scrollStatus = true;
            vm.headerMoreStatus = 0;
        },
        // 分享的方法
        getData(){
            let vm = this;
            let url = window.location.href;
            if(vm.$weixin){
                vm.$store.state.shareQQ(vm.goodsInfoData.goods_name, vm.shareDoc, url, vm.goodsInfoData.imgs[0])
                vm.$store.state.shareFriend(vm.goodsInfoData.goods_name, vm.shareDoc, url, vm.goodsInfoData.imgs[0])
                vm.$store.state.shareFriends(vm.goodsInfoData.goods_name, url, vm.goodsInfoData.imgs[0])
            }
        },
        // 分享弹层
        hideShare(data){
            if(data == false){
                this.headerMoreStatus = 0;
                this.scrollStatus = false;
                this.shareLayerStatus = data;
            }
        },
        // 打开QQ
        openQQ (qq) {
            MessageBox.confirm('是否要添加买家的QQ?', '').then(action => {
                this.OpenQQ(qq_data)
            }).catch(err => {
                console.log('点击取消')
            })
        },
        // 免费拿样 知道了 按钮
        showLayerBtn(){
            this.showLayer = false;
            this.scrollStatus = false;
        },
        openWeixin(img){
            console.log(img,'weixin')
            this.wechatImg.status = true;
            this.wechatImg.img = img;
            this.showWeiXin = true;
        },
        // 放大图片
        bigImg (index) {
            this.$preview.open(index, this.imgListData)
            this.bigStatus = true;
        },
        // 卖家信息按钮
        sellInfoBtn () {
            if (this.sellInfoStatus == 0) {
                this.sellInfoStatus = 1
            } else {
                this.sellInfoStatus = 0
            }
        },
        // 基本信息按钮
        detailInfoBtn () {
            if (this.detailInfoStatus == 0) {
                this.detailInfoStatus = 1
            } else {
                this.detailInfoStatus = 0
            }
        },
        // 图文详情按钮
        imgTextDetailBtn () {
            if (this.imgTextDetailStatus == 0) {
                this.imgTextDetailStatus = 1
            } else {
                this.imgTextDetailStatus = 0
            }
        },
        // 色卡部分按钮
        detailColorBtn () {
            if (this.colorStatus == 0) {
                this.colorStatus = 1
            } else {
                this.colorStatus = 0
            }
        },
        // 发布求购按钮
        goMatch (shop_id) {
            this.$router.push({path:'/sendpurchase',query:{id : shop_id}})
        },
        // 免费拿样按钮
        sampleBtn () {
            this.showLayer = true
            this.scrollStatus = true;
        },
        // 打开色号详情
        openDetailColor () {
            let vm = this
            if (vm.hasSkusStatus) {
                vm.detailColorStatus = 1
                vm.scrollStatus = true;
            } else {
                Toast({
                message: '该商品无Sku',
                duration: 3000
                })
            }
        },
        // 监听色号子组件消息
        detailColorFun (data) {
            this.detailColorStatus = data
            if(data == 0){
                this.scrollStatus = false;
            }
        },
        // 监听微信子组件消息
        cancelWeiXin(data){
            console.log(data);
            this.showWeiXin = data;
        },
        // 复制按钮
        copyFun () {
            const clipboard = new Clipboard('.copy_btn')
            clipboard.on('success', e => {
                Toast({
                message: '复制成功',
                duration: 3000
                })
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                Toast({
                message: '浏览器不支持自动复制功能',
                duration: 3000
                })
                // 释放内存
                clipboard.destroy()
            })
        },
        cancelPhoneCall (data) {
            this.showPhoneCall = data
        },
        // 活动倒计时
        discountTimes(end_time) {
            let vm = this;
            let _this = vm;
			let i = Math.floor(( end_time ));
			_this.timer = setInterval(function() {
				i--;
                let days =Math.floor( i / 60 / 60 / 24 );
                _this.endDays = arr(days);
                let hours = Math.floor( i / 60 / 60 - ( 24 * days ));
                _this.endHours = arr(hours);
                let minutes = Math.floor( i / 60 - ( 24 * 60 * days ) -( 60 * hours ));
                _this.endMinutes = arr(minutes) ;
                let seconds =  i - ( 24 * 60 * 60 * days ) -( 60 * 60 * hours ) -( 60 * minutes );
                _this.endSeconds = arr(seconds);

                if (_this.endMinutes <= 0 && _this.endSeconds <= 0 && _this.endHours <= 0 && _this.endDays <= 0) {
                    clearInterval(timer)
                    _this.endDays = '00' // 倒计时天
                    _this.endHours = '00' // 倒计时时
                    _this.endMinutes = '00' // 倒计时分
                    _this.endSeconds = '00' // 倒计时秒
                }
                if (i <= 0) {
                    _this.endSeconds = 0
                    _this.endMinutes = 0
                    _this.endHours = 0
                    _this.endDays = 0
                    clearInterval(_this.timer)
                    setTimeout('location.reload()', 1000)
                }
            }, 1000)
            function arr (i) {
                if (i < 10) {
                    return '0' + i
                } else {
                    return i
                }
            }
        },
        // 滚动监听
        jump () {
            let jump = document.querySelectorAll('.detail_img_text_box')
            let total = jump[0].offsetTop
            let distance = document.documentElement.scrollTop || document.body.scrollTop
            // 平滑滚动，时长500ms，每10ms一跳，共50跳
            let step = total / 50
            if (total > distance) {
                smoothDown()
            } else {
                let newTotal = distance - total
                step = newTotal / 50
                smoothUp()
            }
            function smoothDown () {
                if (distance < total) {
                    distance += step;
                    document.body.scrollTop = distance - 35;
                    document.documentElement.scrollTop = distance - 35;
                    setTimeout(smoothDown, 10);
                } else {
                    document.body.scrollTop = total - 35;
                    document.documentElement.scrollTop = total - 35;
                }
            }
            function smoothUp () {
                if (distance > total) {
                    distance -= step;
                    document.body.scrollTop = distance - 35;
                    document.documentElement.scrollTop = distance - 35;
                    setTimeout(smoothUp, 10);
                } else {
                    document.body.scrollTop = total - 35;
                    document.documentElement.scrollTop = total - 35;
                }
            }
        },
    },
    components: {
        DetailColor,
        TelePhone,
        WeiXinLayer,
        ShareLayer,
        TitleHead
    }
}
</script>
