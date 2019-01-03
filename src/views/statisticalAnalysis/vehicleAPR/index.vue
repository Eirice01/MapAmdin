<template>
    <el-container v-loading.body="listLoading" class="app-container">
      <el-header class="header-plane" height="auto">
         <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDate"></data-pickers>
          </el-form-item>
           <el-form-item label="预警类型">
             <el-popover placement="bottom"
                        width="250">
              <menu-type-tree ref="menuType" selectedAll v-if="menus.length"
                              style="height: 300px; overflow: auto"
                              :treeMenuData="menus"
                              :treeMenuProp="defaultProps"
                              :checkedKeys="defaultChecked"
                              @check-change="handleNodeChange"></menu-type-tree>
              <el-input slot="reference"
                        placeholder="请选择预警类型"
                        v-model.trim="alarmTypeName"
                        style="width:150px;"
                        size="small" readonly></el-input>
            </el-popover>
             <span style="font-size: 14px">已选择{{count}}种</span>
          </el-form-item>
          <el-form-item label="处理状态">
          <el-select v-model.trim="tableQuery.status"
                      @change="refshTable"
                      placeholder="请选择"
                      style="width:90px;"
                      size="small">
              <el-option v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item >
            <select-car-single ref="selectCarSingle" @selectedCar="selectedCar"></select-car-single>
          </el-form-item>
          <el-form-item >
             <el-button type="primary"
                   size="mini"
                   @click="initPage">查询</el-button>
              <el-button type="primary"
                   size="mini"
                   @click="resetPage">重置</el-button>
          </el-form-item >
         </el-form>
      </el-header>
      <el-main>
        <charts :chartData="chartData"
                :legendData="legendData" showCard
                cardTitle='<span style="font-size:14px;">车辆报警处理报告统计分析</span>'
                chartType="bar"
                ref="bar"
                :ratio=1></charts>
        <el-table :data="tableData"
                  :columns="columns" border stripe
                  style="margin-top:20px; width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-table-column align="center"
                           type="index"
                           width="50"
                           label="序号"></el-table-column>
          <el-table-column align="center"
                           v-for="column in columns"
                           :formatter="column.formatter || function(row,col){return row[column.key]}"
                           :key="column.key"
                           :label="column.title"
                           :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmType'"
                         type="text"
                         @click="handleDetail(scope.row)">
                {{scope.row[column.key]}}
              </el-button>
              <span v-else-if="column.key === 'handleType'"
                    v-text="handlerTypeformatter(scope.row[column.key])"></span>
               <span v-else-if="column.formatter">{{column.formatter(scope.row,column.key,scope.row[column.key])}}</span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination class="pagination-plane" background
                       @size-change="handleSizeChange"
                       @current-change="handleChange"
                       :current-page="tableQuery.page"
                       :page-sizes="[10, 20, 30, 50]"
                       :page-size="tableQuery.limit"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </el-main>
      <alarm-info :dialogTitle="dialogTitle" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
