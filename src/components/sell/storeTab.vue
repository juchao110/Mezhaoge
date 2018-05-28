<template>
    <div class="content">
        <div class="store_tab">
            <div class="title_head">
                <i class="iconfont back" @click="goBack">&#xe60d;</i>
                添加标签
            </div>
            <div v-for="(data,index) in list.list">
                <div class="tab_title">
                    <span v-if="index=='wen_lu'">纹路</span>
                    <span v-if="index=='yong_tu'">用途</span>
                    <span v-if="index=='cai_zhi'">材质</span>
                    <span v-if="index=='di_bu'">底布</span>
                    <span v-if="index=='hou_du'">厚度</span>
                    <span v-if="index=='gong_yi'">工艺</span>
                    <i @click="showMore(index)">更多></i>
                </div>
                <ul class="tab_list clearfloat" :class="{auto:more==index}">
                    <li v-for="(cate,sindex) in data" :class="{on:status[cate.id]}" @click="chooseCate(index,cate.name,cate.id)">{{cate.name}}</li>
                </ul>
            </div>
            <button type="button" class="is_choose" @click="save">选好了</button>
        </div>
    </div>
</template>

<script>
import '../../assets/sass/sell/setStore.sass'
export default {
  props: {
    cate: ''
  },
  data () {
    return {
      list: '',
      choiceId: {},
      choiceName: {},
      status: {},
      more: ''
    }
  },
  created: function () {

  },
  mounted: function () {
    this.list = this.cate
    window.scroll(0, 0)
    console.log(this.list, 'list')
    for (let i in this.list.id) {
      this.choiceId[i] = this.list.id[i]
      for (let j in this.list.id[i]) {
        this.$set(this.status, this.list.id[i][j], true)
      }
    }
    for (let i in this.list.name) {
      this.choiceName[i] = this.list.name[i]
    }
  },
  computed: {

  },
  watch: {
    status: function (newVal, oldVal) {
      console.log(newVal, oldVal)
    }
  },
  methods: {
    goBack () {
      this.$emit('hideCate', false)
    },
    showMore (index) {
      this.more = index
    },
    chooseCate (cate, name, id) {
      if (!this.choiceId[cate]) {
        this.choiceId[cate] = []
        this.choiceName[cate] = []
      }
      if (this.choiceId[cate].indexOf(id) > -1) {
        this.$set(this.status, id, false)
        this.choiceId[cate].splice(this.choiceId[cate].indexOf(id), 1)
        this.choiceName[cate].splice(this.choiceName[cate].indexOf(name), 1)
      } else {
        this.$set(this.status, id, true)
        this.choiceId[cate].push(id)
        this.choiceName[cate].push(name)
      }
    },
    save () {
      // let idList = [], nameList = []
      // for (let i in this.choiceId) {
      // idList = [...idList, ...this.choiceId[i]]
      // }
      // for (let i in this.choiceName) {
      // nameList = [...nameList, ...this.choiceName[i]]
      // }
      this.$emit('cateData', {id: this.choiceId, name: this.choiceName, status: false})
    }
  }
}
</script>

<style lang="css">
</style>
