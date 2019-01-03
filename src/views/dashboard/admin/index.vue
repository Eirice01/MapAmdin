<template>
  <div class="dashboard-editor-container">
    <div>
      <span style="font-size:25px">运营仪表盘</span>
    </div>
    <panel-group></panel-group>
    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :xs="24" :sm="24" :lg="15" :xl="12">
          <alarm-statistics></alarm-statistics>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="9" :xl="12">
          <alarm-distribute></alarm-distribute>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-bottom: 20px">
      <el-col :xs="24" :sm="24" :lg="15" :xl="12">
          <alarm-tendency></alarm-tendency>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="9" :xl="12">
          <vehicle-rank></vehicle-rank>
      </el-col>
    </el-row>

    <el-row :gutter="20" >
      <el-col :xs="24" :sm="24" :lg="15" :xl="12">
          <vehicle-alarm-statistics></vehicle-alarm-statistics>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="9" :xl="12">
          <vehicle-alarm-distribute></vehicle-alarm-distribute>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import PanelGroup from './components/PanelGroup'
  import AlarmStatistics from './components/AlarmStatistics'
  import AlarmDistribute from './components/AlarmDistribute'
  import AlarmTendency from './components/AlarmTendency'
  import VehicleRank from './components/VehicleRank'
  import VehicleAlarmStatistics from './components/VehicleAlarmStatistics'
  import VehicleAlarmDistribute from './components/VehicleAlarmDistribute'

  export default {
    name: 'dashboard-admin',
    components: {
      PanelGroup,
      AlarmStatistics,
      AlarmDistribute,
      AlarmTendency,
      VehicleRank,
      VehicleAlarmStatistics,
      VehicleAlarmDistribute
    }
  }

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);

    .chart-wrapper {
      width: 700px;
      height: 400px;
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
      box-shadow: 2px 2px 2px #bbb;
    }
  }

</style>