import mixins from '@/common/mixins'
import { getCallAlarmtype, getStatistical, getStatisticalCharts } from '@/api/report/reportApi'
import BMap from 'BMap'
import _ from 'lodash'
// include  dateUtil
import { formatDate, timeStamp } from '@/utils/date'
export default {
  mixins: [mixins],
  data() {
    return {
      btnType: 1,
      menus: [],
      count: 0,
      alarmTypeName: '',
      tableQuery: {
        page: 1,
        limit: 10,
        alarmType: '',
        plateNo: '',
        startTime: '',
        endTime: '',
        status: ''
      },
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '未处理',
          value: '0'
        },
        {
          label: '已处理',
          value: '1'
        }
      ],
      chartQuery: {
        startTime: '',
        endTime: '',
        alarmType: '',
        plateNo: '',
        statusType: '0'
      },
      legendData: ['已处理', '未处理'],
      allotDialogVisible: false,
      tableData: [],
      total: 0,
      selectCars: [], // 已选择车辆
      chartData: [],
      data: [],
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
          key: 'driver',
          title: '司机',
          width: '200'
        },
        {
          key: 'phone',
          title: '联系电话',
          width: '200'
        },
        {
          key: 'alarmType',
          title: '报警类型',
          width: '140'
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
          formatter: function(row, column, cellValue, index) {
            return timeStamp(cellValue)
          }
        },
        {
          key: 'handlerUser',
          title: '处理用户',
          width: '200'
        },
        {
          key: 'handlerType',
          title: '处理方式'
        },
        {
          key: 'content',
          title: '处理内容',
          width: '200'
        },
        {
          key: 'Status',
          title: '处理状态'
        },
        {
          key: 'address',
          title: '报警位置',
          width: '200'
        }
      ]
    }
  },

  async mounted() {
    await this.getWarningTree()
    await this.initPage()
  },
  methods: {
    /**
     * 获取预警类型
     * @returns {Promise<void>}
     */
    async getWarningTree() {
      const result = await getCallAlarmtype()
      this.menus = [
        _.get(result, 'data.整车报警'),
        _.get(result, 'data.平台报警')
      ]
    },
    /**
     * 预警类型的选择change方法
     * @param val
     */
    handleNodeChange(val) {
      const codes = []
      const labels = []
      this.count = val.length
      val.forEach(item => {
        codes.push(item.code)
        labels.push(item.label)
      })

      this.tableQuery.alarmType = codes.join()
      this.chartQuery.alarmType = codes.join()
      this.alarmTypeName = labels.join()
      // 动态列
    },
    // 初始化页面
    async initPage() {
      this.listLoading = true
      await this.initTableList()
      await this.initCharts()
      this.listLoading = false
    },
    resetPage() {
      this.$refs.selectCarSingle.clearSelected()
      this.tableQuery.page = 1
      this.tableQuery.pageSize = 10
      this.tableQuery.alarmType = ''
      this.tableQuery.plateNo = ''
      this.tableQuery.handlerType = '0'
      this.chartQuery.plateNo = ''
      this.chartQuery.alarmType = ''
      this.$refs.dataPickers.resetDate()
      this.initPage()
    },
    selectedCar(id) {
      this.tableQuery.plateNo = id
      this.chartQuery.plateNo = id
    },
    // 初始化列表
    async initTableList() {
      const result = await getStatistical(this.tableQuery)
      this.tableData = _.get(result, 'data.rows')
      this.total = _.get(result, 'data.totalCount')
      await this.initAddress()
    },
    /**
     * 处理情况
     * @param
     */
    refshTable() {
      this.initTableList()
    },
    // 调用百度地图API 翻译 address
    async initAddress() {
      var the = this
      var theTableData = the.tableData
      _.forEach(theTableData, function(v, i) {
        const point = new BMap.Point(
          _.get(v, 'longitude'),
          _.get(v, 'latitude')
        )
        new BMap.Geocoder().getLocation(point, function(rs) {
          console.log(rs)
          the.$set(the.tableData[i], 'address', rs.address)
        })
      })
    },
    // 初始化图表
    async initCharts() {
      this.chartData = []
      var the = this
      const chartDatas = await getStatisticalCharts(this.chartQuery)
      const _responseData = _.get(chartDatas, 'data')
      _.forEach(_responseData, function(v, i) {
        the.chartData.push([
          _.get(v, 'startTime'),
          [
            _.get(v, 'hendlerNumber'),
            _.get(v, 'nohendlerNumber')
          ]
        ])
      })
      this.$refs['bar'].drawChart()
    },
    handleSizeChange(val) {
      this.tableQuery.limit = val
      this.initPage()
    },
    handleChange(val) {
      this.tableQuery.page = val
      this.initPage()
    }
  },
  watch: {
    startEnd(val) {
      if (val) {
        this.tableQuery.startTime = formatDate(
          this.startEnd[0],
          this.dateTimeFormat
        )
        this.tableQuery.endTime = formatDate(
          this.startEnd[1],
          this.dateTimeFormat
        )
        this.chartQuery.startTime = formatDate(
          this.startEnd[0],
          this.dateTimeFormat
        )
        this.chartQuery.endTime = formatDate(
          this.startEnd[1],
          this.dateTimeFormat
        )
      } else {
        this.tableQuery.startTime = ''
        this.tableQuery.endTime = ''
        this.chartQuery.startTime = ''
        this.chartQuery.endTime = ''
      }
    }
  }
}
</script>
