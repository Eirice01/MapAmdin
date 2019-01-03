<template>
     <el-container v-loading.body="listLoading" class="app-container">
       <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDataPickers"></data-pickers>
          </el-form-item>
          <el-form-item>
            <el-popover placement="bottom"
                        width="250">
              <menu-type-tree ref="menuType" selectedAll
                              style="height: 300px; overflow: auto"
                              :treeMenuData="menus"
                              :treeMenuProp="defaultProps"
                              v-if="menus.length"
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
          <el-form-item>
            <select-car-single ref="selectCarSingle" @selectedCarId="selectedCarId"></select-car-single>
          </el-form-item>
          <el-form-item>
            <el-button @click="initPage" type="primary" size="mini" style="margin-left:10px;">查询</el-button>
            <el-button type="primary" size="mini" style="margin-left:10px;" @click="resetPage">重置</el-button>
            <el-button type="primary" size="mini" style="margin-left:10px;">导出</el-button>
          </el-form-item>
        </el-form>
        </el-header>

        <el-main>
         <el-card class="box-card">
          <div slot="header" >
           <span style="font-size:14px;">车辆智能预警对比</span>
           <el-button type="primary"
                     size="mini"
                     style="float: right; ">导出</el-button>
          </div>
          <!-- list table start -->
                <el-table :data="listTableData"
                          :header-cell-style="function(row,index){return 'background-color: #4077BC;color: #fff;'}"
                          :columns="listTableColumns" border stripe
                          style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" >
                <el-table-column align="center" fixed
                                 v-for="column in listTableColumns"
                                 :key="column.key"
                                 :label="column.title"
                                 :width="column.width">
                  <template slot-scope="scope">
                    <span >{{scope.row[column.key]}}</span>
                  </template>
                </el-table-column>
                <el-table-column align="center"
                                 v-for="column in dymicCol"
                                 :key="column.key"
                                 :label="column.title"
                                 :width="column.width">
                    <el-table-column align="center"
                                     :prop="column.key + '_N'"
                                     label="预警数">
                                     <template slot-scope="scope">
                                      <span>{{scope.row[column.key + '_N']?scope.row[column.key + '_N']:0}}</span>
                                    </template>
                   </el-table-column>
                    <el-table-column align="center"
                                     :prop="column.key + '_KM'"
                                     label="预警数／百公里">
                                     <template slot-scope="scope">
                                      <span>{{scope.row[column.key + '_KM']?scope.row[column.key + '_KM']:0}}</span>
                                    </template>
                    </el-table-column>
              </el-table-column>
              </el-table>
              <!-- list table end -->
              <el-footer style="padding:5px 0px;height:auto;">
              <el-pagination background
                             @size-change="handleListSize"
                             @current-change="handleListCurrentChange"
                             :current-page="listQuery.page"
                             :page-sizes="[10, 20, 30, 50]"
                             :page-size="listQuery.limit"
                             layout="total, sizes, prev, pager, next, jumper"
                             :total="total">
                </el-pagination>
              </el-footer>
      </el-card>
      </el-main>

         <!-- echarts area start  -->
       <el-main style="padding-top:0px;">
       <el-row class="panel-group"
               :gutter="10">
        <el-col :xs="12"
                :sm="12"
                :lg="12"
                :xl="12"
                class="card-panel-col">
          <charts :chartData="chartData" showCard :ratio=0.5
                  cardTitle='<span style="font-size:14px;">智能预警趋势情况（全部）</span>'
                  chartType="area"
                  ref="area"></charts>
        </el-col>
           <el-col :xs="12"
                   :sm="12"
                   :lg="12"
                   :xl="12"
                   class="card-panel-col">
              <charts :chartData="pieChartData" showCard :ratio=0.45
                      cardTitle='<span style="font-size:14px;">智能预警类型分布（全部）</span>'
                      chartType="rose"
                      ref="rose"></charts>
          </el-col>
       </el-row>
       </el-main>
       <!-- echarts area end -->
       <el-main style="padding-top:0px;">
      <el-card class="box-card">
          <div slot="header" >
           <span style="font-size:14px;">车辆智能预警明细（全部）</span>
          <el-button type="primary"
                     size="mini"
                     style="float: right; ">导出</el-button>
          </div>
           <!-- detail table start-->
        <el-table :data="detailTableData"
                  :columns="detailTableColumns" border stripe
                  style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc" >
          <el-table-column align="center"
                           type="index"
                           width="50"
                           label="序号"></el-table-column>
          <el-table-column align="center"
                           v-for="column in detailTableColumns"
                           :key="column.key"
                           :formatter="column.formatter || function(row,col){return row[column.key]}"
                           :label="column.title"
                           :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmTypeName'"
                         type="text"
                         @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else-if="column.key === 'handleType'"
                    v-text="handlerTypeformatter(scope.row[column.key])"></span>
              <span v-else-if="column.formatter">{{column.formatter(scope.row,column.key,scope.row[column.key])}}</span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- detail table end -->
          <!-- 分页区 -->
          <el-pagination background
                         class="pagination-plane"
                         @size-change="handleDetailSize"
                         @current-change="handleDetailCurrentChange"
                         :current-page="detailListQuery.page"
                         :page-sizes="[10, 20, 30, 50]"
                         :page-size="detailListQuery.size"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="detailTotal">
          </el-pagination>
       </el-card>
       </el-main>
       <alarm-info :dialogTitle="dialogTitle" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
