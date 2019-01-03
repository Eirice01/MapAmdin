<template>
  <div class="app-container">
    <el-container>
      <charts :chartData="chartData" :legendData="legendData" showCard cardTitle="车辆预警趋势" chartType="area" ref="area"></charts>
    </el-container>
  </div>
</template>

<script>
import charts from '@/components/Echarts/ECharts'
import { queryVehicleAlarmTendency } from '@/api/dashboard/dashboard'
import _ from 'lodash'

export default {
  components: { charts },
  data() {
    return {
      chartData: [],
      legendData: ['所有报警', '已处理']
    }
  },
  async created() {
    await this.queryVehicleAlarmTendency()
  },
  mounted() {

  },
  methods: {
    async queryVehicleAlarmTendency() {
      const result = await queryVehicleAlarmTendency(null)
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
