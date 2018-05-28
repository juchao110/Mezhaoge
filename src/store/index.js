import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import action from './action'

Vue.use(Vuex)
const state = {
  // 搜索列表筛选字段保存
  searchListStatus: false, // 如果Status为true 就取这里的数据，反之不取
  searchListopenData: { // 给子组件传值
    popupData: false,
    goodsNumer: '0',
    goodsType: 0,
    navData: '',
    provinceData: 0,
    classChildId: [],
    pidDataObj: {},
    cat_id_list: ''
  },
  // 商品列表页筛选字段保存
  shopListStatus: false, // 如果Status为true 就取这里的数据，反之不取
  shopListopenData: { // 给子组件传值
    popupData: false,
    goodsNumber: '0',
    goodsTypeId: '',
    navId: '',
    childId: [],
    selectData: {},
    classId: '',
    siteId: '',
    goodsType: ''
  },
  shopListkeyData: '',
  shopListGoodsType: '',
  // 存放文字搜索结果页排序状态和选中状态
  orderValue: '',
  sortText: 'desc',
  searchTabStatus: 4,
  searchSortData: {
    'sales': 0,
    'goods_id': 3,
    'sell_price': 3
  },
  // 存放列表页 销量、新品、价格的选中状态\排序状态
  tabStatus: 0,
  sortData: {
    'sales': 0,
    'goods_id': 3,
    'price': 3
  },
  purchaseLobbyBy: {
    orderBy: '',
    filter: {}
  }, // 求购大厅排序
  uploadStatus: 0, // 判断图片上传是否需要人脸识别 0需要 1不需要
  // 两位小数的正数
  testFloatNumber: function (val) {
    let floatNumberReg = /^[0-9]+(.[0-9]{1,2})?$/
    if (!floatNumberReg.test(val)) {
      return true
    } else {
      return false
    }
  },
  // 验证手机号
  testPhone: function (val) {
    let phoneReg = /^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/
    if (!phoneReg.test(val)) {
      return true
    } else {
      return false
    }
  },
  // 验证姓名支持中英文和'.'
  testName: function (val) {
    let nameReg = /^[\u4e00-\u9fa5_a-zA-Z\.]+$/
    if (!nameReg.test(val)) {
      return true
    } else {
      return false
    }
  },
  // 验证公司名支持中英文
  testCompanyName: function (val) {
    let nameReg = /^[\u4e00-\u9fa5_a-zA-Z]+$/
    if (!nameReg.test(val)) {
      return true
    } else {
      return false
    }
  },
  // 验证登录密码6-20位数字——中文
  testPassword: function (val) {
    let passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
    if (!passwordReg.test(val)) {
      return true
    } else {
      return false
    }
  },
  // 验证固定电话
  testTelphone: function (val) {
    // let telReg = /0\d{2,3}-\d{7,8}/
    let telReg = /^0\d{2,3}-\d{8}(-\d{2,6})?$/
    if (!telReg.test(val)) {
      return true
    } else {
      return false
    }
  },
  // 验证正整数
  testNumber: function (val) {
    let numberReg = /^[0-9]*$/
    if (!numberReg.test(val)) {
      return true
    } else {
      return false
    }
  },
  // 判断返回上一页是否有路由，没有去首页 true存在上一页，false不存在
  goBack: function () {
    if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
      if (history.length > 0) {
        return true
      } else {
        return false
      }
    } else { // 非IE浏览器
      if (navigator.userAgent.indexOf('Firefox') >= 0 ||
        navigator.userAgent.indexOf('Opera') >= 0 ||
        navigator.userAgent.indexOf('Safari') >= 0 ||
        navigator.userAgent.indexOf('Chrome') >= 0 ||
        navigator.userAgent.indexOf('WebKit') >= 0) {
        if (window.history.length > 2) {
          return true
        } else {
          return false
        }
      } else { // 未知的浏览器
        return true
      }
    }
  },
  // 顺滑的回到顶部
  backTop: function () {
    (function smoothscroll () {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll)
        window.scrollTo(0, currentScroll - (currentScroll / 5))
      }
    })()
  },
  // 顺滑的滚到某处
  scrollGo: function (n) {
    (function smoothscroll () {
      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop
      if (currentScroll < n) {
        window.requestAnimationFrame(smoothscroll)
        window.scrollTo(0, currentScroll + (n / 10))
      }
    })()
  },
  // 分享朋友
  shareFriend: function (title, desc, link, imgUrl) {
    console.log(imgUrl)
    window.wx.ready(() => {
      console.log('分享给朋友')
      window.wx.onMenuShareAppMessage({
        title: title, // 分享标题
        desc: desc, // 分享描述
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户确认分享后执行的回调函数
          console.log('分享朋友成功')
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
          console.log('分享朋友失败')
        }
      })
    })
  },
  shareQQ: function (title, desc, link, img) {
    window.wx.onMenuShareQQ({
      title: title, // 分享标题
      desc: desc, // 分享描述
      link: link, // 分享链接
      imgUrl: img, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    })
  },
  shareFriends: function (title, link, imgUrl) {
    window.wx.ready(() => {
      console.log('分享到朋友圈')
      window.wx.onMenuShareTimeline({
        title: title, // 分享标题
        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: imgUrl, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
          console.log('分享朋友圈成功')
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
          console.log('取消分享')
        }
      })
    })
  },
  // url图片转成base64
  getBase64Image: function (img) {
    var canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    var ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
    var dataURL = canvas.toDataURL('image/' + ext)
    return dataURL
  },
  // 本地图片转成base64
  getBase64: function (file, callback) {
    var maxWidth = 750
    if (file.files && file.files[0]) {
      var thisFile = file.files[0]
      // if (thisFile.size > 2019200) {
      //   // mualert.alertBox("图片不能超过800K");
      //   alert('图片不能超过2M')
      //   return
      // };
      var reader = new FileReader()
      reader.onload = function (event) {
        var imgUrl = event.target.result
        var img = new Image()
        img.onload = function () {
          var canvasId = 'canvasBase64Imgid',
            canvas = document.getElementById(canvasId)
          if (canvas != null) {
            document.body.removeChild(canvas)
          }
          var canvas = document.createElement('canvas')
          canvas.innerHTML = 'New Canvas'
          canvas.setAttribute('id', canvasId)
          canvas.style.display = 'none'
          document.body.appendChild(canvas)
          canvas.width = this.width
          console.log(this)
          console.log(this.width)
          canvas.height = this.height
          var imageWidth = this.width,
            imageHeight = this.height
          if (this.width > maxWidth) {
            imageWidth = maxWidth
            imageHeight = this.height * maxWidth / this.width
            canvas.width = imageWidth
            canvas.height = imageHeight
          }
          var context = canvas.getContext('2d')
          context.clearRect(0, 0, imageWidth, imageHeight)
          context.drawImage(this, 0, 0, imageWidth, imageHeight)
          var base64 = canvas.toDataURL('image/png', 1)
          var imgbase = base64.substr(22)
          callback(imgbase)
          // this.imgUrl =
        }
        img.src = imgUrl
      }
      reader.readAsDataURL(file.files[0])
    }
  }
}

export default new Vuex.Store({
  state
})
