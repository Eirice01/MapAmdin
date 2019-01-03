<template>
  <div class="vehicle">
    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin: 0 20px">
      <el-tab-pane label="进入区域报警" name="enterArea">
        <enter-area></enter-area>
      </el-tab-pane>
      <el-tab-pane label="离开区域报警" name="leaveArea">
        <leave-area></leave-area>
      </el-tab-pane>
      <el-tab-pane label="区域限速报警" name="speedLimit">
        <speed-limit></speed-limit>
      </el-tab-pane>
      <el-tab-pane label="区域超时报警" name="overTime">
        <over-time></over-time>
      </el-tab-pane>
      <el-tab-pane label="路段偏移报警" name="excursion">
        <excursion></excursion>
      </el-tab-pane>
      <el-tab-pane label="路段限速报警" name="subsection">
        <subsection></subsection>
      </el-tab-pane>
    </el-tabs>
    <report-footer></report-footer>
  </div>
</template>
<script>
import enterArea from './enterArea'
import leaveArea from './leaveArea'
import speedLimit from './speedLimit'
import overTime from './overTime'
import excursion from './excursion'
import subsection from './subsection'

export default {
  components: { enterArea, leaveArea, speedLimit, overTime, excursion, subsection },
  data() {
    return {
      activeName: 'enterArea'
    }
  },
  methods: {
    handleClick(tab, event) {
    }
  }
}
</script>
<style lang="scss">
.vehicle {
  .el-tabs__nav-wrap {
    margin: 0 30px;
    &::after {
      height: 0;
    }
  }
  .el-tabs__item {
    &:hover {
      color: rgb(41, 59, 90);
      font-weight: 700;
    }
    &.is-active {
      color: rgb(41, 59, 90);
      font-weight: 700;
    }
  }
  .el-tabs__active-bar {
    background-color: rgb(41, 59, 90);
  }
}
</style>
