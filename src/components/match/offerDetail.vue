<template>
    <div class="content">
        <TitleHead :title="pageTitle"></TitleHead>
        <div class="offer_detail" v-if="offerDetail">
            <ImageSwiper :close="previewPhoto" @preview='previewStatus' :img="imgList"></ImageSwiper>
            <div class="offer_status offer_fail" v-if="offerDetail.status==3&&offerDetail.source==1">
                <strong>未中标</strong>
                祝您下次成功~~
            </div>
            <div class="offer_status offer_wait" v-if="offerDetail.status==1&&offerDetail.source==1">
                <strong>待确认</strong>
                请耐心等待，买家正在确认中~~
            </div>
            <div class="offer_status offer_get" v-if="offerDetail.status==2&&offerDetail.source==1">
                <strong>已中标</strong>
                请及时跟进确认订单~~
            </div>
            <div class="offer_detail_info">
                <h4>报价信息</h4>
                <div class="offer_detail_get" v-if="offerDetail.status==2&&offerDetail.source==1">
                    <img src="../../assets/images/match/offer_02.png" alt="">
                </div>
                <div class="offer_detail_fail" v-if="offerDetail.status==3&&offerDetail.source==1">
                    <img src="../../assets/images/match/offer_01.png" alt="">
                </div>
                <div class="offer_detail_wait" v-if="offerDetail.status==1&&offerDetail.source==1">
                    <img src="../../assets/images/match/offer_03.png" alt="">
                </div>
                <div class="price">
                    <div class="left">
                        <i class="iconfont">&#xe638;</i>
                        单价
                    </div>
                    <span>{{offerDetail.price}}/{{offerDetail.sku_name}}</span>
                </div>
                <div class="address">
                    <div class="left">
                        <i class="iconfont">&#xe616;</i>
                        产地
                    </div>
                    <span>{{offerDetail.product_name}}</span>
                </div>
                <div class="time">
                    <div class="left">
                        <i class="iconfont">&#xe810;</i>
                        报价时间
                    </div>
                    <span>{{offerDetail.created_at}}</span>
                </div>
                <div class="remark">
                    <div class="left">
                        <i class="iconfont">&#xe67a;</i>
                        备注
                    </div>
                    <div class="right">
                        <span>{{offerDetail.remark}}</span>
                    </div>
                </div>
            </div>
            <h4>卖家信息</h4>
            <div class="buyer_info_box">
                <img :src="offerDetail.logo_image_url" alt="" class="logo">
                <p class="name">{{offerDetail.company_name}}</p>
                <p class="buyer_content clearfloat">
                    <strong class="person">联系人：{{offerDetail.contact_name}}</strong>
                    <span class="phone" v-if="offerDetail.contact_mobile" @click="getPhone(offerDetail.contact_mobile)">
                        <i class="iconfont">&#xe623;</i>
                        电话
                    </span>
                    <a :href="`mqqwpa://im/chat?chat_type=wpa&uin=${offerDetail.qq}&version=1&src_type=web&web_src=oicqzone.com`" class="qq" v-if="!$weixin&&offerDetail.qq">
                        <i class="iconfont">&#xe62a;</i>
                        QQ
                    </a>
                    <span class="wei" v-if="$weixin&&offerDetail.weixin" @click="getWechat(offerDetail.weixin)">
                        <i class="iconfont">&#xe69a;</i>
                        微信
                    </span>
                </p>
            </div>
            <div class="free_get" @click="showLayer=true" v-if="offerDetail.source==2">
                免费拿样
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
                  <div class="btn" @click="showLayer=false">
                      知道了
                  </div>
              </div>
            </mt-popup>
        </div>
        <Telephone :service="phoneNumber" :show="showPhoneCall" @cancelPhone="cancelPhoneCall"></Telephone>
        <Code :parentData="wechatImg" @cancel="cancelCode" v-if="showCode"></Code>

    </div>

</template>

<script>
import '../../assets/sass/match/offerDetail.sass'
import TitleHead from '../common/titleHead.vue'
import ImageSwiper from '../common/imageSwiper.vue'
import Telephone from '../common/telephone.vue'
import Code from '../common/code.vue'
import {Popup} from 'mint-ui'
export default {
  components: {
    TitleHead,
    ImageSwiper,
    Telephone,
    Popup,
    Code
  },
  data () {
    return {
      pageTitle: '报价详情',
      showLayer: false, // 申请拿样弹框
      phoneNumber: '', // 电话号码
      showPhoneCall: false, // 显示打电话确认框
      offerDetail: '',
      imgList: [],
      showCode: false,
      wechatImg: {},
      previewPhoto: false,
      isOpen: false
    }
  },
  mounted: function () {
    console.log('报价详情')
    this.getDetail(this.$route.params.source, this.$route.params.id, localStorage.getItem('userId') ? localStorage.getItem('userId') : '')
  },
  beforeRouteLeave (to, from, next) {
    if (this.isOpen && localStorage.getItem('preview') !== 'false') {
      this.previewPhoto = true
      setTimeout(() => {
        next(false)
        localStorage.removeItem('preview')
        this.previewPhoto = false
      }, 100)
    } else {
      this.previewPhoto = false
      localStorage.removeItem('preview')
      next()
    }
  },
  methods: {
    previewStatus (data) {
      this.isOpen = data
      console.log(data, 'datadata')
    },
    // 拨打电话
    getPhone (phone) {
      this.showPhoneCall = true
      this.phoneNumber = phone
    },
    cancelPhoneCall (data) {
      this.showPhoneCall = data
    },
    getDetail (source, id, user_id) {
      this.$http.get(`wap/match/offer/offer_detail?source=${source}&offer_id=${id}&user_id=${user_id}`, this.$token).then(data => {
        console.log(data)
        this.offerDetail = data.data.data.obj
        this.imgList.push({
          'src': this.offerDetail.main_img,
          'w': 1200,
          'h': 900
        })
      })
    },
    getWechat (img) {
      this.showCode = true
      this.wechatImg.img = img
      this.wechatImg.status = true
      console.log(this.wechatImg)
    },
    cancelCode (data) {
      this.showCode = data
    }
  }
}
</script>
