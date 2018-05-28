<template>
    <div class="content">
        <TitleHead :title="pageTitle"></TitleHead>
        <div class="img_search">
            <p class="img_search_info">集成最新图像识别技术(ProductAI)，通过识别皮革表面的图案、花型，根据用户上传的图片与产品图片精准匹配，并搜出相应产品。</p>
            <div class="pic_check">
                <div class="crop_box">
                    <vueCropper
                      ref="cropper"
                      :img="imgDataUrl"
                      :fixedBox='true'
                      :outputType="imageType">
                    </vueCropper>
                </div>
            </div>
            <div class="btn_list">
                <div class="choose_pic" v-if="!$weixin">
                    选择图片
                    <input type="file" v-on:change="uploadFile($event)" accept="image/jpeg,image/png">
                </div>
                <div class="choose_pic" @click="weiFile" v-if="$weixin">
                    选择图片
                </div>
                <div class="search_pic" @click="getPic">
                    识图搜索
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import TitleHead from '../common/titleHead.vue'
import VueCropper from 'vue-cropper'
import {Toast, Indicator} from 'mint-ui'
var qs = require('qs')
export default {
  components: {
    TitleHead,
    VueCropper,
    Toast,
    Indicator
  },
  data () {
    return {
      pageTitle: '识图找货',
      imgDataUrl: '',
      // imgDataUrl: 'https://imgcn.ezhaoge.com/newgoods/images/d234d701e4f2446c889e5849261ecd0f.png',
      // imgDataUrl: 'https://img11.360buyimg.com/mobilecms/s140x140_jfs/t16870/309/1554397256/239066/b6a9fc71/5acdb1beN9c5a18c7.jpg!q90.webp',
      imageType: 'jpeg',
      overCrop: ''
    }
  },
  mounted: function () {
    console.log('图片搜索')
  },
  methods: {

    // 非微信下上传图片
    uploadFile (e) {
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
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      let param = new FormData() // 创建form对象
      param.append('image', file, file.name) // 通过append向form对象添加数据
      this.$store.state.getBase64(e.target, (url) => {
        Indicator.close()
        this.imgDataUrl = 'data:image/png;base64,' + url // 显示的图片
        this.$refs.cropper.startCrop()
      })
    },
    // 微信下上传图
    weiFile () {
      window.wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          let local = res.localIds[0] // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          window.wx.getLocalImgData({
            localId: local,
            success: (res) => {
              var localData = res.localData
              if (this.$ios) {
                this.imgDataUrl = localData.replace('jgp', 'jpeg')
              } else {
                this.imgDataUrl = `data:images.jpeg;base64,${localData}`
              }

              console.log(this.imgDataUrl, 'imgDataUrl')
            }
          })
        }
      })
    },
    // url地址图片转成base64
    base (url) {
      let imgLink = url
      let tempImage = new Image()
      tempImage.src = imgLink
      tempImage.crossOrigin = '*'
      tempImage.onload = () => {
        this.baseImage = this.$store.state.getBase64Image(tempImage)
        console.log(this.baseImage, 'this.baseImage')
      }
    },
    getPic () {
      console.log(this.imgDataUrl, 'imgDataUrl')
      if (!this.imgDataUrl) {
        Toast({
          message: '请选择一张图片',
          duration: 3000
        })
        return
      }
      this.$refs.cropper.stopCrop()
      this.$refs.cropper.getCropData((url) => {
        // do something
        console.log(url)
        this.overCrop = url
        Indicator.open({
          text: '正在识别',
          spinnerType: 'fading-circle'
        })
        this.$http.post('search/img_upload', qs.stringify({image: url})).then(data => {
          console.log(data)
          Indicator.close()
          if (data.data.error_code != 200) {
            Toast({
              message: data.data.data,
              duration: 3000
            })
          } else {
            console.log('成功')
            console.log(data.data.data.search_key)
            this.$router.push({path: 'searchlist', query: {value: 'image', text: data.data.data.search_key}})
          }
        })
      })
    }

    // 图片转成base64

  }
}
</script>
