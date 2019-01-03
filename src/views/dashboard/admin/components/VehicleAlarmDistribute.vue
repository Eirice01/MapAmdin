<template>
  <charts :chartData="chartData" showCard cardTitle="车辆报警类型分布" chartType="doughnut" ref="pie"></charts>
</template>

<script>
import charts from '@/components/Echarts/ECharts'
import { queryVehicleAlarmDistribute } from '@/api/dashboard/dashboard'
import _ from 'lodash'

export default {
  components: { charts },
  data() {
    return {
      chartData: []
    }
  },
  async created() {
    await this.queryVehicleAlarmDistribute()
  },
  mounted() {

  },
  methods: {
    async queryVehicleAlarmDistribute() {
      const result = await queryVehicleAlarmDistribute(null)
      const the = this
      _.forEach(_.get(result, 'data'), function(v, i) {
        the.chartData.push([_.get(v, 'alarmTypeName'), _.get(v, 'alarmNum')])
      })
      this.$refs['pie'].drawChart()
    }
  }
}
</script>
