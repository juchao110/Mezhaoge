/*
 * @Author: juchao
 * @Date: 2018-03-20 10:20:55
 * @Last Modified by: juchao
 * @Last Modified time: 2018-03-23 11:36:55
 * 我的求购详情
 */
 <template>
    <div class="my_purchase_detail" v-if="detail" @click.stop="showIcon=false" :class="{disable_scroll:showShare}">
        <div class="title_head">
            <i class="iconfont back" @click="goBack">&#xe60d;</i>
            求购详情
            <i class="iconfont more" @click.stop="showIcon=true">&#xe60b;</i>
            <div class="more_box" v-if="showIcon">
                <ul class="more_btn_box">
                    <router-link tag="li" to="/index" class="check_btn_box">
                        <i class="iconfont home_icon">&#xe62e;</i>
                        首页
                    </router-link>
                    <router-link tag="li" to="/user/service" class="check_btn_box">
                        <i class="iconfont serve_icon">&#xe61f;</i>
                        在线客服
                    </router-link>
                    <li @click="share" class="check_btn_box" v-if="!$weixin">
                        <i class="iconfont share_icon">&#xe624;</i>
                        分享
                    </li>

                </ul>
            </div>
        </div>
        <ImageSwiper :close="previewPhoto" @preview='previewStatus' :img="imgList"></ImageSwiper>
        <div class="checking" v-if="detail.status==1">
            <p>报价中</p>
            <div class="time">
                距截止
                <span v-if="timeDay!=0"><span class="time_box">{{timeDay}}</span>天</span>
                <span v-if="timeHour!=0"><span class="time_box">{{timeHour}}</span>时</span>
                <span><span class="time_box">{{timeMin}}</span>分</span>
                <span class="time_box">{{timeSec}}</span>秒
            </div>
        </div>
        <div class="checking" v-if="detail.status==2">
            <p>待确认</p>
            <div class="time">
                距截止
                <span v-if="timeDay!=0"><span class="time_box">{{timeDay}}</span>天</span>
                <span v-if="timeHour!=0"><span class="time_box">{{timeHour}}</span>时</span>
                <span><span class="time_box">{{timeMin}}</span>分</span>
                <span class="time_box">{{timeSec}}</span>秒
            </div>
        </div>
        <div class="fail" v-if="detail.status==4">
            <p>已取消</p>
        </div>
        <div class="success" v-if="detail.status==3">
            <p>已确认</p>
        </div>
        <div class="purchase_info">
            <div class="purchase_info_title" @click="showMore(1)">
                求购信息
                <i class="iconfont down" v-if="!purchaseShow">&#xe733;</i>
                <i class="iconfont up" v-if="purchaseShow">&#xe730;</i>
            </div>
            <div class="purchase_info_box" v-if="purchaseShow">
                <p class="standard">
                    <i class="iconfont">&#xe6eb;</i>
                    产品规格
                </p>
                <ul class="stand_list">
                    <li>
                        <p class="name">材质</p>
                        <p class="value">{{detail.cate_name['材质']}}</p>
                    </li>
                    <li>
                        <p class="name">用途</p>
                        <p class="value">{{detail.cate_name['用途']}}</p>
                    </li>
                    <li>
                        <p class="name">纹路</p>
                        <p class="value">{{detail.cate_name['纹路']}}</p>
                    </li>
                    <li>
                        <p class="name">底布</p>
                        <p class="value">{{detail.cate_name['底布']}}</p>
                    </li>
                    <li>
                        <p class="name">厚度</p>
                        <p class="value">{{detail.cate_name['厚度']}}</p>
                    </li>
                </ul>
                <div class="buy_amount">
                    <div class="left">
                        <i class="iconfont">&#xe726;</i>
                        采购数量
                    </div>
                    <span>{{detail.count}}{{detail.sku}}</span>
                </div>
                <div class="buy_address">
                    <div class="left">
                        <i class="iconfont">&#xe616;</i>
                        交货地
                    </div>
                    <span>{{detail.province_name}}</span>
                </div>
                <div class="buy_time">
                    <div class="left">
                        <i class="iconfont">&#xe810;</i>
                        发起时间
                    </div>
                    <span>{{detail.created_at}}</span>
                </div>
                <div class="buy_remark clearfloat">
                    <div class="left">
                        <i class="iconfont">&#xe67a;</i>
                        备注
                    </div>
                    <div class="right">
                        {{detail.remark}}
                        <p v-if="detail.is_A4==1">需要色卡及A4大货样</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="buyer_info">
            <div class="buyer_info_title" @click="showMore(2)">
                买家信息
                <i class="iconfont down" v-if="!buyerShow">&#xe733;</i>
                <i class="iconfont up" v-if="buyerShow">&#xe730;</i>
            </div>
            <div class="buyer_info_box" v-if="buyerShow">
                <img :src="detail.avatar" alt="" class="logo">
                <p class="name">{{detail.user_name}}</p>
                <p class="buyer_content">
                    <span class="phone" v-if="detail.is_offer==1&&detail.mobile" @click="phoneCall(detail.mobile)">
                        <i class="iconfont">&#xe623;</i>
                        电话
                    </span>
                    <span class="phone" v-if="(detail.is_offer==0||detail.is_offer==2)&&detail.mobile" @click="showError">
                        <i class="iconfont">&#xe623;</i>
                        电话
                    </span>
                    <a :href="`mqqwpa://im/chat?chat_type=wpa&uin=${detail.qq}&version=1&src_type=web&web_src=oicqzone.com`" class="qq" v-if="!$weixin&&detail.qq">
                        <i class="iconfont">&#xe62a;</i>
                        QQ
                    </a>
                    <span class="wei" v-if="$weixin&&detail.weixin" @click="getWechat(detail.weixin)">
                        <i class="iconfont">&#xe69a;</i>
                        微信
                    </span>
                </p>
            </div>
        </div>

        <div class="my_offer" v-if="detail.is_offer!=0">
            <div class="my_offer_title" @click="showMore(3)">
                我的报价
                <i class="iconfont down" v-if="!myOfferShow">&#xe733;</i>
                <i class="iconfont up" v-if="myOfferShow">&#xe730;</i>
            </div>
            <div class="my_offer_box" v-if="myOfferShow">
                <div class="my_offer_box_is" v-if="detail.myOffer.ignore==0">
                    <img :src="detail.myOffer.main_img" alt="" class="pic">
                    <router-link tag='div' :to="`/offerdetail/${detail.myOffer.offer_id}/2?user_id=${userID}`">
                        <p class="price">单价：<span>￥{{detail.myOffer.price}}</span>/{{detail.sku}}</p>
                        <p class="area">产地：{{detail.myOffer.provice_name}}</p>
                        <p class="remark">备注：{{detail.myOffer.remark}}</p>
                        <div class="is_get">
                            <img src="../../assets/images/match/offer_03.png" v-if="detail.myOffer.status==1" alt="">
                            <img src="../../assets/images/match/offer_02.png" v-if="detail.myOffer.status==2" alt="">
                            <img src="../../assets/images/match/offer_01.png" v-if="detail.myOffer.status==3" alt="">
                        </div>
                    </router-link>
                </div>
                <p class="no_offer" v-if="detail.myOffer.ignore==1">忽略，我暂无供货计划！</p>
            </div>

        </div>
        <div class="over_offer">
            <div class="over_offer_title" @click="showMore(4)" v-if="detail.source==1">
                已报价<span>（{{detail.offerListCount}}）</span>
                <i class="iconfont down" v-if="!overOfferShow">&#xe733;</i>
                <i class="iconfont up" v-if="overOfferShow">&#xe730;</i>
            </div>
            <div class="over_offer_title" v-if="detail.source!=1">
                已报价<span>（{{detail.offerListCount}}）</span>
            </div>
            <div class="over_offer_box" v-if="overOfferShow&&detail.source==1">
                <div class="list" v-for="(list,index) in detail.offerList">
                    <div class="company_name">
                        <p>
                            {{list.company_name}}
                        </p>
                        <span class="level level_1" v-if="list.reputation<70"><img src="../../assets/images/level/level_1.png" /></span>
                        <span class="level level_2" v-if="list.reputation>69&&list.reputation<80"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>79&&list.reputation<90"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>79&&list.reputation<90"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>89&&list.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>89&&list.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>89&&list.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_3" v-if="list.reputation>94"><img src="../../assets/images/level/level_3.png" /></span>
                    </div>
                    <div class="company_content">
                        <span class="person">联系人：{{list.contact_name}}</span>
                        <span v-if="list.contact_mobile" class="phone" @click="phoneCall(list.contact_mobile)">
                            <i class="iconfont">&#xe623;</i>
                            电话
                        </span>
                        <a :href="`mqqwpa://im/chat?chat_type=wpa&uin=${list.qq}&version=1&src_type=web&web_src=oicqzone.com`" class="qq" v-if="!$weixin&&list.qq">
                            <i class="iconfont">&#xe62a;</i>
                            QQ
                        </a>
                        <span class="wei" v-if="$weixin&&list.weixin" @click="getWechat(list.weixin)">
                            <i class="iconfont">&#xe69a;</i>
                            微信
                        </span>
                    </div>
                    <div class="offer_company_box">
                        <div class="offer_company_box_is" v-if="list.ignore==0">
                            <img :src="list.main_img" alt="" class="pic">
                            <router-link tag='div' :to="`/offerdetail/${list.offer_id}/2?user_id=${userID}`">
                                <p class="price">单价：<span>{{list.price}}/{{detail.sku}}</span></p>
                                <p class="area">产地：{{list.product_area}}</p>
                                <p class="remark">备注：{{list.remark}}</p>
                                <div class="is_get">
                                    <img src="../../assets/images/match/purchase_01.png" v-if="list.status==2" alt="">
                                </div>
                            </router-link>
                        </div>
                        <p class="no_offer" v-if="list.ignore==1">忽略，我暂无供货计划！</p>
                    </div>

                </div>
            </div>
        </div>
        <div class="wait_offer" v-if="detail.source==1">
            <div class="wait_offer_title" @click="showMore(5)">
                未报价<span>（{{detail.notOfferListCount}}）</span>
                <i class="iconfont down" v-if="!waitOfferShow">&#xe733;</i>
                <i class="iconfont up" v-if="waitOfferShow">&#xe730;</i>
            </div>
            <div class="wait_offer_box" v-if="waitOfferShow">
                <div class="wait_offer_info" v-if="detail.notOfferList.length!=0">
                    正在努力报价中，您也可以致电提醒商家报价！
                </div>
                <div class="list" v-for="(list,index) in detail.notOfferList">
                    <div class="company_name">
                        <p>{{list.company_name}}</p>
                        <span class="level level_1" v-if="list.reputation<70"><img src="../../assets/images/level/level_1.png" /></span>
                        <span class="level level_2" v-if="list.reputation>69&&list.reputation<80"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>79&&list.reputation<90"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>79&&list.reputation<90"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>89&&list.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>89&&list.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_2" v-if="list.reputation>89&&list.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                        <span class="level level_3" v-if="list.reputation>94"><img src="../../assets/images/level/level_3.png" /></span>
                    </div>
                    <div class="company_content">
                        <span class="person">联系人：{{list.contact_name}}</span>
                        <span v-if="list.contact_mobile" class="phone" @click="phoneCall(list.contact_mobile)">
                            <i class="iconfont">&#xe623;</i>
                            电话
                        </span>
                        <a :href="`mqqwpa://im/chat?chat_type=wpa&uin=${list.qq}&version=1&src_type=web&web_src=oicqzone.com`" class="qq" v-if="!$weixin&&list.qq">
                            <i class="iconfont">&#xe62a;</i>
                            QQ
                        </a>
                        <span class="wei" v-if="$weixin&&list.weixin" @click="getWechat(list.weixin)">
                            <i class="iconfont">&#xe69a;</i>
                            微信
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="cancel_purchase" v-if="detail.source==1&&detail.status==2" @click="cancelPurchase(detail.buy_id)">
            取消求购
        </div>
        <div class="purchase_now" v-if="detail.source!=1&&detail.is_push==0&&detail.status==1&&detail.is_offer==0" @click="goOffer">
            <i class="iconfont">&#xe617;</i>立即报价
        </div>
        <div class="can_purchase" v-if="detail.source!=1&&detail.is_push==1&&detail.status==1&&detail.is_offer==0">
            <div class="ignore" @click="ignore(detail.buy_id)">
                忽略
            </div>
            <div class="can_purchase_btn"  @click="goOffer">
                <i class="iconfont">&#xe617;</i>立即报价
            </div>
        </div>
        <PhoneBox :show="isShow" :service="serviceData" @cancelShow="cancelLayer"></PhoneBox>
        <Telephone :service="phoneNumber" :show="showPhoneCall" @cancelPhone="cancelPhoneCall"></Telephone>
        <Code :parentData="wechatImg" @cancel="cancelCode" v-if="showCode"></Code>
        <ShareLayer v-if='showShare' @getShareStatus='hideShare'></ShareLayer>
    </div>
