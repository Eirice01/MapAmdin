<template>
  <el-container v-loading.body="listLoading" class="app-container">
    <el-header class="header-plane" height="auto">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="查询时间">
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
      <charts :chartData="chartData" showCard cardTitle="<span style='font-size:14px;'>里程统计</span>" :ratio=1
              ref="line"></charts>
    </el-main>
    <el-main style="padding-top:0px;">
      <el-table :data="tableData" :columns="columns" border stripe
                style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
        <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
        <el-table-column align="center" v-for="column in columns" :key="column.key" :prop="column.key"
                         :label="column.title" :width="column.width">
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination class="pagination-plane" background @size-change="handleSizeChange" :current-page="tableQuery.page"
                     :page-sizes="[10,20,30, 50]" :page-size="tableQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-main>
    <report-footer></report-footer>
  </el-container>
</template>
<script>
  import mixins from '@/common/mixins'
  import { getMileage, getMileageCharts } from '@/api/report/reportApi'
  import _ from 'lodash'
  export default {
    mixins: [mixins],
    data() {
      return {
        // 预警类型开始
        menus: [],
        legendData: [],
        tableQuery: {
          page: 1,
          pageSize: 10,
          vehicleIds: '',
          startTime: '',
          endTime: ''
        },
        alarmTypeName: '',
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
            title: '车牌号',
            width: '100'
          },
          {
            key: 'deptName',
            title: '所属机构',
            width: '200'
          },
          {
            key: 'statDate',
            title: '日期',
            width: '200'
          },
          {
            key: 'runMileage',
            title: '行驶公里',
            width: '200'
          },
          {
            key: 'firstLoginTime',
            title: '开始时间',
            width: '200'
          },
          {
            key: 'startMileage',
            title: '开始里程',
            width: '200'
          },
          {
            key: 'startAaddress',
            title: '开始位置',
            width: '200'
          },
          {
            key: 'lastLogoutTime',
            title: '结束时间',
            width: '200'
          },
          {
            key: 'endMileage',
            title: '结束里程',
            width: '100'
          },
          {
            key: 'endAaddress',
            title: '结束位置',
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
        this.tableQuery.pageSize = 10
        this.tableQuery.vehicleIds = ''
        this.chartQuery.vehicleIds = ''
        this.$refs.dataPickers.resetDate()
        await this.initPage()
      },
      selectedCarId(id) {
        this.tableQuery.vehicleIds = id
        this.chartQuery.vehicleIds = id
      },
      async initTableList() {
        const result = await getMileage(this.tableQuery)
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
        const result = await getMileageCharts(this.chartQuery)
        const the = this
        _.forEach(_.get(result, 'data'), function(v, i) {
          the.chartData.push([
            _.get(v, 'startTime'),
            _.get(v, 'list', 0)
          ])
        })
        this.$refs['line'].drawChart()
      }
    }
  }
</script>
<style scope>
  .canClick {
    color: #488aff
  }
  .app-container .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  .app-container .el-dialog__body {
    padding: 5px 20px;
  }
  .app-container .el-table__header-wrapper table thead tr th {
    background-color: #4077BC;
    color: #fff
  }
  .app-container .el-dialog__header {
    background-color: #4077BC;
    height: 40px;
    padding-top: 10px;
  }
  .app-container .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .app-container .el-dialog__header i {
    color: #fff;
  }
  .msgManager:hover {
    color: #4077BC;
    cursor: pointer;
  }
  .app-container .el-dialog__headerbtn {
    top: 10px
  }
</style>