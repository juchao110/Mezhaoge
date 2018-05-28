/*
 * @Author: YorkeD 
 * @Date: 2018-04-10 18:44:28 
 * @Last Modified by: YorkeD
 * @Last Modified time: 2018-05-17 17:11:51
 * 产品规格
 */
<template>
    <mt-popup
        v-model="standardBox"
        popup-transition="popup-fade"
        closeOnClickModal=false
    >
        <div class="product_standard_box">
            <div class="standard_header">
                <i class="iconfont go_back_icon l" @click="standardBack">&#xe60d;</i>
                产品规格
            </div>
            <div class="standard_content">
                <div class="standard_title_box">
                    <ul class="title_box">
                        <li class="title_text l">编号</li>
                        <li class="title_text l">
                            <em>*</em>
                            规格
                        </li>
                        <li class="title_text l">价格</li>
                    </ul>
                </div>
                <div class="content_info_box" v-for="(data,index) in addData">
                    <ul class="content_list_box">
                        <li class="list_number_box l">
                            <ul class="number_line_box">
                                <li class="line_info_box">
                                    <input type="text" v-model="numberText[index]" class="number_text">
                                </li>
                            </ul>
                        </li>
                        <li class="list_standard_box l">
                            <ul class="standard_line_box">
                                <li class="line_info_box" @click="openPicker(AttrData.id,index,AttrData.sku_name)" v-for="(AttrData,aindex) in data">
                                    <span class="color_text l" v-if="s[AttrData.id] != undefined && saveSelectdata != '' " v-for="(s,xindex) in saveSelectdata[index]">{{s[AttrData.id].name}}</span>
                                    <i class="iconfont arrow_icon r">&#xe733;</i>
                                </li>
                            </ul>
                        </li>
                        <li class="list_price_box l">
                            <ul class="price_line_box">
                                <li class="line_info_box">
                                    <input type="number" v-model="priceText[index]" class="number_text">
                                </li>
                            </ul>
                        </li>
                        <li class="list_detail_box l">
                            <ul class="detail_line_box">
                                <li class="line_info_box" @click="delStandardBtn(index)">
                                    <i class="iconfont del_icon">&#xe62c;</i>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="standard_add_btn" @click="addDom">
                <i class="iconfont add_icon">&#xe726;</i>
                继续添加
            </div>
            <div class="picker_box" v-if="popupVisible">
                <div class="picker_header">
                    <ul class="header_box">
                        <li class="cancel_btn l" @click="pickerCancel">取消</li>
                        <li class="hint_text l">请选择{{hintText}}</li>
                        <li class="confirm_btn r" @click="pickerConfirm">确定</li>
                    </ul>
                </div>
                <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
            </div>
        </div>
    </mt-popup>
