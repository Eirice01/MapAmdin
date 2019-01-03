<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-header style="font-size: 12px">
          <!-- 查询条件区 -->
          <div class="filter-container" style="float: left">
            <label class="radio-label" style="padding-left:0;">设备ID</label>
            <el-input size="small" style="width: 120px;" class="filter-item" placeholder="请输入设备ID" v-model.trim="listQuery.deviceId"></el-input>
            <label class="radio-label" style="padding-left:0;">SIM卡号</label>
            <el-input size="small" style="width: 120px;" class="filter-item" placeholder="请输入SIM卡号" v-model.trim="listQuery.simCode"></el-input>
            <label class="radio-label" style="padding-left:0;">绑定状态</label>
            <el-select v-model="listQuery.status" size="small" placeholder="请选择绑定状态" style="width: 150px;">
                <el-option
                 v-for="item in bandOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
                </el-option>
            </el-select>
            <label class="radio-label" style="padding-left:0;">设备类型</label>
            <el-select v-model="listQuery.deviceType" placeholder="请选择设备类型" size="small" style="width: 150px;">
                <el-option
                 v-for="item in equipmentOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
                 </el-option>
            </el-select>
            <label class="radio-label" style="padding-left:0;">所属机构</label>
            <el-input size="small" style="width: 130px;" class="filter-item" placeholder="请输入所属机构" v-model="listQuery.deptName" @focus="chooseDeptFilter" readonly></el-input>
            <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-refresh" @click="resetSearch">重置</el-button>
          </div>
          <!-- 工具栏 -->
          <div class="toolbar" style="float: right">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
              <!-- <el-button size="small" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button> -->
          </div>
        </el-header>
        <el-main>
          <!-- 列表数据区 -->
          <el-table :data="list" v-loading.body="listLoading" border stripe fit style="width: 100%" @selection-change="handleSelect">

            <el-table-column type="index" width="50" label="序号"></el-table-column>

            <el-table-column width="120px" align="center" label="SIM卡号">
              <template slot-scope="scope">
                <span>{{scope.row.simCode}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="绑定设备">
              <template slot-scope="scope">
                <span>{{scope.row.deviceId}}</span>
              </template>
            </el-table-column>

            <el-table-column label="设备类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.deviceType}}</span>
              </template>
            </el-table-column>

            <el-table-column label="绑定车辆" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.plateNo}}</span>
              </template>
            </el-table-column>

            <el-table-column label="所属机构" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.deptName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="绑定状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.status == 1 ? '已绑定' : '未绑定'}}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建日期" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="300px">
              <template slot-scope="scope">
                <el-button type="info" size="small" icon="el-icon-message" @click="handleView(scope.row)">查看</el-button>
                <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row.id)">编辑</el-button>
                <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum"
          :page-sizes="[10,20,30,50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
      </el-container>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :rules="rules" ref="dataForm" :model="sysUser" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;' :disabled="isView">
        <el-form-item label="SIM卡号" prop="code">
          <el-input size="small" v-model="sysUser.code" placeholder="请输入SIM卡号" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="所属机构" prop="deptName">
          <el-col :span="22">
            <el-input size="small" v-model="sysUser.deptName" :disabled="true" placeholder="请选择所属机构"></el-input>
          </el-col>
          <el-col :span="2" v-show="!isView">
            <i class="el-icon-search" style="cursor:pointer" @click="chooseDept"></i>
          </el-col>
        </el-form-item>

        <el-form-item label="登记时间">
          <el-date-picker v-model="sysUser.registDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择登记时间" :disabled="isView" :editable='false'>
          </el-date-picker>
        </el-form-item>

        <!-- <el-form-item label="启用状态" prop="status">
          <el-select v-model="sysUser.status" placeholder="请选择启用状态" style="width:300px" :disabled="isView">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注">
            <el-input
             type="textarea"
             autosize
             placeholder="请输入内容"
             v-model="sysUser.remark">
            </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="isView">确 定</el-button>
        <el-button size="small" v-else type="primary" @click="updateData" :disabled="isView">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择所属机构" :visible.sync="dialogVisible" width="300px" :close-on-click-modal="false">
      <dept-tree ref="selectDeptFilterTree"></dept-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseDeptFilterConfirm">确 认</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择所属机构" :visible.sync="dialogDeptVisible" width="300px" :close-on-click-modal="false">
      <dept-tree ref="selectDeptTree"></dept-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDeptVisible = false">取 消</el-button>
        <el-button type="primary" @click="chooseDeptConfirm">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, addSim, fetchSim, updateSim, deleteSim } from '@/api/infomationM/simm'
import waves from '@/directive/waves' // 水波纹指令
import deptTree from './dept/components/deptTree'
import { parseTime } from '@/utils'

