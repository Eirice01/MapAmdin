<template>
  <charts :chartData="chartData" showCard cardTitle="智能预警类型分布" chartType="doughnut" ref="pie"></charts>
</template>

<script>
import charts from '@/components/Echarts/ECharts'
import { queryAlarmDistribute } from '@/api/dashboard/dashboard'
import _ from 'lodash'

export default {
  components: { charts },
  data() {
    return {
      chartData: []
    }
  },
  async created() {
    await this.queryAlarmDistribute()
  },
  mounted() {

  },
  methods: {
    async queryAlarmDistribute() {
      const result = await queryAlarmDistribute(null)
      const the = this
      _.forEach(_.get(result, 'data'), function(v, i) {
        the.chartData.push([_.get(v, 'alarmTypeName'), _.get(v, 'alarmNum')])
      })
      this.$refs['pie'].drawChart()
    }
  }
}
</script>
