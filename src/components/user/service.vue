/*
 * @Author: YorkeD 
 * @Date: 2018-04-17 15:08:15 
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-04-27 16:48:56
 * 在线客服
 */
<template>
    <div>
        <TitleHeader :title="pageTitle"></TitleHeader>
        <div class="service_box">
            <iframe class="service_url" :height="Height_data" scrolling="yes" :src="src_data"></iframe>
        </div>
    </div>
</template>
<script>
import TitleHeader from '../common/titleHead.vue'
export default {
    data(){
        return{
            pageTitle:'在线客服',
            Height_data:0,
            src_data:'',
            name:'',
            id:''
        }
    },
    beforeCreate(){
        this.$http.get("users/user_info", this.$token).then(res => {
			console.log(res);
			this.name = "手机端用户："+ res.data.data.user_name;
            this.id = res.data.data.identity_no;
            this.src_data=`https://webchat.7moor.com/wapchat.html?accessId=f1eb34d0-c36b-11e7-bd3b-d58f603aa126&otherParams={"nickName":"${this.name}"}&clientId=${this.id}`
            console.log(this.name)
            console.log(this.id)
		})
		.catch(function(error) {
			console.log(error);
		});
    },
    beforeMount(){
        this.Heigth_Fun();
    },
    methods:{
        Heigth_Fun(){
            this.Height_data = window.innerHeight-50;
        }
    },
    components:{
        TitleHeader
    }
}
</script>
<style scoped>
.service_box {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-top: .9rem;
}
.service_box .service_url{
    width:100%;
    border:none;
}
</style>

