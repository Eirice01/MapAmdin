<template>
    <el-container  class="app-container">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item>
            <select-car-single ref="selectCarSingle" @selectedCarId="selectedCarId"></select-car-single>
          </el-form-item>
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDate"></data-pickers>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery" type="primary" size="mini" style="margin-left:10px">查询</el-button>
            <el-button @click="resetQuery" type="primary" size="mini" style="margin-left:10px">重置</el-button>
            <el-button type="primary" size="mini" style="margin-left:10px">导出</el-button>
          </el-form-item>
        </el-form>
      </el-header>
     <el-main>
       <charts cardTitle='<span style="font-size:14px">车辆客流统计</span>' :legendData="legendData" :chartData="chartData" showCard :ratio=1 chartType="bar" ref="bar"></charts>
     </el-main>
     <el-main style="padding-top:0px;">
        <el-table :data="vehicleData" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px;">
          <el-table-column align="center" type="index" width="70" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" prop="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmName'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="tableQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
import { getVehicleStatisticsList, getVehicleStatisticsReport } from '@/api/report/reportApi'
import mixins from '@/common/mixins'
import _ from 'lodash'
export default {
  name: 'vehiclePFS',
  mixins: [mixins],
  data() {
    return {
      legendData: [],
      chartData: [],

      total: 0,
      listLoading: false,
      activeIndex: '1',
      option: '1',
      vehicleData: [],
      columns: [
        {
          key: 'plateno',
          title: '车牌号'
        },
        {
          key: 'deptname',
          title: '线路名称'
        },
        {
          key: 'date',
          title: '统计日期'
        },
        {
          key: 'up',
          title: '上客人数'
        },
        {
          key: 'down',
          title: '下客人数'
        }
      ],
      tableQuery: {
        ids: '',
        page: 1,
        pageSize: 10,
        startTime: '',
        endTime: ''
      },
      chartQuery: {
        ids: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  async created() {
    await this.initPage()
  },
  methods: {
    async initPage() {
      this.listLoading = true
      await this.getList()
      await this.getChart()
      this.listLoading = false
    },
    async getList() {
      const res = await getVehicleStatisticsList(this.tableQuery)
      if (res.code === 0) {
        this.vehicleData = res.data.rows
        this.total = res.data.totalCount
      }
      this.listLoading = false
    },
    async getChart() {
      const theVue = this
      theVue.chartData = []
      theVue.legendData = []
      const chartDatas = await getVehicleStatisticsReport(this.chartQuery)
      _.forEach(_.get(chartDatas, 'data'), function(v, k) {
        const tempArray = []
        _.forEach(v, function(_v, i) {
          theVue.legendData.push(_.get(_v, 'plateno'))
          tempArray.push(_.get(_v, 'up'))
        })
        theVue.chartData.push([k, tempArray])
      })
      this.$refs['bar'].drawChart()
    },
    handleSizeChange(val) {
      this.tableQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.tableQuery.page = val
      this.getList()
    },
    handleQuery() {
      this.tableQuery.page = 1
      this.tableQuery.pageSize = 10
      this.getList()
      this.getChart()
    },
    resetQuery() {
      this.listLoading = true
      this.$refs.selectCarSingle.clearSelected()
      this.$refs.dataPickers.resetDate()
      this.tableQuery.page = 1
      this.tableQuery.pageSize = 10
      this.tableQuery.ids = ''
      this.chartQuery.ids = ''
      const the = this
      setTimeout(function() {
        the.initPage()
      }, 300)
    },
    selectedCarId(val) {
      this.tableQuery.ids = val
      this.chartQuery.ids = val
    }
  }
}
</script>