// echarts plugins

import mixins from '@/common/mixins'
import {
  getWarningTypes,
  getWarningContrastList,
  getDistribute,
  getWarningDetailList,
  getTendency
} from '@/api/report/reportApi'
// include lodash
import _ from 'lodash'
// include  dateUtil
import { formatDate, timeStamp } from '@/utils/date'
export default {
  mixins: [mixins],
  data() {
    return {
      menus: [],
      chartData: [],
      val: true,
      pieChartData: [],
      warningProcessDialog: false,
      option: '1',
      alarmTypeName: '',
      listQuery: {
        page: 1,
        limit: 10,
        alarmTypeArry: '',
        vehicleId: '',
        startTime: '',
        endTime: ''
      },
      vehicleId: '',
      detailListQuery: {
        page: 1,
        size: 10,
        alarmTypeArry: '',
        vehicleId: '',
        startTime: '',
        endTime: ''
      },
      dymicCol: [],
      count: 0,
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      listTableData: [],
      detailTableData: [],
      listTableColumns: [
        {
          key: 'indexNum',
          title: '排名',
          width: '100'
        },
        {
          key: 'plateNum',
          title: '车牌号',
          width: '100'
        },
        {
          key: 'deptName',
          title: '所属机构',
          width: '200'
        },
        {
          key: 'totalMileage',
          title: '总里程',
          width: '140'
        },
        {
          key: 'totalAlarmNum',
          title: '预警数',
          width: '200'
        },
        {
          key: 'hundredKMAlarmProbability',
          title: '预警数/百公里',
          width: '200'
        }
      ],
      detailTableColumns: [
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
          key: 'alarmTypeName',
          title: '预警类型',
          width: '200'
        },
        {
          key: 'alarmDate',
          title: '预警时间',
          width: '200',
          formatter: function(row, column, cellValue, index) {
            return formatDate(new Date(cellValue), 'yyyy-MM-dd hh:mm:ss')
          }
        },
        {
          key: 'handlerTime',
          title: '处理时间',
          width: '200'
        },
        {
          key: 'timeLength',
          title: '处理时长',
          width: '200',
          formatter: function(row, column, cellValue, index) {
            return timeStamp(cellValue)
          }
        },
        {
          key: 'handlerUserId',
          title: '处理用户',
          width: '100'
        },
        {
          key: 'content',
          title: '处理内容',
          width: '300'
        },
        {
          key: 'handleType',
          title: '处理类型',
          width: '200'
        },
        {
          key: 'addr',
          title: '预警位置',
          width: '400'
        }
      ],
      allotDialogVisible: false,
      total: 0,
      detailTotal: 0,
      defaultTreeProp: {
        children: 'children',
        label: 'text'
      }
    }
  },
  async created() {
    this.listLoading = true
    await this.getWarningTree()
    await this.initPage()
  },

  methods: {
    /**
     * 获取预警类型
     * @returns {Promise<void>}
     */
    async getWarningTree() {
      const result = await getWarningTypes()
      this.menus = [
        _.get(result, 'data.车辆状态预警'),
        _.get(result, 'data.驾驶员状态预警')
      ]
    },
    handleListSize(val) {
      this.listQuery.limit = val
      this.initPage()
    },
    handleDetailSize(val) {
      this.detailListQuery.size = val
      this.initPage()
    },
    async resetPage() {
      this.$refs.selectCarSingle.clearSelected()
      this.$refs.menuType.selectAll()
      this.$refs.dataPickers.resetDate()
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.listQuery.vehicleId = ''
      this.detailListQuery.page = 1
      this.detailListQuery.size = 10
      this.detailListQuery.vehicleId = ''
      const the = this
      // 重置需要延迟 因为选择全部需要一个时间段 data的数据还未被刷新
      setTimeout(function() {
        the.initPage()
      }, 300)
    },
    selectedCarId(id) {
      this.listQuery.vehicleId = id
      this.detailListQuery.vehicleId = id
      this.vehicleId = id
    },

    handleDetailCurrentChange(val) {
      this.detailListQuery.page = val
      this.initPage()
    },
    handleListCurrentChange(val) {
      this.listQuery.page = val
      this.initPage()
    },
    /**
     * 预警类型的选择change方法
     * @param val
     */
    initDymiCol() {
      this.dymicCol = []
      const the = this
      var types = _.split(_.get(the.listQuery, 'alarmTypeArry'), ',')
      var typeNames = _.split(the.alarmTypeName, ',')
      _.forEach(types, function(v, i) {
        the.dymicCol.push({ key: v, title: typeNames[i] })
      })
    },
    handleNodeChange(val) {
      const codes = []
      const labels = []
      this.count = val.length
      val.forEach(item => {
        codes.push(item.code)
        labels.push(item.label)
      })
      this.listQuery.alarmTypeArry = codes.join()
      this.detailListQuery.alarmTypeArry = codes.join()
      this.alarmTypeName = labels.join()
    },
    async initPage() {
      this.listLoading = true
      const the = this
      if (_.isEmpty(_.get(the, 'listQuery.alarmTypeArry'))) {
        this.$message({
          message: '至少选择一种预警类型',
          type: 'warning',
          duration: '1500'
        })
        this.listLoading = false
        return false
      }
      // 初始化动态列
      await this.initDymiCol()
      await this.initCharts()
      await this.initTableList()
      this.listLoading = false
    },
    /**
     * 初始化table数据
     * @param null
     */
    async initTableList() {
      const theVue = this
      const result = await getWarningContrastList(theVue.listQuery)
      const detailResult = await getWarningDetailList(theVue.detailListQuery)
      // 处理合并列 table 数据
      _.forEach(_.get(result, 'data.rows'), function(v, i) {
        _.forEach(_.get(v, 'alarmTypeCount'), function(t, j) {
          _.set(
            v,
            _.get(t, 'alarmTypeId') + '_KM',
            _.get(t, 'hundredKMAlarmProbability')
          )
          _.set(v, _.get(t, 'alarmTypeId') + '_N', _.get(t, 'alarmNum'))
        })
      })
      this.listTableData = _.get(result, 'data.rows')
      this.detailTableData = _.get(detailResult, 'data.rows')
      this.total = _.get(result, 'data.totalCount')
      this.detailTotal = _.get(detailResult, 'data.totalCount')
    },
    // 初始化图标的数据
    async initCharts() {
      const theVue = this
      theVue.chartData = []
      theVue.pieChartData = []
      const startTime = this.listQuery.startTime
      const endTime = this.listQuery.endTime
      const timeParams = {
        startTime: startTime,
        endTime: endTime,
        vehicleId: this.vehicleId,
        alarmTypeArry: _.get(theVue.listQuery, 'alarmTypeArry')
      }
      const chartDatas = await getTendency(timeParams)
      const pieChartDatas = await getDistribute(timeParams)
      _.forEach(_.get(chartDatas, 'data'), function(v, i) {
        var tempData = []
        _.forEach(_.get(v, 'list'), function(_v, j) {
          tempData.push([_.get(_v, 'alarmTypeName'), _.get(_v, 'alarmNum')])
        })
        theVue.chartData.push([
          _.get(v, 'dateTime'),
          _.get(v, 'totalAlarmNum'),
          tempData
        ])
      })
      // 多于5个显示到其他
      let otherVal = 0
      _.forEach(_.get(pieChartDatas, 'data'), function(v, i) {
        if (i > 4) {
          otherVal = _.add(otherVal, _.get(v, 'alarmNum', 0))
        } else {
          theVue.pieChartData.push([
            _.get(v, 'alarmTypeName'),
            _.get(v, 'alarmNum', 0)
          ])
        }
      })
      if (_.gt(otherVal, 0)) {
        theVue.pieChartData.push(['其他', otherVal])
      }
      this.$refs['area'].drawChart()
      this.$refs['rose'].drawChart()
    },
    checkDataPickers(arr) {
      if (arr) {
        this.listQuery.startTime = arr[0]
        this.listQuery.endTime = arr[1]
        this.detailListQuery.startTime = arr[0]
        this.detailListQuery.endTime = arr[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
        this.detailListQuery.startTime = ''
        this.detailListQuery.endTime = ''
      }
    }
  }

}
</script>
