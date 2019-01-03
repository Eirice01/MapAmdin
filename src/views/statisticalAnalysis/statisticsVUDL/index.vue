<template>
    <el-container v-loading.body="listLoading" class="app-container">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDate"></data-pickers>
          </el-form-item>
           <el-form-item>
            <select-car-double ref="selectCarDouble" @selectedCarId="selectedCarId"></select-car-double>
          </el-form-item>
          <el-form-item>
            <el-button @click="initPage" type="primary" size="mini" >查询</el-button>
            <el-button type="primary" size="mini"  @click="resetPage">重置</el-button>
            <el-button type="primary" size="mini" >导出</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
       <charts :chartData="chartData" yAxisSuffix="小时" yDate :legendData="legendData" showCard cardTitle='<span font-size="13px">在线时长统计</span>' :ratio=1 chartType="area" ref="area"></charts>
      </el-main>
      <el-main style="padding-top:0px;">
        <el-table :data="tableData" :columns="columns"  border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
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
                       :page-sizes="[10,20,30, 50]" :page-size="tableQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
import mixins from '@/common/mixins'
import { getVehicleOnOff, getVehicleOnOffCharts } from '@/api/report/reportApi'
import _ from 'lodash'
import { timeStamp } from '@/utils/date'
export default {
  mixins: [mixins],
  data() {
    return {
      // 预警类型开始
      menus: [],
      legendData: ['所有车辆', '上线车辆'],
      tableQuery: {
        page: 1,
        pageSize: 10,
        vehicleId: '',
        numberDay: 1,
        startTime: '',
        endTime: ''
      },
      chartQuery: {
        vehicleIds: '',
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
          title: '车牌号'
        },
        {
          key: 'deptName',
          title: '所属机构'
        },
        {
          key: 'typeName',
          title: '状态类型'
        },
        {
          key: 'startTime',
          title: '发生时间'
        },
        {
          key: 'handlerLong',
          title: '状态时长'
        },
        {
          key: 'vehicleUse',
          title: '车辆使用率'
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
      this.tableQuery.page = 1
      this.tableQuery.pageSize = 10
      this.tableQuery.vehicleId = ''
      this.chartQuery.vehicleIds = ''
      this.$refs.dataPickers.resetDate()
      await this.initPage()
    },
    selectedCarId(id) {
      this.tableQuery.vehicleId = id
      this.chartQuery.vehicleIds = id
    },
    async initTableList() {
      this.listLoading = true
      const result = await getVehicleOnOff(this.tableQuery)
      if (_.get(result, 'code') === 0) {
        this.tableData = result.data.rows
        this.total = result.data.totalCount
      }
      this.listLoading = false
    },
    handleSizeChange(val) {
      this.tableQuery.pageSize = val
      this.initTableList()
    },
    handleChange(val) {
      this.tableQuery.page = val
      this.initTableList()
    },
    async initCharts() {
      this.chartData = []
      const the = this
      const chartDatas = await getVehicleOnOffCharts(this.chartQuery)
      const _responseData = _.get(chartDatas, 'data')
      _.forEach(_responseData, function(v, i) {
        var tempData = []
        tempData.push(['在线时长', timeStamp(_.divide(_.get(v, 'onlineVehicle', 0), 1000))])
        the.chartData.push([_.get(v, 'startTime'), _.divide(_.get(v, 'onlineVehicle', 0), (1000 * 3600)), tempData])
      })
      this.$refs['area'].drawChart()
    }
  }
}
</script>
