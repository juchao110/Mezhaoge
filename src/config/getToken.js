import Vue from 'vue'

export default function () {
  if (localStorage.token) {
    Vue.prototype.$token = {
      headers: {
        'Authorization': localStorage.token
      }
    }
    //   图片的token 使用
    Vue.prototype.$ImgHeader = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': localStorage.token
      }
    }
  }
}
