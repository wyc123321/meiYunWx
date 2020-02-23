<template>
  <div class="my">
    <group>
      <plateNumber @getPlateLicense="getPlateLicense"></plateNumber>
      <x-input title="提煤单号" v-model="formData.deliveryCode" placeholder="请输入提煤单号" label-width="85px"></x-input>
      <!--<x-input title="车牌号" v-model="formData.carNumber" placeholder="请输入车牌号" label-width="85px"></x-input>-->
    </group>
    <p class="title">发货信息</p>
    <group>
      <!--联动选择-->
      <!--<selector title="起始地" placeholder="请选择起始地" id="address-input1" :options="startAddressArr"-->
      <!--v-model="startAddressName"></selector>-->
      <popup-picker title="起始地" placeholder="请选择起始地" :data="addressList" v-model="startAddressValue"
                    @on-change="changeAddress($event,'startAddressId')"></popup-picker>
      <datetime v-model="formData.deliverDate" placeholder="请选择发货日期"
                format="YYYY-MM-DD"
                @on-change="changeDate($event,'deliverDate')" title="发货日期" year-row="{value}年" month-row="{value}月"
                day-row="{value}日"
                hour-row="{value}点" minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
      <x-input title="发货吨数" type="number" v-model="formData.deliverTon" @on-blur="blur($event,'deliverTon')"
               placeholder="请输入发货吨数"
               label-width="85px"></x-input>
    </group>
    <p class="title">收货信息</p>
    <group>
      <!--联动选择-->
      <!--<selector title="收货地" placeholder="请选择收货地" id="address-input2" :options="endAddressArr"-->
      <!--v-model="endAddressName"></selector>-->
      <popup-picker title="收货地" placeholder="请选择收货地" :data="addressList" v-model="endAddressValue"
                    @on-change="changeAddress($event,'endAddressId')"></popup-picker>
      <datetime v-model="formData.arrivalDate" placeholder="请选择收货日期"
                format="YYYY-MM-DD"
                @on-change="changeDate($event,'arrivalDate')" title="收货日期" year-row="{value}年" month-row="{value}月"
                day-row="{value}日"
                hour-row="{value}点" minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
      <x-input title="收货吨数" type="number" v-model="formData.arrivalTon" @on-blur="blur($event,'arrivalTon')"
               placeholder="请输入收货吨数"
               label-width="85px"></x-input>
    </group>
    <p class="title"> 计费信息</p>
    <group>
      <x-input title="亏吨" disabled v-model="formData.lossTon" label-width="85px"></x-input>
      <x-input title="亏吨扣费" type="number" v-model="formData.lossFee" placeholder="请输入亏吨扣费" label-width="85px"></x-input>
      <!--<x-input title="运费单价"  placeholder="请输入运费单价" label-width="85px"></x-input>-->
      <x-input title="信息费" type="number" v-model="formData.informationFee" placeholder="请输入信息费"
               label-width="85px"></x-input>
      <!--<x-input title="油票"  placeholder="请输入油票" label-width="85px"></x-input>-->
      <x-input title="超吨费" type="number" v-model="formData.extraTonFee" placeholder="请输入超吨费"
               label-width="85px"></x-input>
      <x-input title="油费" type="number" v-model="formData.oilFee" placeholder="请输入油费" label-width="85px"></x-input>
      <x-input title="运费单价" v-model="formData.freightUnit" placeholder="请输入运费单价" label-width="85px"></x-input>
      <x-input title="运费" disabled v-model="formData.freightFee" label-width="85px"></x-input>
      <x-input title="实际金额" disabled v-model="formData.paymentAmount" label-width="85px"></x-input>
      <x-input title="填报人" disabled v-model="realName" label-width="85px"></x-input>
      <x-input title="账户余额" disabled v-model="balance" label-width="85px"></x-input>
    </group>
    <div class="submitBtnList">
      <button class="submitBtn1" @click="onCompute">计算运费</button>
      <button class="submitBtn" @click="onSubmit">提交运单</button>
    </div>

    <toast v-model="showPositionValue" type="text" width="8rem" :time="1500" is-show-mask :text="message"></toast>
    <!--联动选择容器-->
    <!--<div id="container1">-->

    <!--</div>-->
    <!--<div id="container2">-->

    <!--</div>-->
    <div v-transfer-dom>
      <alert v-model="showTip" title="恭喜" @on-show="onShow" @on-hide="onHide">提交成功</alert>
    </div>
    <div v-transfer-dom>
      <confirm v-model="show"
               title="提交运单"
               @on-cancel="onCancel"
               @on-confirm="onConfirm"
               @on-show="onShow"
               @on-hide="onHide1">
        <p style="text-align:center;">{{ '确定提交运单吗?' }}</p>
      </confirm>
    </div>
  </div>
