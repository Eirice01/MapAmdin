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
        <charts :chartData="chartData" showCard cardTitle='<span style="font-size:14px">上线率统计</span>' yAxisSuffix="%" :ratio=1 chartType="area" ref="area"></charts>
      </el-main>
      <el-main style="padding-top:0px;">
        <el-table :data="tableData" :columns="columns"  border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :prop="column.key" :label="column.title"  :width="column.width">
          <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmType'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else-if="column.key === 'handleType'" v-text="handlerTypeformatter(scope.row[column.key])"></span>
              <span v-else-if="column.formatter">{{column.formatter(scope.row,column.key,scope.row[column.key])}}</span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange"  @current-change="handleChange" :current-page="tableQuery.page"
                       :page-sizes="[10,20,30, 50]" :page-size="tableQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
import mixins from '@/common/mixins'
import { getVehicleOnline, getVehicleOnlineCharts } from '@/api/report/reportApi'
import _ from 'lodash'
export default {
  mixins: [mixins],
  data() {
    return {
      // 预警类型开始
      menus: [],
      tableQuery: {
        page: 1,
        pageSize: 10,
        vehicleIds: '',
        startTime: '',
        endTime: '',
        numberDay: 1
      },
      chartQuery: {
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
          title: '所属机构',
          width: '200'
        },
        {
          key: 'firstLoginTime',
          title: '开始上线时间',
          width: '200'
        },
        {
          key: 'lastLogoutTime',
          title: '最后下线时间',
          width: '200'
        },
        {
          key: 'onlineTimeLength',
          title: '上线时间',
          width: '200'
        },
        {
          key: 'offlineTimeLength',
          title: '离线时间',
          width: '200'
        },
        {
          key: 'timeLength',
          title: '总时间',
          width: '200'
        },
        {
          key: 'vehicleUse',
          title: '车辆使用率',
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
    handleChange(val) {
      this.tableQuery.page = val
      this.initTableList()
    },
    async resetPage() {
      this.listLoading = true
      this.$refs.selectCarSingle.clearSelected()
      this.tableQuery.page = 1
      this.tableQuery.pageSize = 10
      this.tableQuery.vehicleIds = ''
      this.$refs.dataPickers.resetDate()
      await this.initPage()
    },
    selectedCarId(id) {
      this.tableQuery.vehicleId = id
      this.chartQuery.vehicleId = id
    },
    async initTableList() {
      const result = await getVehicleOnline(this.tableQuery)
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
    async initCharts() {
      this.chartData = []
      const the = this
      const chartDatas = await getVehicleOnlineCharts(this.chartQuery)
      const _responseData = _.get(chartDatas, 'data')
      _.forEach(_responseData, function(v, i) {
        var tempData = []
        var ratio = _.eq(_.get(v, 'vehicleTotal', 0), 0) ? 0 : _.round(_.multiply(_.divide(_.get(v, 'vehicleCount', 0), _.get(v, 'vehicleTotal', 0)), 100), 2)
        tempData.push(['上线率', ratio])
        tempData.push(['所有车辆', _.get(v, 'vehicleTotal', 0)])
        tempData.push(['上线车辆', _.get(v, 'vehicleCount', 0)])
        the.chartData.push([_.get(v, 'startTime'), ratio, tempData])
      })
      this.$refs['area'].drawChart()
    }
  }
}
</script>
