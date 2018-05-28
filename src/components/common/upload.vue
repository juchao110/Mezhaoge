<template>
    <div>
        <div class="upload_pic" v-if="$weixin" @click="wxChange">
            <div class="upload">
                <i v-if="!disabled" class="iconfont">&#xe610;</i>
                <img v-if="disabled" src="../../assets/images/small_loading.gif" class="load_img" alt="">
            </div>
        </div>
        <div class="upload_pic" v-if="!$weixin">
            <div class="upload">
                <i v-if="!disabled" class="iconfont">&#xe610;</i>
                <input v-if="!disabled" type="file" v-on:change="onFileChange($event)" accept="image/png,image/jpeg">
                <!-- <input v-if="!disabled" type="file" v-on:change="onFileChange($event)" accept="image/png,image/jpeg" multiple="multiple"> -->
                <img v-if="disabled" src="../../assets/images/small_loading.gif" class="load_img" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import '../../assets/sass/upload.sass'
import {Toast, Indicator} from 'mint-ui'
var qs = require('qs')
export default {
  props: {
    button: ''
    // status: ''
  },
  data () {
    return {
      imgUrl: '',
      disabled: false,
      checkStatus: 1
    }
  },
  mounted: function () {
    console.log(this.$store.state.uploadStatus, 'this.$store.state.uploadStatus')
    this.btnValue = this.button
    console.log(this.btnVal, 'val')
  },
  methods: {
    wxChange () {
      window.wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          Indicator.open({
            spinnerType: 'fading-circle'
          })
          let local = res.localIds[0] // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          window.wx.uploadImage({
            localId: local, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 0, // 默认为1，显示进度提示
            success: (res) => {
              var serverId = res.serverId // 返回图片的服务器端ID
              console.log(serverId, 'serverIdserverId')
              this.$http.get(`wechat/wechat_img?server_id=${res.serverId}&not_check=${this.$store.state.uploadStatus}`).then(res => {
                console.log(res)
                Indicator.close()
                if (res.data.code != 200) {
                  console.log('非法图片')
                  Toast({
                    message: res.data.message,
                    duration: 3000
                  })
                } else {
                  console.log('正常图片')
                  this.imgUrl = res.data.call_back_url
                  this.$emit('fromChild', {disable: false, btnVal: this.btnValue, imageUrl: this.imgUrl})
                }
              }).catch(() => {
                Toast({
                  message: '网络异常，请稍后再试',
                  duration: 3000
                })
                Indicator.close()
              })
            }
          })
        }
      })
    },
    onFileChange (e) {
      // 多图上传功能
      // console.log(e.target.files)
      // if (e.target.files.length > 7) {
      //   Toast({
      //     message: '最多上传7张图',
      //     duration: 3000
      //   })
      //   return
      // }
      let file = e.target.files[0]
      let fileData = file.name.split('.')
      let fileClass = fileData[fileData.length - 1]
      console.log(file)
      // if (file.size > 4194304) {
      //   Toast({
      //     message: '图片大小不能大于4M',
      //     position: 'middle',
      //     duration: 3000
      //   })
      //   return
      // }
      if (fileClass.toLowerCase() != 'jpg' && fileClass.toLowerCase() != 'png' && fileClass.toLowerCase() != 'jpeg') {
        Toast({
          message: '图片格式仅支持‘jpg、png、jpeg’',
          position: 'middle',
          duration: 3000
        })
        return
      }
      let param = new FormData() // 创建form对象
      param.append('image', file, file.name) // 通过append向form对象添加数据
      this.$emit('fromChild', {disable: true, btnVal: '上传图片中..'})
      this.disabled = true
      this.$http.post(`match/img_uploade?not_check=${this.$store.state.uploadStatus}`, param, this.$ImgHeader).then((data) => {
        this.disabled = false
        if (data.data.error_code != 200) {
          Toast({
            message: data.data.data,
            duration: 3000
          })
          this.$emit('fromChild', {disable: false, btnVal: this.btnValue})
        } else {
          this.imgUrl = data.data.data.call_back_url
          this.$emit('fromChild', {disable: false, btnVal: this.btnValue, imageUrl: this.imgUrl})
        }
      }).catch(() => {
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
        this.disabled = false
        this.$emit('fromChild', {disable: false, btnVal: this.btnValue})
      })
    }
  }
}
</script>