export default {
  name: 'simList',
  components: { deptTree },
  directives: {
    waves
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      isView: false,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        simCode: '',
        deviceType: '',
        name: '',
        status: '',
        deptIdAll: ''
      },
      bandOptions: [
        {
          value: '0',
          label: '未绑定'
        },
        {
          value: '1',
          label: '已绑定'
        }
      ],
      equipmentOptions: [
        {
          value: 'VEHICLE_GB32960',
          label: 'T-box终端'
        },
        {
          value: 'VEHICLE_QH_ADAS',
          label: 'ADAS智能设备'
        }
      ],
      options: [],
      sysUser: {
        deptId: '',
        deptName: '',
        registDate: '',
        status: '',
        code: '',
        remark: '',
        useFlag: 0
      },
      roles: [
        {
          value: 0,
          label: '未启用'
        },
        {
          value: 1,
          label: '已启用'
        }],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogStatus: '',
      dialogVisible: false,
      textMap: {
        update: '编辑SIM卡',
        create: '新增SIM卡',
        view: '查看详情'
      },
      rules: { // 表单验证规则
        code: [
          { required: true, message: '请填写SIM卡号', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ]
        // ,
        // status: [
        //   { required: true, message: '请选择状态', trigger: 'blur' }
        // ]
      }
    }
  },
  computed: {
    deviceId() {
      return this.listQuery.deviceId
    }
  },
  watch: {
    deviceId: {
      handler(val, oldVal) {
        if (val === '') {
          console.log(val)
          delete this.listQuery.deviceId
        }
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    statuFilter(statu) {
      return statu === 1 ? '未过期' : '已过期'
    }
  },
  mounted() {
    console.log(this.listQuery)
    this.getList()
  },
  methods: {
    getList() { // 分页获取用户列表
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    getSimDetail(id) { // 获取单个用户详情信息
      fetchSim(id).then(res => {
        console.log(res)
        this.sysUser = res.data
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleDelete(id) { // 删除事件
      this.$confirm('是否删除此SIM卡?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSim(id).then(response => {
          if (response && response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.listQuery.pageNum = 1
            this.getList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleView(row) {
      this.dialogStatus = 'view'
      this.isView = true
      this.getSimDetail(row.id)
      // this.sysUser = row
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleFilter() {
      console.log(this.listQuery)
      this.listQuery.pageNum = 1
      this.getList()
    },
    chooseDept() {
      this.dialogDeptVisible = true
    },
    chooseDeptConfirm() {
      // getSelectNode
      const deptNode = this.$refs.selectDeptTree.getSelectNode()
      if (deptNode === null) {
        this.$message({
          message: '请选择所属机构',
          type: 'warning'
        })
      } else {
        this.sysUser.deptId = deptNode.id
        this.sysUser.deptName = deptNode.text
        this.dialogDeptVisible = false
      }
    },
    chooseDeptFilter() {
      this.dialogVisible = true
    },
    chooseDeptFilterConfirm() {
      // getSelectNode
      const deptNode = this.$refs.selectDeptFilterTree.getSelectNode()
      if (deptNode === null) {
        this.$message({
          message: '请选择所属机构',
          type: 'warning'
        })
      } else {
        this.listQuery.deptIdAll = deptNode.id
        this.listQuery.deptName = deptNode.text
        this.dialogVisible = false
      }
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['SIM卡号', '绑定设备', '设备类型', '绑定车辆', '所属机构', '绑定状态']
        const filterVal = ['simCode', 'deviceId', 'deviceType', 'plateNo', 'deptName', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'SIM卡列表'
        })
        this.downloadLoading = false
      })
    },
    resetForm() { // 重置表单
      this.sysUser = {
        deptId: '',
        deptName: '',
        registDate: '',
        status: '',
        code: '',
        remark: '',
        useFlag: 0
      }
    },
    resetSearch() {
      this.listQuery.deviceId = null
      this.listQuery.simCode = ''
      this.listQuery.status = ''
      this.listQuery.deviceType = ''
      this.listQuery.name = ''
      this.listQuery.deptIdAll = ''
      this.listQuery.deptName = ''
    },
    handleCreate() { // 新增按钮方法
      this.dialogFormVisible = true
      this.isView = false
      this.resetForm()
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() { // 新增保存方法
      console.log(this.sysUser)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          console.log(this.sysUser)
          addSim(this.sysUser).then((res) => {
            if (res && res.code === 0) {
              // this.list.unshift(this.sysUser)
              this.listQuery.pageNum = 1
              this.getList()
              this.dialogFormVisible = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    handleUpdate(id) { // 修改按钮方法
      this.isView = false
      this.resetForm()
      this.getSimDetail(id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() { // 修改保存方法
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.sysUser)
          updateSim(tempData).then((response) => {
            if (response && response.code === 0) {
              this.listQuery.pageNum = 1
              this.getList()
              for (const v of this.list) {
                if (v.userId === this.sysUser.userId) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.sysUser)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'error',
                duration: 2000
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 5px 0 0;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.el-header {
  height: 70px;
  padding: 10px 20px;
}
.toolbar {
  height: 50px;
  line-height: 50px;
}
.filter-container {
  height: 50px;
  line-height: 50px;
}
.el-pagination {
  padding: 2px 20px;
}
.el-tree {
  background: #eef1f6;
}
.el-aside {
  padding: 8px;
}
</style>
