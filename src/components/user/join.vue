/*
 * @Author: juchao
 * @Date: 2018-03-20 10:20:55
 * @Last Modified by: juchao
 * @Last Modified time: 2018-03-20 10:23:02
 * 卖家入驻
 */
 <template>
     <div class="content">
         <TitleHead :title="pageTitle" v-show="!showChoose"></TitleHead>
         <div class="join" v-show="!showChoose">
             <div class="result_fail" v-if="joinStatus==3">
                 <p>原因：{{reason}}</p>
                 <p>请修改资料后重新提交审核</p>
             </div>
             <div class="result_check" v-if="joinStatus==2">
                 <p>您的资料已提交成功，请耐心等待审核~~~</p>
                 <p>如需修改资料，请编辑后重新提交</p>
             </div>
             <h3>基本信息</h3>
             <div class="col_1">
                 <div class="left_col">
                     <span>*</span>
                     公司名称
                 </div>
                 <div class="right_col">
                     <input type="text" v-model="companyName" maxlength="50" placeholder="请输入公司名称">
                 </div>
             </div>
             <div class="col_1" @click="showProvince">
                 <div class="left_col">
                     <span>*</span>
                     公司地址
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
                     <span>*</span>
                     详细地址
                 </div>
                 <div class="right_col">
                     <input type="text" v-model="companyAddress" maxlength="50" placeholder="请输入公司详细地址">
                 </div>
             </div>
             <div class="col_1">
                 <div class="left_col">
                     <span class="white_color">*</span>
                     公司电话
                 </div>
                 <div class="right_col">
                     <input type="text" v-model="companyPhone" placeholder="请输入座机号，分机请用“-”分割">
                 </div>
             </div>
             <div class="col_1">
                 <div class="left_col">
                     <span>*</span>
                     联系人
                 </div>
                 <div class="right_col">
                     <input type="text" v-model="user" maxlength="30" placeholder="请输入联系人">
                 </div>
             </div>
             <div class="col_1">
                 <div class="left_col">
                     <span>*</span>
                     手机号码
                 </div>
                 <div class="right_col">
                     <input type="tel" v-model="phone" placeholder="请输入手机号码">
                 </div>
             </div>
             <h3>证照信息</h3>
             <div class="col_img">
                 <div class="left_col">
                     <span class="white_color">*</span>
                     营业执照
                 </div>
                 <div class="right_col">
                     <div class="upload_com">
                         <Upload :button="btnVal" @fromChild="getChildData" v-if="!imgUrl"></Upload>
                     </div>
                     <div class="over_upload" v-if="imgUrl">
                         <img :src="imgUrl" alt="">
                         <div class="iconfont delete" @click="deleteImg">
                             <img src="../../assets/images/delete.png" alt="">
                         </div>
                     </div>
                 </div>
             </div>
             <button type="button" class="submit_btn" :disabled="btnVal!='提交'" @click="submit">{{btnVal}}</button>
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
     </div>
</template>

