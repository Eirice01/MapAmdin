<template>
  <charts :chartData="chartData" :ratio='0.6' :legendData="legendData" showCard cardTitle="车辆报警统计" chartType="bar" ref="bar"></charts>
</template>

<script>
import charts from '@/components/Echarts/ECharts'
import { queryVehicleAlarmStatistics } from '@/api/dashboard/dashboard'
import _ from 'lodash'

export default {
  components: { charts },
  data() {
    return {
      chartData: [],
      legendData: ['所有报警', '已处理'],
      tireReportQuery: {} // 报表入参
    }
  },
  async created() {
    await this.queryVehicleAlarmStatistics()
  },
  mounted() {

  },
  methods: {
    async queryVehicleAlarmStatistics() {
      const result = await queryVehicleAlarmStatistics(this.tireReportQuery)
      const the = this
      _.forEach(_.get(result, 'data'), function(v, i) {
        the.chartData.push([_.get(v, 'alarmTypeName'), [_.get(v, 'alarmCount'), _.get(v, 'handleAlarmCount')]])
      })
      this.$refs['bar'].drawChart()
    }
  }
}
</script>
