<template>
  <div class="my">
    <group>
      <x-input title="提煤单号" v-model="formData.deliveryCode" disabled placeholder="请输入提煤单号" label-width="85px"></x-input>
      <x-input title="车牌号" v-model="formData.carNumber" disabled placeholder="请输入车牌号" label-width="85px"></x-input>
    </group>
    <p class="title">发货信息</p>
    <group>
      <x-input title="起始地" v-model="formData.startAddress.name" disabled placeholder="请输入起始地"
               label-width="85px"></x-input>
      <x-input title="发货日期" v-model="formData.deliverDate" disabled placeholder="请输入发货日期" label-width="85px"></x-input>
      <x-input title="发货吨数" type="number" v-model="formData.deliverTon" disabled
               placeholder="请输入发货吨数"
               label-width="85px"></x-input>
    </group>
    <p class="title">收货信息</p>
    <group>
      <x-input title="收货地" v-model="formData.endAddress.name" disabled placeholder="请输入收货地"
               label-width="85px"></x-input>
      <x-input title="收货日期" v-model="formData.arrivalDate" disabled placeholder="请输入收货日期" label-width="85px"></x-input>
      <x-input title="收货吨数" type="number" disabled v-model="formData.arrivalTon" @on-blur="blur($event,'arrivalTon')"
               placeholder="请输入收货吨数"
               label-width="85px"></x-input>
    </group>
    <p class="title"> 计费信息</p>
    <group>
      <x-input title="亏吨" disabled v-model="formData.lossTon" disabled label-width="85px"></x-input>
      <x-input title="亏吨扣费" type="number" v-model="formData.lossFee" disabled placeholder="请输入亏吨扣费"
               label-width="85px"></x-input>
      <!--<x-input title="运费单价"  placeholder="请输入运费单价" label-width="85px"></x-input>-->
      <x-input title="信息费" type="number" v-model="formData.informationFee" disabled placeholder="请输入信息费"
               label-width="85px"></x-input>
      <!--<x-input title="油票"  placeholder="请输入油票" label-width="85px"></x-input>-->
      <x-input title="超吨费" type="number" v-model="formData.extraTonFee" disabled placeholder="请输入超吨费"
               label-width="85px"></x-input>
      <x-input title="油费" type="number" v-model="formData.oilFee" disabled placeholder="请输入油费"
               label-width="85px"></x-input>
      <x-input title="运费单价" v-model="formData.freightUnit" disabled placeholder="请输入运费单价" label-width="85px"></x-input>
      <x-input title="运费" disabled v-model="formData.freightFee" disabled label-width="85px"></x-input>
      <x-input title="实际金额" disabled v-model="formData.paymentAmount" disabled label-width="85px"></x-input>
      <x-input title="填报人" disabled v-model="formData.user.realName" label-width="85px" disabled></x-input>
      <x-input title="填表时间" disabled v-model="formData.createTime" class="balance" disabled
               label-width="85px"></x-input>
    </group>
    <div class="submitBtnList">
      <button class="submitBtn1" @click="onSubmit">返回</button>
      <button class="submitBtn" @click="xDialogShow = true">打印</button>
    </div>
    <toast v-model="showPositionValue" type="text" width="8rem" :time="1500" is-show-mask :text="message"></toast>
    <div v-transfer-dom>
      <x-dialog v-model="xDialogShow" class="dialog-print">
       <p>选择打印机</p>
        <checker
          v-model="printerId"
          default-item-class="demo5-item"
          selected-item-class="demo5-item-selected"
        >
          <checker-item v-for="(item,index) in printList" :key="index" :disabled="item.status!=2" :value="item.id">
              <span> {{item.machineName}}</span>
              <span v-if="item.status==0">离线</span>
              <span v-if="item.status==1">缺纸</span>
              <span v-if="item.status==2">正常</span>
          </checker-item>
        </checker>
        <div class="btnList">
          <button class="submitBtn" @click="xDialogShow=false">取消</button>
          <button class="submitBtn" @click="print">确定</button>
        </div>
      </x-dialog>
    </div>
    <div v-transfer-dom>
      <alert v-model="printerFlag" title="恭喜">打印成功</alert>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import {
    Loading,
    Selector,
    Toast,
    XInput,
    Group,
    Cell,
    Datetime,
    Alert,
    TransferDomDirective as TransferDom,
    PopupPicker,
    Confirm,
    XDialog,
    Checker, CheckerItem,
  } from 'vux'

  export default {
    name: "addWayDetaill",
    data() {
      return {
        message: '',
        showPositionValue: false,
        formData: {
          deliveryCode: '',  //提煤单号
          carNumber: '',  // 车牌号
          startAddressId: '',  // 发货地
          deliverDate: '',  // 发货日期
          deliverTon: '',  // 发货吨数
          endAddressId: '',  // 收货地
          arrivalDate: '',  // 收货日期
          arrivalTon: '',  // 收货吨数
          lossFee: '',  // 亏吨扣费
          lossTon: '',  // 亏吨
          oilFee: '',  // 油费
          informationFee: '',  // 信息费
          extraTonFee: '',  // 超吨费
          freightUnit: '',  // 运费单价
          freightFee: '',  // 运费
          paymentAmount: '',  // 实际金额
          user: {
            realName: '',
            balance: '',
          },
          startAddress: {
            name: '',
          },
          endAddress: {
            name: '',
          },
        },
        xDialogShow:false,
        printList:[],
        printerId: "",
        printerFlag:false
      }
    },
    components: {
      Loading,
      Toast,
      XInput,
      Group,
      Cell,
      Datetime,
      Selector,
      Alert,
      PopupPicker,
      Confirm,
      XDialog,
      Checker, CheckerItem
    },
    directives: {
      TransferDom
    },
    methods: {
      blur(e, value) {
        console.log(e, value)
        e = e.trim();
        this.formData[value] = e
        if (this.formData.deliverTon && this.formData.arrivalTon) {
          this.formData.lossTon = (Number(this.formData.deliverTon) - Number(this.formData.arrivalTon)).toFixed(2)
        }
      },
      onSubmit() {
        this.$router.push({path: '/personalList'});
      },
      async getDetail(id) {
        await this.$axios.post(process.env.API_BASE + 'wayBill/detail', {
          id
        }).then(response => {
          if (response.status == '200') {
            this.formData = response.data;
            this.formData.createTime =moment(this.formData.createTime).format('YYYY-MM-DD HH:mm:ss') ;
          }
        }).catch((error) => {
          if (error.response) {
            this.showPositionValue = true;
            this.message = error.response.data;
          }
        })
      },
      async getALlList() {
        await this.$axios.post(process.env.API_BASE + 'printer/getALlList').then(response => {
          if (response.status == '200') {
            this.printList = response.data;
          }
        }).catch((error) => {
          if (error.response) {
            this.showPositionValue = true;
            this.message = error.response.data;
          }
        })
      },
      async print() {
        if(!this.printerId){
          this.showPositionValue = true;
          this.message = '请选择打印机';
          return
        }
        let data={
          id:this.formData.id,
          printerId:this.printerId
        };
        this.$vux.loading.show({
          text: '请稍后...'
        });
        await this.$axios.post(process.env.API_BASE + 'wayBill/print',data).then(response => {
          if (response.status == '200') {
              this.printerFlag = true;
              this.xDialogShow = false;
              this.printerId = '';
          }
        }).catch((error) => {
          if (error.response) {
            this.showPositionValue = true;
            this.message = error.response.data;
          }
        })
        this.$vux.loading.hide();
      },
      init() {
        window.localStorage.setItem('preView', this.$route.path);
        let storageToken = JSON.parse(localStorage.getItem('token'));
        if (!storageToken) {
          this.$router.replace({path: '/login'});
        }
      }
    },
    async created() {
      this.$vux.loading.show({
        text: '加载中...'
      });
      this.init();
      await this.getDetail(this.$route.query.id);
      await this.getALlList();
      this.$vux.loading.hide();
    },
  }
