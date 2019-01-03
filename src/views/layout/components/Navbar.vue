<template>
<div class="topHeader">
<div class="logo">
  <img src="@/assets/logo/logo1.png" alt="">
  <img src="@/assets/logo/logo2.png" alt="">
</div>
<el-menu
  :default-active="$route.path"
  mode="horizontal"
  @select="handleSelect"
  background-color="rgb(62, 99, 171)"
  text-color="#fff"
  active-text-color="#ffd04b"
  router>
  <el-menu-item index="/dashboard">运营仪表盘</el-menu-item>
  <el-submenu index="2" background-color="#fff">
    <template slot="title">车辆监控</template>
    <el-menu-item index="/vehicle/realtime">实时监控</el-menu-item>
    <el-menu-item index="/vehicle/replyingHRD">轨迹回放</el-menu-item>
    <el-menu-item index="/vehicle/regionalZC">区域查车</el-menu-item>
    <el-menu-item index="/vehicle/multimedia">多媒体监控</el-menu-item>
    <el-menu-item index="/vehicle/textmessagesAS">文本信息下发</el-menu-item>
  </el-submenu>
  <el-submenu index="3">
    <template slot="title">报警中心</template>
    <el-menu-item index="/alarm/intelligentEWP">智能预警处理</el-menu-item>
    <el-menu-item index="/alarm/earlyWEI">预警证据查询</el-menu-item>
    <el-menu-item index="/alarm/vehicleAS">车辆报警设置</el-menu-item>
    <el-menu-item index="/alarm/vehicleAP">车辆报警处理</el-menu-item>
  </el-submenu>
  <el-submenu index="4">
    <template slot="title">统计分析</template>
    <el-menu-item index="/statisticalAnalysis/ADASEarlyWPR">ADAS预警处理报告</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/vehicleIEWA">车辆智能预警分析</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/abnormalTPS">胎压异常预警统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/fireExtinguishingDAWS">灭火装置异常预警统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/vehicleAPR">车辆报警处理报告</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/batteryAS">电池报警统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/faultAS">故障报警统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/electronicFAS">电子围栏报警统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/routePFS">线路客流统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/vehiclePFS">车辆客流统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/newEnergyRS">新能源减排量统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/vehicleLaunchRS">车辆上线率统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/statisticsVUDL">车辆上下线统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/speedingS">超速统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/mileageS">里程统计</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/logging">登录日志</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/operationalLogbook">操作日志</el-menu-item>
    <el-menu-item index="/statisticalAnalysis/instructionsTL">选指令日志</el-menu-item>
  </el-submenu>
  <el-submenu index="5">
    <template slot="title">信息管理</template>
    <el-menu-item index="/informationM/organizationalM">机构管理</el-menu-item>
    <el-menu-item index="/informationM/vehicleM">车辆管理</el-menu-item>
    <el-menu-item index="/informationM/equipmentM">设备管理</el-menu-item>
    <el-menu-item index="/informationM/SIMM">SIM卡管理</el-menu-item>
    <el-menu-item index="/informationM/driverM">司机管理</el-menu-item>
    <el-menu-item index="/informationM/vehicleBrandM">车辆品牌管理</el-menu-item>
    <el-menu-item index="/informationM/fenceM">围栏管理</el-menu-item>
    <el-menu-item index="/informationM/lineM">线路管理 </el-menu-item>
    <el-menu-item index="/informationM/userM">用户管理</el-menu-item>
    <el-menu-item index="/informationM/roleM">角色管理</el-menu-item>
    <el-menu-item index="/informationM/menuM">菜单管理</el-menu-item>
    <el-menu-item index="/informationM/dictM">字典管理</el-menu-item>
  </el-submenu>
</el-menu>
<div class="personalCenter">
  <div class="personal">
    <img src="@/assets/navicon/nav_icon_account.png" @mouseover="showPersonalMsg" @mouseout="hidPersonalMsg" title="个人中心">
    <div class="userinfo" v-show="showInfo">
      <el-row>
        <el-col :span="10">用户名：</el-col>
        <el-col :span="14">Ameda</el-col>
      </el-row>
      <el-row>
        <el-col :span="10">所属企业：</el-col>
        <el-col :span="14">泉州公交发展有限公司</el-col>
      </el-row>
      <el-row>
        <el-col :span="10">所属角色：</el-col>
        <el-col :span="14">一级管理员</el-col>
      </el-row>
      <el-row>
        <el-col :span="10">账户启用时间：</el-col>
        <el-col :span="14">2018-09-13 09:24:35</el-col>
      </el-row>
      <el-row>
        <el-col :span="10">账户停用时间：</el-col>
        <el-col :span="14">2018-09-13 09:24:45</el-col>
      </el-row>
      <el-row>
        <el-col :span="10">在线时长：</el-col>
        <el-col :span="14">3小时0分30秒</el-col>
      </el-row>
    </div>
  </div>
  <div style="float: left; padding: 0 10px;" class="msg">
    <img src="@/assets/navicon/nav_icon_message.png" alt="" title="消息" class="msg">
    <span class="msgIcon">1</span>
  </div>
  <img src="@/assets/navicon/nav_icon_logout.png" alt="" title="退出登录" class="logout">
