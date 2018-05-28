<template>
    <div class="content">
        <div class="word_search">
            <div class="search_head">
                <i class="iconfont back" @click="goBack">&#xe60d;</i>
                <div class="input_box">
                    <i class="iconfont search_icon">&#xe60a;</i>
                    <form action="" target="nm_iframe">
                        <input v-focus type="search" v-model="word" placeholder="请输入产品">
                        <input type="submit" @click="submit">
                    </form>
                    <i class="iconfont delete_word" @click="deleteWord" v-if="showDelete">&#xe68a;</i>
                    <router-link to='imgsearch' tag="i" class="iconfont go_img_search" v-if="!showDelete">&#xe652;</router-link>
                    <iframe name="nm_iframe" style="display:none;"></iframe>
                </div>
                <div class="go_search" @click="goSearch">
                    搜索
                </div>
            </div>
            <div class="search_item">
                <p>最近搜索
                    <i class="iconfont" @click="clear" v-if="oldSearch">&#xe607;</i>
                </p>
                <ul class="clearfloat" v-if="oldSearch">
                    <li v-for="s in wordList" @click="oldSearchbtn(s)" v-if="s!=''">{{s}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import '../../assets/sass/search/search.sass'
export default {
  data () {
    return {
      showDelete: false,
      word: '',
      wordList: [],
      oldSearch: ''
    }
  },
  watch: {
    word: function (newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.showDelete = true
      } else {
        this.showDelete = false
      }
    }
  },
  mounted: function () {
    console.log('搜索')
    this.oldSearch = localStorage.getItem('searchWord')
    if (this.oldSearch) {
      console.log(11111)
      this.wordList = localStorage.getItem('searchWord').split(',')
    }
  },
  methods: {
    goBack () {
      if (this.$store.state.goBack()) {
        this.$router.go(-1)
      } else {
        this.$router.push({path: '/index'})
      }
    },
    goSearch () {
      this.submit()
    },
    deleteWord () {
      this.showDelete = false
      this.word = ''
    },
    submit () {
      console.log(this.wordList)
      console.log(this.word)
      if (this.wordList.indexOf(this.word) > -1) {

      } else {
        this.wordList.unshift(this.word)
        localStorage.setItem('searchWord', this.wordList)
      }
      this.$router.push({path: 'searchlist', query: {value: 'word', text: this.word}})
    },
    oldSearchbtn (s) {
      this.$router.push({path: 'searchlist', query: {value: 'word', text: s}})
      console.log(s, 'sss')
    },
    clear () {
      this.oldSearch = ''
      this.wordList = []
      localStorage.setItem('searchWord', '')
    }
  }
}
</script>
