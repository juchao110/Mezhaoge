<template>
    <div class="content">
        <TitleHead :title="pageTitle" v-if="!showChoose"></TitleHead>
        <div class="offer" v-if="!showChoose">
            <div class="offer_img">
                <p>
                    <span>*</span>产品图片
                </p>
                <Upload :button="btnVal" @fromChild="getChildData" v-if="!imgUrl"></Upload>
                <div class="over_upload" v-if="imgUrl">
                    <img :src="imgUrl" alt="">
                    <div class="delete" @click="deleteImg">
                        <img src="../../assets/images/delete.png" alt="">
                    </div>
                </div>
            </div>
            <div class="col_1">
                <div class="title">
                    <span>*</span>
                    单价
                </div>
                <div class="input_div">
                    <input type="number" v-model="price" placeholder="请输入单价">
                </div>
                <div class="value">
                    元
                </div>
            </div>
            <div class="col_1" @click="chooseSelect('产地')">
                <div class="title">
                    <span class="title_col_white_color">*</span>
                    产地
                </div>
                <div class="value">
                    {{goodForm['产地'] | default(offer.province_name)}}
                </div>
                <i class="iconfont">&#xe635;</i>
            </div>
            <div class="col_1">
                <div class="title">
                    <span class="title_col_white_color">*</span>
                    数量
                </div>
                <div class="input_div">
                    <input type="tel" v-model="amount" placeholder="请输入数量">
                </div>
                <div class="value">
                    {{offer.sku_name}}
                </div>
            </div>
            <div class="remark">
                <p><span class="title_col_white_color">**</span>备注</p>
                <textarea v-model="remark" maxlength="30" placeholder="请联系我确认货品明细及价格后，再提交订单"></textarea>
            </div>
            <button type="button" class="common_submit_btn" :disabled="btnVal!='确认提交'" @click="save">{{btnVal}}</button>
        </div>
        <OneSelect :list="selectList" @chooseBox="getChooseBoxStatus" v-if="showChoose"></OneSelect>

    </div>
</template>

<script>
import TitleHead from '../common/titleHead.vue'
import Upload from '../common/upload.vue'
import OneSelect from '../common/oneSelect.vue'
import '../../assets/sass/sell/offer.sass'
import {Indicator, Toast, MessageBox} from 'mint-ui'
var qs = require('qs')
export default {
  components: {
    TitleHead,
    Upload,
    Toast,
    Indicator,
    OneSelect,
    MessageBox
  },
  data () {
    return {
      pageTitle: '报价',
      imgUrl: '',
      disabled: false,
      btnVal: '确认提交',
      selectList: {},
      remark: '',
      amount: '',
      price: '',
      showChoose: false,
      list: '',
      offer: {},
      areaName: '',
      areaId: '',
      goodForm: {},
      goodFormId: {}
    }
  },
  mounted: function () {
    console.log('报价')
    this.$store.state.uploadStatus = 0
    this.userId = localStorage.getItem('userId') ? localStorage.getItem('userId') : ''
    this.getOffer(this.$route.params.id)
    this.getArea()
  },
  methods: {
    // 获取子组件传来的数据
    getChildData (data) {
      console.log(data, 'url')
      this.imgUrl = data.imageUrl
      this.disabled = data.disable
      this.btnVal = data.btnVal
    },
    deleteImg () {
      this.imgUrl = ''
    },
    getArea () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('wap/area/list').then(data => {
        console.log(data)
        Indicator.close()
        this.list = data.data.data
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
      })
    },
    getOffer (id) {
      this.$http.get(`wap/match/buy/buy_offer_detail?buy_id=${id}`, this.$token).then(data => {
        console.log(data)
        this.offer = data.data.data.data
        this.amount = this.offer.count
        this.goodForm['产地'] = this.offer.province_name
        this.goodFormId['产地'] = this.offer.province_id
        console.log(this.goodFormId['产地'])
      })
    },
    chooseSelect (type) {
      this.selectList.type = type
      this.selectList.id = type
      this.selectList.choosedId = this.goodFormId[type]
      this.selectList.list = this.list
      this.showChoose = true
    },
    getChooseBoxStatus (data) {
      console.log(data, 'daya')
      this.showChoose = data.status
      this.goodForm[this.selectList.type] = data[this.selectList.type].title
      this.goodFormId[this.selectList.type] = data[this.selectList.type].id
      this.selectList.choosedId = data[this.selectList.type].id
      console.log(this.goodForm, 'from')
      console.log(this.goodFormId, 'fromid')
    },
    save () {
      if (!this.imgUrl) {
        Toast({
          message: '请上传产品图片',
          duration: 3000
        })
        return
      }
      if (!this.price) {
        Toast({
          message: '请输入单价',
          duration: 3000
        })
        return
      }
      if (this.price == 0) {
        Toast({
          message: '单价不能等于0',
          duration: 3000
        })
        return
      }
      if (this.price < 0) {
        Toast({
          message: '单价不能小于0',
          duration: 3000
        })
        return
      }
      if (this.price > 999.99) {
        Toast({
          message: '单价不能大于999.99',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testFloatNumber(this.price)) {
        Toast({
          message: '单价最多保留两位小数',
          duration: 3000
        })
        return
      }
      MessageBox.confirm('确定提交报价吗').then(action => {
        Indicator.open({
          spinnerType: 'fading-circle'
        })
        this.btnVal = '保存中'
        this.disabled = true
        this.$http.post('match/offer/match_offer_save', qs.stringify({
          buy_id: this.$route.params.id,
          province_id: this.goodFormId['产地'] ? this.goodFormId['产地'] : this.offer.province_id,
          main_img: this.imgUrl,
          count: this.amount,
          price: this.price,
          remark: this.remark
        }), this.$token).then(data => {
          console.log(data)
          Indicator.close()
          this.btnVal = '确认提交'
          this.disabled = false
          if (data.data.error_code != 200) {
            Toast({
              message: data.data.data,
              duration: 3000
            })
          } else {
            this.$router.push({path: `/offerdetail/${data.data.data.offer_id}/1?user_id=${this.userId}`})
            Toast({
              message: '报价成功',
              duration: 3000
            })
          }
        }).catch(() => {
          this.btnVal = '确认提交'
          Indicator.close()
          this.disabled = false
        })
      })
    }
  }
}
</script>
