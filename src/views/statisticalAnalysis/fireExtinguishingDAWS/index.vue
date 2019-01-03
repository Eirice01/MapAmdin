<template>
    <el-container class="app-container" style="padding-bottom:20px" v-loading.body="listLoading">
      <el-header class="header-plane" height="auto">
         <el-form :inline="true"  class="demo-form-inline">
           <el-form-item>
             <select-car-single ref="selectCarSingle" @selectedCar="selectedCar" @selectedCarId="selectedCarId"></select-car-single>
           </el-form-item>
          <el-form-item label="处理状态">
            <el-select v-model.trim="listQuery.hendlerStatus" placeholder="请选择" style="width:100px" size="small">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预警类型">
           <el-popover placement="bottom" width="250">
              <menu-type-tree ref="menuType" style="height: 300px; overflow: auto" :treeMenuData="menus" v-if="menus.length > 0 " selectedAll :treeMenuProp="defaultProps" :checkedKeys="defaultChecked" @check-change="handleNodeChange"></menu-type-tree>
              <el-input slot="reference" placeholder="请选择预警类型" v-model.trim="alarmTypeName" style="width:100px;" size="small" readonly></el-input>
            </el-popover>
            <span style="font-size: 14px">已选择{{count}}种</span>
          </el-form-item>
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDataPickers"></data-pickers>
          </el-form-item>
          <el-form-item>
            <el-button @click="initPage" type="primary" size="mini" >查询</el-button>
            <el-button @click="resetQuery" type="primary" size="mini" >重置</el-button>
            <el-button type="primary" size="mini" @click="handleExport" >导出</el-button>
          </el-form-item>
         </el-form>
      </el-header>
      <el-main>
        <charts cardTitle='<span style="font-size:14px">灭火装置预警处理情况统计</span>' :chartData="chartData" :legendData="legendData" showCard :ratio=1 chartType="bar" ref="bar"></charts>
      </el-main>
      <el-main style="padding-top:0">
        <el-table :data="fireData" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc">
          <el-table-column align="center" type="index" label="序号" width="50" ></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :prop="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmType'" type="text" @click="handleDetail(scope.row)">{{scope.row[column.key]}}</el-button>
              <span v-else-if="column.key === 'handlerType'" v-text="handlerTypeformatter(scope.row[column.key])"></span>
              <span v-else-if="column.key === 'handlerStatus'" v-text="handlerStatusformatter(scope.row[column.key])"></span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange" @current-change="handleCurrentChangelist" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-main>
      <alarm-info :dialogTitle="dialogTitle" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
import { getFireStatisticsList, getFireStatisticsExport, getFireStatisticsReport, getFireStatisticsType } from '@/api/report/reportApi'
import mixins from '@/common/mixins'
import _ from 'lodash'