<script>
import '../../assets/sass/user/join.sass'
import TitleHead from '../common/titleHead.vue'
import {Toast, MessageBox, Indicator} from 'mint-ui'
import Upload from '../common/upload.vue'
import OneSelect from '../common/oneSelect.vue'
var qs = require('qs')
export default {
  components: {
    TitleHead,
    Toast,
    MessageBox,
    Upload,
    OneSelect,
    Indicator
  },
  data () {
    return {
      pageTitle: '卖家入驻',
      showChoose: false,
      imgUrl: '',
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      user: '',
      phone: '',
      btnVal: '提交',
      disabled: false,
      joinStatus: '',
      province: '',
      city: '',
      chooseTitle: '请选择省份',
      provinceName: '',
      provinceId: '',
      cityName: '',
      cityId: '',
      reason: ''
    }
  },
  mounted: function () {
    console.log('卖家入驻')
    this.$store.state.uploadStatus = 1
    this.getStatus()
    this.getProvince()
  },
  methods: {
    deleteImg () {
      this.imgUrl = ''
    },
    // 获取子组件传来的数据
    getChildData (data) {
      console.log(data, 'url')
      this.imgUrl = data.imageUrl
      this.disabled = data.disable
      this.btnVal = data.btnVal
    },
    // 获取审核状态
    getStatus () {
      this.$http.get('match/business/enter', this.$token).then(data => {
        console.log(data)
        this.joinStatus = data.data.data.verify_status
        this.imgUrl = data.data.data.business_license_pic
        this.user = data.data.data.company_emergency_name
        this.companyAddress = data.data.data.company_address
        this.phone = data.data.data.company_emergency_tel
        this.companyPhone = data.data.data.company_mobile
        this.companyName = data.data.data.company_name
        this.cityId = data.data.data.company_city
        this.provinceId = data.data.data.company_province
        this.cityName = data.data.data.company_city_name
        this.provinceName = data.data.data.company_province_name
        this.reason = data.data.data.verify_remark
        if (this.joinStatus == 1) {
          this.$router.push({path: '/user'})
        }
      })
    },
    // 获取省份
    getProvince () {
      this.$http.get('match/area', this.$token).then(data => {
        console.log(data)
        this.province = data.data.data
      })
    },
    // 获取市
    getCity (id) {
      this.$http.get(`match/area?province_id=${id}`, this.$token).then(data => {
        console.log(data)
        this.city = data.data.data
      })
    },
    showProvince () {
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
      window.scrollTo(0, 0)
      this.cityId = id
      this.cityName = title
      this.showChoose = false
      this.province = ''
      this.city = ''
    },
    cancelChoose () {
      if (this.city) {
        this.city = ''
        this.cityId = ''
        this.cityName = ''
        this.getProvince()
      } else {
        this.showChoose = false
        this.provinceId = ''
        this.provinceName = ''
        this.cityId = ''
        this.cityName = ''
        this.city = ''
        this.province = ''
      }
    },
    submit () {
      if (!this.companyName) {
        Toast({
          message: '请输入公司名称',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.companyName.split('').length < 2) {
        Toast({
          message: '公司名称不少于2个字',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (this.$store.state.testCompanyName(this.companyName)) {
        Toast({
          message: '请输入真实公司名称',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.provinceId || !this.cityId) {
        Toast({
          message: '请选择省市',
          position: 'middle',
          duration: 3000
        })
        return
      }
      if (!this.companyAddress) {
        Toast({
          message: '请输入公司详细地址',
          position: 'middle',
          duration: 3000
        })
        return
      }
      // if (!this.companyPhone) {
      //   Toast({
      //     message: '请输入公司电话',
      //     position: 'middle',
      //     duration: 3000
      //   })
      //   return
      // }
      // if (this.$store.state.testTelphone(this.companyPhone)) {
      //   Toast({
      //     message: '请输入正确的公司电话',
      //     position: 'middle',
      //     duration: 3000
      //   })
      //   return
      // }
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
      // if (!this.imgUrl) {
      //   Toast({
      //     message: '请上传营业执照',
      //     position: 'middle',
      //     duration: 3000
      //   })
      //   return
      // }
      MessageBox.confirm('是否提交申请').then(action => {
        Indicator.open({
          spinnerType: 'fading-circle'
        })
        this.$http.post('match/business/enter_request', qs.stringify({
          company_name: this.companyName,
          company_address: this.companyAddress,
          company_mobile: this.companyPhone,
          company_emergency_name: this.user,
          company_emergency_tel: this.phone,
          business_license_pic: this.imgUrl,
          province_id: this.provinceId,
          city_id: this.cityId,
          business_license_pic: this.imgUrl,
          document_type: 2
        }), this.$token).then(data => {
          console.log(data)
          Indicator.close()
          if (data.data.error_code != 201) {
            Toast({
              message: data.data.data,
              position: 'middle',
              duration: 3000
            })
          } else {
            Toast({
              message: '提交申请成功',
              position: 'middle',
              duration: 3000
            })
            location.reload()
          }
        }).catch(() => {
          Indicator.close()
          Toast({
            message: '网络异常，请稍后再试',
            position: 'middle',
            duration: 3000
          })
        })
      })
    }

  }
}
</script>
