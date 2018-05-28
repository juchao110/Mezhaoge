// 判断当前环境
let isWeixin, isIos, isQQ

function isEquipment () {
  let UA = navigator.userAgent,
    isAndroid = /android|adr|linux/gi.test(UA),
    isIOS = /iphone|ipod|ipad/gi.test(UA) && !isAndroid,
    isBlackBerry = /BlackBerry/i.test(UA),
    isWindowPhone = /IEMobile/i.test(UA),
    isMobile = isAndroid || isIOS || isBlackBerry || isWindowPhone
  return {
    isAndroid: isAndroid,
    isIOS: isIOS,
    isMobile: isMobile,
    isWeixin: /MicroMessenger/gi.test(UA),
    isQQ: /QQ/gi.test(UA),
    isPC: !isMobile,
    isWeibo: /WeiBo/gi.test(UA)
  }
}
if (isEquipment().isWeixin) { // 是否是微信
  isWeixin = true
} else {
  isWeixin = false
}
if (isEquipment().isQQ) {
  isQQ = true
} else {
  isQQ = false
}
// 判断当前是ios还是安卓
var u = navigator.userAgent
var ios = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
if (ios) {
  isIos = true
} else {
  isIos = false
}
if (isWeixin) {
  window.wx = require('weixin-js-sdk')
}

export {
  isWeixin,
  isIos,
  isQQ
}
