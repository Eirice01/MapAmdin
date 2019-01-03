<template>
    <el-container v-loading.body="listLoading" class="app-container">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="报警类型">
            <el-popover placement="bottom" width="250">
              <menu-type-tree selectedAll v-if="menus.length" ref="menuType" style="height: 300px; overflow: auto" :treeMenuData="menus"  :treeMenuProp="defaultProps" :checkedKeys="defaultChecked" @check-change="handleNodeChange"></menu-type-tree>
              <el-input slot="reference" placeholder="请选择报警类型" v-model.trim="alarmTypeName" style="width:150px;" size="small" readonly></el-input>
            </el-popover>
            <span style="font-size: 14px">已选择{{count}}种</span>
          </el-form-item>
          <el-form-item >
            <select-car-single ref="selectCarSingle" @selectedCarId="selectedCarId"></select-car-single>
          </el-form-item>
          <el-form-item label="处理状态">
            <el-select v-model="tableQuery.type" placeholder="请选择处理状态">
              <el-option label="全部" value=""></el-option>
              <el-option label="未处理" value="1"></el-option>
              <el-option label="已处理" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDate"></data-pickers>
        </el-form-item>

        <el-form-item >
          <el-button type="primary" size="mini"  @click="initPage">查询</el-button>
          <el-button type="primary" size="mini"  @click="resetPage">重置</el-button>
          <el-button type="primary" size="mini" >导出</el-button>
        </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <charts :chartData="chartData" showCard cardTitle='<span style="font-size:14px;">电子围栏报警处理情况统计</span>' :ratio=1 :legendData="legendData" chartType="bar" ref="bar"></charts>
      </el-main>
      <el-main style="padding-top:0px;">
        <el-table :data="tableData" :columns="columns"  border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :prop="column.key" :label="column.title"  :width="column.width">
          <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmType'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
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
import { getAence, getAenceCharts, getCallAlarmtype } from '@/api/report/reportApi'
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
        vehicleId: '',
        type: '',
        startTime: '',
        endTime: ''
      },
      alarmTypeName: '',
      chartQuery: {
        alarmType: '',
        hendlerStatus: null,
        startTime: '',
        endTime: '',
        vehicleId: ''
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
          key: 'driverPhone',
          title: '联系电话',
          width: '200'
        },
        {
          key: 'fenceName',
          title: '围栏名称',
          width: '200'
        },
        {
          key: 'drawingType',
          title: '围栏类型',
          width: '200'
        },
        {
          key: 'alarmTypeName',
          title: '报警类型',
          width: '200'
        },
        {
          key: 'alarmStart',
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
          key: 'username',
          title: '处理用户',
          width: '200'
        },
        {
          key: 'handlerTypeName',
          title: '处理方式',
          width: '200'
        },
        {
          key: 'content',
          title: '处理内容',
          width: '200'
        },
        {
          key: 'handlerType',
          title: '处理状态',
          width: '200'
        },

        {
          key: 'address',
          title: '报警位置',
          width: '200'
        }
      ]
    }
  },
  async created() {
    await this.getWarningTree()
    await this.initPage()
  },
  methods: {
    async initPage() {
      this.listLoading = true
      await this.initCharts()
      await this.initTableList()
      this.listLoading = false
    },
    /**
     * 获取报警类型
     * @returns {Promise<void>}
     */
    async getWarningTree() {
      const result = await getCallAlarmtype()
      this.menus = [_.get(result, 'data.整车报警'), _.get(result, 'data.平台报警')]
    },
    resetPage() {
      this.listLoading = true
      this.$refs.selectCarSingle.clearSelected()
      this.$refs.menuType.selectAll()
      this.$refs.dataPickers.resetDate()
      this.tableQuery.page = 1
      this.tableQuery.limit = 10
      this.tableQuery.vehicleId = ''
      this.tableQuery.type = ''
      this.chartQuery.vehicleId = ''
      this.chartQuery.hendlerStatus = null
      const the = this
      // 重置需要延迟 因为选择全部需要一个时间段 data的数据还未被刷新
      setTimeout(function() {
        the.initTableList()
        the.initCharts()
      }, 300)
    },
    selectedCarId(id) {
      this.tableQuery.vehicleId = id
      this.chartQuery.vehicleId = id
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
      const result = await getAence(this.tableQuery)
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
      const chartDatas = await getAenceCharts(this.chartQuery)
      _.forEach(_.get(chartDatas, 'data'), function(v, i) {
        the.chartData.push([_.get(v, 'startTime'), [_.get(v, 'handle'), _.get(v, 'noHandle')]])
      })
      this.$refs['bar'].drawChart()
    }
  }
}
</script>
