<template>
    <div class="purchase_list">
        <SearchHeader></SearchHeader>
        <router-view></router-view>
    </div>
</template>

<script>
import SearchHeader from '../common/searchHead'
export default {
    data(){
        return{

        }
    },
    beforeCreate(){

    },
    beforeMount(){

    },
    methods:{

    },
    components:{
        SearchHeader
    }
}
</script>
