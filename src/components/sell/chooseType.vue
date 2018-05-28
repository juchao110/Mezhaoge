/*
 * @Author: YorkeD 
 * @Date: 2018-03-30 15:44:44 
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-04-09 11:08:03
 */
<template>
    <div class="content">   
        <TitleHeader :title="titleName"></TitleHeader>
        <div class="choose_type">
            <div class="no1_select_top">
                <ul class="select_top_box">
                    <li class="select_top_line l"></li>
                    <li class="select_top_title l">皮革</li>
                    <li class="select_top_line l"></li>
                </ul>
                <router-link tag="div" :to="{path:'releaseproduct',query:{id:'1'}}" class="no1_select_btn">皮革</router-link>
            </div>
            <div class="no1_select_top">
                <ul class="select_top_box">
                    <li class="select_top_line l"></li>
                    <li class="select_top_title l">纹路</li>
                    <li class="select_top_line l"></li>
                </ul>
                <router-link tag="div" :to="{path:'releaseproduct',query:{id:'9'}}" class="no3_select_btn l">离型纸</router-link>
                <router-link tag="div" :to="{path:'releaseproduct',query:{id:'10'}}" class="no4_select_btn l">辊筒</router-link>
            </div>
            <div class="no1_select_top">
                <ul class="select_top_box">
                    <li class="select_top_line l"></li>
                    <li class="select_top_title l">化工</li>
                    <li class="select_top_line l"></li>
                </ul>
                <router-link tag="div" :to="{path:'releaseproduct',query:{id:'5'}}" class="no3_select_btn l">聚氨酯/树脂</router-link>
                <router-link tag="div" :to="{path:'releaseproduct',query:{id:'7'}}" class="no4_select_btn l">色料</router-link>
                <router-link tag="div" :to="{path:'releaseproduct',query:{id:'6'}}" class="no3_select_btn l">表处</router-link>
                <router-link tag="div" :to="{path:'releaseproduct',query:{id:'8'}}" class="no4_select_btn l">助剂</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import TitleHeader from '../common/titleHead';
import '../../assets/sass/sell/chooseType.sass';
import { Indicator , Toast } from 'mint-ui'
export default {
    data(){
        return{
            titleName:'选择类目',        // 公共头传参
            classTypeData:[]            // 分类数据
        }
    },
    beforeCreate(){
        console.log("发布产品选择类目")
        let vm = this;
        Indicator.open({
            spinnerType: 'fading-circle'
        })
        vm.$http.get('goods/release_nav',vm.$token).then((req)=>{
            Indicator.close()
            console.log(req);
            let code = req.data.error_code;
            let msg = req.data.error_data;
            if(code == 200 ){
                vm.classTypeData = req.data.data;
            }else{
                Toast({
                    message: msg,
                    duration: 3000
                })
            }
        })
    },
    beforeMount(){

    },
    methods:{
        
    },
    components:{
        TitleHeader
    }
}
</script>