</template>
<script>
import { Popup , Picker , Toast , Indicator} from 'mint-ui';
import '../../assets/sass/sell/productStandard.sass';
export default {
    props: ['standardObj'],
    data(){
        return{
            standardBox:true,
            popupVisible:false,             // 滚动的值
            slots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }
            ],
            hintText:"",                                 // 提示用户当前属性分类名称
            newAttrData:[],                              // 根据后台传过来的数组，重新循环出自己用的新数组
            standardId:'',                               // 存放规格分类的ID
            childStandardData:[],                        // father传过来的参数
            addData:[],                                  // 后台传的数组循环创建
            addDataIndex:'',                             // 根据数组的下标进行添加或改变规格名称
            numberText:[],                               // 编号，用户输入数据数组
            priceText:[],                                // 价格，用户输入数据数组
            no1ColorId:[],                               // 存放 规格 的id数组用与对比使用
            no1ColorName:[],                             // 存放 规格 的name数组用与对比使用
            no1ColorSelectName:[],                       // 存放用户选择的子name值，根据这个值去找id并合并到 modelUserSelect 中
            modelUserSelect:{id:'',name:undefined},             // +存放规格  子ID为key值，子name为value的形式组合
            modelFatherSelect:{},                        // +存放规格  父ID为key值，value 是 modelUserSelect
            modelSelect:[],                              // +存放后端需要的参数  第二级数组
            modelSelectAll:[],                           // % 存放显示的数据
            childSelectAll:[],                           // **存放后端需要的数据参数
            statusCont:0,                                // 用户判断当前规格是否完成

            saveSelectdata:[],                           // ***** 二维数组需要传给父组件  ********

            // goods_sku_id 编辑后产生这个ID需要传给后端
            goodsSkyId:[],                               // *需要传给后台
 
            // 用于判断的   
            arrLength:[],                                // 把规格的name传进来，
            arrLengthNumber:1,                           // 默认是0个，用于退出时 判断规格是否全部填写

            
            nullSelectTitle:[],                          // Null的Select的title
            editStatus:0,                                // 用于判断是否是二次编辑，0否，1是
        }
    },
    beforeCreate(){

    },
    beforeMount () {
        let vm =this;
        let indexStatus = 1;
        console.log(vm.standardObj,"standardObj");
        let childStandardData = vm.standardObj.standardData;
        for(let i in childStandardData){
            if( typeof(childStandardData[i].id) === 'number'){
                vm.newAttrData.push(childStandardData[i]);
                indexStatus = i;
            }
        }
        // 增加默认选择的文字，告诉用户这个选项是选择什么属性。**最后的结果是一个一维数组，目前的思路是当数据的时候往 saveSelectdata push 当前的数组
        let nullAttrTitle = [];
        let nullObjData = {};
        let newNullAttr = [];   // 最终结果数组
        for(let newIndex in vm.newAttrData){
            let newObj = vm.newAttrData[newIndex];
            let nullObjName = {};
            if(newObj.flag == 0){
                nullObjName['name'] = newObj.sku_name;
                nullObjName['id'] = '';
                nullObjData[newObj.id] = nullObjName;
                newNullAttr[0] = nullObjData;
            }
        }
        // 当父组件传的数据editStandard数组长度 等于 0事，那么这个就是一个新的发布，这个时候push下
        vm.saveSelectdata.push(newNullAttr);

        // 当编辑完成之后再次回到产品规格页面时，先判断编辑数据的长度，根据长度创建
        let editStandard = vm.standardObj.editStandard;
        let saveData = vm.standardObj.saveData;
        if(saveData.length > 1){
            vm.arrLengthNumber = vm.arrLength.length;
            vm.modelUserSelect = {id:'',name:undefined};
            vm.modelFatherSelect = {};
            vm.arrLength = [];
            // 循环他的length 根据length长度 创建多少个DOM
            for(let createDom in saveData){
                vm.addData.push(vm.newAttrData);
            }
        }else{
            // 如果长度不大于1 那么就创建一个DOM
            vm.addData.push(vm.newAttrData);
        }
        // 循环添加数据到对应的展示数组中
        let allAttr = [];
        let allLength = 0;
        console.log(saveData != '','length')
        if(saveData != ''){
            vm.editStatus = 1;
            console.log(vm.editStatus,"vm.editStatus");
            vm.saveSelectdata = saveData;
            vm.modelSelectAll = saveData;
            vm.childSelectAll = saveData;
            for(let i in saveData){
                let childSaveData = saveData[i]
                for(let chlidi in childSaveData){
                    let childObj = childSaveData[chlidi];
                    for(let childKeys in childObj){
                        if(childKeys != 'color_number' && childKeys != 'price' && childKeys != 'goods_sku_id'){
                            allAttr.push(childKeys);
                            allLength++
                            if(allLength == allAttr.length){
                                vm.statusCont = 1;
                            }
                        }else{
                            if(childKeys == 'goods_sku_id'){
                                vm.goodsSkyId[i] = childObj[childKeys];
                            }else if(childKeys == 'price'){
                                vm.priceText[i] = childObj[childKeys];
                            }else if(childKeys == 'color_number'){
                                vm.numberText[i] = childObj[childKeys];
                            }
                        }
                    }
                }
            }
        }
        if(editStandard.length > 0){
            vm.editStatus = 1;
            for(let editAttrIndex in editStandard){
                let no2AttreditStandard = editStandard[editAttrIndex];
                for(let no2index in no2AttreditStandard){
                    let editChildAttr = no2AttreditStandard[no2index];
                    for(let editChildIndex in editChildAttr){
                        let editAttrData = editChildAttr[editChildIndex]
                        if(editChildIndex != 'color_number' && editChildIndex != 'price' && editChildIndex != 'goods_sku_id'){

                        }else{
                            if(editChildIndex == 'goods_sku_id'){
                                vm.goodsSkyId[editAttrIndex] = editChildAttr[editChildIndex];
                            }else if(editChildIndex == 'price'){
                                vm.priceText[editAttrIndex] = editChildAttr[editChildIndex];
                            }else if(editChildIndex == 'color_number'){
                                vm.numberText[editAttrIndex] = editChildAttr[editChildIndex];
                            }
                        }
                    }
                }
            }
        }
    },
    methods:{
        // 退出并完成按钮
        standardBack(){
            let vm = this;
            let a = vm.addData.length;
            let b = vm.modelSelectAll.length;
            let c = vm.arrLengthNumber;
            let a_num = a * c;
            let b_num = b * c;
            if( a_num != b_num ){
                Toast({
                    message:'请继续填写产品规格',
                    duration: 3000
                })
            }else{
                Indicator.open({
                    spinnerType: 'fading-circle'
                })
                for(let i in vm.addData){
                    let colorNumber = {};
                    let colorPrice = {};
                    let goodsSky = {};
                    if(vm.numberText[i] == undefined){
                        colorNumber['color_number'] = '';
                    }else if(vm.numberText[i] != undefined){
                        colorNumber['color_number'] = vm.numberText[i];
                    }
                    if(vm.priceText[i] == undefined){
                        colorPrice['price'] = '';
                    }else if(vm.priceText[i] != undefined){
                        colorPrice['price'] = vm.priceText[i];
                    }
                    if(vm.goodsSkyId[i] == undefined){
                        goodsSky['goods_sku_id'] = '';
                    }else{
                        goodsSky['goods_sku_id'] = vm.goodsSkyId[i];
                    }
                    vm.childSelectAll[i].push(colorNumber);
                    vm.childSelectAll[i].push(colorPrice);
                    vm.childSelectAll[i].push(goodsSky);
                    let data = {
                        sandard:vm.childSelectAll,
                        saveData:vm.childSelectAll,
                        layerData:0
                    }
                    console.log(data,"data");
                    setTimeout(() => {
                        Indicator.close()
                        vm.$emit('sandardStatus',data);
                    }, 1000);
                }
            }
        },
        // 滚动选择的事件
        onValuesChange(picker, values) {
            this.no1ColorSelectName = values;
            if (values[0] > values[1]) {
                picker.setSlotValue(1, values[0]);
            }
        },
        // 打开滚动选项按钮
        openPicker(id,index,name){
            console.log(id);
            let vm = this;
            let modelSelectAll = vm.modelSelectAll[index];
            if(modelSelectAll != undefined){
                vm.modelFatherSelect = modelSelectAll[0];
            }
            vm.addDataIndex = index;
            vm.standardId = id;
            vm.hintText = name;
            if(vm.popupVisible){
                vm.popupVisible = false;
                Indicator.open({
                    spinnerType: 'fading-circle'
                })
                vm.no1ColorId = [];
                vm.no1ColorName = [];
                vm.scrollDataFun(id);
                let _this = vm;
                setTimeout(() => {
                    Indicator.close()
                    _this.popupVisible = true;
                }, 1000);
            }else{
                vm.no1ColorId = [];
                vm.no1ColorName = [];
                vm.scrollDataFun(id);
                vm.popupVisible = true;
            }
        },
        // 规格数据，通过ID循环并赋值给规格数据的data
        scrollDataFun(ids){
            let vm = this;
            for(let i in vm.standardObj.standardData){
                if(vm.standardObj.standardData[i].id == ids){
                    let skuData = vm.standardObj.standardData[i].sku_attr_get;
                    for(let j in skuData){
                        let skuName = skuData[j].name;
                        let skuId = skuData[j].id;
                        vm.no1ColorId.push(skuId);
                        vm.no1ColorName.push(skuName);
                        vm.slots[0].values = vm.no1ColorName;
                    }
                }
            }
        },
        // 滚动选项确认按钮
        pickerConfirm(){
            let vm = this;
            let index = vm.addDataIndex;
            let modelSelect = [];
            for(let i in vm.no1ColorName){
                if(vm.no1ColorSelectName == vm.no1ColorName[i]){
                    if(vm.modelUserSelect.name != vm.no1ColorSelectName){
                        vm.arrLength.push(vm.no1ColorSelectName);
                        vm.modelUserSelect = {id:'',name:''};
                        vm.modelUserSelect.id = vm.no1ColorId[i];
                        vm.modelUserSelect.name = vm.no1ColorName[i];
                        
                        // 替换用户选择的值
                        let saveSelectData = vm.saveSelectdata[index]
                        for(let no2Index in saveSelectData){
                            let saveSelectObj = saveSelectData[no2Index];
                            let keySelectObj = saveSelectObj[vm.standardId];
                            keySelectObj.id =  vm.no1ColorId[i];
                            keySelectObj.name = vm.no1ColorName[i];
                        }
                        vm.modelFatherSelect[vm.standardId] = vm.modelUserSelect;
                        modelSelect[index*0] = vm.modelFatherSelect;
                        vm.no1ColorName = [];
                        vm.modelSelectAll[index] = modelSelect;
                        vm.childSelectAll[index] = modelSelect;
                        // vm.saveSelectdata[index] = modelSelect;
                        if(vm.newAttrData.length == vm.arrLength.length){
                            modelSelect = [];
                            vm.modelUserSelect = {id:'',name:''};
                            vm.arrLengthNumber = vm.arrLength.length;
                            vm.arrLength = [];
                            vm.statusCont = 1;
                        }
                    }else{

                    }
                }
            }
            vm.popupVisible = false;
        },
        // 滚动选项取消按钮
        pickerCancel(){
            let vm = this;
            let index =vm.addDataIndex;
            vm.arrLength.push(vm.no1ColorSelectName);
            vm.modelUserSelect = {id:'',name:''};
            vm.modelFatherSelect = {};
            vm.modelSelect =[];
            vm.arrLength = [];
            vm.no1ColorName = [];
            vm.popupVisible = false;
        },
        // 添加规格
        addDom(){
            let vm = this;
            let a = vm.addData.length;
            let b = vm.modelSelectAll.length;
            let c = vm.arrLengthNumber;
            let a_num = a * c;
            let b_num = b * c;
            if( a_num != b_num ){
                Toast({
                    message:'请先完善当前规格',
                    duration: 3000
                })
            }else{
                if(vm.statusCont == 1){
                    vm.addData.push(vm.newAttrData);
                    let nullAttrTitle = [];
                    let nullObjData = {};
                    let newNullAttr = [];   // 最终结果数组
                    for(let newIndex in vm.newAttrData){
                        let newObj = vm.newAttrData[newIndex];
                        let nullObjName = {};
                        if(newObj.flag == 0){
                            nullObjName['name'] = newObj.sku_name;
                            nullObjName['id'] = '';
                            nullObjData[newObj.id] = nullObjName;
                            newNullAttr[0] = nullObjData;
                            vm.arrLength.push(newObj.sku_name);
                        }
                    }
                    vm.saveSelectdata.push(newNullAttr);
                    vm.arrLengthNumber = vm.arrLength.length;
                    vm.modelUserSelect = {id:'',name:''};
                    vm.modelFatherSelect = {};
                    vm.arrLength = [];
                    vm.statusCont = 0;
                }else{
                    Toast({
                        message:'请先完善当前规格',
                        duration: 3000
                    })
                }
            }
        },
        // 删除该规格
        delStandardBtn(index){
            console.log(index,"deleteIndex");
            let vm = this;
            console.log(vm.editStatus,'vm.editStatus');
            console.log(vm.saveSelectdata,"del___saveSelectdata");
            console.log(vm.modelSelectAll,"del___modelSelectAll");
            console.log(vm.childSelectAll,"del___childSelectAll");
            if(vm.addData.length == 1){
                Toast({
                    message: '规格参数至少一条',
                    duration: 3000
                })
            }else{
                vm.addData.splice(index,1);
                vm.numberText.splice(index,1);
                vm.priceText.splice(index,1);
                vm.goodsSkyId.splice(index,1);
                if(vm.editStatus == 1){
                    vm.saveSelectdata.splice(index,1);
                }else{
                    vm.saveSelectdata.splice(index,1);
                    vm.modelSelectAll.splice(index,1);
                    vm.childSelectAll.splice(index,1);
                }
                console.log(vm.saveSelectdata,"del___saveSelectdata111111111111111");
                console.log(vm.modelSelectAll,"del___modelSelectAll11111111111");
                console.log(vm.childSelectAll,"del___childSelectAll11111111111");
                vm.statusCont = 1;
            }
        }
    },
}
</script>