</script>

<style scoped>
  .my {
    margin: 30px;
    box-sizing: border-box;
  }

  .title {
    font-size: 32px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(42, 42, 42, 1);
    padding-left: 20px;
    box-sizing: border-box;
    position: relative;
    margin: 25px 0 25px;
  }

  .title:before {
    content: "";
    position: absolute;
    width: 6px;
    height: 30px;
    background: rgba(0, 98, 211, 1);
    top: 50%;
    transform: translateY(-50%);
    left: 0;
  }

  .submitBtn {
    height: 96px;
    background: rgba(0, 98, 211, 1);
    border-radius: 4px;
    outline: none;
    border: none;
    text-align: center;
    line-height: 96px;
    cursor: pointer;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    display: block;
    width: 40%;
    margin-top: 40px;
  }

  .submitBtn1 {
    height: 96px;
    border-radius: 4px;
    outline: none;
    border: none;
    text-align: center;
    line-height: 96px;
    cursor: pointer;
    font-size: 30px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    display: block;
    width: 40%;
    margin-top: 40px;
    color: #000000;
    background-color: white;
  }


  .submitBtnList {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

</style>
<style>
  .my .weui-cells {
    margin-top: 0px !important;
  }

  .my .weui-label {
    color: #797979 !important;
    font-size: 28px !important;
    font-weight: bold !important;
  }

  .my .weui-cell_access p {
    color: #797979 !important;
    font-size: 28px !important;
    font-weight: bold !important;
  }

  .my .weui-input {
    font-size: 30px !important;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #999 !important;
  }

  .my input::-webkit-input-placeholder {
    font-size: 26px;
    color: #5F5D70 !important;
  }

  .my .vux-cell-placeholder {
    font-size: 26px;
    color: #5F5D70 !important;
  }

  .my .weui-cell {
    padding: 14PX 15PX !important;
  }

  .my input {
    font-size: 30px !important;
  }

  .my .balance input.weui-input {
    color: red !important;
    -webkit-text-fill-color: red !important;
    font-weight: bold !important;
  }
  .dialog-print .demo5-item {
    width: 80%;
    height: 60px;
    line-height: 60px;
    border-radius: 3px;
    border: 2px solid #ccc;
    background-color: #fff;
    margin: 20px auto;
    display: flex !important;
    justify-content: space-between;
    padding: 0 15px !important;
    box-sizing: border-box;
  }
  .dialog-print .demo5-item-selected {
    background: #ffffff url('../../../static/img/checker.png') no-repeat right bottom;
    /*border-color: #ff4a00 !important;*/
    border: 2px solid #ff4a00 !important;
    box-sizing: border-box;
  }
  .dialog-print .weui-dialog>p{
    margin-top: 30px;
  }
  .dialog-print .weui-dialog .btnList{
    display: flex;
    justify-content: space-between;
    width: 80%;
    margin: 25px auto;
    box-sizing: border-box;
  }
  .dialog-print .weui-dialog button{
    width: 40% !important;
    height: 60px !important;
    line-height: 60px !important;
    font-size: 22px !important;
  }
  .dialog-print .weui-dialog button:first-child{
    color: #000000 !important;
    background-color: rgb(248,247,252) !important;
  }
</style>