</template>

<script>
  // import AjaxPicker from 'ajax-picker'
  import moment from 'moment'
  import plateNumber from './plateNumber'
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
    name: "addWayBill",
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
          deliveryCode: '提煤单号',
          carNumber: '车牌号',
          startAddressId: '发货地',
          deliverDate: '发货日期',
          deliverTon: '发货吨数',
          endAddressId: '收货地',
          arrivalDate: '收货日期',
          arrivalTon: '收货吨数',
          lossFee: '亏吨扣费',  //
          lossTon: '亏吨',  //
          oilFee: '油费',  // 油费
          informationFee: '亏吨扣费',  // 信息费
          extraTonFee: '亏吨扣费',  // 超吨费
          freightUnit: '运费单价',  // 运费单价
          paymentAmount: '实际金额',  // 实际金额
          freightFee: '运费',  // 运费
        },
        addressList: [],
        endAddressValue: [],
        startAddressValue: [],
        realName: '',
        balance: '',
        show: false
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
      plateNumber,
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
      async onConfirm() {
        this.$vux.loading.show({
          text: '提交中...'
        });
        await this.$axios.post(process.env.API_BASE + 'wayBill/add', this.formData).then(response => {
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
      getPlateLicense(data) {
        console.log('组件传出的data', data)
        this.formData.carNumber = data;
      },
      onHide() {
        console.log('on hide');
        this.formData = {
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
        };
        this.endAddressValue=[];
        this.startAddressValue=[];
      },
      onShow() {
        console.log('on show')
      },
      changeDate(value, key) {
        console.log('change', value, key);
        this.formData[key] = value;
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
      blur(e, value) {
        console.log(e, value)
        e = e.trim();
        this.formData[value] = e
        if (this.formData.deliverTon && this.formData.arrivalTon) {
          this.formData.lossTon = (Number(this.formData.deliverTon) - Number(this.formData.arrivalTon)).toFixed(2)
        }
      },
      async onCompute() {
        let formData = this.formData;
        console.log(formData);
        for (var key in formData) {
          if (!formData[key] && key != 'paymentAmount' && key != 'freightFee' && key != 'lossTon') {
            this.showPositionValue = true;
            this.message = this.formDataVerification[key] + '不能为空';
            return
          }
        }
        this.$vux.loading.show({
          text: '计算中...'
        });
        await this.$axios.post(process.env.API_BASE + 'wayBill/calculate', this.formData)
          .then((response) => {
            if (response.status == '200') {
              this.formData.paymentAmount = response.data.paymentAmount;
              this.formData.freightFee = response.data.freightFee;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {
            if (error.response) {
              this.showPositionValue = true;
              this.message = error.response.data;
            }
          });
        this.$vux.loading.hide();
      },
      async getCityList(idArea, type) {
        await this.$axios.get(process.env.API_BASE + 'common/queryRegion', {
          params: {
            'parentCode': idArea
          }
        })
          .then((response) => {
            if (response.status == '200') {
              let list = response.data;
              list = list.map((item) => {
                return {
                  name: item.regionName,
                  id: item.regionCode
                }
              });
              if (type == 'city') {
                this.ciytList = list
              } else {
                this.countyList = list
              }
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {
            if (error.response) {
              this.showPositionValue = true;
              this.message = error.response.data;
            }
          });
      },
      async getRealName() {
        await this.$axios.post(process.env.API_BASE + 'user/detail')
          .then((response) => {
            if (response.status == '200') {
              this.realName = response.data.realName;
              this.balance = response.data.balance;
            } else {
              this.$message.error(response.data.msg);
            }
          })
          .catch((error) => {
            if (error.response) {
              this.showPositionValue = true;
              this.message = error.response.data;
            }
          });
      },
      async onSubmit() {
        let formData = this.formData;
        console.log(formData);
        for (var key in formData) {
          if (!formData[key] && key != 'paymentAmount' && key != 'freightFee') {
            this.showPositionValue = true;
            this.message = this.formDataVerification[key] + '不能为空';
            return
          }
          if (!formData[key] && (key == 'paymentAmount' || key == 'freightFee')) {
            this.showPositionValue = true;
            this.message = '请先计算运费';
            return
          }
        }
        if (this.formData.arrivalDate != this.formData.deliverDate) {
          if (moment(this.formData.arrivalDate).isBefore(this.formData.deliverDate)) {
            this.showPositionValue = true;
            this.message = "到货日期不能小于发货日期";
            return
          }
        }
        this.show = true;
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
      setAjaxPicker() {
        this.$nextTick(() => {
          var _this = this;
          var picker1 = new AjaxPicker({
            title: '地区选择', //选择器标题
            tipText: ['省份', '城市', '区/县'],  //选择器提示语（可以一个也可以多个，对应每一栏的选择提示语）
            input: 'address-input1', //点击触发选择器的input的id
            container: 'container1', //选择器的容器的id
            renderArr: [ //渲染函数数组，第一个函数对应第一个列表，以此类推，该数组中的函数数量和列表的数量一致
              async () => {
                picker1.render(_this.provinceList)
              },
              async () => {
                console.log(picker1.result1);
                await _this.getCityList(picker1.result1.id, 'city');
                picker1.render(_this.ciytList);
              },
              async () => {
                console.log(picker1.result2);
                await _this.getCityList(picker1.result2.id, 'county');
                picker1.render(_this.countyList)
              },
            ],
            success(arr) {
              // 用户选择完毕后调用，返回结果数组
              console.log(arr)
              let str = arr.map((n) => n.value).join(' / ')
              let startAddressArr = [];
              startAddressArr.push(str)
              _this.startAddressArr = startAddressArr;
              _this.startAddressName = str;
              _this.formData.startAddressId = arr[arr.length - 1].id;
            }
          })
          var picker2 = new AjaxPicker({
            title: '地区选择', //选择器标题
            tipText: ['省份', '城市', '区/县'],  //选择器提示语（可以一个也可以多个，对应每一栏的选择提示语）
            input: 'address-input2', //点击触发选择器的input的id
            container: 'container2', //选择器的容器的id
            renderArr: [ //渲染函数数组，第一个函数对应第一个列表，以此类推，该数组中的函数数量和列表的数量一致
              async () => {
                picker2.render(_this.provinceList)
              },
              async () => {
                console.log(picker2.result1);
                await _this.getCityList(picker2.result1.id, 'city');
                picker2.render(_this.ciytList);
              },
              async () => {
                console.log(picker2.result2);
                await _this.getCityList(picker2.result2.id, 'county');
                picker2.render(_this.countyList)
              },
            ],
            success(arr) {
              // 用户选择完毕后调用，返回结果数组
              console.log(arr)
              let str = arr.map((n) => n.value).join(' / ')
              let endAddressArr = [];
              endAddressArr.push(str)
              _this.endAddressArr = endAddressArr;
              _this.endAddressName = str;
              _this.formData.endAddressId = arr[arr.length - 1].id;
            }
          })
        })
      },
      init() {
        window.localStorage.setItem('preView', this.$route.path);
        let storageToken =   JSON.parse(localStorage.getItem('token'));
        if(!storageToken){
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
      await this.getRealName();
      this.$vux.loading.hide();
    },
    mounted() {

    }
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
</style>

