<template>
  <div class="my">
    <group>
      <popup-picker title="起始地" placeholder="请选择起始地" :data="addressList" v-model="startAddressValue"
                    @on-change="changeAddress($event,'startAddressId')"></popup-picker>
      <popup-picker title="目的地" placeholder="请选择目的地" :data="addressList" v-model="endAddressValue"
                    @on-change="changeAddress($event,'endAddressId')"></popup-picker>
      <popup-picker title="吨位取值" placeholder="请选择吨位取值" :data="tonList" v-model="tonValue"
                    @on-change="changeTon($event,'tonValue')"></popup-picker>
    </group>
    <div class="submitBtnList submitBtnList1">
      <button class="submitBtn2" @click="onSubmit">提交计费配置</button>
    </div>
    <toast v-model="showPositionValue" position="top" type="text" width="8rem" :time="1500" is-show-mask :text="message"></toast>

    <div v-transfer-dom>
      <alert v-model="showTip" title="恭喜" @on-show="onShow" @on-hide="onHide">提交成功</alert>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show"
               title="提交计费配置"
               @on-cancel="onCancel"
               @on-confirm="onConfirm"
               @on-show="onShow"
               @on-hide="onHide1">
        <p style="text-align:center;">{{ '确定提计费配置吗?' }}</p>
      </confirm>
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
    Confirm
  } from 'vux'

  export default {
    name: "addCalculateConfig",
    data() {
      return {
        message: '',
        showPositionValue: false,
        formData: {
          startAddressId: '',  // 发货地
          endAddressId: '',  // 收货地
          tonValue: '',  // 吨位取值
        },
        provinceList: [],
        ciytList: [],
        countyList: [],
        startAddressName: "",
        startAddressArr: [],
        endAddressArr: [],
        endAddressName: '',
        showTip: false,
        formDataVerification: {
          startAddressId: '起始地',
          endAddressId: '目的地',
          tonValue: '吨位取值',  // 吨位取值
        },
        addressList: [],
        endAddressValue: [],
        startAddressValue: [],
        tonValue: [],
        realName: '',
        show: false,
        tonList: [
          [{
            name: "发货吨数",
            value: "发货吨数",
            id: 1
          },
            {
              name: "收货吨数",
              value: "收货吨数",
              id: 2
            },
            {
              name: "最小吨数",
              value: "最小吨数",
              id: 3
            }]
        ]
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
      Confirm
    },
    directives: {
      TransferDom
    },
    methods: {
      onHide1() {
        console.log('on hide')
      },
      onShow() {
        console.log('on show')
      },
      onCancel() {
        this.show = false;
      },
      changeAddress(value, key) {
        console.log('change', value, key);
        let result = this.addressList[0].find((item) => {
          return item.name == value
        })
        if (result) {
          console.log(result)
          this.formData[key] = result.id;
        }
      },
      changeTon(value, key) {
        console.log('change', value, key);
        let result = this.tonList[0].find((item) => {
          return item.name == value
        });
        if (result) {
          console.log(result)
          this.formData[key] = result.id;
        }
      },
      async onConfirm() {
        this.$vux.loading.show({
          text: '提交中...'
        });
        await this.$axios.post(process.env.API_BASE + 'calculateConfigLog/add', this.formData).then(response => {
          if (response.status == '200') {
            this.showTip = true;
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {
          if (error.response) {
            this.showPositionValue = true;
            this.message = error.response.data;
          }
        });
        this.$vux.loading.hide();
      },
      onHide() {
        console.log('on hide');
        this.formData = {
          startAddressId: '',  // 发货地
          endAddressId: '',  // 收货地
          tonValue: '',  // 吨位取值
        };
        this.endAddressValue=[];
        this.startAddressValue=[];
        this.tonValue=[];
      },
      onShow() {
        console.log('on show')
      },
      async onSubmit() {
        let formData = this.formData;
        console.log(formData);
        for (var key in formData) {
          if (!formData[key]) {
            this.showPositionValue = true;
            this.message = this.formDataVerification[key] + '不能为空';
            return
          }
          this.show = true;
        }
      },
      async getAddressList() {
        await this.$axios.post(process.env.API_BASE + 'address/getALlList').then(response => {
          if (response.status == '200') {
            let addressList = [];
            let arr = [];
            addressList = response.data;
            addressList = addressList.map((item) => {
              return {
                name: item.name,
                value: item.name,
                id: item.id
              }
            })
            arr.push(addressList)
            this.addressList = arr;
          } else {
            this.$message.error(response.data);
          }
        }).catch((error) => {
          if (error.response) {
            this.showPositionValue = true;
            this.message = error.response.data;
          }
        })
      },
      init() {
        let storageToken =   JSON.parse(localStorage.getItem('token'));
        if(!storageToken){
          window.localStorage.setItem('preView', this.$route.path);
          this.$router.replace({path: '/login'});
        }
      }
    },
    async created() {
      this.$vux.loading.show({
        text: '加载中...'
      });
      this.init()
      await this.getAddressList();
      this.$vux.loading.hide();
    },
  }
</script>

<style scoped>
  .my {
    margin: 0 30px;
    box-sizing: border-box;
    padding-top: 40px;
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


  .submitBtn2 {
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
    width: 100%;
    margin-top: 40px;
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
</style>

