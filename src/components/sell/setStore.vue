<template>
    <div>
        <TitleHead :title="pageTitle" v-show="!showChoose&&!showTab&&!showTypeChoose"></TitleHead>
        <div class="set_store" v-show="!showChoose&&!showTab&&!showTypeChoose" v-if="shopInfo">
            <h3>店铺资料</h3>
            <div class="col_1">
                <div class="left_col">
                    <span class="title_col_white_color">*</span>公司名称
                </div>
                <div class="right_col">
                    {{shopInfo.shop_info.shop_name}}
                </div>
            </div>
            <div class="store_icon">
                <p>
                    <span>*</span>店铺标识
                </p>
                <Upload :button='submitVal' @fromChild="getChildData" v-if="!imgUrl"></Upload>
                <div class="over_upload" v-if="imgUrl">
                    <img :src="imgUrl" alt="">
                    <div class="delete" @click="deleteImg">
                        <img src="../../assets/images/delete.png" alt="">
                    </div>
                </div>
            </div>
            <div class="store_ind">
                <p><span class="title_col_white_color">*</span>公司介绍</p>
                <textarea placeholder="请输入店铺介绍" v-model="storeInfo"></textarea>
            </div>
            <div class="col_1">
                <div class="left_col">
                    <span>*</span>联系人
                </div>
                <div class="right_col">
                    <input type="text" v-model="user" placeholder="请输入联系人">
                </div>
            </div>
            <div class="col_1">
                <div class="left_col">
                    <span>*</span>手机号码
                </div>
                <div class="right_col">
                    <input type="text" v-model="phone" placeholder="请输入手机号码">
                </div>
            </div>
            <div class="col_1">
                <div class="left_col">
                    <span>*</span>固定电话
                </div>
                <div class="right_col">
                    <input type="text" v-model="tel" placeholder="请输入固定电话">
                </div>
            </div>
            <div class="col_1" @click="showProvince">
                <div class="left_col">
                    <span>*</span>经营地址
                </div>
                <div class="right_col">
                    <div class="choose_city" v-if="!cityName">
                        请选择省市
                    </div>
                    <div class="over_choose_city" v-if="cityName">
                        {{provinceName}}{{cityName}}
                    </div>
                    <i class="iconfont go_choose">&#xe635;</i>
                </div>
            </div>
            <div class="col_1">
                <div class="left_col">
                    <span>*</span>详细地址
                </div>
                <div class="right_col">
                    <input type="text" v-model="address" placeholder="请输入详细地址">
                </div>
            </div>
            <div class="col_1">
                <div class="left_col">
                    <span class="white_color">*</span>设置QQ
                </div>
                <div class="right_col">
                    <input type="text" v-model="qq" placeholder="请输入店铺QQ">
                </div>
            </div>
            <div class="col_1">
                <div class="left_col">
                    <span class="title_col_white_color">*</span>网址
                </div>
                <div class="right_col">
                    <input type="text" v-model="url" placeholder="请输入网址">
                </div>
            </div>
            <div class="col_1" @click="chooseStoreFrom('主要货源')">
                <div class="left_col">
                    <span class="title_col_white_color">*</span>主要货源
                </div>
                <div class="right_col">
                    <span>{{goodForm['主要货源'] | default('请选择')}}</span>
                    <i class="iconfont go_choose">&#xe635;</i>
                </div>
            </div>
            <div class="store_ind">
                <p><span class="title_col_white_color">*</span>经营范围</p>
                <textarea placeholder="请输入经营范围" v-model="storeScope"></textarea>
            </div>
            <h3>店铺标签</h3>
            <div class="tab_list">
                <ul class="clearfloat">
                    <li v-for="l in cateListName">
                        {{l}}
                    </li>
                </ul>
                <div class="add_more" @click="chooseStoreType">
                    <i class="iconfont">&#xe726;</i>
                    添加更多标签
                </div>
                <button type="button"  class="save_btn" :disabled="submitVal!='提交'" @click="submit">{{submitVal}}</button>
            </div>
        </div>
        <div class="choose_one" v-if="showChoose">
            <div class="title">
                <i class="iconfont back" @click="cancelChoose">&#xe60d;</i>
                {{chooseTitle}}
            </div>
            <ul class="choose_list" v-if="!city">
                <li v-for="(data,index) in province" @click="chooseProvince(data.title,data.id)"><span :class="{on:data.id==provinceId}">{{data.title}}</span></li>
            </ul>
            <ul class="choose_list" v-if="city">
                <li v-for="(data,index) in city" @click="chooseCity(data.title,data.id)"><span :class="{on:data.id==cityId}">{{data.title}}</span></li>
            </ul>
        </div>
        <OneSelect :list="selectList" @chooseBox="getChooseBoxStatus" v-if="showTypeChoose"></OneSelect>
        <MoreSelect :list="selectList" @chooseBox="getChooseBoxStatus" v-if="showMoreChoose"></MoreSelect>
        <StoreTab :cate="cateList" @hideCate="getStatus" @cateData="getCateList" v-if="showTab"></StoreTab>
    </div>
