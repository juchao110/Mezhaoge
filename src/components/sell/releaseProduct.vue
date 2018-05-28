/*
 * @Author: juchao
 * @Date: 2018-03-20 10:47:19
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-18 17:41:27
 * 发布产品
 */
<template>
    <div class="content" v-bind:class="{disable_scroll:srcollStatus === true}">
        <TitleHeader :title="titleName"></TitleHeader>
        <div class="release_product">
            <div class="release_product_title">
                <p class="release_title_text">已选择品类：{{classText}}</p>
            </div>
            <div class="release_product_tab" v-if="navId == 1 && editStatus != 1">
                <ul class="tab_header_box">
                    <li class="tab_header_select l" @click="tabSelectBtn(0)" v-bind:class="{tab_select_border: 0 == tabSelectType }">尾货</li>
                    <li class="tab_header_select l" @click="tabSelectBtn(1)" v-bind:class="{tab_select_border: 1 == tabSelectType }">现货</li>
                </ul>
            </div>
            <div class="release_product_content">
                <div class="release_img_content">
                    <div class="img_content_wenlu">
                        <p class="img_wenlu_title">
                            <em class="l">*</em>
                            <span v-if=" navId == 1 || navId == 9 || navId == 10 ">纹路图片</span>
                            <span class="img_title_hint" v-if=" navId == 1 || navId == 9 || navId == 10 ">用于智能图片搜索/匹配</span>
                            <span v-if=" navId != 1 && navId != 9 && navId != 10 ">产品主图</span>
                            <span class="img_title_hint" v-if=" navId != 1 && navId != 9 && navId != 10 ">高质量的图片获得更多曝光机会</span>
                        </p>
                        <div class="img_upfile_box" v-show="imgWenLuSrc == ''" >
                            <Upload @fromChild="getWenImg"></Upload>
                        </div>
                        <div class="img_wen_ok" v-if="imgWenLuSrc != ''">
                            <img :src="imgWenLuSrc" class="wenlu_img_box">
                            <span class="detail_img" @click="delWenLuImg">-</span>
                        </div>
                    </div>
                    <div class="img_content_qita">
                        <p class="img_qita_title">
                            <em class="l">*</em>
                            更多图片
                            <span class="img_title_hint" v-if=" navId == 1 || navId == 9 || navId == 10 ">上传底布、厚度、色卡等图片</span>
                            <span class="img_title_hint" v-if=" navId != 1 && navId != 9 && navId != 10 ">更多其他产品细节图</span>
                        </p>
                        <div class="img_wen_ok l" v-if=" moreImgData.length != 0  " v-for="(imgData,index) in moreImgData">
                            <img :src="imgData" class="wenlu_img_box">
                            <span class="detail_img" v-if="moreImgData != ''" @click="delImg(index)">-</span>
                        </div>
                        <div class="img_upfile_box l" v-if=" moreImgData.length < 7 " >
                            <Upload @fromChild="getOtherImg" :status="tabSelectType" v-if=" moreImgData.length < 7 "></Upload>
                        </div>
                    </div>
                </div>
                <div class="release_select_content">
                    <ul class="select_content_box">
                        <li class="select_content_text" v-if=" attr.flag !=3 "  v-for="(attr,index) in attrData" @click="attr.cate_sku == null && attr.flag != 2 && goSelectBtn(attr.id,attr.flag,attr.cate_name)">
                            <em class="l" v-bind:class="{white_color:attr.is_required == 0}">*</em>
                            <span class="conent_text_box l">{{attr.cate_name}}</span>
                            <input v-if="attr.flag == 2" type="text" :placeholder="`请输入${attr.cate_name}`" v-model="inputTextData[attr.id]" class="select_input_text">
                            <span class="r" v-if="attr.cate_sku != null">{{attr.cate_sku}}</span>
                            <i class="iconfont arrow_right r" v-if="attr.cate_sku == null && attr.flag != 2" @click="goSelectBtn(attr.id,attr.flag,attr.cate_name)">&#xe635;</i>
                            <span class="unit_text r">{{userSelectTitleData[attr.id] | default('')}}</span>
                        </li>
                    </ul>
                </div>
                <div class="release_price_content">
                    <ul class="price_content_box">
                        <li class="price_content_text">
                            <em class="l">*</em>
                            价格单位
                            <i class="iconfont arrow_right r" @click="moreBtn(1)">&#xe635;</i>
                            <span class="price_unit r">{{unitTitleData}}</span>
                        </li>
                        <li class="price_content_text" @click="goodsStandard" v-if="tabSelectType == 1 && isSkuData == 1 ">
                            <em class="l">*</em>
                            产品规格
                            <i class="iconfont arrow_right r">&#xe635;</i>
                            <span class="price_unit r" v-if="childStandarData != '' ">已编辑</span>
                        </li>
                        <!-- 只有最低价格小于最高价格并且必须是编辑状态 -->
                        <li class="price_content_text" v-if="editStatus == 1 && OriginalPrice == 1">
                            <em class="l">*</em>
                            原价
                            <input type="number" placeholder="最低价格" v-model="minOriginalPrice" class="min_prime_cost">
                            <span>~</span>
                            <input type="number" placeholder="最高价格" v-model="maxOriginalPrice" class="max_prime_cost">
                            <span class="unit_text r">元</span>
                        </li>
                        <li class="price_content_text" v-if="editStatus == 1 && promotionPrice == 1">
                            <em class="l">*</em>
                            促销价
                            <input type="number" placeholder="最低价格" v-model="promotionPricemin" class="min_promotion_price">
                            <span>~</span>
                            <input type="number" placeholder="最高价格" v-model="promotionPricemax" class="max_promotion_price">
                            <span class="unit_text r">元</span>
                        </li>
                        
                        <!-- 最高价格等于最低价格并且不是现货，才有价格输入框      库存数量输入框必须是没有sku并且不是皮革类目或者是尾货并且是皮革类目 -->
                        <li class="price_content_text" v-if=" isSkuData == 0 && promotionPrice != 1">
                            <em class="l">*</em>
                            原价
                            <input type="number" placeholder="请输入原价" v-model="minOriginalPrice" class="prime_cost">
                            <span class="unit_text r">元</span>
                        </li>
                        <li class="price_content_text" v-if="isSkuData == 0 && promotionPrice != 1">
                            <em class="l">*</em>
                            促销价
                            <input type="number" placeholder="请输入促销价" v-model="promotionPricemin" class="promotion_price">
                            <span class="unit_text r">元</span>
                        </li>
                        <li class="price_content_text" v-if="isSkuData == 0 && navId != 1">
                            <em class="l">*</em>
                            数量
                            <input type="number" placeholder="请输入库存数量" v-model="numberData" class="number_input">
                            <span class="unit_text r">{{unitTitleData}}</span>
                        </li>
                        <li class="price_content_text" v-if="tabSelectType == 0 && navId == 1">
                            <em class="l">*</em>
                            数量
                            <input type="number" placeholder="请输入库存数量" v-model="numberData" class="number_input">
                            <span class="unit_text r">{{unitTitleData}}</span>
                        </li>
                    </ul>
                </div>
                <div class="release_set_content">
                    <ul class="set_content_box">
                        <li class="set_content_text">
                            <em class="l">*</em>
                            产品标题
                            <input type="text" placeholder="品牌、属性、规格、卖点" v-model="goodsTitle" class="goods_title">
                        </li>
                        <li class="set_content_text">
                            <em class="l white_color">*</em>
                            商家货号
                            <input type="text" placeholder="请输入货号" v-model="articleNumber" class="article_number">
                        </li>
                        <li class="set_content_text">
                            <em class="l white_color">*</em>
                            店铺分类
                            <i class="iconfont arrow_right r" @click="moreBtn(2)">&#xe635;</i>
                            <span class="unit_text r">{{storTitleData}}</span>
                        </li>
                    </ul>
                </div>
                <div class="release_footer_content">
                    <ul class="footer_content_box">
                        <li class="footer_content_text">
                            <em class="l">*</em>
                            发货期限
                            <i class="iconfont arrow_right r" @click="moreBtn(3)">&#xe635;</i>
                            <span class="time_text r">{{timerTitleData}}</span>
                        </li>
                        <li class="footer_content_text">
                            <em class="l">*</em>
                            <span class="text_box l">橱窗推荐</span>
                            <span class="yes_text r" v-bind:class='{recommend_no : false === recommendData }'>是</span>
                            <mt-switch class='recommen_box r' v-model="recommendData"></mt-switch>
                            <span class="no_text r" v-bind:class='{recommend_no : true === recommendData }'>否</span>
                        </li>
                        <li class="footer_content_text" v-if="tabSelectType==1">
                            <em class="l">*</em>
                            <span class="text_box l">是否上架</span>
                            <span class="yes_text r" v-bind:class='{recommend_no : false === publishData }'>是</span>
                            <mt-switch class='recommen_box r' v-model="publishData"></mt-switch>
                            <span class="no_text r" v-bind:class='{recommend_no : true === publishData }'>否</span>
                        </li>
                        <li class="footer_content_text celar clearfloat:after" v-if="tabSelectType==0">
                            <em class="l">*</em>
                            验证码
                            <input type="text" placeholder="请输入验证码" v-model="imgCode" class="img_code_input">
                            <img @click="imgCodeBtn" class="img_code r" :src="imgSrcData" alt="图片验证码">
                        </li>
                    </ul>
                </div>
                <div class="submit_btn" @click="submitBtn">确认提交</div>
            </div>
        </div>
        <mt-popup
        v-model="selectStatus"
        popup-transition="popup-fade"
        :closeOnClickModal=false
        >
            <div class="select_box">
                <div class="select_box_header">
                    <i class="iconfont go_back_icon l" @click="selectBackBtn">&#xe60d;</i>
                    {{selectTitleData}}
                </div>
                <div class="select_box_content">
                    <ul class="select_content_list">
                        <li class="content_list_box" v-if="flagStatus == 0" v-bind:class="{blue_color:userSelectClass[fatherId] == childAttr.id}" @click="childSelect(childAttr.id,childAttr.cate_name)" v-for="(childAttr,index) in selectData">{{childAttr.cate_name}}</li>
                        <li class="content_list_box" v-if="flagStatus == 1" v-bind:class="{blue_color:blueId[childAttr.id]}" @click="childSelect(childAttr.id,childAttr.cate_name)" v-for="(childAttr,index) in selectData">
                            {{childAttr.cate_name}}
                            <i class="iconfont r not_selected" v-if="!blueId[childAttr.id]">&#xe61d;</i>
                            <i class="iconfont r pitch_on" v-if="blueId[childAttr.id]">&#xe604;</i>
                        </li>
                    </ul>
                </div>
                <div class="common_submit_btn" v-if="flagStatus" @click="selectSubmit">确定</div>
            </div>
        </mt-popup>
        <mt-popup
        v-model="unitSelectLayer"
        popup-transition="popup-fade"
        :closeOnClickModal=false
        >
            <div class="select_box">
                <div class="select_box_header">
                    <i class="iconfont go_back_icon l" @click="moreBackBtn(1)">&#xe60d;</i>
                    单位
                </div>
                <div class="select_box_content">
                    <ul class="select_content_list">
                        <li class="content_list_box" v-bind:class="{blue_color:unitUpDown == childAttr.id}" @click="moreChildSelect(1,childAttr.id,childAttr.name)" v-for="(childAttr,index) in unitSelectData">{{childAttr.name}}</li>
                    </ul>
                </div>
            </div>
        </mt-popup>
        <mt-popup
        v-model="classSelectLayer"
        popup-transition="popup-fade"
        :closeOnClickModal=false
        >
            <div class="select_box">
                <div class="select_box_header">
                    <i class="iconfont go_back_icon l" @click="moreBackBtn(2)">&#xe60d;</i>
                    店铺分类
                </div>
                <div class="select_box_content">
                    <ul class="select_content_list">
                        <li class="content_list_box" v-bind:class="{blue_color:storClassUpDown == childAttr.shop_cate_id}" @click="moreChildSelect(2,childAttr.shop_cate_id,childAttr.name)" v-for="(childAttr,index) in storClassData">{{childAttr.name}}</li>
                    </ul>
                </div>
            </div>
        </mt-popup>
        <mt-popup
        v-model="timerSelectLayer"
        popup-transition="popup-fade"
        :closeOnClickModal=false
        >
            <div class="select_box">
                <div class="select_box_header">
                    <i class="iconfont go_back_icon l" @click="moreBackBtn(3)">&#xe60d;</i>
                    发货期限
                </div>
                <div class="select_box_content">
                    <ul class="select_content_list">
                        <li class="content_list_box" v-bind:class="{blue_color:timerUpDown == childAttr.delivery_date_id}"  @click="moreChildSelect(3,childAttr.delivery_date_id,childAttr.name)" v-for="(childAttr,index) in timerSelecrtData">{{childAttr.name}}</li>
                    </ul>
                </div>
            </div>
        </mt-popup>
        <ProductSandard :standardObj="standardObj" v-if="standardStatus" v-on:sandardStatus="productBtn"></ProductSandard>
    </div>
