<template>
    <div class="content">
        <TitleHead :title="pageTitle"></TitleHead>
        <div class="about_us">
            <div class="top_bg">
                <img src="../../assets/images/user/about_02.png" alt="">
            </div>
            <div class="company_info">
                <div class="title">
                    公司简介
                </div>
                <p>一革网成立于2017年4月，总部设与上海松江区漕河泾产业园，办公面积1600多平方米，仓储配送中心设与中国嘉兴、广州。一革网合作的供应商分布于广东、浙江、江苏、福建、安徽、江西等1000多家皮革生产厂家。一革网主要服务于各类箱包类、服装类、鞋革类等工厂皮革的采购。</p>
                <p>一革网整合了互联网与传统制造业，成就“互联网+”的先导，打造一站式皮革采购服务平台。</p>
                <p class="margin_b_80">一革网整合了互联网与传统制造业，成就“互联网+”的先导，打造一站式皮革采购服务平台。</p>
                <div class="title">
                    联系方式
                </div>
                <strong>微信公众号：yigewang2018</strong>
                <strong>服务热线：400-111-6660</strong>
                <strong>邮箱服务：service@ezhaoge.com</strong>
            </div>
        </div>
    </div>
</template>

<script>
import TitleHead from '../common/titleHead.vue'
import '../../assets/sass/user/aboutUs.sass'
export default {
  components: {
    TitleHead
  },
  data () {
    return {
      pageTitle: '关于我们'
    }
  },
  mounted: function () {
    console.log('关于我们')
  },
  methods: {

  }
}
</script>