export default {
  name: 'vehiclePFS',
  mixins: [mixins],
  data() {
    return {
      // 报表
      legendData: [],
      chartData: [],
      // 预警类型
      menus: [],
      alarmTypeName: '',
      count: 0,
      defaultChecked: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 选择车辆
      warningProcessDialog: false,
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '已处理',
          value: 1
        },
        {
          label: '未处理',
          value: 0
        }
      ],
      // 列表数据
      total: 0,
      listLoading: false,
      activeIndex: '1',
      fireData: [],
      columns: [
        {
          key: 'plateNo',
          title: '车牌号',
          width: '150'
        },
        {
          key: 'deptName',
          title: '所属机构',
          width: '150'
        },
        {
          key: 'driverName',
          title: '司机',
          width: '150'
        },
        {
          key: 'phone',
          title: '联系电话',
          width: '150'
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
          key: 'handlerStatus',
          title: '处理状态',
          width: '100'
        },
        {
          key: 'address',
          title: '预警位置',
          width: '250'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        startTime: '',
        endTime: '',
        vehicleId: '',
        hendlerStatus: '',
        alarmType: ''
      },
      chartQuery: {
        plateNos: '',
        startTime: '',
        endTime: '',
        hendlerStatus: '',
        alarmType: ''
      },
      exportQuery: {
        page: 1,
        limit: 10,
        alarmType: '',
        vehicleId: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  watch: {
    listQuery: {// 深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        this.chartQuery.hendlerStatus = val.hendlerStatus
      },
      deep: true
    }
  },
  async created() {
    this.listLoading = true
    await this.getAlarmTree()
    // await this.initDefaultTypes()
    await this.initPage()
  },
  methods: {
    async initPage() {
      if (this.listQuery.alarmType === null || this.listQuery.alarmType === '') {
        this.$message({
          message: '预警类型不能为空！',
          type: 'warning'
        })
        this.listLoading = false
        return
      }
      await this.getFireReport(this.legendData)
      await this.getFireList()
      this.listLoading = false
    },
    async getAlarmTree() {
      const result = await getFireStatisticsType()
      this.menus = [result.data]
    },
    async resetQuery() {
      const _ = this
      this.listLoading = true
      this.$refs.selectCarSingle.clearSelected()
      this.$refs.menuType.selectAll()
      this.$refs.dataPickers.resetDate()
      this.listQuery.page = 1
      this.listQuery.limit = 10
      this.listQuery.vehicleId = ''
      this.listQuery.hendlerStatus = ''
      this.chartQuery.plateNos = ''
      this.chartQuery.hendlerStatus = ''
      // await this.initDefaultTypes()
      setTimeout(function() {
        _.initPage()
      }, 300)
    },
    async getFireList() {
      const res = await getFireStatisticsList(this.listQuery)
      if (res.code === 0) {
        this.fireData = res.data.rows
        this.total = res.data.totalCount
      }
      this.listLoading = false
    },
    async getFireReport() {
      if (this.listQuery.hendlerStatus === 1) {
        this.legendData = ['已处理']
      }
      if (this.listQuery.hendlerStatus === 0) {
        this.legendData = ['未处理']
      }
      if (this.listQuery.hendlerStatus === '') {
        this.legendData = ['已处理', '未处理']
      }
      const theVue = this
      theVue.chartData = []
      const chartDatas = await getFireStatisticsReport(this.chartQuery)
      _.forEach(_.get(chartDatas, 'data'), function(v, i) {
        theVue.chartData.push([_.get(v, 'startTime'), [_.get(v, 'hendlerNumber'), _.get(v, 'nohendlerNumber')]])
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
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getFireList()
    },
    handleCurrentChangelist(val) {
      this.listQuery.page = val
      this.getFireList()
    },
    handleExport() {
      getFireStatisticsExport(this.exportQuery).then((result) => {
        this.downloads(result)
      }).catch((result) => {
        this.downloads(result)
      })
    },
    downloads(data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]), { type: 'application/vnd.ms-excel' })
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '灭火装置异常预警统计.xls')
      document.body.appendChild(link)
      link.click()
    },
    selectedCar(val) {
      this.chartQuery.plateNos = val
    },
    selectedCarId(val) {
      this.listQuery.vehicleId = val
      this.exportQuery.vehicleId = val
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
      this.listQuery.alarmType = arr.join()
      this.alarmTypeName = tmp.join()
    },
    handlerStatusformatter(n) {
      switch (n) {
        case 0:
          return '未处理'
        case 1:
          return '已处理'
      }
    },
    checkDataPickers(arr) {
      if (arr) {
        this.listQuery.startTime = arr[0]
        this.listQuery.endTime = arr[1]
        this.chartQuery.startTime = arr[0]
        this.chartQuery.endTime = arr[1]
        this.chartQuery.startTime = arr[0]
        this.chartQuery.endTime = arr[1]
      } else {
        this.listQuery.startTime = ''
        this.listQuery.endTime = ''
        this.chartQuery.startTime = ''
        this.chartQuery.endTime = ''
        this.exportQuery.startTime = ''
        this.exportQuery.endTime = ''
      }
    }
  }
}
</script>