</template>

<script>
import '../../assets/sass/sell/setStore.sass'
import TitleHead from '../common/titleHead.vue'
import {Toast, Indicator} from 'mint-ui'
import Upload from '../common/upload.vue'
import OneSelect from '../common/oneSelect.vue'
import MoreSelect from '../common/moreSelect.vue'
import StoreTab from './storeTab.vue'
var qs = require('qs')
export default {
  components: {
    TitleHead,
    Toast,
    Upload,
    OneSelect,
    MoreSelect,
    StoreTab,
    Indicator
  },
  data () {
    return {
      pageTitle: '店铺设置',
      shopInfo: '',
      imgUrl: '',
      disabled: '',
      btnVal: '',
      storeInfo: '',
      user: '',
      phone: '',
      tel: '',
      address: '',
      qq: '',
      url: '',
      storeScope: '',
      cateList: {
        id: {},
        name: {}
      }, // 传给子组件的已选id和name
      selectList: {},
      showChoose: false, // 省市区弹出
      showTypeChoose: false, // 单选弹出
      showMoreChoose: false,
      goodForm: {},
      goodFormId: {},
      showTab: false,
      cateListId: [], // 已选的标签id
      cateListName: [], // 已选的标签name
      cityName: '',
      provinceName: '',
      province: '',
      city: '',
      provinceId: '',
      cityId: '',
      chooseTitle: '请选择省份',
      submitVal: '提交',
      scrollY: ''
    }
  },
  mounted: function () {
    console.log('店铺设置')
    this.getStoreData()
  },
  methods: {
    // 获取省份
    getProvince () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('match/area', this.$token).then(data => {
        console.log(data)
        Indicator.close()
        this.province = data.data.data
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络异常，请稍后再试',
          duration: 3000
        })
      })
    },
    // 获取市
    getCity (id) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`match/area?province_id=${id}`, this.$token).then(data => {
        console.log(data)
        Indicator.close()
        this.city = data.data.data
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络异常，请稍后再试',
          duration: 3000
        })
      })
    },
    chooseStoreFrom (type) {
      this.scrollY = window.scrollY
      console.log(this.goodFormId)
      this.selectList.type = type
      if (type == '主要货源') {
        this.selectList.id = type
        this.selectList.choosedId = this.goodFormId[type] ? this.goodFormId[type] : ''
        this.selectList.list = this.shopInfo.shop_goods_from
      }
      this.showTypeChoose = true
    },
    getChooseBoxStatus (data) {
      if (data.type) {
        this.showTypeChoose = data.status
        this.goodForm[this.selectList.type] = data[this.selectList.type].title
        this.goodFormId[this.selectList.type] = data[this.selectList.type].id
        this.selectList.choosedId = data[this.selectList.type].id
        console.log(this.goodForm, 'from')
        console.log(this.goodFormId, 'fromid')
      } else {
        this.showTypeChoose = data
      }
      setTimeout(() => {
        // this.$store.state.scrollGo(this.scrollY)
        window.scroll(0, this.scrollY)
      }, 10)
    },
    // 获取子组件传来的数据
    getChildData (data) {
      console.log(data, 'url')
      this.imgUrl = data.imageUrl
      this.disabled = data.disable
      this.submitVal = data.btnVal
    },
    deleteImg () {
      this.imgUrl = ''
    },
    getStoreData () {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get('shop/config', this.$token).then(data => {
        console.log(data)
        Indicator.close()
        this.shopInfo = data.data.data
        this.imgUrl = this.shopInfo.shop_info.logo_image_url
        this.storeInfo = this.shopInfo.shop_info.shop_info
        this.user = this.shopInfo.shop_info.contact_name
        this.phone = this.shopInfo.shop_info.contact_mobile
        this.tel = this.shopInfo.shop_info.contact_phone
        this.address = this.shopInfo.shop_info.address
        this.qq = this.shopInfo.shop_info.qq
        this.url = this.shopInfo.shop_info.web_site
        this.storeScope = this.shopInfo.shop_info.business_scope
        this.cateList.list = this.shopInfo.goods_cate_list
        this.provinceId = this.shopInfo.shop_info.province_id
        this.goodFormId['主要货源'] = this.shopInfo.shop_info.goods_from_id
        this.goodForm['主要货源'] = this.shopInfo.shop_info.goods_from_name
        this.cityId = this.shopInfo.shop_info.city_id
        this.provinceName = this.shopInfo.shop_info.province_name
        this.cityName = this.shopInfo.shop_info.city_name
        for (let i in this.shopInfo.shop_cate_list_pinyin) {
          this.cateList.id[i] = []
          this.cateList.name[i] = []
          for (let j in this.shopInfo.shop_cate_list_pinyin[i]) {
            this.cateList.id[i].push(this.shopInfo.shop_cate_list_pinyin[i][j].id)
            this.cateList.name[i].push(this.shopInfo.shop_cate_list_pinyin[i][j].title)
            this.cateListName.push(this.shopInfo.shop_cate_list_pinyin[i][j].title)
            this.cateListId.push(this.shopInfo.shop_cate_list_pinyin[i][j].id)
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
    // 添加店铺标签
    chooseStoreType () {
      console.log(this.cateList, 'cateList')
      this.showTab = true
      console.log('添加店铺标签')
    },
    getStatus (data) {
      this.showTab = data
    },
    getCateList (data) {
      this.cateListId = ''
      this.cateListName = ''
      console.log(data)
      this.showTab = data.status
      for (let i in data.id) {
        this.cateListId = [...this.cateListId, ...data.id[i]]
      }
      for (let i in data.name) {
        this.cateListName = [...this.cateListName, ...data.name[i]]
      }
      console.log(this.cateListName, 'name')
      this.cateList.id = data.id
      this.cateList.name = data.name
    },
    showProvince () {
      this.scrollY = window.scrollY
      console.log(this.scrollY)
      this.showChoose = true
      this.getProvince()
      this.provinceName = ''
      this.cityName = ''
    },
    chooseProvince (title, id) {
      console.log(this.provinceName)
      window.scrollTo(0, 0)
      console.log(title, id)
      this.provinceName = title
      this.provinceId = id
      this.getCity(id)
    },
    chooseCity (title, id) {
      this.cityId = id
      this.cityName = title
      this.showChoose = false
      this.province = ''
      this.city = ''
      setTimeout(() => {
        // this.$store.state.scrollGo(this.scrollY)
        window.scroll(0, this.scrollY)
      }, 1)
    },
    cancelChoose () {
      if (this.city) {
        this.city = ''
        this.cityId = ''
        this.cityName = ''
        this.getProvince()
      } else {
        this.showChoose = false
        setTimeout(() => {
          // this.$store.state.scrollGo(this.scrollY)
          window.scroll(0, this.scrollY)
        }, 1)
        this.provinceId = ''
        this.provinceName = ''
        this.cityId = ''
        this.cityName = ''
        this.city = ''
        this.province = ''
      }
    },
    submit () {
      if (!this.imgUrl) {
        Toast({
          message: '请上传店铺标识',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.user) {
        Toast({
          message: '请输入联系人',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testName(this.user)) {
        Toast({
          message: '请输入真实联系人',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.user.split('').length < 2) {
        Toast({
          message: '联系人姓名不少于2个字',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.phone) {
        Toast({
          message: '请输入手机号码',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testPhone(this.phone)) {
        Toast({
          message: '手机号码格式有误',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.tel) {
        Toast({
          message: '请输入固定电话',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testTelphone(this.tel)) {
        Toast({
          message: '请输入正确的固定电话',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.provinceId && !this.cityId) {
        Toast({
          message: '请选择经营地址',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.address) {
        Toast({
          message: '请输入详细地址',
          position: 'middle',
          duration: 3000
        })
        return
      }
      // if (!this.qq) {
      //   Toast({
      //     message: '请输入QQ',
      //     position: 'middle',
      //     duration: 3000
      //   })
      //   return
      // }
      if (this.$store.state.testNumber(this.qq)) {
        Toast({
          message: 'QQ格式有误',
          position: 'middle',
          duration: 3000
        })
        return
      }
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.submitVal = '提交中'
      this.$http.post('shop/config_request', qs.stringify({
        logo_image_url: this.imgUrl,
        shop_info: this.storeInfo,
        contact_name: this.user,
        contact_phone: this.tel,
        contact_mobile: this.phone,
        province_id: this.provinceId,
        city_id: this.cityId,
        address: this.address,
        qq: this.qq,
        web_site: this.url,
        shop_goods_from: this.goodFormId['主要货源'],
        business_scope: this.storeScope,
        cate_id_list: this.cateListId
      }), this.$token).then(data => {
        console.log(data)
        this.submitVal = '提交'
        Indicator.close()
        if (data.data.error_code != 201) {
          Toast({
            message: data.data.data,
            duration: 3000
          })
        } else {
          this.$router.push({path: '/sell'})
          Toast({
            message: '设置成功',
            duration: 3000
          })
        }
      }).catch(err => {
        this.submitVal = '提交'
        Indicator.close()
      })
    }
  }
}
</script>
