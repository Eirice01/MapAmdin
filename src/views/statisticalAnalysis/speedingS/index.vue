<template>
    <el-container v-loading.body="listLoading" class="app-container">
      <el-header class="header-plane" height="auto" >
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDate"></data-pickers>
          </el-form-item>
          <el-form-item label="处理状态">
            <el-select v-model="tableQuery.status" placeholder="请选择处理状态" style="width:100px" size="small">
              <el-option label="全部" value=""></el-option>
              <el-option label="未处理" value="1"></el-option>
              <el-option label="已处理" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <select-car-single ref="selectCarSingle" @selectedCar="selectedCar"></select-car-single>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" style="margin-left:10px;" @click="initPage">查询</el-button>
            <el-button type="primary" size="mini" style="margin-left:10px;" @click="resetPage">重置</el-button>
            <el-button type="primary" size="mini" style="margin-left:10px;">导出</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <charts :chartData="chartData" showCard cardTitle="超速统计" :ratio=1 :legendData="legendData"  chartType="bar" ref="bar"></charts>
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
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange" :current-page="tableQuery.page"
                       :page-sizes="[10,20,30, 50]" :page-size="tableQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
      <!--<alarm-info :dialogTitle="dialogTitle" :showAlarm="showAlarm" @closeAlarm="closeAlarm" @alarmlogic="alarmlogic"></alarm-info>-->
      <alarm-info :dialogTitle="dialogTitle" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
import mixins from '@/common/mixins'
import { getOverspeed, getOverspeedCharts } from '@/api/report/reportApi'
import _ from 'lodash'
export default {
  mixins: [mixins],
  data() {
    return {
      // 预警类型开始
      menus: [],
      legendData: ['已处理', '未处理'],
      tableQuery: {
        page: 1,
        limit: 10,
        plateNo: '',
        startTime: '',
        endTime: '',
        status: ''
      },
      chartQuery: {
        plateNo: '',
        startTime: '',
        endTime: '',
        status: ''
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
          key: 'driver',
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
          title: '报警类型',
          width: '200'
        },
        {
          key: 'alarmTime',
          title: '报警时间',
          width: '200'
        },
        {
          key: 'handlerTime',
          title: '处理时间',
          width: '200'
        },
        {
          key: 'delay',
          title: '处理时长',
          width: '200'
        },
        {
          key: 'handlerUser',
          title: '处理用户',
          width: '100'
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
          key: 'Status',
          title: '处理状态',
          width: '200'
        },
        {
          key: 'address',
          title: '预警位置',
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
      this.tableQuery.plateNo = ''
      this.tableQuery.status = ''
      this.chartQuery.plateNo = ''
      this.chartQuery.alarmType = ''
      this.chartQuery.status = ''
      this.$refs.dataPickers.resetDate()
      await this.initPage()
    },
    selectedCar(id) {
      this.tableQuery.plateNo = id
      this.chartQuery.plateNo = id
    },
    async initTableList() {
      const result = await getOverspeed(this.tableQuery)
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
    /**
     * 初始化charts
     * @returns {Promise<void>}
     */
    async initCharts() {
      this.chartData = []
      const the = this
      _.set(the.chartQuery, 'status', _.get(the.tableQuery, 'status', ''))
      const chartDatas = await getOverspeedCharts(the.chartQuery)
      _.forEach(_.get(chartDatas, 'data'), function(v, i) {
        the.chartData.push([_.get(v, 'startTime'), [_.get(v, 'hendlerNumber'), _.get(v, 'nohendlerNumber')]])
      })
      this.$refs['bar'].drawChart()
    }
  }
}
</script>