</div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import ThemePicker from '@/components/ThemePicker'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    ThemePicker
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ])
  },
  data() {
    return {
      showInfo: false
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    handleSelect(key, keyPath) {
      this.$router.push(keyPath)
    },
    showPersonalMsg() {
      this.showInfo = true
    },
    hidPersonalMsg() {
      this.showInfo = false
    }
  }
}
</script>

<style lang="scss">
.topHeader {
  display: flex;
  >.logo {
    background: rgb(62, 99, 171);
    width: 550px;
    height: 60px;
    img {
      float: left;
    }
  }
  >.el-menu {
    flex: 1;
    display: flex;
    >.el-menu-item {
      max-width: 110px;
      flex: 1;
      // &:not(.is-disabled) {
      &:hover {
        background-color: rgb(56, 84, 137) !important;
      }
      // }
      &.is-active {
        background-color: #fff !important;
        color: rgb(62, 99, 171) !important;
        border-bottom: 3px solid rgb(66, 185, 131) !important;
      }
    }
    >.el-submenu {
      max-width: 110px;
      flex: 1;
      &:hover {
        .el-submenu__title {
          background-color: rgb(56, 84, 137) !important;
        }
      }
      &.is-active {
        .el-submenu__title {
          background-color: #fff !important;
          color: rgb(62, 99, 171) !important;
          // border-bottom-color: rgb(66, 185, 131) !important;
          border-bottom: 3px solid rgb(66, 185, 131) !important;
          i {
            color: rgb(62, 99, 171);
          }
        }
      }
      i {
        color: #fff;
      }
    }
  }
  >.personalCenter {
    width: 200px;
    height: 61px;
    float: right;
    background:rgb(62, 99, 171);
    padding: 15px 20px 0px 20px;
    border-bottom: solid 1px #e6e6e6;
    >img {
      vertical-align: middle;
      &:last-of-type {
        padding: 0 10px;
      }
    }
    .msg {
      position: relative;
      .msgIcon {
        position: absolute;
        width: 15px;
        height: 15px;
        font-size: 12px;
        background-color: red;
        border-radius: 50%;
        line-height: 15px;
        text-align: center;
        color: #fff;
        top: 0;
        right: 5px;
      }
    }
    >.personal {
      float: left;
      position: relative;
      padding: 0 10px;
      >img {
        width: 30px;
        height: 30px;
      }
      >.userinfo {
        width: 350px;
        position: absolute;
        background-color: rgb(62, 99, 171);
        z-index: 99;
        bottom: -248px;
        left: -180px;
        padding: 20px;
        border-radius: 10px;
        color: #fff;
        .el-col {
          line-height: 2;
        }
      }
    }
  }
}
// .navbar {
//   width: 100%;
//   height: 50px;
//   line-height: 50px;
//   border-radius: 0px !important;
//   .hamburger-container {
//     line-height: 58px;
//     height: 50px;
//     float: left;
//     padding: 0 10px;
//   }
//   .breadcrumb-container{
//     float: left;
//   }
//   .errLog-container {
//     display: inline-block;
//     vertical-align: top;
//   }
//   .right-menu {
//     float: right;
//     height: 100%;
//     &:focus{
//      outline: none;
//     }
//     .right-menu-item {
//       display: inline-block;
//       margin: 0 8px;
//     }
//     .screenfull {
//       height: 20px;
//     }
//     .international{
//       vertical-align: top;
//     }
//     .theme-switch {
//       vertical-align: 15px;
//     }
//     .avatar-container {
//       height: 50px;
//       margin-right: 30px;
//       .avatar-wrapper {
//         cursor: pointer;
//         margin-top: 5px;
//         position: relative;
//         .user-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 10px;
//         }
//         .el-icon-caret-bottom {
//           position: absolute;
//           right: -20px;
//           top: 25px;
//           font-size: 12px;
//         }
//       }
//     }
//   }
// }
</style>
