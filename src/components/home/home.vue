<template>
  <div class="home">
    <headerTop></headerTop>
    <div class="state">
      <div>
        <img :src="accJz ? billActive: bill" alt="" :class="{small:!accJz}">
        <p class="content" v-if="accJz">取票({{billState}})</p>
        <p class="time"> {{accJz}}</p>
      </div>
      <div>
        <img :src="accState == '已完成' ?  accActive:acc " alt="" :class="{small:!accJz}">
        <p class="content" v-if="accJz">记账({{accState}})</p>
        <p class="time"> {{accJz}}</p>
      </div>
      <div>
        <img :src="accJz ? taxActive:tax" alt="" :class="{small:!accJz}">
        <p class="content" v-if="accJz">报税({{taxState}})</p>
        <p class="time"> {{accJz}}</p>
      </div>
    </div>
    <div class="date" @click="showPopup">
      <div>
        {{accJzBack}}
      </div>
      <div>
        <img src="../../../static/img/date.png" alt="">
      </div>
    </div>
    <ul class="detail" v-if="accJz">
      <li v-for="(item,index) in ads" :key="index">
        <span>{{item.seriesname}}</span>
        <span :class="{red:item.seriesdata<0}">{{item.seriesdata}}</span>
      </li>
    </ul>
    <div class="empty" v-if="!accJz">
      暂无记账信息
    </div>
    <group>
      <popup-picker v-if="accJz" :show.sync="showPopupPicker" :show-cell="false" title="TEST" @on-change='change'
                    :data="[timeList]" v-model="accJzArray"></popup-picker>
    </group>
  </div>
</template>

<script>
  import {Group, PopupPicker, Loading} from 'vux'
  import headerTop from '../headerTop/headerTop'

  export default {
    name: "home",
    data() {
      return {
        token: '',
        customerInfo: {},
        billState: '',
        taxState: '',
        accState: '',
        accJz: '', // 记账日期
        accJzBack: '', // 记账日期
        showPopupPicker: false,
        ads: [],
        timeList: [],
        accJzArray: [],
        acc: require('../../../static/img/acc.png'),
        accActive: require('../../../static/img/accActive.png'),
        tax: require('../../../static/img/tax.png'),
        taxActive: require('../../../static/img/taxActive.png'),
        bill: require('../../../static/img/bill.png'),
        billActive: require('../../../static/img/billActive.png')
      }
    },
    components: {
      Group, PopupPicker, Loading, headerTop
    },
    methods: {
      showPopup() {
        if (!this.accJz) {
          return;
        }
        this.showPopupPicker = true;
      },
      //获取驾驶舱数据
      async getJSCByTime() {
        var id = this.customerInfo.customerId;
        var time = this.accJzBack.replace("-", "");
        await this.$axios.get(process.env.API_ACC + 'api/v2/acc/wx/cockpit/' + id + "?jzqj=" + time, {
          headers: {
            'x-access-token': this.token,
          },
        })
          .then(response => {
            if (response.data.success) {
              this.ads = response.data.data.ads;
              for (let i in  this.ads) {
                // 影藏实缴税金
                if(this.ads[i].targetformulaId==8){
                  this.ads.splice(i,1)
                }
              }
            } else {
              this.showPositionValue = true;
              this.message = response.data.message;
            }
          })
          .catch(error => {

          });
      },
      //获取驾驶舱数据
      async getListTime() {
        var id = this.customerInfo.customerId;
        await this.$axios.get(process.env.API_ACC + 'api/v2/acc/wx/period/' + id, {
          headers: {
            'x-access-token': this.token,
          },
        })
          .then(response => {
            if (response.data.success) {
              this.timeList = response.data.data.periodList;
            } else {
              this.showPositionValue = true;
              this.message = response.data.message;
            }
          })
          .catch(error => {

          });
      },
      async change(value) {
        console.log(value);
        this.accJzBack = value[0];
        this.$vux.loading.show({
          text: '加载中...'
        });
        await this.getJSCByTime();
        this.$vux.loading.hide();
      }
    },
    async created() {
      var customerInfo = localStorage.getItem('customerInfo');
      if (customerInfo) {
        this.customerInfo = JSON.parse(customerInfo);
        //当前记账日期
        var accJz = this.customerInfo.acc_month_jz;
        var accState = this.customerInfo.acc_state_jz;
        if (accJz == null) {
          console.log("无记账信息");
          this.accJzArray = [];
          this.accJz = '';
        } else {
          this.accJz = accJz.replace("年", "").replace("月", "");
          this.accJz = this.accJz.substring(0, 4) + '-' + this.accJz.substring(4, 6);
          this.accJzBack = this.accJz;
          this.accJzArray.push(this.accJzBack);
        }
        if (accState == null || accState == '0001') {
          accState = "未开始";
        } else if (accState == '1001') {
          accState = "进行中";
        } else if (accState == '2001') {
          accState = "已完成";
        }
        this.accState = accState;
        this.billState = '已取';
        this.taxState = '已报';
      }
      var token = localStorage.getItem('token');
      this.token = token;
      if (!token || !customerInfo) {
        this.$router.replace('/')
      }
      if (this.accJz) {
        this.$vux.loading.show({
          text: '加载中...'
        });
        await this.getJSCByTime();
        await this.getListTime();
        this.$vux.loading.hide();
      }
    }
  }
</script>

<style scoped>
  .homeHeader {
    display: flex;
    align-items: center;
    margin: 32px 12px 32px 32px;
  }

  .homeHeader img {
    display: block;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin-right: 12px;
  }

  .customerName {
    font-size: 16px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
  }

  .customerType {
    font-size: 12px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(153, 153, 153, 1);
  }

  .state {
    margin: 0 16px 32px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 14px 0px rgba(91, 115, 249, 0.17);
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 10px 0;
    box-sizing: border-box;
  }

  .state > div {
    width: 33.33%;
    text-align: center;
  }

  .state > div img {
    width: 35px;
    height: 37px;
    display: inline-block;
    margin-bottom: -10px;
  }
  .state > div img.small {
    width: 35px;
    height: 37px;
    display: inline-block;
  }

  .state > div .content {
    margin-bottom: 5px;
    font-size: 14px;
    font-weight: bold;
  }

  .date {
    display: flex;
    width: 80%;
    justify-content: space-between;
    align-items: center;
    margin: 20px auto;
    font-size: 14px;
    font-family: PingFangSC-Semibold;
    font-weight: 600;
    color: rgba(51, 51, 51, 1);
  }

  .date img {
    display: block;
    width: 15px;
    height: 16px;
  }

  .detail {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 14px 0px rgba(91, 115, 249, 0.17);
    border-radius: 10px;
    margin: 0 16px;
    padding: 12px;
    box-sizing: border-box;
  }

  .detail li {
    list-style: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    line-height: 48px;
    border-bottom: 1px solid #F9F9F9;
    box-sizing: border-box;
  }

  .detail li:last-child {
    border: none;
  }

  .detail li > span {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
  }

  .detail li > span.red {
    font-size: 14px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(220, 82, 82, 1);
  }

  .home {
    margin-bottom: 60px;
  }

  .empty {
    height: 200px;
    line-height: 200px;
    margin: 0 16px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 4px 14px 0px rgba(91, 115, 249, 0.17);
    border-radius: 10px;
    text-align: center;
    font-size: 20px;
  }
</style>
