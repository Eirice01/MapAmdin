<template>
    <el-container class="app-container" v-loading.body="listLoading" style="padding-bottom:20px;">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="预警类型">
            <el-popover placement="bottom" width="240">
              <menu-type-tree ref="menuType" style="height: 300px; overflow: auto" :treeMenuData="menus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked" @check-change="handleNodeChange"></menu-type-tree>
              <el-input slot="reference" placeholder="请选择预警类型" v-model.trim="alarmTypeName" style="width:150px;" size="small" readonly></el-input>
            </el-popover>
            <span style="font-size: 14px">已选择{{count}}种</span>
          </el-form-item>
          <el-form-item>
            <select-car-single ref="selectCarSingle" @selectedCarId="selectedCarId"></select-car-single>
          </el-form-item>
          <el-form-item label="处理状态">
            <el-select size="mini" v-model="tableQuery.hendlerStatus" placeholder="请选择处理状态" style="width:90px;">
              <el-option label="全部" value = ''></el-option>
              <el-option label="未处理" value = 0></el-option>
              <el-option label="已处理" value = 1></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDate"></data-pickers>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini"  @click="initPage">查询</el-button>
            <el-button type="primary" size="mini"  @click="resetPage">重置</el-button>
            <el-button type="primary" size="mini" >导出</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <charts :chartData="chartData" showCard cardTitle='<span style="font-size:14px">胎压预警处理情况统计</span>' :ratio=1 :legendData="legendData"  chartType="bar" ref="bar"></charts>
      </el-main>
      <el-main style="padding-top:0px;">
        <el-table :data="tableData" :columns="columns"  border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
         <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :prop="column.key" :label="column.title" :formatter="column.formatter ||function(row,col,cell,index){return cell}" :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmType'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else-if="column.key === 'handlerType'" v-text="handlerTypeformatter(scope.row[column.key])"></span>
              <span v-else-if="column.formatter">{{column.formatter(scope.row,column.key,scope.row[column.key])}}</span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange" :current-page="tableQuery.page"
                       :page-sizes="[10,20,30, 50]" :page-size="tableQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
      <alarm-info :dialogTitle="dialogTitle" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
  import mixins from '@/common/mixins'
  import {
    getAlarmTyreTypes,
    getStatisticsList,
    getStatisticsReport
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
          hendlerStatus: '',
          startTime: '',
          endTime: ''
        },
        alarmTypeName: '',
        chartQuery: {
          alarmType: '',
          plateNos: '',
          hendlerStatus: '',
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
            width: '100',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'deptName',
            title: '所属机构',
            width: '200',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'driverName',
            title: '司机',
            width: '140',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'phone',
            title: '联系电话',
            width: '200',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'alarmType',
            title: '预警类型',
            width: '200',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'alarmStart',
            title: '预警时间',
            width: '200',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'handlerTime',
            title: '处理时间',
            width: '200',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'handlerLong',
            title: '处理时长',
            width: '200',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'handerName',
            title: '处理用户',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'handlerType',
            title: '处理方式'
          },
          {
            key: 'content',
            title: '处理内容',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          },
          {
            key: 'handlerStatus',
            title: '处理状态',
            formatter: function(row, column, cellValue, index) {
              if (cellValue === 0) {
                return '未处理'
              }
              if (cellValue === 1) {
                return '已处理'
              }
            }
          },
          {
            key: 'address',
            title: '预警位置',
            width: '300',
            formatter: function(row, column, cellValue, index) {
              return cellValue
            }
          }
        ]
      }
    },
    async created() {
      await this.getAlarmTree()
      await this.initDefaultTypes()
      await this.initPage()
    },
    methods: {
      async initPage() {
        if (this.tableQuery.alarmType === null || this.tableQuery.alarmType === '') {
          this.$message({
            message: '预警类型不能为空！',
            type: 'warning'
          })
          return
        }
        this.listLoading = true
        await this.initCharts()
        await this.initTableList()
        this.listLoading = false
      },
      async resetPage() {
        const _ = this
        this.$refs.selectCarSingle.clearSelected()
        this.$refs.dataPickers.resetDate()
        await this.initDefaultTypes()
        this.tableQuery.page = 1
        this.tableQuery.pageSize = 10
        this.tableQuery.vehicleId = ''
        this.tableQuery.hendlerStatus = ''
        this.chartQuery.plateNos = ''
        this.chartQuery.hendlerStatus = ''
        setTimeout(function() {
          _.initPage()
        }, 300)
      },
      selectedCarId(id) {
        this.tableQuery.vehicleId = id
        this.chartQuery.vehicleId = id
      },
      async getAlarmTree() {
        const result = await getAlarmTyreTypes()
        this.menus = [result.data]
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
        const result = await getStatisticsList(this.tableQuery)
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
      async initCharts() {
        if (this.tableQuery.hendlerStatus === '0') {
          this.legendData = ['未处理']
        }
        if (this.tableQuery.hendlerStatus === '1') {
          this.legendData = ['已处理']
        }
        if (this.tableQuery.hendlerStatus === '') {
          this.legendData = ['已处理', '未处理']
        }
        this.chartData = []
        const result = await getStatisticsReport(this.chartQuery)
        const the = this
        _.forEach(_.get(result, 'data'), function(v, i) {
          the.chartData.push([
            _.get(v, 'startTime'),
            [_.get(v, 'hendlerNumber'), _.get(v, 'nohendlerNumber')]
          ])
        })
        this.$refs['bar'].drawChart()
      },
      async initDefaultTypes() {
        const the = this
        var defaultChecked = []
        _.forEach(the.menus, function(v, i) {
          if (_.get(v, 'children')) {
            defaultChecked.push(_.get(v, 'code'))
          }
        })
        the.$refs.menuType.$refs.menu.setCheckedKeys(defaultChecked)
      }
    }
  }
</script>
