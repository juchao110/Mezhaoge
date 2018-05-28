import Vue from 'vue'

Vue.directive('focus', {
  inserted: function (el) {
    console.log('聚焦')
    el.focus()
  }
})
