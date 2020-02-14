<template>
    <div class="homeHeader">
      <img :src="src" alt="">
      <div>
        <p class="customerName">{{customerInfo.customerName}}</p>
        <p class="customerType">{{industry}}</p>
        <p class="customerType">{{acc_tax}}</p>
      </div>
    </div>
</template>
<script>
  export default {
    name: "headerTop",
    data() {
      return {
        src: '',
        defaultSrc: require('../../../static/img/touxiang1.png'),
        acc_tax: '',
        industry: '',
        customerInfo: {},
      }
    },
    methods: {
      checkAccType(acc_tax) {
        var accType = "小规模";
        if (acc_tax == 1001) {
          accType = "小规模";
        } else if (acc_tax == 2001) {
          accType = "一般纳税人";
        } else if (acc_tax == 3001) {
          accType = "个体户";
        }
        return accType;
      },
      checkIndustry(industry) {
        var industryStr = "其他";
        switch (industry) {
          case 1011:
            industryStr = "服务";
            break;
          case 1021:
            industryStr = "批发和零售";
            break;
          case 1041:
            industryStr = "住宿和餐饮";
            break;
          case 1051:
            industryStr = "装饰工程";
            break;
          case 1061:
            industryStr = "建筑业";
            break;
          case 1071:
            industryStr = "广告传媒";
            break;
          case 1081:
            ndustryStr = "教育";
            break;
          case 1091:
            industryStr = "信息技术";
            break;
          case 1111:
            industryStr = "运输仓储";
            break;
          case 1121:
            industryStr = "文体娱乐";
            break;
          case 1131:
            industryStr = "医药";
            break;
          case 1141:
            industryStr = "租赁";
            break;
          default :
            industryStr = "其他";
            break;
        }
        return industryStr;
      },
    },
    async created() {
      var customerInfo = localStorage.getItem('customerInfo');
      if (customerInfo) {
        this.customerInfo = JSON.parse(customerInfo);
        this.acc_tax = this.checkAccType(this.customerInfo.acc_tax);
        this.industry = this.checkIndustry(this.customerInfo.industry);
        var touxiang = localStorage.getItem('touxiang');
        if (touxiang) {
          this.src = touxiang;
        }
        if (!this.src) {
          this.src = this.defaultSrc;
        }
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
</style>
