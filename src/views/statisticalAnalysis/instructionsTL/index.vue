<template>
  <div class="app-container">
    <el-container v-loading.body="listLoading" style="padding-bottom:20px;">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="查询时间">
            <data-pickers ref="dataPickers" @startEnd="checkStartEnd"></data-pickers>
          </el-form-item>
          <el-form-item label="指令类型">
            <el-input size="small" v-model="listQuery.commandType" placeholder="请输入指令类型"
                      style="display:inline-block; width:200px"></el-input>
            <!-- <el-select v-model="listQuery.commandType" placeholder="请选择指令类型">
              <el-option label="图片抓拍" value="图片抓拍"></el-option>
              <el-option label="文本下发" value="文本下发"></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item>
            <el-button size="small" type="primary" @click="handleFilter">查询
            </el-button>
            <el-button size="small" type="primary" @click="refresh">重置</el-button>
            <el-button size="small" type="primary" @click="handleDownload">导出</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <!-- 列表数据区  -->
        <el-table :data="list" v-loading.body="listLoading" border stripe fit style="width: 100%">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="车牌号" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.plateNo}}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属机构" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.deptName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="指令类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.commandType}}</span>
            </template>
          </el-table-column>
          <el-table-column label="下发时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.sendTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="指令详情" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.commandName}}</span>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
                         :page-sizes="[5,10,15,20]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
      </el-main>
      <report-footer></report-footer>
    </el-container>
  </div>
</template>
<script>
  import { getCommandLog, exportExcel } from '@/api/log/command'
  import { parseTime } from '@/utils'
  import mixins from '@/common/mixins'

  export default {
    name: 'loginlog',
    mixins: [mixins],
    data() {
      return {
        getMessaged: false,
        treeData: [],
        tableData: [],
        list: [],
        total: 0,
        isView: false,
        isUpdate: false,
        listQuery: {
          page: 1,
          pageSize: 5,
          commandType: '',
          startTime: '',
          endTime: ''
        }
      }
    },
    async mounted() {
      await this.getList()
    },
    methods: {
      async getList() { // 分页获取用户列表
        this.listLoading = true
        console.log(this.listQuery)
        const result = await getCommandLog(this.listQuery)
        this.list = result.data.rows
        this.total = result.data.totalCount
        this.listLoading = false
      },
      handleNodeClick(val) {
        this.queryList.deptId = val.id
        this.getCarList()
      },
      search() {
        this.getCarList()
      },
      async refresh() {
        this.listQuery.page = 1
        this.listQuery.pageSize = 5
        this.listQuery.commandType = ''
        this.$refs.dataPickers.resetDate()
        await this.getList()
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.listQuery.page = val
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
        link.setAttribute('download', '指令日志.xls')
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
