<template>
    <div class="content">
        <TitleHead :title="pageTitle"></TitleHead>
        <div class="information_page" v-if="info">
            <h1 class="info_title">{{info.title}}</h1>
            <div class="info_from">
                <div class="from l">
                    来源：<span>{{info.source}}</span>
                </div>
                <div class="time r">
                    {{info.created_at}}
                </div>
            </div>
            <div class="info_desc" v-if="info.description">
                {{info.description}}
            </div>
            <div class="info_content">
                <div v-html="info.body">
                </div>
            </div>
            <div class="info_zan" :class="{on:status==2}" @click="enter(info.id)">
                <i class="iconfont">&#xe654;</i>
                {{number}}赞
            </div>
        </div>
    </div>
</template>

<script>
import '../../assets/sass/information/information.sass'
import TitleHead from '../common/titleHead.vue'
import {Toast, Indicator} from 'mint-ui'
export default {
  components: {
    TitleHead,
    Toast,
    Indicator
  },
  data () {
    return {
      pageTitle: '网站公告',
      info: '',
      number: '',
      status: 1 // 点赞的状态 1==点赞   2==取消点赞
    }
  },
  created: function () {
    console.log('资讯')
  },
  mounted: function () {
    this.getInfo(this.$route.params.id)
  },
  methods: {
    getInfo (id) {
      Indicator.open({
        spinnerType: 'fading-circle'
      })
      this.$http.get(`wap/zx/detail?id=${id}`).then((data) => {
        console.log(data)
        Indicator.close()
        this.info = data.data.data
        this.number = this.info.upvote
        if (this.$weixin) {
          this.$store.state.shareFriend(this.info.title, `我分享了【${this.info.title}】，快来看吧！`, window.location.href, this.info.pic_url)
          this.$store.state.shareFriends(this.info.title, window.location.href, this.info.pic_url)
        }
      }).catch(() => {
        Indicator.close()
        Toast({
          message: '网络错误，请稍后再试',
          duration: 3000
        })
      })
    },
    enter (id) {
      console.log('点赞事件')
      this.$http.get(`wap/zx/ajax_upvote?id=${id}&status=${this.status}`).then(data => {
        console.log(data)
        if (data.data.data.code == 200) {
          if (this.status == 1) {
            this.status = 2
          } else {
            this.status = 1
          }
          Toast({
            message: data.data.data.msg,
            duration: 3000
          })
          this.number = data.data.data.upvote
        } else {
          Toast({
            message: data.data.data.msg,
            duration: 3000
          })
        }
      })
    }
  }
}
</script>
