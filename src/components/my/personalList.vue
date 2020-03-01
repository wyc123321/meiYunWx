<template>
  <div class="my">
    <group>
      <datetime v-model="formData.createTime" placeholder="请选择填表时间"
                format="YYYY-MM-DD"
                @on-change="changeDate($event,'createTime')" title="填表时间" year-row="{value}年" month-row="{value}月"
                day-row="{value}日"
                hour-row="{value}点" minute-row="{value}分" confirm-text="完成" cancel-text="取消"></datetime>
    </group>

    <div class="messageTotal">
      <div>
        <p>{{formNumber}}</p>
        <p>填表总数</p>
      </div>
      <div class="boder">
        <p>{{totalMoney}}</p>
        <p>付款总额</p>
      </div>
    </div>
    <x-table :cell-bordered="false"  style="background-color:#fff;" v-if="list.length>0">
      <thead>
      <tr>
        <th style="font-weight: bold;">提煤单号</th>
        <th style="font-weight: bold;">车牌号</th>
        <th style="font-weight: bold;">付款金额</th>
        <th style="font-weight: bold;">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in list" :key="index" @click="goTo(item)">
        <td>{{item.deliveryCode}}</td>
        <td>{{item.carNumber}}</td>
        <td>{{item.paymentAmount}}</td>
        <td><span style="background: #5A78FE; padding: 5px 8px;border-radius:3px; color: white">查看详情</span></td>
      </tr>
      </tbody>
    </x-table>
    <div class="empty" v-if="list.length==0">
      <img src="../../../static/img/empty.svg" alt="">
      <p>暂无数据</p>
    </div>
    <toast v-model="showPositionValue" position="top" type="text" width="8rem" :time="1500" is-show-mask
           :text="message"></toast>
  </div>
</template>

<script>
  import moment from 'moment'
  import {
    Loading,
    XTable,
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
    name: "personalList",
    data() {
      return {
        message: '',
        showPositionValue: false,
        formData: {
          createTime: ''
        },
        showTip: false,
        show: false,
        list: [],
        totalMoney: 0,
        formNumber: 0,
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
      XTable
    },
    directives: {
      TransferDom
    },
    methods: {
      async changeDate(value, key) {
        console.log('change', value, key);
        this.formData[key] = value;
        this.$vux.loading.show({
          text: '加载中...'
        });
        await this.getpersonalList();
        this.$vux.loading.hide();
      },
      async getpersonalList() {
        await this.$axios.post(process.env.API_BASE + 'wayBill/personalList', {
          "createTime": this.formData.createTime
        }).then(response => {
          if (response.status == '200') {
            localStorage.setItem('createTime',this.formData.createTime)
            this.list = response.data;
            let totalMoney = 0;
            for (var i = 0; i < this.list.length; i++) {
              totalMoney += Number(this.list[i].paymentAmount)
            }
            totalMoney = totalMoney.toFixed(2);
            this.totalMoney = totalMoney;
            this.formNumber = this.list.length;
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
      goTo(item){
        this.$router.push({
          path: `/addWayDetaill`,
          query: {
            id: item.id
          }
        })
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
      if(localStorage.getItem('createTime')){
        this.formData.createTime = localStorage.getItem('createTime')
      }else {
        this.formData.createTime = moment(new Date()).format('YYYY-MM-DD');
      }
      await this.getpersonalList();
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

  .my .empty {
    font-size: 20px !important;
    text-align: center;
    margin-top: 200px;
  }

  .my .empty img {
    width: 300px;
  }

  .my .messageTotal {
    display: flex;
    align-items: center;
    margin: 40px 0;
    background: white;
    padding: 15px 0;
  }

  .my .messageTotal > div {
    width: 50%;
    text-align: center;
    font-size: 30px;
    position: relative;
  }
  .my .messageTotal > div.boder:before {
    content: '';
   position: absolute;
    width: 1px;
    height: 60px;
    background: #e0e0e0;
    left: 0;
    top: 50%;
    margin-top: -30px;
  }

  .my .messageTotal > div > p:first-child {
    font-weight: bold;
    margin-bottom: 30px;
    color: red;
  }
</style>

