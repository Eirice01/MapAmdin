<!-- 
@author lishibin
@date 2018-11-19
@desc 报表页面底部foot 组件
-->
<template>
    <el-footer class="footer_bg" height="34px">
      <el-row>
      <el-col :span="4">所有车辆:{{info.vehicleCount}}</el-col>
      <el-col :span="4">车辆上线:{{info.onLineVehicleCount}}</el-col>
      <el-col :span="4">在线率:{{info.onlineRate}}</el-col>
      <el-col :span="4">今日报警:{{info.alarmCount}}</el-col>
      <el-col :span="4">今日处理:{{info.handleAlarmCount}}</el-col>
      <el-col :span="4">报警声音<el-switch
        v-model="val"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
      </el-col>
      </el-row>
      </el-footer>
</template>
<script>
// 查询信息
import { queryDashInfo } from '@/api/dashboard/dashboard'
import _ from 'lodash'
export default {
  data() {
    return {
      val: true,
      info: {}
    }
  },
  async created() {
    await this.initPage()
  },
  methods: {
    async initPage() {
      const result = await queryDashInfo(null)
      this.info = _.get(result, 'data')
    }
  }
}
</script>
<style scoped>
/*
    底部样式
*/
  .footer_bg{
    background: #fff; 
    bottom:0px; 
    padding: 9px 10px 0 20px; 
    box-shadow: 0 0 10px #ccc;
    position: fixed;
    z-index: 10000;
    font-size: 12px;
    width: 100%;
  }
</style>
