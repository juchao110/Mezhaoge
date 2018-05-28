<!-- 二次弹窗组件 -->
<template>
    <div class="tel_box">
        <mt-popup v-model="showBox" position="middle" :closeOnClickModal="false">
            <div class="phone_content">
                <p>确定拨打电话？</p>
                <!-- <p>姓名：<span class="orange">{{service.name}}</span></p>
                <p>手机：<span class="blue">{{service.phone}}</span></p>
                <p>全程为您提供撮合相关顾问服务</p> -->
                <div class="checkout clearfloat">
                    <div class="cancel" @click="cancel">取消</div>
                    <div class="submit" @click="cancel">
                        <a :href="`tel:${service}`">拨打电话</a>
                    </div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
export default {
  props: {
    show: '',
    service: {}
  },
  watch: {
    show: function (newVal, oldVal) {
      this.showBox = newVal
    }
  },
  data () {
    return {
      showBox: false
    }
  },
  mounted: function () {
    this.showBox = this.show
    console.log(1212)
    console.log(this.service)
  },
  methods: {
    cancel () {
      this.$emit('cancelPhone', false)
    }
  }
}
</script>

<style scoped>
    .phone_content{
        width: 6rem;
        padding-top: .6rem;
    }
    .phone_content p{
        height: .4rem;
        line-height: .4rem;
        font-size: 14px;
        color: #333;
        text-align: center;
    }
    .phone_content p .orange{
        color: #f60
    }
    .phone_content p .blue{
        color: #09e
    }
    .phone_content .checkout{
        height: .8rem;
        line-height: .8rem;
        font-size: 14px;
        color: #09e;
        border-top: 1px solid #ddd;
        margin-top: .4rem;
    }
    .phone_content .checkout div{
        width: 50%;
        float: left;
        text-align: center;
    }
    .phone_content .checkout .cancel{
        border-right: 1px solid #ddd;
    }
    .phone_content .checkout .submit a{
        color: #09e;
    }
</style>
