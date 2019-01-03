<template>
    <el-container class="app-container">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="选择线路">
            <el-popover placement="bottom" width="250">
              <el-tree default-expand-all style="height: 300px; overflow: auto"
               ref="tree"
               show-checkbox
               :data="deptList"
               :props="defaultProps"
               node-key="id"
               highlight-current
               @check-change="handleCheckChange"></el-tree>
              <el-input slot="reference" style="width:100px" readonly size="small" v-model.trim="lineNames" placeholder="请选择线路"></el-input>
            </el-popover>
            <span style="font-size: 14px" v-if="countids.length > 0">已选择{{count}}条线路</span>
          </el-form-item>
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkDate"></data-pickers>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery" type="primary" size="mini" >查询</el-button>
            <el-button @click="resetQuery" type="primary" size="mini" >重置</el-button>
            <el-button type="primary" size="mini" >导出</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <charts cardTitle='<span style="font-size:14px">线路客流统计</span>' :legendData="legendData" :chartData="chartData" showCard :ratio=1 chartType="bar" ref="bar"></charts>
      </el-main>
      <el-main style="padding-top:0px;">
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe style="width:100%; border-radius: 5px;">
          <el-table-column align="center" type="index" width="70" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :prop="column.key" :label="column.title" :width="column.width">
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
import { getDeptTree } from '@/api/base/device'
import { getRouteList, getRouteReport } from '@/api/report/reportApi'
import mixins from '@/common/mixins'
import _ from 'lodash'
export default {
  name: 'routePFS',
  mixins: [mixins],
  data() {
    return {
      // 统计报表
      legendData: [],
      chartData: [],
      // 结构树
      countids: [],
      deptList: [],
      count: 0,
      lineNames: '',
      defaultProps: { children: 'children', label: 'text' },
      total: 0,
      listLoading: false,
      activeIndex: '1',
      option: '1',
      data: [],
      columns: [
        {
          key: 'deptname',
          title: '线路名称'
        },
        {
          key: 'vehicleCount',
          title: '车辆总数'
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
        },

        {
          key: 'averageuup',
          title: '单车上客人数'
        },

        {
          key: 'averageDown',
          title: '单车下客人数'
        }
      ],
      tableQuery: {
        ids: '',
        startTime: '',
        endTime: '',
        page: 1,
        pageSize: 10
      },
      chartQuery: {
        ids: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  async created() {
    await this.getTree()
    await this.initPage()
  },
  methods: {
    async initPage() {
      this.listLoading = true
      await this.getList()
      await this.getChart()
      this.listLoading = false
    },
    async getTree() {
      const res = await getDeptTree()
      var the = this
      // 机构禁用逻辑  如果没有子元素 而且是机构设置 disabled 为true
      var dataDeptList = _.get(res, 'data.children', [])
      _.forEach(dataDeptList, function(v, i) {
        const len = 0
        the.initDisableNodes(v, len)
      })
      this.deptList = dataDeptList
    },
    initDisableNodes(node, len) {
      var the = this
      const count = the.initDisabledLength(node)
      // 自己是否禁用
      _.set(node, 'disabled', _.lte(count || 0, 0))
      _.forEach(_.get(node, 'children'), function(v, i) {
        // 每个子元素是否禁用
        const lens = 0
        the.initDisableNodes(v, lens)
      })
    },
    // 禁用掉无线路子元素的数据选中
    initDisabledLength(node, length) {
      var the = this
      if (_.eq(_.get(node, 'attributes.deptType'), 2)) {
        length = _.add(1)
      }
      _.forEach(_.get(node, 'children'), function(v, k) {
        length = _.add(the.initDisabledLength(v))
      })
      return length
    },
    async getList() {
      const res = await getRouteList(this.listQuery)
      if (res.code === 0) {
        this.data = res.data.rows
        this.total = res.data.totalCount
      }
      this.listLoading = false
    },
    async getChart() {
      const theVue = this
      theVue.chartData = []
      theVue.legendData = []
      const chartDatas = await getRouteReport(this.chartQuery)
      _.forEach(_.get(chartDatas, 'data'), function(v, k) {
        const tempArray = []
        _.forEach(v, function(_v, i) {
          theVue.legendData.push(_.get(_v, 'deptname'))
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
      this.$refs.tree.setCheckedKeys([])
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
    /**
     * 选择线路的change方法
     *
     */
    handleCheckChange(node, flag, hasChildren) {
      // 获取选中的部门ids
      const the = this
      const treeObj = this.$refs.tree
      var checkedNodes = treeObj.getCheckedNodes(true)
      // 五条之后不做选中
      if (checkedNodes.length > 5) {
        this.$message({
          message: '最多只能选择5条线路',
          type: 'warning',
          duration: '1500'
        })
        treeObj.setChecked(_.get(node, 'id', ''), false)
        return false
      }
      var names = []
      var deptIds = []
      _.forEach(checkedNodes, function(v, i) {
        names.push(_.get(v, 'text', ''))
        deptIds.push(_.get(v, 'id', ''))
      })
      this.count = deptIds.length
      this.countids = deptIds
      this.lineNames = names.join()
      _.set(the.tableQuery, 'ids', deptIds.join())
      _.set(the.chartQuery, 'ids', deptIds.join())
    }
  }
}
</script>