</template>

<script>
import TitleHeader from '../common/titleHead.vue';
import ProductSandard from './productStandard.vue';
import Upload from '../common/upload.vue'
import '../../assets/sass/sell/releaseProduct.sass';
import { Button , Indicator , Toast , Popup ,Switch } from 'mint-ui';
var qs = require("qs");
export default {
    data(){
        return{
            navId:0,                           // * 类目ID
            editStatus:0,                      // 如果是编辑发布产品，那么这个变量就等于1
            titleName:'发布产品',               // 公共头传参
            tabSelectType:0,                   // 用于判断现货和尾货 0是尾货，1是现货
            classText:'',                      // 用于类目类型文字存放
            selectStatus:false,                // 选择弹层开关
            selectTitleData:'皮革',            // 选择弹层title
            attrData:[],                       // 属性部分数据
            selectData:[],                     // 选择数据的数组
            flagStatus:0,                      // 用于判断是单选还是多选，0是单选，1是多选
            fatherId:0,                        // 用于组成参数给后端用的，这个是所点父级分类的id，已这个id为key值进行对象组合
            fatherIdData:[],                   // 用于提交发布时判断必填项的判断
            userSelectClass:{},                // 用户选择的子id存放
            newUserSelect:{},                  // 用户选择的子id存放，并在提交时传给后端
            newData:"",                        // * 用户选择的子id存放，转成JSON 并在提交时传给后端
            userSelectId:{},                   // 用户选择的子id存放的数组，并在大于10个之后处理
            user_select_id:[],
            userSelectTitleData:{},            // 用于存放用户选择的内容，用父ID做key值，title为value值
            userSelectTitle:[],                // 用于存放用户选择的内容title，先存放在这个数组中，统一进行处理
            checkSelect:['-1'],                // 用于子选择 判断使用
            unitSelectData:[],                 // 单位数据数组
            unitTitleData:'米',                // 单位
            unitUpDown:'1',                    // * 单位数据的id，并在提交时传给后端
            timerSelecrtData:[],               // 时间数据数组
            timerTitleData:'7天内',            // 时间
            timerUpDown:'8',                   // * 时间数据的id，并在提交时传给后端
            storClassData:[],                  // 店铺分类数组
            storClassUpDown:'',                // * 店铺分类数据的id，并在提交时传给后端
            storTitleData:'',                  // 店铺分类title
            unitSelectLayer:false,             // 控制单位弹层
            classSelectLayer:false,            // 控制分类弹层
            timerSelectLayer:false,            // 控制时间弹层
            scorllYData:0,                        // 保存Y值
            goodsIdData:'',                    // * goodsid 编辑商品时会有
            newObjData:{},                     // 验证必填
            srcollStatus:false,                // 控制底层scroll的滚动
            goodsTypeStatus:3,                 // *3是尾货  1是现货  空是后端不处理


            allDataId:{},                      // 用父ID做key，子ID做数组的形式，根据用户选择之后在次点击进来之后同样有文字高亮，（多选用）
            blueId:{},                         // 文字高亮用

            isSkuData:0,                       // 是否有SKU属性 0是没有 1是有，根据返回参数循环得出结果

            // 图片
            imgWenLuSrc:'',                    // * 存放纹路图片
            moreImgData:[],                    // * 其他图片数组

            // 尾货字段
            promotionPricemax:'',              // * 促销价max
            promotionPricemin:'',              // * 促销价mix
            minOriginalPrice:'',               // * 原价min
            maxOriginalPrice:'',               // * 原价max
            numberData:'',                     // * 数量
            promotionPrice:0,                  // 根据编辑状态接口返回，如果最高价格大于最低价格则显示区间价格 1是显示，0是不显示    促销价
            OriginalPrice:0,                   // 根据编辑状态接口返回，如果最高价格大于最低价格则显示区间价格 1是显示，0是不显示    原价

            // 现货字段
            goodsTitle:'',                     // * 产品标题
            articleNumber:'',                  // * 商家货号
            recommendData:true,               // 是否推荐，默认false
            publishData:true,                  // 是否上架，默认false
            imgSrcData:'',                     // 图片验证码图片地址
            imgCode:'',                        // * 图片验证码
            colorCodeData:[],                  // * 色号 用户所编辑的
            is_invoice:0,                      // * 发票预留字段  默认0
            goodsType:3,                       // * 尾货是3 现货1
            status:1,                          // * 是否上架，尾货默认上架 传1  0是不上架
            is_recommend:0,                    // * 是否推荐，1是，0否
            

            // 产品规格弹层
            standardStatus:0,                  // 控制弹层显示与隐藏
            standardObj:{
                standardData:[],               // 产品规格数据
                saveData:[],                   // 产品规格二维数组
                editStandard:[],               // 编辑参数
            },

            childStandarData:[],               // 子组件传过来用户选择的数据


            // 离型纸
            inputTextData:{},                   // 输入框内容

        }
    },
    beforeCreate(){

    },
    beforeMount(){
        window.scroll(0,0);
        let vm = this;
        let goodsId = vm.$route.query.goods_id;
        let classType = vm.$route.query.id;
        vm.navId = classType;
        if(classType == 1){
            vm.goodsType = vm.$route.query.goods_type;
            if(vm.goodsType == 3 || vm.goodsType == undefined){
                vm.tabSelectType = 0;
            }else{
                vm.tabSelectType = 1;
            }
        }
        if(goodsId == undefined){
            vm.goodsIdData = '';
        }else{
            vm.goodsIdData = goodsId;
            vm.editStatus = 1;
        }
        if(classType == 1){
            vm.classText = '皮革';
            vm.goodsTypeStatus = 3;
        }else if(classType == 5){
            vm.classText = '聚氨酯/树脂';
            vm.tabSelectType = 1;
            vm.goodsTypeStatus = '';
        }else if(classType == 6){
            vm.classText = '表处';
            vm.tabSelectType = 1;
            vm.goodsTypeStatus = '';
        }else if(classType == 7){
            vm.classText = '色料';
            vm.tabSelectType = 1;
            vm.goodsTypeStatus = '';
        }else if(classType == 8){
            vm.classText = '助剂';
            vm.tabSelectType = 1;
            vm.goodsTypeStatus = '';
        }else if(classType == 9){
            vm.classText = '离型纸';
            vm.tabSelectType = 1;
            vm.goodsTypeStatus = '';
        }else if(classType == 10){
            vm.classText = '辊筒';
            vm.tabSelectType = 1;
            vm.goodsTypeStatus = '';
        }
        Indicator.open({
            spinnerType: 'fading-circle'
        })
        vm.$http.get(`goods/new_release?device=wechat&nav_id=${classType}&goods_id=${vm.goodsIdData}&goods_type=${vm.goodsTypeStatus}`,vm.$token).then((req)=>{
            console.log(req,'发布商品接口');
            let code = req.data.error_code;
            let msg = req.data.error_data;
            if(code == 200 ){
                vm.attrData = req.data.data.goods_cate;
                vm.unitSelectData = req.data.data.goods_sku;
                vm.timerSelecrtData = req.data.data.delivery_date;
                vm.storClassData = req.data.data.shop_cate_list;
                vm.isSkuData = req.data.data.has_sku;
                vm.standardObj.standardData = Object.assign([],req.data.data.nav_sku_attr);
                // 获取图片验证码
                let num = Math.random();
                vm.imgSrcData = `${vm.$imgCode}match/captcha?${num}`
                for(let a in vm.attrData){
                    let id = vm.attrData[a].id;
                    let name = vm.attrData[a].cate_name;
                    let is_required = vm.attrData[a].is_required;
                    if(is_required == 1){
                        vm.newObjData[id] = name;
                    }
                }
                // 默认单位
                let unitDefaultId = req.data.data.default_sku_id;
                for(let unitindex in vm.unitSelectData){
                    let unitId = vm.unitSelectData[unitindex].id;
                    if(unitId == unitDefaultId){
                        vm.unitUpDown = unitDefaultId;
                        vm.unitTitleData = vm.unitSelectData[unitindex].name;
                    }
                }
                Indicator.close()
                if(vm.editStatus == 1){
                    vm.imgWenLuSrc = req.data.data.goods.main_img;
                    vm.moreImgData = req.data.data.goods.img_other;
                    vm.promotionPricemax = req.data.data.goods.max_price;
                    vm.promotionPricemin = req.data.data.goods.min_price;
                    vm.minOriginalPrice = req.data.data.goods.min_cost_price;
                    vm.maxOriginalPrice = req.data.data.goods.max_cost_price;
                    if(vm.promotionPricemax > vm.promotionPricemin){
                        vm.promotionPrice = 1;
                    }
                    if(vm.maxOriginalPrice > vm.minOriginalPrice){
                        vm.OriginalPrice = 1;
                    }
                    vm.numberData = req.data.data.goods.count;
                    vm.goodsTitle = req.data.data.goods.goods_name;
                    vm.unitUpDown = req.data.data.goods.sku_price_id;
                    vm.articleNumber = req.data.data.goods.goods_code;
                    let isInvoice = req.data.data.goods.is_invoice;
                    let standard = req.data.data.goods.standard;
                    vm.standardObj.editStandard = standard;
                    vm.standardObj.saveData = standard;
                    if(isInvoice == 1){
                        vm.is_invoice = true;
                    }else{
                        vm.is_invoice = false;
                    }
                    vm.timerUpDown = req.data.data.goods.delivery_date;
                    vm.unitUpDown = req.data.data.goods.sku_price_id;
                    vm.storClassUpDown = req.data.data.goods.shop_cate;
                    for(let stor of vm.storClassData){
                        if(stor.shop_cate_id == vm.storClassUpDown){
                            vm.storTitleData = stor.name;
                        }
                    }
                    for(let unit of vm.unitSelectData){
                        if(unit.id == vm.unitUpDown){
                            vm.unitTitleData =unit.name;
                        }
                    }
                    for(let time of vm.timerSelecrtData){
                        if(time.delivery_date_id == vm.timerUpDown){
                            vm.timerTitleData = time.name;
                        }
                    }
                    let recommend = req.data.data.goods.is_recommend;
                    if(recommend == 1){
                        vm.recommendData = true;
                    }else{
                        vm.recommendData = false;
                    }
                    vm.colorCodeData = req.data.data.goods.standard;
                    vm.timerUpDown = req.data.data.goods.delivery_date;
                    vm.newData = req.data.data.goods.goods_cate;
                    vm.childStandarData = req.data.data.goods.standard;
                    let statusData = req.data.data.goods.status;
                    if(statusData == 1){
                        vm.publishData = true;
                    }else{
                        vm.publishData = false;
                    }
                    vm.newUserSelect = JSON.parse(vm.newData);

                    // getType 下有个call方法 用于判断数据类型
                    let getType = Object.prototype.toString;
                    for(let e in vm.newUserSelect){
                        let userSelect = vm.newUserSelect[e];
                        vm.inputTextData[e] = userSelect;
                        if(!Number.isInteger(userSelect) && getType.call(userSelect) != '[object Object]'){
                            let AttrChildId = userSelect.split(',');
                            vm.userSelectClass[e] = AttrChildId;
                            let AttrObj = {};
                            for(let key in AttrChildId){
                                let objKey = AttrChildId[key]
                                AttrObj[objKey] = true;
                            }
                            vm.allDataId[e] = AttrObj;
                        }else{
                            vm.userSelectClass[e] = userSelect;
                        }
                        vm.fatherIdData.push(e);
                    }
                    let nameString = {};
                    let notattrobj = {};
                    for(let j in vm.attrData){
                        let father_id = vm.attrData[j].id;
                        if(vm.userSelectClass[father_id]){
                            let childAttr = vm.attrData[j].child;
                            let userchild_id = vm.userSelectClass[father_id];
                            // console.log(userchild_id,"userchild_id");
                            if(userchild_id instanceof Array){
                                let childAttrId = '';
                                let noattr = [];
                                for(let s in userchild_id){
                                    for(let k in childAttr){
                                        if(userchild_id[s] == childAttr[k].id){
                                            noattr.push(childAttr[k].cate_name);
                                        }
                                    }
                                }
                                let css = noattr;
                                vm.userSelectTitleData[father_id] = css.join(' ');
                            }else{
                                for(let f in childAttr){
                                    let childAttrId = childAttr[f].id
                                    if(userchild_id == childAttrId){
                                        vm.userSelectTitleData[father_id] = childAttr[f].cate_name;
                                    }
                                }
                            }
                        }
                    }
                    console.log(vm.userSelectTitleData,"11111")
                }
            }else{
                Toast({
                    message: msg,
                    duration: 3000
                })
            }
        })
    },
    methods:{
        // 确认提交按钮
        submitBtn(){
            console.log('确认提交')
            let vm = this;
            console.log(vm.newUserSelect,"newUserSelect1111");
            console.log(vm.inputTextData,"vm.inputTextData")
            console.log(vm.minOriginalPrice,'unitUpDown')
            console.log(vm.promotionPricemin,'jiage')
            let data = {};
            if(vm.tabSelectType == 0){
                vm.goodsType = 3;
            }else{
                vm.goodsType = 1;
            }
            let priceTest = /^\d+(\.\d{1,2})?$/;

            if(!vm.publishData){
                vm.status = 0;
            }else{
                vm.status = 1;
            }

            if(!vm.recommendData){
                vm.is_recommend = 0;
            }else{
                vm.is_recommend = 1;
            }
            if(JSON.stringify(vm.inputTextData) != '{}'){
                for(let text in vm.inputTextData){
                    vm.newUserSelect[text] = vm.inputTextData[text];
                }
            }
            vm.newData = JSON.stringify(vm.newUserSelect);
            console.log(vm.newUserSelect,"newUserSelect");
            console.log(vm.newData,"newData");
            //先判断是什么类型的产品，1皮革、5聚氨酯/树脂、6表处、7色料、8助剂、9离型纸、10辊筒
            if(vm.navId == 1){
                // 验证 根据现货和尾货分别验证
                if(vm.tabSelectType == 0){
                    if(vm.imgWenLuSrc == ''){
                        Toast({
                            message: '纹路图片不能为空',
                            duration: 3000
                        })
                        return false
                    }else if(vm.fatherIdData == ''){
                        Toast({
                            message: '产品属性不能为空',
                            duration: 3000
                        })
                        return false
                    }else if(vm.fatherIdData != ''){
                        for(let i in vm.attrData){
                            let fatherid =  vm.fatherIdData[i];
                            if(fatherid != vm.attrData[i].id && fatherid == undefined && vm.attrData[i].is_required == 1){
                                let name_data = vm.attrData[i].cate_name;
                                Toast({
                                    message: name_data +'属性不能为空',
                                    duration: 3000
                                })
                                return false
                            }
                        }
                    }
                    if(vm.unitUpDown == ''){
                        Toast({
                            message: '请选择价格单位',
                            duration: 3000
                        })
                        return false
                    }else if(vm.minOriginalPrice == ''){
                        console.log('kong')
                        Toast({
                            message: '请输入原价',
                            duration: 3000
                        })
                        return false
                    }else if(!priceTest.test(vm.minOriginalPrice)){
                        Toast({
                            message: '价格只能输入2位小数',
                            duration: 3000
                        })
                        return false
                    }else if(vm.minOriginalPrice > 999.99){
                        Toast({
                            message: '设置价格不能大于999.99',
                            duration: 3000
                        })
                        return false
                    }else if(vm.promotionPricemin == ''){
                        Toast({
                            message: '请输入促销价',
                            duration: 3000
                        })
                        return false
                    }else if(vm.promotionPricemin > 999.99){
                        Toast({
                            message: '设置价格不能大于999.99',
                            duration: 3000
                        })
                        return false
                    }else if(!priceTest.test(vm.promotionPricemin)){
                        Toast({
                            message: '价格只能输入2位小数',
                            duration: 3000
                        })
                        return false
                    }else if(Number(vm.promotionPricemin) > Number(vm.minOriginalPrice)){
                        Toast({
                            message: '促销价不能大于原价',
                            duration: 3000
                        })
                        return false
                    }else if(vm.numberData == ''){
                        Toast({
                            message: '请输入商品数量',
                            duration: 3000
                        })
                        return false
                    }else if(!/^\d+$/.test(vm.numberData)){
                        Toast({
                            message: '数量格式不正确，请输入整数',
                            duration: 3000
                        })
                        return false
                    }else if(vm.goodsTitle == ''){
                        Toast({
                            message: '请输入产品标题',
                            duration: 3000
                        })
                        return false
                    }else if(vm.timerUpDown == ''){
                        Toast({
                            message: '请选择发货期限',
                            duration: 3000
                        })
                        return false
                    }else if (vm.imgCode == ''){
                        Toast({
                            message: '请输入图片验证码',
                            duration: 3000
                        })
                        return false
                    }
                    data = {
                        goods_id:vm.goodsIdData,
                        goods_name:vm.goodsTitle,
                        shop_cate:vm.storClassUpDown,
                        sku_price_id:vm.unitUpDown,
                        count:vm.numberData,
                        main_img:vm.imgWenLuSrc,
                        img_other:vm.moreImgData,
                        is_invoice:vm.is_invoice,
                        is_recommend:vm.is_recommend,
                        captcha_src:vm.imgCode,
                        standard:vm.colorCodeData,
                        delivery_date:vm.timerUpDown,
                        goods_type:vm.goodsType,
                        status:vm.status,
                        nav_id:vm.navId,
                        goods_cate:vm.newData,
                        min_price:vm.promotionPricemin,
                        max_price:vm.promotionPricemax,
                        min_cost_price:vm.minOriginalPrice,
                        max_cost_price:vm.maxOriginalPrice,
                        goods_code:vm.articleNumber
                    }
                }else{
                    if(vm.imgWenLuSrc == ''){
                        Toast({
                            message: '纹路图片不能为空',
                            duration: 3000
                        })
                        return false
                    }else if(vm.fatherIdData == ''){
                        Toast({
                            message: '产品属性不能为空',
                            duration: 3000
                        })
                        return false
                    }else if(vm.fatherIdData != ''){
                        for(let i in vm.attrData){
                            let fatherid =  vm.fatherIdData[i];
                            if(fatherid != vm.attrData[i].id && fatherid == undefined && vm.attrData[i].is_required == 1){
                                let name_data = vm.attrData[i].cate_name;
                                Toast({
                                    message: name_data +'属性不能为空',
                                    duration: 3000
                                })
                                return false
                            }
                        }
                    }
                    if(vm.unitUpDown == ''){
                        Toast({
                            message: '请选择价格单位',
                            duration: 3000
                        })
                        return false
                    }else if(vm.childStandarData == ''){
                        Toast({
                            message: '请编辑产品规格',
                            duration: 3000
                        })
                        return false
                    }else if(vm.goodsTitle == ''){
                        Toast({
                            message: '请输入产品标题',
                            duration: 3000
                        })
                        return false
                    }else if(vm.timerUpDown == ''){
                        Toast({
                            message: '请选择发货期限',
                            duration: 3000
                        })
                        return false
                    }
                    data = {
                        goods_id:vm.goodsIdData,
                        goods_name:vm.goodsTitle,
                        shop_cate:vm.storClassUpDown,
                        sku_price_id:vm.unitUpDown,
                        count:vm.numberData,
                        main_img:vm.imgWenLuSrc,
                        img_other:vm.moreImgData,
                        is_invoice:vm.is_invoice,
                        is_recommend:vm.is_recommend,
                        captcha_src:vm.imgCode,
                        standard:vm.colorCodeData,
                        delivery_date:vm.timerUpDown,
                        goods_type:vm.goodsType,
                        status:vm.status,
                        nav_id:vm.navId,
                        goods_cate:vm.newData,
                        standard:vm.childStandarData,
                        goods_code:vm.articleNumber,
                        save_data:vm.standardObj.saveData
                    }
                }
            }else if(vm.navId == 5){
                if(vm.imgWenLuSrc == ''){
                    Toast({
                        message: '产品主图不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.fatherIdData == ''){
                    Toast({
                        message: '产品属性不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.fatherIdData != ''){
                    for(let i in vm.attrData){
                        let fatherid =  vm.fatherIdData[i];
                        if(fatherid != vm.attrData[i].id && fatherid == undefined && vm.attrData[i].is_required == 1){
                            let name_data = vm.attrData[i].cate_name;
                            Toast({
                                message: name_data +'属性不能为空',
                                duration: 3000
                            })
                            return false
                        }
                    }
                }
                if(vm.unitUpDown == ''){
                    Toast({
                        message: '请选择价格单位',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice == ''){
                    Toast({
                        message: '请输入原价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.minOriginalPrice)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin == ''){
                    Toast({
                        message: '请输入促销价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.promotionPricemin)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(Number(vm.promotionPricemin) > Number(vm.minOriginalPrice)){
                    Toast({
                        message: '促销价不能大于原价',
                        duration: 3000
                    })
                    return false
                }else if(vm.numberData == ''){
                    Toast({
                        message: '请输入商品数量',
                        duration: 3000
                    })
                    return false
                }else if(!/^\d+$/.test(vm.numberData)){
                    Toast({
                        message: '数量格式不正确，请输入整数',
                        duration: 3000
                    })
                    return false
                }else if(vm.goodsTitle == ''){
                    Toast({
                        message: '请输入产品标题',
                        duration: 3000
                    })
                    return false
                }else if(vm.timerUpDown == ''){
                    Toast({
                        message: '请选择发货期限',
                        duration: 3000
                    })
                    return false
                }
                data = {
                    goods_id:vm.goodsIdData,
                    goods_name:vm.goodsTitle,
                    shop_cate:vm.storClassUpDown,
                    sku_price_id:vm.unitUpDown,
                    count:vm.numberData,
                    main_img:vm.imgWenLuSrc,
                    img_other:vm.moreImgData,
                    is_invoice:vm.is_invoice,
                    is_recommend:vm.is_recommend,
                    captcha_src:vm.imgCode,
                    standard:vm.colorCodeData,
                    delivery_date:vm.timerUpDown,
                    goods_type:vm.goodsType,
                    status:vm.status,
                    nav_id:vm.navId,
                    goods_cate:vm.newData,
                    min_price:vm.promotionPricemin,
                    max_price:vm.promotionPricemax,
                    min_cost_price:vm.minOriginalPrice,
                    max_cost_price:vm.maxOriginalPrice,
                    goods_code:vm.articleNumber
                }
            }else if(vm.navId == 6){
                if(vm.imgWenLuSrc == ''){
                    Toast({
                        message: '产品主图不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.fatherIdData == ''){
                    Toast({
                        message: '产品属性不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.unitUpDown == ''){
                    Toast({
                        message: '请选择价格单位',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice == ''){
                    Toast({
                        message: '请输入原价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.minOriginalPrice)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin == ''){
                    Toast({
                        message: '请输入促销价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.promotionPricemin)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(Number(vm.promotionPricemin) > Number(vm.minOriginalPrice)){
                    Toast({
                        message: '促销价不能大于原价',
                        duration: 3000
                    })
                    return false
                }else if(vm.numberData == ''){
                    Toast({
                        message: '请输入商品数量',
                        duration: 3000
                    })
                    return false
                }else if(!/^\d+$/.test(vm.numberData)){
                    Toast({
                        message: '数量格式不正确，请输入整数',
                        duration: 3000
                    })
                    return false
                }else if(vm.goodsTitle == ''){
                    Toast({
                        message: '请输入产品标题',
                        duration: 3000
                    })
                    return false
                }else if(vm.timerUpDown == ''){
                    Toast({
                        message: '请选择发货期限',
                        duration: 3000
                    })
                    return false
                }
                data = {
                    goods_id:vm.goodsIdData,
                    goods_name:vm.goodsTitle,
                    shop_cate:vm.storClassUpDown,
                    sku_price_id:vm.unitUpDown,
                    count:vm.numberData,
                    main_img:vm.imgWenLuSrc,
                    img_other:vm.moreImgData,
                    is_invoice:vm.is_invoice,
                    is_recommend:vm.is_recommend,
                    captcha_src:vm.imgCode,
                    standard:vm.colorCodeData,
                    delivery_date:vm.timerUpDown,
                    goods_type:vm.goodsType,
                    status:vm.status,
                    nav_id:vm.navId,
                    goods_cate:vm.newData,
                    min_price:vm.promotionPricemin,
                    max_price:vm.promotionPricemax,
                    min_cost_price:vm.minOriginalPrice,
                    max_cost_price:vm.maxOriginalPrice,
                    goods_code:vm.articleNumber
                }
            }else if(vm.navId == 7){
                if(vm.imgWenLuSrc == ''){
                    Toast({
                        message: '产品主图不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.fatherIdData == ''){
                    Toast({
                        message: '产品属性不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.unitUpDown == ''){
                    Toast({
                        message: '请选择价格单位',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice == ''){
                    Toast({
                        message: '请输入原价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.minOriginalPrice)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin == ''){
                    Toast({
                        message: '请输入促销价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.promotionPricemin)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(Number(vm.promotionPricemin) > Number(vm.minOriginalPrice)){
                    Toast({
                        message: '促销价不能大于原价',
                        duration: 3000
                    })
                    return false
                }else if(vm.numberData == ''){
                    Toast({
                        message: '请输入商品数量',
                        duration: 3000
                    })
                    return false
                }else if(!/^\d+$/.test(vm.numberData)){
                    Toast({
                        message: '数量格式不正确，请输入整数',
                        duration: 3000
                    })
                    return false
                }else if(vm.goodsTitle == ''){
                    Toast({
                        message: '请输入产品标题',
                        duration: 3000
                    })
                    return false
                }else if(vm.timerUpDown == ''){
                    Toast({
                        message: '请选择发货期限',
                        duration: 3000
                    })
                    return false
                }
                data = {
                    goods_id:vm.goodsIdData,
                    goods_name:vm.goodsTitle,
                    shop_cate:vm.storClassUpDown,
                    sku_price_id:vm.unitUpDown,
                    count:vm.numberData,
                    main_img:vm.imgWenLuSrc,
                    img_other:vm.moreImgData,
                    is_invoice:vm.is_invoice,
                    is_recommend:vm.is_recommend,
                    captcha_src:vm.imgCode,
                    standard:vm.colorCodeData,
                    delivery_date:vm.timerUpDown,
                    goods_type:vm.goodsType,
                    status:vm.status,
                    nav_id:vm.navId,
                    goods_cate:vm.newData,
                    min_price:vm.promotionPricemin,
                    max_price:vm.promotionPricemax,
                    min_cost_price:vm.minOriginalPrice,
                    max_cost_price:vm.maxOriginalPrice,
                    goods_code:vm.articleNumber
                }
            }else if(vm.navId == 8){
                if(vm.imgWenLuSrc == ''){
                    Toast({
                        message: '产品主图不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.fatherIdData == ''){
                    Toast({
                        message: '产品属性不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.unitUpDown == ''){
                    Toast({
                        message: '请选择价格单位',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice == ''){
                    Toast({
                        message: '请输入原价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.minOriginalPrice)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin == ''){
                    Toast({
                        message: '请输入促销价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.promotionPricemin)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(Number(vm.promotionPricemin) > Number(vm.minOriginalPrice)){
                    Toast({
                        message: '促销价不能大于原价',
                        duration: 3000
                    })
                    return false
                }else if(vm.numberData == ''){
                    Toast({
                        message: '请输入商品数量',
                        duration: 3000
                    })
                    return false
                }else if(!/^\d+$/.test(vm.numberData)){
                    Toast({
                        message: '数量格式不正确，请输入整数',
                        duration: 3000
                    })
                    return false
                }else if(vm.goodsTitle == ''){
                    Toast({
                        message: '请输入产品标题',
                        duration: 3000
                    })
                    return false
                }else if(vm.timerUpDown == ''){
                    Toast({
                        message: '请选择发货期限',
                        duration: 3000
                    })
                    return false
                }
                data = {
                    goods_id:vm.goodsIdData,
                    goods_name:vm.goodsTitle,
                    shop_cate:vm.storClassUpDown,
                    sku_price_id:vm.unitUpDown,
                    count:vm.numberData,
                    main_img:vm.imgWenLuSrc,
                    img_other:vm.moreImgData,
                    is_invoice:vm.is_invoice,
                    is_recommend:vm.is_recommend,
                    captcha_src:vm.imgCode,
                    standard:vm.colorCodeData,
                    delivery_date:vm.timerUpDown,
                    goods_type:vm.goodsType,
                    status:vm.status,
                    nav_id:vm.navId,
                    goods_cate:vm.newData,
                    min_price:vm.promotionPricemin,
                    max_price:vm.promotionPricemax,
                    min_cost_price:vm.minOriginalPrice,
                    max_cost_price:vm.maxOriginalPrice,
                    goods_code:vm.articleNumber
                }
            }else if(vm.navId == 9){

                if(vm.imgWenLuSrc == ''){
                    Toast({
                        message: '产品主图不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.fatherIdData == ''){
                    Toast({
                        message: '产品属性不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.unitUpDown == ''){
                    Toast({
                        message: '请选择价格单位',
                        duration: 3000
                    })
                    return false
                }else if(vm.goodsTitle == ''){
                    Toast({
                        message: '请输入产品标题',
                        duration: 3000
                    })
                    return false
                }else if(vm.timerUpDown == ''){
                    Toast({
                        message: '请选择发货期限',
                        duration: 3000
                    })
                    return false
                }
                data = {
                    goods_id:vm.goodsIdData,
                    goods_name:vm.goodsTitle,
                    shop_cate:vm.storClassUpDown,
                    sku_price_id:vm.unitUpDown,
                    count:vm.numberData,
                    main_img:vm.imgWenLuSrc,
                    img_other:vm.moreImgData,
                    is_invoice:vm.is_invoice,
                    is_recommend:vm.is_recommend,
                    captcha_src:vm.imgCode,
                    standard:vm.colorCodeData,
                    delivery_date:vm.timerUpDown,
                    goods_type:vm.goodsType,
                    status:vm.status,
                    nav_id:vm.navId,
                    standard:vm.childStandarData,
                    goods_cate:vm.newData,
                    min_price:vm.promotionPricemin,
                    max_price:vm.promotionPricemax,
                    min_cost_price:vm.minOriginalPrice,
                    max_cost_price:vm.maxOriginalPrice,
                    goods_code:vm.articleNumber
                }
            }else if(vm.navId == 10){
                if(vm.imgWenLuSrc == ''){
                    Toast({
                        message: '产品主图不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.fatherIdData == ''){
                    Toast({
                        message: '产品属性不能为空',
                        duration: 3000
                    })
                    return false
                }else if(vm.fatherIdData != ''){
                    for(let i in vm.attrData){
                        let fatherid =  vm.fatherIdData[i];
                        if(fatherid != vm.attrData[i].id && fatherid == undefined && vm.attrData[i].is_required == 1){
                            let name_data = vm.attrData[i].cate_name;
                            Toast({
                                message: name_data +'属性不能为空',
                                duration: 3000
                            })
                            return false
                        }
                    }
                }
                if(vm.unitUpDown == ''){
                    Toast({
                        message: '请选择价格单位',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice == ''){
                    Toast({
                        message: '请输入原价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.minOriginalPrice)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.minOriginalPrice > 999.99){
                    Toast({
                        message: '设置价格不能大于999.99',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin == ''){
                    Toast({
                        message: '请输入促销价',
                        duration: 3000
                    })
                    return false
                }else if(!priceTest.test(vm.promotionPricemin)){
                    Toast({
                        message: '价格只能输入2位小数',
                        duration: 3000
                    })
                    return false
                }else if(vm.promotionPricemin > 999.99){
                        Toast({
                            message: '设置价格不能大于999.99',
                            duration: 3000
                        })
                        return false
                }else if(Number(vm.promotionPricemin) > Number(vm.minOriginalPrice)){
                    Toast({
                        message: '促销价不能大于原价',
                        duration: 3000
                    })
                    return false
                }else if(vm.numberData == ''){
                    Toast({
                        message: '请输入商品数量',
                        duration: 3000
                    })
                    return false
                }else if(!/^\d+$/.test(vm.numberData)){
                    Toast({
                        message: '数量格式不正确，请输入整数',
                        duration: 3000
                    })
                    return false
                }else if(vm.goodsTitle == ''){
                    Toast({
                        message: '请输入产品标题',
                        duration: 3000
                    })
                    return false
                }else if(vm.timerUpDown == ''){
                    Toast({
                        message: '请选择发货期限',
                        duration: 3000
                    })
                    return false
                }
                data = {
                    goods_id:vm.goodsIdData,
                    goods_name:vm.goodsTitle,
                    shop_cate:vm.storClassUpDown,
                    sku_price_id:vm.unitUpDown,
                    count:vm.numberData,
                    main_img:vm.imgWenLuSrc,
                    img_other:vm.moreImgData,
                    is_invoice:vm.is_invoice,
                    is_recommend:vm.is_recommend,
                    captcha_src:vm.imgCode,
                    standard:vm.colorCodeData,
                    delivery_date:vm.timerUpDown,
                    goods_type:vm.goodsType,
                    status:vm.status,
                    nav_id:vm.navId,
                    goods_cate:vm.newData,
                    min_price:vm.promotionPricemin,
                    max_price:vm.promotionPricemax,
                    min_cost_price:vm.minOriginalPrice,
                    max_cost_price:vm.maxOriginalPrice,
                    goods_code:vm.articleNumber
                }
            }

            Indicator.open({
                spinnerType: 'fading-circle'
            })
            vm.$http.post('goods/new_release_request?device=wechat',qs.stringify(data),vm.$token).then((req)=>{
                Indicator.close()
                console.log(req);
                let code = req.data.error_code;
                let msg = req.data.data;
                if(code == 200){
                    Toast({
                        message:'发布成功',
                        duration:3000
                    })
                    vm.$router.push({path:'/sell/myproductlist'})
                }else{
                    Toast({
                        message:msg,
                        duration:3000
                    })
                    vm.imgCodeBtn();
                }
            })
        },
        // tab 切换
        tabSelectBtn(index){
            window.scroll(0,0);
            let vm = this;
            if(index == 0){
                vm.goodsTypeStatus = 3;
            }else{
                vm.goodsTypeStatus = 1;
            }
            vm.tabSelectType = index;
            vm.$store.state.uploadStatus=index
            vm.selectData = [],           
            vm.fatherId = 0;
            vm.fatherIdData = [];
            vm.userSelectClass = {};              
            vm.newUserSelect = {};               
            vm.newData = "";                   
            vm.userSelectId = {};              
            vm.user_select_id = [];
            vm.userSelectTitleData = {};            
            vm.userSelectTitle = [];
            vm.checkSelect = ['-1'];
            vm.timerTitleData = '7天内';     
            vm.timerUpDown = '8';                  // * 时间数据的id，并在提交时传给后端
            vm.storClassUpDown = '';                // * 店铺分类数据的id，并在提交时传给后端
            vm.storTitleData = '';                  // 店铺分类title
            vm.unitSelectLayer = false;            // 控制单位弹层
            vm.classSelectLayer = false;            // 控制分类弹层
            vm.timerSelectLayer = false;            // 控制时间弹层
            vm.goodsIdData = '';                    // * goodsid 编辑商品时会有

            vm.allDataId = {};                      // 用父ID做key，子ID做数组的形式，根据用户选择之后在次点击进来之后同样有文字高亮，（多选用）
            vm.blueId = {};                         // 文字高亮用

            // 图片
            vm.imgWenLuSrc = '';                    // * 存放纹路图片
            vm.moreImgData = [];                    // * 其他图片数组

            // 尾货字段
            vm.promotionPricemax = '';              // * 促销价max
            vm.promotionPricemin = '';              // * 促销价mix
            vm.minOriginalPrice = '';               // * 原价min
            vm.maxOriginalPrice = '';               // * 原价max
            vm.numberData = '';                     // * 数量

            // 现货字段
            vm.goodsTitle = '';                     // * 产品标题
            vm.articleNumber = '';                  // * 商家货号
            vm.recommendData = true;               // 是否推荐，默认false
            vm.publishData = true;                  // 是否上架，默认false
            vm.imgSrcData = '';                     // 图片验证码图片地址
            vm.imgCode = '';                        // * 图片验证码
            vm.colorCodeData = [];                  // * 色号 用户所编辑的
            vm.is_invoice = 0;                      // * 发票预留字段  默认0
            vm.goodsType = 3;                       // * 尾货是3 现货1
            vm.status = 1;                          // * 是否上架，尾货默认上架 传1  0是不上架
            vm.is_recommend = 0;                    // * 是否推荐，1是，0否

            // 产品规格弹层
            vm.standardStatus = 0;                  // 控制弹层显示与隐藏
            vm.standardObj = {
                standardData:[],                    // 产品规格数据
                saveData:[],                        // 产品规格二维数组
                editStandard:[],                    // 编辑参数
            };

            vm.childStandarData = [];               // 子组件传过来用户选择的数据

            // 离型纸
            vm.inputTextData = {};                   // 输入框内容


            // 重新请求接口
            Indicator.open({
            spinnerType: 'fading-circle'
            })
            vm.$http.get(`goods/new_release?device=wechat&nav_id=${vm.navId}&goods_id=${vm.goodsIdData}&goods_type=${vm.goodsTypeStatus}`,vm.$token).then((req)=>{
                console.log(req,'发布商品接口');
                let code = req.data.error_code;
                let msg = req.data.error_data;
                if(code == 200 ){
                    vm.attrData = req.data.data.goods_cate;
                    vm.unitSelectData = req.data.data.goods_sku;
                    vm.timerSelecrtData = req.data.data.delivery_date;
                    vm.storClassData = req.data.data.shop_cate_list;
                    vm.isSkuData = req.data.data.has_sku;
                    vm.standardObj.standardData = Object.assign([],req.data.data.nav_sku_attr);
                    // 获取图片验证码
                    vm.imgSrcData = `${vm.$imgCode}match/captcha`
                    for(let a in vm.attrData){
                        let id = vm.attrData[a].id;
                        let name = vm.attrData[a].cate_name;
                        let is_required = vm.attrData[a].is_required;
                        if(is_required == 1){
                            vm.newObjData[id] = name;
                        }
                    }
                    // 默认单位
                    let unitDefaultId = req.data.data.default_sku_id;
                    for(let unitindex in vm.unitSelectData){
                        let unitId = vm.unitSelectData[unitindex].id;
                        if(unitId == unitDefaultId){
                            vm.unitUpDown = unitDefaultId;
                            vm.unitTitleData = vm.unitSelectData[unitindex].name;
                        }
                    }
                    Indicator.close()
                    if(vm.editStatus == 1){
                        vm.imgWenLuSrc = req.data.data.goods.main_img;
                        vm.moreImgData = req.data.data.goods.img_other;
                        vm.promotionPricemax = req.data.data.goods.max_price;
                        vm.promotionPricemin = req.data.data.goods.min_price;
                        vm.minOriginalPrice = req.data.data.goods.min_cost_price;
                        vm.maxOriginalPrice = req.data.data.goods.max_cost_price;
                        vm.numberData = req.data.data.goods.count;
                        vm.goodsTitle = req.data.data.goods.goods_name;
                        vm.unitUpDown = req.data.data.goods.sku_price_id;
                        vm.articleNumber = req.data.data.goods.goods_code;
                        let isInvoice = req.data.data.goods.is_invoice;
                        let standard = req.data.data.goods.standard;
                        vm.standardObj.editStandard = standard;
                        if(isInvoice == 1){
                            vm.is_invoice = true;
                        }else{
                            vm.is_invoice = false;
                        }
                        vm.timerUpDown = req.data.data.goods.delivery_date;
                        vm.unitUpDown = req.data.data.goods.sku_price_id;
                        vm.storClassUpDown = req.data.data.goods.shop_cate;
                        for(let stor of vm.storClassData){
                            if(stor.shop_cate_id == vm.storClassUpDown){
                                vm.storTitleData = stor.name;
                            }
                        }
                        for(let unit of vm.unitSelectData){
                            if(unit.id == vm.unitUpDown){
                                vm.unitTitleData =unit.name;
                            }
                        }
                        for(let time of vm.timerSelecrtData){
                            if(time.delivery_date_id == vm.timerUpDown){
                                vm.timerTitleData = time.name;
                            }
                        }
                        let recommend = req.data.data.goods.is_recommend;
                        if(recommend == 1){
                            vm.recommendData = true;
                        }else{
                            vm.recommendData = false;
                        }
                        vm.colorCodeData = req.data.data.goods.standard;
                        vm.timerUpDown = req.data.data.goods.delivery_date;
                        vm.newData = req.data.data.goods.goods_cate;
                        vm.childStandarData = req.data.data.goods.standard;
                        let statusData = req.data.data.goods.status;
                        if(statusData == 1){
                            vm.publishData = true;
                        }else{
                            vm.publishData = false;
                        }
                        vm.newUserSelect = JSON.parse(vm.newData);
                        for(let e in vm.newUserSelect){
                            let userSelect = vm.newUserSelect[e];
                            vm.inputTextData[e] = userSelect;
                            if(!Number.isInteger(userSelect)){
                                let AttrChildId = userSelect.split(',');
                                vm.userSelectClass[e] = AttrChildId;
                            }else{
                                vm.userSelectClass[e] = userSelect;
                            }
                            vm.fatherIdData.push(e);
                        }
                        let nameString = {}
                        for(let j in vm.attrData){
                            let father_id = vm.attrData[j].id;
                            if(vm.userSelectClass[father_id]){
                                let childAttr = vm.attrData[j].child;
                                let userchild_id = vm.userSelectClass[father_id];
                                if(userchild_id instanceof Array){
                                    let childAttrId = '';
                                    for(let s in childAttr){
                                        childAttrId = childAttr[s].id
                                        let noattr = [];
                                        for(let k in userchild_id){
                                            if(childAttrId == userchild_id[k]){
                                                nameString[father_id] += childAttr[s].cate_name;
                                                for(let name in nameString){
                                                    let aString = nameString[name]
                                                    let setString = aString.substr(9)
                                                    vm.userSelectTitleData[father_id] = setString;
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    for(let f in childAttr){
                                        let childAttrId = childAttr[f].id
                                        if(userchild_id == childAttrId){
                                            vm.userSelectTitleData[father_id] = childAttr[f].cate_name;
                                        }
                                    }
                                }
                            }
                        }
                        
                    }
                }else{
                    Toast({
                        message: msg,
                        duration: 3000
                    })
                }
            })
        },
        // 图片验证码刷新按钮
        imgCodeBtn(){
            this.imgSrcData = this.imgSrcData + '?1'
        },
        // 获取子组件传来的数据
        getWenImg (data) {
            if(data.imageUrl){
                this.imgWenLuSrc = data.imageUrl
            }
        },
        getOtherImg (data) {
            if (data.imageUrl) {
                this.moreImgData.push(data.imageUrl)
            }
        },
        // 删除纹路图片
        delWenLuImg(){
            this.imgWenLuSrc = '';
        },
        // 删除其他图片
        delImg(index){
            this.moreImgData.splice(index,1);
        },
        // scrollY 定位的方法
        goScrollY(){
            setTimeout(() => {
                window.scroll(0,this.scorllYData);
            }, 100);
        },
        // 打开选择弹层，并根据id 渲染对应的数据
        goSelectBtn(id,flag,cate_name){
            let vm = this;
            console.log(vm.userSelectTitleData,"vm.userSelectTitleData")
            console.log(vm.newUserSelect,"vm.newUserSelect");
            vm.scorllYData = window.scrollY;
            vm.selectTitleData = cate_name;
            vm.selectStatus = true;
            vm.srcollStatus = true;
            vm.fatherId = id;
            vm.fatherIdData.push(vm.fatherId);
            vm.flagStatus = flag;
            vm.userSelectTitle = [];
            vm.userSelectId = {};
            vm.user_select_id = [];
            if(JSON.stringify(vm.allDataId) != "{}" && vm.allDataId[vm.fatherId] != undefined){
                vm.blueId = vm.allDataId[vm.fatherId];
                vm.userSelectId = vm.allDataId[vm.fatherId];
                let titleArr = vm.userSelectTitleData[vm.fatherId].split(' ');
                let idArr = vm.newUserSelect[vm.fatherId].split(',');
                vm.user_select_id = idArr;
                vm.userSelectTitle = titleArr;
            }
            if(JSON.stringify(vm.userSelectClass) == "{}"){
                vm.checkSelect = ['-1'];
            }else if(vm.userSelectClass[id]){
                vm.checkSelect = vm.userSelectClass[id];
            }else{
                vm.checkSelect = ['-1'];
            }
            for(let i = 0; i < vm.attrData.length; i++){
                if(vm.attrData[i].id == id){
                    vm.selectData = vm.attrData[i].child;
                }
            }
            if(vm.editStatus == 1){
                let userTitle = vm.userSelectTitleData[vm.fatherId];
                vm.user_select_id = vm.userSelectClass[vm.fatherId];
                vm.userSelectTitle = userTitle.split(' ');
            }
        },
        // 子菜单选择的事件
        childSelect(id,cate_name){
            let vm = this;
            // vm.flagStatus 等于0是单选
            console.log(id,"child_id");
            console.log(vm.userSelectId,"userSelectId");
            if(!vm.userSelectId[id]){
                if( vm.flagStatus == 0){
                    vm.userSelectClass[vm.fatherId] = id;
                    vm.userSelectTitleData[vm.fatherId] = cate_name;
                    vm.newUserSelect[vm.fatherId] = id;
                    vm.inputTextData = vm.newUserSelect;
                    vm.selectStatus = false;
                    vm.srcollStatus = false;
                    vm.goScrollY();
                }else{
                    if(vm.user_select_id.length != 10){
                        vm.$set(vm.userSelectId,id,true);      // set方法  用来更新view层
                        vm.user_select_id.push(id);
                        vm.userSelectTitle.push(cate_name);
                        let stringTitle = vm.userSelectTitle.join(' ');
                        let stringid = vm.user_select_id.join(',');
                        vm.newUserSelect[vm.fatherId] = stringid;
                        vm.inputTextData[vm.fatherId] = stringid;
                        vm.allDataId[vm.fatherId] = vm.userSelectId;
                        vm.blueId = vm.userSelectId;
                        vm.userSelectClass[vm.fatherId] = vm.userSelectId;
                        vm.userSelectTitleData[vm.fatherId] = stringTitle;
                    }else{
                        Toast({
                            message: '多选属性最多10个',
                            duration: 3000
                        })
                        vm.userSelectId[id] = false;
                    }
                }
            }else{
                vm.$set(vm.userSelectId,id,false);
                for(let i in vm.user_select_id){
                    console.log(vm.user_select_id,"user_select_id");
                    let user_select = vm.user_select_id[i];
                    console.log(user_select,"user_select");
                    if(user_select == id){
                        vm.user_select_id.splice(i,1);
                        console.log(vm.user_select_id,'del_id');
                        vm.userSelectTitle.splice(i,1);
                        console.log(vm.userSelectTitle,'del_title');
                        let stringid = vm.user_select_id.join(',');
                        let stringTitle = vm.userSelectTitle.join(' ');
                        vm.newUserSelect[vm.fatherId] = stringid;
                        vm.inputTextData[vm.fatherId] = stringid;
                        vm.userSelectTitleData[vm.fatherId] = stringTitle;
                    }
                }
            }
            // console.log(vm.blueId,'blueId child');
            // console.log(vm.inputTextData,"vm.inputTextData")
            // console.log(vm.userSelectClass,'userSelectClass child');
            // console.log(vm.newUserSelect,'newUserSelect child');
        },
        // 子菜单选择退出事件
        selectBackBtn(){
            let vm = this;
            vm.user_select_id = [];
            vm.userSelectId = {};
            vm.blueId = {};
            vm.selectStatus = false;
            vm.srcollStatus = false;
            vm.goScrollY();
        },
        // 子菜单确定按钮
        selectSubmit(){
            let vm = this;
            if(JSON.stringify(vm.userSelectClass[vm.fatherId]) != '{}'){
                let stringTitle = vm.userSelectTitle.join(' ');
                vm.userSelectClass[vm.fatherId] = vm.user_select_id;
                vm.userSelectTitleData[vm.fatherId] = stringTitle;
                vm.selectStatus = false;
                vm.srcollStatus = false;
                vm.goScrollY();
            }else{
                Toast({
                    message:'最少选择一个属性',
                    duration: 3000
                })
            }
        },
        // 发货期限、单位、店铺分类的弹层控制及数据渲染，index 取值 1是单位、2是店铺分类、3是发货期限
        moreBtn(index){
            let vm = this;
            vm.scorllYData = window.scrollY;
            vm.srcollStatus = true;
            if(index == 1){
                vm.unitSelectLayer = true;
            }else if(index == 2){
                vm.classSelectLayer = true;
            }else if(index == 3){
                vm.timerSelectLayer = true;
            }
        },
        // 发货期限、单位、店铺分类的弹层子点击事件 index 取值 1是单位、2是店铺分类、3是发货期限
        moreChildSelect(index,id,name){
            let vm = this;
            if(index == 1){
                vm.unitUpDown = id;
                vm.unitTitleData = name;
                vm.unitSelectLayer = false;
            }else if(index == 2 ){
                vm.storClassUpDown = id;
                vm.storTitleData = name;
                vm.classSelectLayer = false;
            }else if(index == 3 ){
                vm.timerTitleData= name;
                vm.timerUpDown = id;
                vm.timerSelectLayer = false;
            }
            vm.srcollStatus = false;
            vm.goScrollY();
        },
        // 发货期限、单位、店铺分类的弹层的退出按钮  index 取值 1是单位、2是店铺分类、3是发货期限
        moreBackBtn(index){
            let vm = this;
            if(index == 1){
                vm.unitSelectLayer = false;
            }else if(index == 2 ){
                vm.classSelectLayer = false;
            }else if(index == 3 ){
                vm.timerSelectLayer = false;
            }
            vm.srcollStatus = false;
            vm.goScrollY();
        },
        // 产品规格按钮事件
        goodsStandard(){
            this.standardStatus = 1;
            this.srcollStatus = true;
            this.scorllYData = window.scrollY;
        },
        // 监听子组件传参
        productBtn(data){
            console.log(data.saveData,"saveData");
            let vm = this;
            vm.standardObj.editStandard = [];
            let primaryData = data.sandard;
            vm.childStandarData = data.sandard;
            vm.standardObj.saveData = data.saveData;
            vm.standardStatus = data.layerData;
            if(data.layerData == 0){
                vm.srcollStatus = false;
                vm.goScrollY();
            }
            // let newData = [];
            // let nullData = [];
            // for(let primaryIndex in primaryData){
            //     let primary = primaryData[primaryIndex];
            //     for(let keys in primary){
            //         console.log(primary,'primary')
            //         if(keys != 'color_number' && keys != 'price' && keys != 'goods_sku_id'){
            //             newData.push(primary);
            //             console.log(newData,'newdata')
            //             if(newData.length == 1){
            //                 nullData.push(newData);
            //                 console.log(nullData,'nulldata')
            //             }
            //         }else{
            //             nullData.push(primary);
            //         }
            //     }
            // }
            // vm.standardObj.editStandard = nullData[0][0];
            // console.log(vm.standardObj.editStandard,'editStandard');
        }
    },
    components:{
        TitleHeader,
        Button,
        ProductSandard,
        Upload
    }
}
</script>
