<template>
  <div class="app-container">
    <el-container>
      <el-header style="height:30px;">
        <el-form :inline="true" :model="query" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" icon="el-icon-plus" @click="handleCreate" size="small">新增</el-button>
          </el-form-item>
          <el-form-item>
            <el-input v-model="query.name" size="small" style="width: 200px;margin-left:50px;" class="filter-item" placeholder="字典名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter(query.name)">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%;">
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
            <template slot-scope="scope">
              <span>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-tooltip content="编辑" placement="top">
                <el-button circle type="primary" size="small" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button circle type="primary" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <!-- 分页区 -->
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>

    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="sysDict" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="sysDict.name" placeholder="示例：东风"></el-input>
        </el-form-item>

        <el-form-item label="字典类型" prop="type">
          <el-input v-model="sysDict.type" placeholder="示例：车辆品牌"></el-input>
        </el-form-item>

        <el-form-item label="字典码" prop="code">
          <el-input v-model="sysDict.code" placeholder="示例：vehicle_type"></el-input>
        </el-form-item>

        <el-form-item label="字典值" prop="value">
          <el-input v-model="sysDict.value" placeholder="示例：0"></el-input>
        </el-form-item>

        <el-form-item label="排序号" prop="orderNum">
          <el-input v-model="sysDict.orderNum" placeholder="示例：0"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="sysDict.remark" placeholder="备注信息"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus==='create'" type="primary" @click="handleConfirm">确 定</el-button>
        <el-button v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-11 17:58:56
import { fetchList, createDict, updateDict, deleteDict, fetchDict } from '@/api/infomationM/dict'

export default {
  name: 'dictList',
  data() {
    return {
      total: 0,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑字典',
        create: '新增字典'
      },
      listLoading: false,
      sysDict: {
        id: '',
        name: '',
        type: '',
        code: '',
        value: '',
        orderNum: '',
        remark: ''
      },
      rules: { // 表单验证规则
        name: [{ required: true, message: '字典名称必填', trigger: 'blur' }],
        type: [{ required: true, message: '字典类型必填', trigger: 'blur' }],
        code: [{ required: true, message: '字典码必填', trigger: 'blur' }],
        value: [{ required: true, message: '字典值必填', trigger: 'blur' }]
      },
      data: [],
      columns: [
        {
          key: 'id',
          title: '字典ID',
          width: '100'
        },
        {
          key: 'name',
          title: '字典名称'
        },
        {
          key: 'type',
          title: '字典类型'
        },
        {
          key: 'code',
          title: '字典码'
        },
        {
          key: 'value',
          title: '字典值'
        },
        {
          key: 'orderNum',
          title: '排序'
        },
        {
          key: 'remark',
          title: '备注'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        name: ''
      },
      query: {
        name: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    getList() { // 分页获取字典列表
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.data = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
        this.query.name = ''
        this.listQuery.name = ''
      })
    },
    handleFilter(name) {
      this.listQuery.name = name
      this.listQuery.page = 1
      this.getList()
    },
    resetForm() { // 重置表单
      this.sysDict = {
        name: '',
        type: '',
        code: '',
        value: '',
        orderNum: '',
        remark: ''
      }
    },
    handleCreate() {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getDictDetail(id) {
      fetchDict(id).then((response) => {
        const tmp = response.data
        this.sysDict.id = tmp.id
        this.sysDict.name = tmp.name
        this.sysDict.type = tmp.type
        this.sysDict.code = tmp.code
        this.sysDict.value = tmp.value
        this.sysDict.orderNum = tmp.orderNum
        this.sysDict.remark = tmp.remark
      })
    },
    handleEdit(id) {
      this.resetForm()
      this.getDictDetail(id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleConfirm() { // 新增字典
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createDict(this.sysDict).then((response) => {
            if (response.code === 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    updateData() { // 修改字典
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.sysDict)
          updateDict(tempData).then((response) => {
            if (response.code === 0) {
              this.getList()
              for (const v of this.data) {
                if (v.id === this.sysDict.id) {
                  const index = this.data.indexOf(v)
                  this.data.splice(index, 1, this.sysDict)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleDelete(id) { // 删除字典
      this.$confirm('此操作将删除字典信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDict(id).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: response.msg,
              type: 'error'
            })
          }
        })
      })
    }
  }
}
</script>

<style scoped>

</style>
