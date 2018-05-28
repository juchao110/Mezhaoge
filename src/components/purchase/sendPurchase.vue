<template>
    <div class="content" v-if="dataList">
        <TitleHead :title="pageTitle" v-show="!showChoose"></TitleHead>
        <div class="send_purchase" v-show="!showChoose">
            <div class="company_info" v-if="dataList.shopObj!=''&&dataList">
                <p class="info">您将向指定供应商发起求购~~</p>
                <p class="name">{{dataList.shopObj.business_name}}
                    <span class="level level_1" v-if="dataList.shopObj.reputation<70"><img src="../../assets/images/level/level_1.png" /></span>
                    <span class="level level_2" v-if="dataList.shopObj.reputation>69&&dataList.shopObj.reputation<80"><img src="../../assets/images/level/level_2.png" /></span>
                    <span class="level level_2" v-if="dataList.shopObj.reputation>79&&dataList.shopObj.reputation<90"><img src="../../assets/images/level/level_2.png" /></span>
                    <span class="level level_2" v-if="dataList.shopObj.reputation>79&&dataList.shopObj.reputation<90"><img src="../../assets/images/level/level_2.png" /></span>
                    <span class="level level_2" v-if="dataList.shopObj.reputation>89&&dataList.shopObj.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                    <span class="level level_2" v-if="dataList.shopObj.reputation>89&&dataList.shopObj.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                    <span class="level level_2" v-if="dataList.shopObj.reputation>89&&dataList.shopObj.reputation<95"><img src="../../assets/images/level/level_2.png" /></span>
                    <span class="level level_3" v-if="dataList.shopObj.reputation>94"><img src="../../assets/images/level/level_3.png" /></span>
                </p>
            </div>
            <div class="img_col clearfloat">
                <p>
                    <span>*</span>
                    纹路图片
                    <em>用于智能图片搜索/匹配</em>
                </p>
                <div class="upload_com clearfloat">
                    <Upload :button="submitVal" @fromChild="getWenImg" v-if="!imgUrl"></Upload>
                </div>
                <div class="over_upload" v-if="imgUrl">
                    <img :src="imgUrl" class="wen_img" alt="">
                    <div class="delete" @click="deleteImg">
                        <img src="../../assets/images/delete.png" alt="">
                    </div>
                </div>
            </div>
            <div class="more_img_col clearfloat">
                <p>
                    更多图片
                    <em>上传底布、厚度、色卡等图片</em>
                </p>
                <div class="more_over_upload">
                    <ul class="clearfloat">
                        <li v-for="(img,index) in otherImg" v-if="otherImg.length!=0">
                            <img :src="img" class="each_img" alt="">
                            <div class="delete" @click="deleteOtherImg(index)">
                                <img src="../../assets/images/delete.png" alt="">
                            </div>
                        </li>
                        <li>
                            <Upload :button="submitVal" @fromChild="getOtherImg" v-if="otherImg.length<7"></Upload>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="col_1" v-for="(a,index) in dataList.cate_list" @click="getCateList(a.id,a.title)">
                <div class="title">
                    <span>*</span>
                    {{a.title}}
                </div>
                <div class="value">
                    {{goodForm[a.title]}}
                </div>
                <i class="iconfont">&#xe635;</i>
            </div>
            <div class="col_1" @click="chooseSelect('报价时限')">
                <div class="title">
                    <span>*</span>
                    报价时限
                </div>
                <div class="value">
                    {{goodForm['报价时限']}}
                </div>
                <i class="iconfont">&#xe635;</i>
            </div>
            <div class="col_1" @click="chooseSelect('交货地')">
                <div class="title">
                    <span>*</span>
                    交货地
                </div>
                <div class="value">
                    {{goodForm['交货地']}}
                </div>
                <i class="iconfont">&#xe635;</i>
            </div>
            <div class="col_1">
                <div class="title">
                    <span>*</span>
                    采购数量
                </div>
                <div class="input_div">
                    <input type="number" placeholder="请输入数量" v-model="amount">
                </div>
                <div class="value" @click="chooseSelect('单位')">
                    {{goodForm['单位'] | default('单位')}}
                </div>
                <i class="iconfont">&#xe635;</i>
            </div>
            <div class="remark">
                <p>备注</p>
                <textarea v-model="remark" placeholder="请输入其他要求，例如期望交货时间、交货地点等其他要求（限30字）" maxlength="30"></textarea>
            </div>
            <div class="col_1">
                <div class="title">
                    <span>*</span>
                    是否需要色卡及A4大货样
                </div>
                <div class="right_switch">
                    <span class="l" :class="{grey_color:needA4}">否</span>
                    <mt-switch class="l switch_icon" v-model="needA4"></mt-switch>
                    <span class="l" :class="{grey_color:!needA4}">是</span>
                </div>
            </div>
            <div class="col_1">
                <div class="title">
                    <span>*</span>验证码
                </div>
                <div class="input_div">
                    <input type="text" v-model="imageCode" placeholder="请输入验证码">
                </div>
                <img :src="imgCode" alt="" class="img_code" @click="refresh">
            </div>
            <button type="button" class="submit" @click="submit" :disabled="submitVal!='确认提交'">{{submitVal}}</button>
        </div>
        <OneSelect :list="selectList" @chooseBox="getChooseBoxStatus" v-if="showChoose"></OneSelect>
        <!-- <MoreSelect :list="selectList" @moreChooseBox="getMoreChoose" v-if="showChoose"></MoreSelect> -->
    </div>
