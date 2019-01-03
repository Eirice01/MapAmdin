<template>
  <el-row class="panel-group">
    <el-col :xs="12" :sm="12" :lg="5" :xl="6"  class="card-panel-col">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper icon-car">
          <img class="icon-icon" :src="sma_car"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">{{vehicleCount}}</div>
          <span class="card-panel-text">车辆总数(辆)</span>
        </div>
        <img class="icon_midd" :src="index_line">
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-pc">
          <img class="icon-icon" :src="sma_pc"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">{{onLineVehicleCount}}</div>
          <span class="card-panel-text">车辆上线(辆)</span>
        </div>
        <img class="icon_midd" :src="index_line">
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-ratio">
          <img class="icon-icon" :src="sma_ratio"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">{{onlineRate}}</div>
          <span class="card-panel-text">车辆在线率(%)</span>
        </div>
        <img class="icon_midd" :src="index_line">
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" :xl="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-alarm">
          <img class="icon-icon" :src="sma_alarm"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">{{alarmCount}}</div>
          <span class="card-panel-text">今日报警(条)</span>
        </div>
        <img class="icon_midd" :src="index_line">
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="4" :xl="5" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-alarm-done">
          <img class="icon-icon" :src="sma_alarm_done"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-num">{{handleAlarmCount}}</div>
          <span class="card-panel-text">今日处理(条)</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { queryDashInfo } from '@/api/dashboard/dashboard'
import sma_car from '@/assets/icon/sma-car.png'
import sma_pc from '@/assets/icon/sma-pc.png'
import sma_ratio from '@/assets/icon/sma-ratio.png'
import sma_alarm from '@/assets/icon/sma-alarm.png'
import sma_alarm_done from '@/assets/icon/sma-alarm-done.png'
import index_line from '@/assets/icon/index_line.png'
export default {
  data() {
    return {
      vehicleCount: 0, // 车辆总数
      onLineVehicleCount: 0, // 在线车辆
      onlineRate: '', // 在线率
      alarmCount: 0, // 报警总数
      handleAlarmCount: 0, // 已处理报警数
      sma_car: sma_car,
      sma_pc: sma_pc,
      sma_ratio: sma_ratio,
      sma_alarm: sma_alarm,
      sma_alarm_done: sma_alarm_done,
      index_line: index_line
    }
  },
  async created() {
    await this.initDashInfo()
  },
  mounted() {

  },
  methods: {
    async initDashInfo() {
      const dashInfoData = await queryDashInfo(null)
      this.vehicleCount = dashInfoData.data.vehicleCount
      this.onLineVehicleCount = dashInfoData.data.onLineVehicleCount
      this.onlineRate = dashInfoData.data.onlineRate
      this.alarmCount = dashInfoData.data.alarmCount
      this.handleAlarmCount = dashInfoData.data.handleAlarmCount
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.icon_midd{
  width: 3px;
  height: 108px;
  float: right;
}
.icon-icon{
  width:50px;
  height:50px
}
.panel-group {
  margin-top: 32px;
  .card-panel-col{
    float: left;
    margin-bottom: 32px;
    width: 20%;

  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    // overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 2px 2px 2px #bbb;
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
         background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px 1px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: left;
      font-weight: bold;
      margin-top: 26px;
      margin-left:30px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 15px;
        margin-bottom: 12px;

      }
      .card-panel-num {
        font-size: 24px;
        margin-bottom: 12px;
      }
    }
  }
}
</style>
