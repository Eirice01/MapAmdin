<template>
  <div class="app-container">
  <!-- 操作日志 -->
  <el-container style="padding-buttom:20px" v-loading.body="listLoading">
    <el-header class="header-plane" height="auto" >
      <el-form :inline="true"  class="demo-form-inline">
        <el-form-item label="查询时间">
          <data-pickers ref="dataPickers" @startEnd="checkStartEnd"></data-pickers>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input  size="small" v-model="listQuery.userName" placeholder="请输入用户名"  style="display:inline-block; width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleFilter">查询</el-button>
          <el-button size="small" type="primary" @click="refresh">重置</el-button>
          <el-button size="small" type="primary" @click="handleDownload">导出</el-button>
        </el-form-item>
      </el-form>
        </el-header>
        <el-main>
          <!-- 列表数据区  -->
          <el-table :data="list" v-loading.body="listLoading" border stripe fit style="width: 100%">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column align="center" label="登录账号">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户名称" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.realname}}</span>
              </template>
            </el-table-column>
            <el-table-column label="所属机构" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.operation}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createDate}}</span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination class="pagination-plane" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum"
                         :page-sizes="[5,10,15,20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </el-main>
        <report-footer></report-footer>
      </el-container>
  </div>
</template>
<script>
import { getOperationLog, exportExcel } from '@/api/log/operationalLogbook'
import { parseTime } from '@/utils'
import mixins from '@/common/mixins'
import selectCarSingle from '@/components/SelectCar/selectCarSingle'
export default {
  name: 'loginlog',
  mixins: [mixins],
  components: {
    selectCarSingle
  },
  data() {
    return {
      tableData: [],
      allotDialogVisible: false,
      tmp: {},
      radioVal: '-1',
      list: [],
      total: 0,
      isView: false,
      isUpdate: false,
      listQuery: {
        pageSize: 5,
        pageNum: 1,
        startTime: '',
        endTime: '',
        userName: '' // 用户名
      }
    }
  },
  async mounted() {
    await this.getList()
  },
  methods: {
    async getList() { // 分页获取操作日志列表
      this.listLoading = true
      const result = await getOperationLog(this.listQuery)
      this.list = result.data.rows
      this.total = result.data.totalCount
      this.listLoading = false
    },
    async refresh() {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = 5
      this.listQuery.userName = ''
      this.$refs.dataPickers.resetDate()
      await this.getList()
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleDownload() {
      exportExcel(this.listQuery).then((result) => {
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
      link.setAttribute('download', '操作日志.xls')
      document.body.appendChild(link)
      link.click()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}

</script>
