<template>
  <charts :chartData="chartData" showCard :ratio='0.6' :legendData="legendData" cardTitle="智能防控预警统计" chartType="bar" ref="bar"></charts>
</template>

<script>
import menuTypeTree from '@/components/menuTypeTree'
import charts from '@/components/Echarts/ECharts'
import { getAlarmType } from '@/api/alarm/intelligentEWP'
import { queryAlarmStatistics } from '@/api/dashboard/dashboard'
import _ from 'lodash'

export default {
  components: { menuTypeTree, charts },
  data() {
    return {
      chartData: [],
      legendData: ['所有预警', '已处理'],
      warningTypes: [],
      defaultChecked: [100000, 100001, 200001, 200002, 200003, 200004, 200007],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tireReportQuery: {// 报表入参
        alarmType: '100000,100001,200001,200002,200003,200004,200007'
      },
      alarmTypeName: '',
      xAxis: []
    }
  },
  async created() {
    await this.getWarningTypes()
    await this.queryAlarmStatistics()
  },
  mounted() {

  },
  methods: {
    async getWarningTypes() {
      const result = await getAlarmType()
      this.warningTypes = [_.get(result, 'data.车辆状态预警'), _.get(result, 'data.驾驶员状态预警')]
      _.get(result, 'data.车辆状态预警.children').forEach(item => {
        this.defaultChecked.forEach(codeItem => {
          if (codeItem === item['code']) {
            this.xAxis.push(item['label'])
          }
        })
      })
      _.get(result, 'data.驾驶员状态预警.children').forEach(item => {
        this.defaultChecked.forEach(codeItem => {
          if (codeItem === item['code']) {
            this.xAxis.push(item['label'])
          }
        })
      })
      this.alarmTypeName = this.xAxis.join()
      queryAlarmStatistics()
    },
    async queryAlarmStatistics() {
      const result = await queryAlarmStatistics(this.tireReportQuery)
      const the = this
      _.forEach(_.get(result, 'data'), function(v, i) {
        the.chartData.push([_.get(v, 'alarmTypeName'), [_.get(v, 'alarmCount'), _.get(v, 'handleAlarmCount')]])
      })
      this.$refs['bar'].drawChart()
    },
    /**
     * 预警类型的选择change方法
     * @param val
     */
    handleNodeChange(val) {
      console.log(val)
      const arr = []
      const tmp = []
      this.count = val.length
      val.forEach(item => {
        arr.push(item.code)
        tmp.push(item.label)
      })
      this.tireReportQuery.alarmType = arr.join()
      this.alarmTypeName = tmp.join()
      this.xAxis = tmp
      queryAlarmStatistics()
    }
  }
}
</script>
