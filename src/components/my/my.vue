<template>
  <div class="my">
    <group>
      <x-input title="提煤单号" name="username" placeholder="请输入提煤单号" label-width="85px"></x-input>
      <x-input title="车牌号" name="username" placeholder="请输入车牌号" label-width="85px"></x-input>
    </group>
    <p class="title">发货信息</p>
    <group>
      <x-address @on-hide="logHide" @on-show="logShow" title="目的地" v-model="value" :list="addressData"
                 @on-shadow-change="onShadowChange" placeholder="请选择起始地" :show.sync="showAddress"></x-address>
      <datetime v-model="value5" placeholder="请选择发货日期" :min-year=2000 :max-year=2016 format="YYYY-MM-DD HH:mm"
                @on-change="change" title="收货日期" year-row="{value}年" month-row="{value}月" day-row="{value}日"
                hour-row="{value}点" minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
      <x-input title="车牌号" name="username" placeholder="请输入发货吨数" label-width="85px"></x-input>
    </group>
    <p class="title">收货信息</p>
    <group>
      <x-address @on-hide="logHide" @on-show="logShow" title="目的地" v-model="value" :list="addressData"
                 @on-shadow-change="onShadowChange" placeholder="请选择目的地" :show.sync="showAddress"></x-address>
      <datetime v-model="value5" placeholder="请选择收货日期" :min-year=2000 :max-year=2016 format="YYYY-MM-DD HH:mm"
                @on-change="change" title="收货日期" year-row="{value}年" month-row="{value}月" day-row="{value}日"
                hour-row="{value}点" minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
      <x-input title="收货吨数" name="username" placeholder="请输入收货吨数" label-width="85px"></x-input>
    </group>
    <p class="title"> 计费信息</p>
    <group>
      <x-input title="亏吨" name="username" placeholder="请输入亏吨" label-width="85px"></x-input>
      <x-input title="亏吨扣费" name="username" placeholder="请输入亏吨扣费" label-width="85px"></x-input>
      <x-input title="运费单价" name="username" placeholder="请输入运费单价" label-width="85px"></x-input>
      <x-input title="信息费" name="username" placeholder="请输入信息费" label-width="85px"></x-input>
      <x-input title="油票" name="username" placeholder="请输入油票" label-width="85px"></x-input>
      <x-input title="超吨费" name="username" placeholder="请输入超吨费" label-width="85px"></x-input>
      <x-input title="运费" name="username" placeholder="请输入运费" label-width="85px"></x-input>
      <x-input title="实际金额" name="username" placeholder="实际金额" label-width="85px"></x-input>
    </group>
    <button class="submitBtn">确 定</button>
    <!--<toast v-model="showPositionValue" type="text" width="12rem" :time="1500" is-show-mask :text="message"-->
    <!--position="top"></toast>-->
  </div>
</template>

<script>
  import {XInput, Group, XButton, Cell, Datetime, XAddress, ChinaAddressV4Data} from 'vux'

  export default {
    name: "my",
    data() {
      return {
        token: '',
        list: [],
        message: '',
        showPositionValue: false,
        count: 0,
        show: false,
        value5: '',
        value: [],
        addressData: ChinaAddressV4Data,
        showAddress: false
      }
    },
    components: {
      XInput,
      XButton,
      Group,
      Cell,
      Datetime,
      XAddress
    },
    methods: {
      change(value) {
        console.log('change', value)
      },
      doShowAddress() {
        this.showAddress = true
        setTimeout(() => {
          this.showAddress = false
        }, 2000)
      },
      onShadowChange(ids, names) {
        console.log(ids, names)
      },
      changeData() {
        this.value2 = ['430000', '430400', '430407']
      },
      changeDataByLabels() {
        this.value2 = ['广东省', '广州市', '天河区']
      },
      changeDataByLabels2() {
        this.value2 = ['广东省', '中山市', '--']
      },
      getName(value) {
        return value2name(value, ChinaAddressV4Data)
      },
      logHide(str) {
        console.log('on-hide', str)
      },
      logShow(str) {
        console.log('on-show')
      }
    },
    async created() {

    }
  }
</script>

<style scoped>
  .my {
    margin: 30px;
    box-sizing: border-box;
  }

  .title {
    font-size: 30px;
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
    margin: 0 auto;
    outline: none;
    border: none;
    color: white;
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
  }

  .my .weui-cell_access p {
    color: #797979 !important;
    font-size: 28px !important;
  }

  .my .weui-input {
    font-size: 28px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(42, 42, 42, 1) !important;
  }

  .my input::-webkit-input-placeholder, {
    font-size: 26px;
    color: #5F5D70 !important;
  }

  .my .vux-cell-placeholder {
    font-size: 26px;
    color: #5F5D70 !important;
  }
</style>

