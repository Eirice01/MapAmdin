<template>
    <el-container v-loading.body="listLoading" class="app-container">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label= "查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDate"></data-pickers>
          </el-form-item>
          <el-form-item>
            <select-car-single ref="selectCarSingle" @selectedCarId="selectedCarId"></select-car-single>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini"  @click="initPage">查询</el-button>
            <el-button type="primary" size="mini"  @click="resetPage">重置</el-button>
            <el-button type="primary" size="mini" >导出</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <charts :chartData="chartData" hideLegend showCard cardTitle='<span style="font-size:14px">碳减排量报表</span>' :ratio=1 :legendData="legendData"  chartType="bar" ref="bar"></charts>
      </el-main>
      <el-main style="padding-top:0;">
        <el-table :data="tableData" :columns="columns"  border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-table-column align="center" width="50" label="序号">
            <template scope="scope"><span>{{scope.$index+(tableQuery.page - 1) * tableQuery.limit + 1}} </span></template>
          </el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :prop="column.key" :label="column.title"  :width="column.width">
          <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmType'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else-if="column.key === 'handleType'" v-text="handlerTypeformatter(scope.row[column.key])"></span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
         <!-- 分页区 -->
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange" @current-change="handleChange" :current-page="tableQuery.page"
                       :page-sizes="[10,20,30, 50]" :page-size="tableQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
      <alarm-info :dialogTitle="dialogTitle" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
import mixins from '@/common/mixins'
import { getVehicleRelease, getVehicleReleaseCharts } from '@/api/report/reportApi'
import _ from 'lodash'
export default {
  mixins: [mixins],
  data() {
    return {
      // 预警类型开始
      menus: [],
      legendData: ['理论碳减排（每日车辆总数）'],
      tableQuery: {
        page: 1,
        limit: 10,
        vehicleIds: '',
        startTime: '',
        endTime: ''
      },
      chartQuery: {
        plateNos: '',
        startTime: '',
        endTime: ''
      },
      count: 0,
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      allotDialogVisible: false,
      tableData: [],
      total: 0,
      defaultTreeProp: {
        children: 'children',
        label: 'text'
      },
      chartData: [],
      columns: [
        {
          key: 'plateNo',
          title: '车牌号',
          width: '100'
        },
        {
          key: 'deptName',
          title: '所属线路',
          width: '200'
        },
        {
          key: 'runMileage',
          title: '发生里程（KM）',
          width: '140'
        },
        {
          key: 'socConsume',
          title: '实际耗电（℃）',
          width: '200'
        },
        {
          key: 'actualCarbon',
          title: '产生碳排（KG）',
          width: '200'
        },
        {
          key: 'theoryFuel',
          title: '理论燃油（L）',
          width: '200'
        },
        {
          key: 'theoryCarbon',
          title: '理论碳排（KG）',
          width: '200'
        },
        {
          key: 'socischarge',
          title: '理论减排量（KG）',
          width: '200'
        }
      ]
    }
  },
  async mounted() {
    await this.initPage()
  },
  methods: {
    async initPage() {
      this.listLoading = true
      await this.initCharts()
      await this.initTableList()
      this.listLoading = false
    },
    async resetPage() {
      this.listLoading = true
      this.$refs.selectCarSingle.clearSelected()
      this.tableQuery.page = 1
      this.tableQuery.limit = 10
      this.tableQuery.vehicleIds = ''
      this.chartQuery.plateNos = ''
      this.$refs.dataPickers.resetDate()
      await this.initPage()
    },
    selectedCarId(id) {
      this.tableQuery.vehicleId = id
      this.chartQuery.vehicleId = id
    },
    /**
     * 处理alarmDailog逻辑及操作Daiglog显示关闭
     * @returns {Promise<void>}
     */
    async  alarmlogic() {
      // 此处处理和业务相关的东西
      this.showAlarm = false
    },
    closeAlarm() {
      this.showAlarm = false
    },
    async initTableList() {
      const result = await getVehicleRelease(this.tableQuery)
      if (_.get(result, 'code') === 0) {
        this.tableData = result.data.rows
        this.total = result.data.totalCount
      }
      this.listLoading = false
    },
    handleSizeChange(val) {
      this.tableQuery.limit = val
      this.initTableList()
    },
    handleChange(val) {
      this.tableQuery.page = val
      this.initTableList()
    },
    async initCharts() {
      this.chartData = []
      const the = this
      const chartDatas = await getVehicleReleaseCharts(this.chartQuery)
      _.forEach(_.get(chartDatas, 'data'), function(v, i) {
        the.chartData.push([_.get(v, 'startTime'), [_.get(v, 'socDischarge')]])
      })
      this.$refs['bar'].drawChart()
    }
  }
}
</script>
