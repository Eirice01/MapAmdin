<template>
<div class="app-container">
    <el-container v-loading.body="listLoading">
      <el-header class="header-plane"  height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="查询时间">
             <el-date-picker
              v-model.trim="startEnd"
              type="datetimerange"
              :picker-options="pickerOptions"
              :default-time="defaultTime"
              range-separator="——"
              :closeable="false"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
           <el-form-item label="预警类型">
             <el-popover placement="bottom" width="250">
              <menu-type-tree ref="menuType" style="height: 300px; overflow: auto" v-if="menus.length" selectedAll :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked" @check-change="handleNodeChange"></menu-type-tree>
              <el-input slot="reference" placeholder="请选择预警类型" v-model.trim="alarmTypeName" style="width:150px;" size="small" readonly></el-input>
            </el-popover>
            <span style="font-size: 14px">已选择{{count}}种</span>
           </el-form-item>
           <el-form-item >
              <select-car-single ref="selectCarSingle" @selectedCarId="selectedCarId" @selectedCar="selectedCar"></select-car-single>
           </el-form-item>
           <el-form-item label="处理状态">
           <el-select size="small" v-model="tableQuery.hendlerStatus" placeholder="请选择处理状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="未处理" value="0"></el-option>
            <el-option label="已处理" value="1"></el-option>
          </el-select>
           </el-form-item>
           <el-form-item >
              <el-button type="primary" size="mini" style="margin-left:10px;" @click="initPage">查询</el-button>
              <el-button type="primary" size="mini" style="margin-left:10px;" @click="resetPage">重置</el-button>
              <el-button type="primary" size="mini" style="margin-left:10px;">导出</el-button>
           </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <charts :chartData="chartData" :legendData="legendData" showCard cardTitle='<span style="font-size: 14px">预警处理统计</span>' :ratio=1 chartType="bar" ref="bar"></charts>
      </el-main>
      <el-main>
        <el-table :data="tableData" :columns="columns"  border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :prop="column.key" :label="column.title"  :width="column.width">
          <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmType'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else-if="column.key === 'handlerType'" v-text="handlerTypeformatter(scope.row[column.key])"></span>
              <span v-else-if="column.formatter">{{column.formatter(scope.row,column.key,scope.row[column.key])}}</span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
         <!-- 分页区 -->
        <el-pagination  class="pagination-plane" background @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="tableQuery.page"
               :page-sizes="[10,20,30, 50]" :page-size="tableQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
      <alarm-info :dialogTitle="dialogTitle" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
    </el-container>
         <report-footer></report-footer>
</div>

</template>
<script>
import mixins from '@/common/mixins'
import { formatDate, getStartEnd } from '@/utils/date'
import {
  getWarningTypes,
  getAdas,
  getAdasCharts
} from '@/api/report/reportApi'
import _ from 'lodash'
export default {
  mixins: [mixins],
  data() {
    return {
      // 预警类型开始
      menus: [],
      defaultTime: ['00:00:00', '23:59:59'],
      legendData: [],
      tableQuery: {
        page: 1,
        limit: 10,
        alarmType: '',
        vehicleId: '',
        startTime: '',
        endTime: '',
        hendlerStatus: ''
      },
      alarmTypeName: '',
      chartQuery: {
        plateNos: '',
        hendlerStatus: null,
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
          width: '100'
        },
        {
          key: 'driverName',
          title: '司机',
          width: '140'
        },
        {
          key: 'phone',
          title: '联系电话',
          width: '200'
        },
        {
          key: 'alarmType',
          title: '预警类型',
          width: '200'
        },
        {
          key: 'alarmStart',
          title: '预警时间',
          width: '200'
        },
        {
          key: 'handlerTime',
          title: '处理时间',
          width: '200'
        },
        {
          key: 'handlerLong',
          title: '处理时长',
          width: '200'
        },
        {
          key: 'handerName',
          title: '处理用户',
          width: '200'
        },
        {
          key: 'handlerType',
          title: '处理方式',
          width: '200'
        },
        {
          key: 'content',
          title: '处理内容',
          width: '200'
        },
        {
          key: 'handlerStatus',
          title: '处理状态',
          formatter: function(row, col, cellVal, index) {
            return _.eq(cellVal, 1) ? '已处理' : '未处理'
          }
        },
        {
          key: 'address',
          title: '预警位置',
          width: '300'
        }
      ]
    }
  },
  watch: {
    startEnd(val) {
      if (val) {
        debugger
        this.tableQuery.startTime = formatDate(val[0], this.dateTimeFormat)
        this.tableQuery.endTime = formatDate(val[1], this.dateTimeFormat)
        this.chartQuery.startTime = formatDate(val[0], this.dateTimeFormat)
        this.chartQuery.endTime = formatDate(val[1], this.dateTimeFormat)
      } else {
        this.tableQuery.startTime = ''
        this.tableQuery.endTime = ''
        this.chartQuery.startTime = ''
        this.chartQuery.endTime = ''
      }
    }
  },
  async created() {
    await this.getAlarmTree()
    await this.initPage()
  },
  methods: {
    async initPage() {
      this.listLoading = true
      await this.initCharts()
      await this.initTableList()
      this.listLoading = false
    },
    resetPage() {
      this.$refs.selectCarSingle.clearSelected()
      this.$refs.menuType.selectAll()
      this.startEnd = getStartEnd()
      this.tableQuery.page = 1
      this.tableQuery.limit = 10
      this.tableQuery.vehicleId = ''
      this.tableQuery.hendlerStatus = ''
      this.chartQuery.plateNo = ''
      this.chartQuery.hendlerStatus = null
      const the = this
      setTimeout(function() {
        the.initPage()
      }, 300)
    },
    selectedCarId(id) {
      this.tableQuery.vehicleId = id
    },
    selectedCar(id) {
      this.chartQuery.plateNos = id
    },
    async getAlarmTree() {
      const result = await getWarningTypes()
      this.menus = [
        _.get(result, 'data.外设检测预警'),
        _.get(result, 'data.车辆状态预警'),
        _.get(result, 'data.驾驶员状态预警')
      ]
    },
    /**
     * 预警类型的选择change方法
     * @param val
     */
    handleNodeChange(val) {
      const arr = []
      const tmp = []
      this.count = val.length
      val.forEach(item => {
        arr.push(item.code)
        tmp.push(item.label)
      })
      this.chartQuery.alarmType = arr.join()
      this.tableQuery.alarmType = arr.join()
      this.alarmTypeName = tmp.join()
    },
    async initTableList() {
      this.listLoading = true
      const result = await getAdas(this.tableQuery)
      if (result.code === 0) {
        this.tableData = result.data.rows
        this.total = result.data.totalCount
      }
      this.listLoading = false
    },
    handleSizeChange(val) {
      this.tableQuery.limit = val
      this.initTableList()
    },
    handleCurrentChange(v) {
      this.tableQuery.page = v
      this.initTableList()
    },
    // 初始化图表数据
    async initCharts() {
      const the = this
      this.chartData = []
      this.legendData = ['已处理', '未处理']
      var chartParam = _.clone(the.chartQuery)
      const result = await getAdasCharts(chartParam)
      _.forEach(_.get(result, 'data'), function(v, i) {
        the.chartData.push([
          _.get(v, 'startTime'),
          [_.get(v, 'hendlerNumber'), _.get(v, 'nohendlerNumber')]
        ])
      })
      this.$refs['bar'].drawChart()
    }
  }
}
</script>
