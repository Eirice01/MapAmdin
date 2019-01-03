<template>
  <charts :chartData="chartData" :ratio='0.6' showCard cardTitle="智能防控预警趋势" chartType="area" ref="area"></charts>
</template>

<script>
import charts from '@/components/Echarts/ECharts'
import { queryAlarmTendency } from '@/api/dashboard/dashboard'
import _ from 'lodash'

export default {
  components: { charts },
  data() {
    return {
      chartData: []
    }
  },
  async created() {
    await this.queryAlarmTendency()
  },
  mounted() {

  },
  methods: {
    async queryAlarmTendency() {
      const result = await queryAlarmTendency(null)
      const the = this
      _.forEach(_.get(result, 'data'), function(v, i) {
        const tempData = []
        _.forEach(_.get(v, 'list'), function(_v, j) {
          tempData.push([_.get(_v, 'alarmTypeName'), _.get(_v, 'alarmNum')])
        })
        the.chartData.push([_.get(v, 'dateTime'), _.get(v, 'totalAlarmNum'), tempData])
      })
      this.$refs['area'].drawChart()
    }
  }
}
</script>