</template>

<script>
import TitleHead from '../common/titleHead.vue'
import Upload from '../common/upload.vue'
import OneSelect from '../common/oneSelect.vue'
import MoreSelect from '../common/moreSelect.vue'
import '../../assets/sass/user/sendPurchase.sass'
import {Switch, Toast, Indicator} from 'mint-ui'
var qs = require('qs')
export default {
  components: {
    TitleHead,
    Upload,
    OneSelect,
    MoreSelect,
    Switch,
    Toast,
    Indicator
  },
  data () {
    return {
      pageTitle: '发布求购单',
      shopId: '', // 店铺id
      imgUrl: '',
      otherImg: [],
      disabled: '',
      dataList: '', // 基础数据
      selectList: {},
      showChoose: false,
      offerTime: '', // 报价时限
      offerTimeId: '', // 报价时限
      areaId: '', // 交货地
      goodForm: {},
      goodFormId: {},
      needA4: true,
      imgCode: '', // 图形验证码地址
      amount: '', // 采购数量
      remark: '', // 备注
      imageCode: '', // 图片验证码
      submitVal: '确认提交',
      scrollY: '',
      moreChooseList: {},
      historyData: {} // 用于存放用户已输入的参数
    }
  },
  mounted: function () {
    console.log('发布求购')
    // this.$route.params.shopId  接受店铺id
    this.shopId = this.$route.query.id
    this.$store.state.uploadStatus = 0
    if (localStorage.getItem('purchaseData')) {
      console.log(JSON.parse(localStorage.getItem('purchaseData')))
      let jsonData = JSON.parse(localStorage.getItem('purchaseData'))
      this.goodForm = jsonData.goodFormName
      this.goodFormId = jsonData.goodFormId
      this.amount = jsonData.count
      this.imgUrl = jsonData.imgUrl
      this.otherImg = jsonData.otherImg
      this.remark = jsonData.remark
      this.shopId = jsonData.shop_id
      if (jsonData.is_A4 == 0) {
        this.needA4 = true
      } else {
        this.needA4 = false
      }
      console.log(jsonData.goodFormName, 'this.goodForm')
    }
    this.getData(this.shopId)
  },
  methods: {
    // 获取子组件传来的数据
    getWenImg (data) {
      console.log(data, 'data')
      this.imgUrl = data.imageUrl
      this.disabled = data.disable
      this.submitVal = data.btnVal
    },
    getOtherImg (data) {
      console.log(data, 'other')
      this.disabled = data.disable
      this.submitVal = data.btnVal
      if (data.imageUrl) {
        this.otherImg.push(data.imageUrl)
      }
    },
    deleteImg () {
      this.imgUrl = ''
    },
    deleteOtherImg (index) {
      this.otherImg.splice(index, 1)
    },
    // getMoreChoose (data) {
    //   console.log('多选组件的值')
    //   console.log(data)
    //   this.moreChooseList[data.pId] = data
    //   console.log(this.moreChooseList, 'moreChooseList')
    //   this.showChoose = data.status
    // },
    // 单选监听子组件的值
    getChooseBoxStatus (data) {
      console.log(data)
      if (data.type) {
        this.showChoose = data.status
        this.goodForm[this.selectList.type] = data[this.selectList.type].title
        this.goodFormId[this.selectList.type] = data[this.selectList.type].id
        this.selectList.choosedId = data[this.selectList.type].id
        console.log(this.goodForm, 'from')
        console.log(this.goodFormId, 'fromid')
      } else {
        this.showChoose = data
      }
      setTimeout(() => {
        window.scroll(0, this.scrollY)
      }, 10)
    },
    // 打开选择弹窗事件
    chooseSelect (type) {
      this.scrollY = window.scrollY
      this.selectList.type = type
      if (type == '交货地') {
        this.selectList.id = type
        this.selectList.choosedId = this.goodFormId[type] ? this.goodFormId[type] : ''
        this.selectList.list = this.dataList.area
      } else if (type == '报价时限') {
        this.selectList.id = type
        this.selectList.choosedId = this.goodFormId[type] ? this.goodFormId[type] : ''
        this.selectList.list = this.dataList.deadline
      } else if (type == '单位') {
        this.selectList.id = type
        this.selectList.choosedId = this.goodFormId[type] ? this.goodFormId[type] : ''
        this.selectList.list = this.dataList.goods_sku
      }
      this.showChoose = true
    },
    getData (shopId) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/buy/match_buy?shop_id=${shopId}`, this.$token).then(data => {
        console.log(data)
        this.dataList = data.data.data
        this.imgCode = data.data.data.captcha_src
        Indicator.close()
        for (let i in this.dataList.deadline) {
          if (this.dataList.deadline[i].title === '1天') {
            this.goodFormId['报价时限'] = this.dataList.deadline[i].id
            this.goodForm['报价时限'] = this.dataList.deadline[i].title
          }
        }
        for (let i in this.dataList.goods_sku) {
          if (this.dataList.goods_sku[i].title === '米') {
            this.goodFormId['单位'] = this.dataList.goods_sku[i].id
            this.goodForm['单位'] = this.dataList.goods_sku[i].title
          }
        }
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络异常，请稍后再试',
          duration: 3000
        })
      })
    },
    // 获取分类信息
    getCateList (id, name) {
      this.scrollY = window.scrollY
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/match/buy/child_cate?pid=${id}`).then(data => {
        console.log(data)
        Indicator.close()
        this.selectList.require = true
        this.selectList.pId = id
        this.selectList.type = name
        this.selectList.id = name
        this.selectList.choosedId = this.goodFormId[name] ? this.goodFormId[name] : ''

        this.selectList.list = data.data.data.list
        // 多选时需要传的已选中值
        // for (let i in this.moreChooseList) {
        //   if (this.moreChooseList[i].pId == id) {
        //     this.selectList.choosedList = this.moreChooseList[i].data
        //   }
        // }
        this.showChoose = true
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络异常，请稍后再试',
          duration: 3000
        })
      })
    },
    // 刷新图片验证码
    refresh () {
      this.imgCode = `${this.imgCode}?${Math.random()}`
    },
    // 提交
    submit () {
      console.log(this.imgUrl, 'this.imgUrlthis.imgUrl')
      if (!this.imgUrl) {
        Toast({
          message: '请上传纹路图片',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.goodFormId['纹路']) {
        Toast({
          message: '请选择纹路',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.goodFormId['用途']) {
        Toast({
          message: '请选择用途',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.goodFormId['材质']) {
        Toast({
          message: '请选择材质',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.goodFormId['底布']) {
        Toast({
          message: '请选择纹底布',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.goodFormId['厚度']) {
        Toast({
          message: '请选择厚度',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.goodFormId['报价时限']) {
        Toast({
          message: '请选择报价时限',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.goodFormId['交货地']) {
        Toast({
          message: '请选择交货地',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.amount) {
        Toast({
          message: '请输入采购数量',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testNumber(this.amount)) {
        Toast({
          message: '采购数量必须为正整数',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.goodFormId['单位']) {
        Toast({
          message: '请选择单位',
          position: 'middle',
          duration: 3000
        })
        return
      }
      let isNeed
      if (this.needA4 == true) {
        isNeed = 0
      } else {
        isNeed = 1
      }
      if (!this.imageCode) {
        Toast({
          message: '请输入图片验证码',
          position: 'middle',
          duration: 3000
        })
        return
      }
      this.historyData = {
        imgUrl: this.imgUrl,
        otherImg: this.otherImg,
        goodFormName: this.goodForm,
        goodFormId: this.goodFormId,
        count: this.amount,
        is_A4: isNeed,
        remark: this.remark,
        shop_id: this.shopId
      }
      if (localStorage.getItem('token')) {
        this.$http.get('check/token', this.$token).then(data => {
          if (data.data.error_code == 401) {
            console.log('当前token存在但无效')
            localStorage.removeItem('token')
            Toast({
              message: '请先登录',
              duration: 3000
            })
            localStorage.setItem('purchaseData', JSON.stringify(this.historyData))
            this.$router.push({path: '/login', query: {redirect: this.$route.path}})
          } else {
            console.log('当前token存在且有效')
            Indicator.open({
              spinnerType: 'fading-circle'
            })
            this.submitVal = '提交中'
            this.$http.post('match/buy/match_buy_save', qs.stringify({
              shop_id: this.shopId,
              img_1: this.imgUrl,
              img_2: this.otherImg.join(','),
              goods_cate1: this.goodFormId['纹路'],
              goods_cate2: this.goodFormId['用途'],
              goods_cate3: this.goodFormId['材质'],
              goods_cate4: this.goodFormId['底布'],
              goods_cate5: this.goodFormId['厚度'],
              province_id: this.goodFormId['交货地'],
              deadline: this.goodFormId['报价时限'],
              count: this.amount,
              sku_id: this.goodFormId['单位'],
              is_A4: isNeed,
              remark: this.remark,
              captcha_src: this.imageCode
            }), this.$token).then(data => {
              console.log(data)
              this.submitVal = '确认提交'
              Indicator.close()
              if (data.data.error_code != 200) {
                this.refresh()
                Toast({
                  message: data.data.data,
                  position: 'middle',
                  duration: 3000
                })
              } else {
                Toast({
                  message: '发布成功',
                  position: 'middle',
                  duration: 3000
                })
                localStorage.removeItem('purchaseData')
                this.$router.push({path: '/user/mypurchaselist'})
              }
            }).catch(data => {
              Toast({
                message: '网络错误，请稍后再试',
                position: 'middle',
                duration: 3000
              })
              this.submitVal = '确认提交'
              Indicator.close()
            })
          }
        })
      } else {
        Toast({
          message: '请先登录',
          duration: 3000
        })
        localStorage.setItem('purchaseData', JSON.stringify(this.historyData))
        this.$router.push({path: '/login', query: {redirect: this.$route.path}})
      }
    }
  }
}
</script>