</template>

<script>
import PhoneHead from '../common/phoneHead.vue'
import PhoneBox from '../common/phoneBox.vue'
import ImageSwiper from '../common/imageSwiper.vue'
import Telephone from '../common/telephone.vue'
import Code from '../common/code.vue'
import '../../assets/sass/match/myPurchaseDetail.sass'
import '../../assets/sass/header.sass'
import {Toast, Indicator, MessageBox} from 'mint-ui'
import jsUrlHelper from '../../assets/js/getUrl.js'
import ShareLayer from '../common/shareLayer.vue'
var qs = require('qs')
export default {
  components: {
    PhoneHead,
    PhoneBox,
    ImageSwiper,
    Telephone,
    Toast,
    Code,
    ShareLayer,
    MessageBox
  },
  data () {
    return {
      pageTitle: '求购详情',
      spurce: '',
      purchaseId: '',
      userID: '',
      isShow: false, // 是否显示弹框
      showPhoneCall: false, // 打电话确认弹框
      phoneNumber: '', // 打电话的电话号码
      serviceData: {name: '', phone: ''},
      imgList: [],
      purchaseShow: true, // 显示详细信息
      buyerShow: true, // 显示详细信息
      myOfferShow: true, // 显示详细信息
      overOfferShow: true, // 显示详细信息
      waitOfferShow: true, // 显示详细信息
      detail: '',
      endTime: '', // 结束时间
      nowTime: '', // 当前时间
      timeDay: 0,
      timeHour: 0,
      timeMin: 0,
      timeSec: 0,
      showIcon: false,
      wechatImg: {},
      showCode: false,
      showShare: false,
      shareTitle: [],
      shareDesc: '我在一革网发现有人求购这件产品，快来报价，说不定能成交哦！',
      previewPhoto: false,
      isOpen: false
    }
  },
  created: function () {
    // window.scroll(0, 0)
    this.userID = localStorage.getItem('userId') ? localStorage.getItem('userId') : ''
    console.log(this.$route)
    this.purchaseId = this.$route.params.id
    this.source = this.$route.params.source
    // if (this.$route.query.user_id) {
    //   this.userID = this.$route.query.user_id
    // }
  },
  mounted: function () {
    this.getData(this.purchaseId, this.source, this.userID ? this.userID : '')
    // let url = window.location.href
    // console.log('----------------')
    // let urlArr = url.split('')
    // console.log(urlArr)
    // let needUrl = urlArr.splice(urlArr.indexOf('#'), urlArr.length)
    // console.log(needUrl.join(''))
    // // let fullUrl = encodeURIComponent(`${window.location.origin}/${needUrl.join('')}`)
    // let fullUrl = `${window.location.origin}/${needUrl.join('')}`
    // console.log(fullUrl)
    // console.log('----------------')
  },
  beforeRouteLeave (to, from, next) {
    if (this.isOpen && localStorage.getItem('preview') !== 'false') {
      this.previewPhoto = true
      setTimeout(() => {
        next(false)
        this.previewPhoto = false
        localStorage.removeItem('preview')
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
    getData (id, source, userid) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/buy/buy_detail?buy_id=${id}&source=${source}&user_id=${userid}`, this.$token).then(data => {
        Indicator.close()
        this.detail = data.data.data.obj
        this.endTime = data.data.data.obj.s_endtime
        this.nowTime = data.data.data.obj.s_now_time
        if ((this.detail.status == 2 || this.detail.status == 3) && this.detail.source == 1) {
          this.purchaseShow = false
        }
        for (let i in this.detail.cate_name) {
          this.shareTitle.push(this.detail.cate_name[i])
          console.log(this.shareTitle.join('/'))
        }
        if (this.$weixin) {
          this.$store.state.shareQQ(`求购${this.shareTitle.join('/')}，你有货吗`, this.shareDesc, window.location.href, this.detail.buy_imgs[0])
          this.$store.state.shareFriend(`求购${this.shareTitle.join('/')}，你有货吗`, this.shareDesc, window.location.href, this.detail.buy_imgs[0])
          this.$store.state.shareFriends(`求购${this.shareTitle.join('/')}，你有货吗`, window.location.href, this.detail.buy_imgs[0])
        }
        for (let i in this.detail.buy_imgs) {
          this.imgList.push({
            'src': this.detail.buy_imgs[i],
            'w': 1200,
            'h': 900
          })
        }
        if (this.detail.status == 1) {
          this.countdowm(this.nowTime, this.endTime)
        } else {
          this.countdowm(this.nowTime, data.data.data.obj.s_push_time)
        }
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
      })
    },
    // 倒计时
    countdowm (now, end) {
      let t = (end - now) * 1000
      let timer = setInterval(() => {
        if (t > 0) {
          let day = Math.floor(t / 86400000)
          let hour = Math.floor((t / 3600000) % 24)
          let min = Math.floor((t / 60000) % 60)
          let sec = Math.floor((t / 1000) % 60)
          hour = hour < 10 ? '0' + hour : hour
          min = min < 10 ? '0' + min : min
          sec = sec < 10 ? '0' + sec : sec
          if (day > 0) {
            this.timeDay = day
            this.timeHour = hour
            this.timeMin = min
            this.timeSec = sec
          }
          if (day <= 0 && hour > 0) {
            this.timeDay = 0
            this.timeHour = hour
            this.timeMin = min
            this.timeSec = sec
          }
          if (day <= 0 && hour <= 0) {
            this.timeDay = 0
            this.timeHour = 0
            this.timeMin = min
            this.timeSec = sec
          }
          t -= 1000
        } else {
          clearInterval(timer)
          console.log('取消')
          if (this.detail.status != 4) {
            if (!this.userID) {
              this.userID = ''
            }
            Indicator.open({
              spinnerType: 'fading-circle'
            })
            this.$http.get(`wap/match/buy/buy_detail?buy_id=${this.purchaseId}&source=${this.source}&user_id=${this.userID}`, this.$token).then(data => {
              Indicator.close()
              this.detail = data.data.data.obj
              this.endTime = data.data.data.obj.endtime
              this.nowTime = data.data.data.obj.now_time
              if (this.$weixin) {
                this.$store.state.shareQQ(`求购${this.shareTitle.join('/')}，你有货吗`, this.shareDesc, window.location.href, this.detail.buy_imgs[0])
                this.$store.state.shareFriend(`求购${this.shareTitle.join('/')}，你有货吗`, this.shareDesc, window.location.href, this.detail.buy_imgs[0])
                this.$store.state.shareFriends(`求购${this.shareTitle.join('/')}，你有货吗`, '', window.location.href, this.detail.buy_imgs[0])
              }
              for (let i in this.detail.buy_imgs) {
                this.imgList.push({
                  'src': this.detail.buy_imgs[i],
                  'w': 1200,
                  'h': 900
                })
              }
            }).catch(() => {
              Indicator.close()
              Toast({
                message: '网络错误，请稍后再试',
                duration: 3000
              })
            })
          }
        }
      }, 1000)
    },
    goBack () {
      if (this.$store.state.goBack()) {
        this.$router.go(-1)
      } else {
        this.$router.push({path: '/index'})
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
    // 显示详细信息
    showMore (type) {
      if (type == 1) {
        this.purchaseShow = !this.purchaseShow
      } else if (type == 2) {
        this.buyerShow = !this.buyerShow
      } else if (type == 3) {
        this.myOfferShow = !this.myOfferShow
      } else if (type == 4) {
        this.overOfferShow = !this.overOfferShow
      } else if (type == 5) {
        this.waitOfferShow = !this.waitOfferShow
      }
    },
    getWechat (img) {
      this.showCode = true
      this.wechatImg.img = img
      this.wechatImg.status = true
    },
    cancelCode (data) {
      this.showCode = data
    },
    // 打电话调用二次确认弹框并传入电话号码
    phoneCall (phone) {
      this.phoneNumber = phone
      this.showPhoneCall = true
    },
    cancelPhoneCall (data) {
      this.showPhoneCall = data
    },
    showError () {
      Toast({
        message: '报价后可打电话',
        position: 'middle',
        duration: 3000
      })
    },
    goOffer () {
      if (this.$token) {
        this.$router.push({path: `/sell/offer/${this.detail.buy_id}`})
      } else {
        this.$router.push({path: '/login',
          query: {
            redirect: this.$route.fullPath
          }})
      }
    },
    ignore (id) {
      MessageBox.confirm('确认忽略报价吗？').then(action => {
        this.$http.post('wap/match/offer/buy_ignore', qs.stringify({
          buy_id: id
        }), this.$token).then(data => {
          console.log(data)
          if (data.data.error_code == 200) {
            Toast({
              message: '已忽略报价',
              duration: 3000
            })
            this.getData(this.purchaseId, this.source, this.userID ? this.userID : '')
          } else {
            Toast({
              message: data.data.data,
              duration: 3000
            })
          }
        }).catch(() => {
          Indicator.close()
          Toast({
            message: '网络错误，请稍后再试',
            duration: 3000
          })
        })
      })
    },
    cancelPurchase (id) {
      MessageBox.confirm('确认取消求购吗？').then(action => {
        this.$http.post('wap/match/buy/buy_cancel', qs.stringify({
          buy_id: id
        }), this.$token).then(data => {
          console.log(data)
          if (data.data.error_code == 200) {
            Toast({
              message: '已取消求购',
              duration: 3000
            })
            this.getData(this.purchaseId, this.source, this.userID ? this.userID : '')
          } else {
            Toast({
              message: data.data.data,
              duration: 3000
            })
          }
        }).catch(() => {
          Indicator.close()
          Toast({
            message: '网络错误，请稍后再试',
            duration: 3000
          })
        })
      })
    },
    share () {
      this.showShare = true
    },
    hideShare (data) {
      this.showShare = data
    }

  }
}
</script>
