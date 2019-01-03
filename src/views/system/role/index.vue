<template>
  <div class="app-container">
    <el-container style="border: 1px solid #eee">
      <el-aside width="220px" style="background-color: rgb(238, 241, 246)" id="roleTree">
        <!-- <el-tree :data="treeData" :props="defaultProps" ref="deptTree" @node-click="handleNodeClick" :filter-node-method="filterNode"></el-tree> -->
        <dept-tree @nodeClick="handleNodeClick"></dept-tree>
      </el-aside>
      <el-container>
        <el-header style="height: 60px;font-size: 12px">
          <!-- 查询条件区 -->
          <div class="filter-container" style="float: left">
            <label class="radio-label" style="padding-left:0;">角色名称: </label>
            <el-input size="small" label="角色名称" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入姓名" v-model.trim="listQuery.roleName"></el-input>
            <el-button size="small" type="primary" icon="el-icon-search" class="filter-item" v-waves @click="handleFilter">查询</el-button>
          </div>
          <!-- 工具栏 -->
          <div class="toolbar" style="float: right">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
              <!-- <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-download" @click="educe">导出</el-button> -->
          </div>
        </el-header>
        <el-main>
          <!-- 列表数据区 -->
          <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%" @selection-change="handleSelect">
            <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect">
            </el-table-column>

            <el-table-column align="center" label="序号" type="index" width="60" fixed="left">
            </el-table-column>

            <el-table-column align="center" label="角色名称" fixed="left">
              <template slot-scope="scope">
                <span>{{scope.row.roleName}}</span>
              </template>
            </el-table-column>
            
            <el-table-column align="center" label="所属机构" fixed="left">
              <template slot-scope="scope">
                <span>{{scope.row.deptName}}</span>
              </template>
            </el-table-column>

            <!-- <el-table-column align="center" label="机构名称" fixed="left">
              <template slot-scope="scope">
                <span>{{scope.row.deptName}}</span>
              </template>
            </el-table-column> -->

            <el-table-column label="修改日期" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.updateTime}}</span>
              </template>
            </el-table-column>
            
            <el-table-column align="center" label="操作" fixed="right" width="270px">
              <template slot-scope="scope">
                <el-button type="info" size="small" icon="el-icon-message" @click="handleView(scope.row)">查看</el-button>
                <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete(scope.row.roleId)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-container>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :rules="rules" ref="dataForm" :model="sysUser" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;' :disabled="isView">
        <el-form-item label="角色名称" prop="roleName">
          <el-input size="small" v-model="sysUser.roleName" placeholder="请输入角色名称" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="所属机构" prop="deptName">
          <el-col :span="22">
            <el-input size="small" v-model="sysUser.deptName" :disabled="true" placeholder="请选择所属机构"></el-input>
          </el-col>
          <el-col :span="2" v-show="!isView">
            <i class="el-icon-search" style="cursor:pointer" @click="chooseDept" ></i>
          </el-col>
        </el-form-item>

        <el-form-item label="分配权限">
          <el-tree
          :data="data"
          ref="jurisdictionTree"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
          @check-change="checkChange"
          :default-checked-keys="sysUser.menuIdList"
          style="min-height: 200px; max-height: 300px; overflow: auto">
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" type="primary" v-if="dialogStatus=='create'" @click="createData" :disabled="isView">确 定</el-button>
        <el-button size="small" type="primary" v-else @click="updateData" :disabled="isView">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择所属机构" :visible.sync="dialogDeptVisible" width="300px" :close-on-click-modal="false">
      <dept-tree ref="selectDeptTree"></dept-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeptVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="chooseDeptConfirm">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchRoleList, getMenuTree, createRole, getRoleDetail, updateRole, deleteRole, exportRole } from '@/api/system/role'
import waves from '@/directive/waves' // 水波纹指令
import deptTree from '../dept/components/deptTree'

export default {
  name: 'userList',
  components: { deptTree },
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      selectRows: [], // 选中的行数据
      data: [],
      isView: false,
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      listQuery: {
        page: 1,
        limit: 10,
        roleName: '',
        deptName: ''
      },
      sysUser: {
        id: undefined,
        roleName: '',
        deptId: '',
        menuIdList: []
      },
      roles: [],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '新增角色',
        view: '角色详情'
      },
      rules: { // 表单验证规则
        roleName: [
          { required: true, message: '角色名称是必填项', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        deptName: [{ required: true, message: '请选择所属机构', trigger: 'blur' }]
      },
      tmpKey: '-999'
    }
  },
  watch: {
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  mounted() {
    this.getList()
    getMenuTree().then(res => {
      // this.data = res.data.children
      this.data = JSON.parse('[' + JSON.stringify(res.data) + ']')
    })
  },
  methods: {
    educe() {
      exportRole().then(res => {})
    },
    checkChange(data) {
      this.sysUser.menuIdList = [].concat(this.$refs.jurisdictionTree.getCheckedKeys(), [this.tmpKey], this.$refs.jurisdictionTree.getHalfCheckedKeys())
    },
    getList() { // 分页获角色列表
      this.listLoading = true
      fetchRoleList(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleView(row) {
      this.isView = true
      this.dialogFormVisible = true
      this.dialogStatus = 'view'
      getRoleDetail(row.roleId).then(res => {
        this.sysUser.roleName = res.data.roleName
        this.sysUser.deptName = res.data.deptName
        res.data.menuIdList == null ? this.sysUser.menuIdList = [] : this.sysUser.menuIdList = res.data.menuIdList
        this.$nextTick(() => {
          // 2. 给tree绑定数据时，通过tempKey移除之前添加的半选中状态节点Id。
          const idx = this.sysUser.menuIdList.indexOf(this.tmpKey)
          if (idx !== -1) {
            this.sysUser.menuIdList.splice(idx, this.sysUser.menuIdList.length - idx)
          }
          this.$refs.jurisdictionTree.setCheckedKeys(this.sysUser.menuIdList)
          // this.$refs.jurisdictionTree.setCheckedKeys(this.sysUser.menuIdList)
        })
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleDelete(id) { // 删除事件
      this.isView = false
      this.$confirm('此操作将删除角色信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(id).then(response => {
          if (response && response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.listQuery.page = 1
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
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleNodeClick(data) { // 树节点点击回调方法
      if (data.text === '顶级节点') {
        this.listQuery.deptId = ''
      } else {
        this.listQuery.deptId = data.id
      }
      this.listQuery.page = 1
      this.getList()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
      // this.$nextTick(() => {
      //   this.listQuery.roleName = ''
      // })
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
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    resetForm() { // 重置表单
      this.sysUser = {
        userId: undefined,
        roleName: '',
        deptId: '',
        deptName: '',
        menuIdList: []
      }
    },
    handleCreate() { // 新增按钮方法
      this.isView = false
      this.resetForm()
      // this.getAllRole()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs.jurisdictionTree.setCheckedKeys([])
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() { // 新增保存方法
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.sysUser.menuIdList.length !== 0) {
            createRole(this.sysUser).then((response) => {
              if (response && response.code === 0) {
                // this.list.unshift(this.sysUser)
                this.dialogFormVisible = false
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.listQuery.page = 1
                this.getList()
                this.resetForm()
              }
              this.resetForm()
            })
          } else {
            this.$message.error('请分配权限后再添加')
          }
        }
      })
    },
    handleUpdate(row) { // 修改按钮方法
      this.resetForm()
      this.isView = false
      this.dialogFormVisible = true
      getRoleDetail(row.roleId).then(res => {
        this.sysUser.roleName = res.data.roleName
        this.sysUser.menuIdList = res.data.menuIdList
        this.sysUser.roleId = res.data.roleId
        this.sysUser.deptName = res.data.deptName
        this.sysUser.deptId = res.data.deptId
        if (res.data.deptId === '-1') {
          this.sysUser.deptName = '顶级节点'
        }
        this.dialogStatus = 'update'
        res.data.menuIdList == null ? this.sysUser.menuIdList = [] : this.sysUser.menuIdList = res.data.menuIdList
        this.$nextTick(() => {
          const idx = this.sysUser.menuIdList.indexOf(this.tmpKey)
          if (idx !== -1) {
            this.sysUser.menuIdList.splice(idx, this.sysUser.menuIdList.length - idx)
          }
          this.$refs.jurisdictionTree.setCheckedKeys(this.sysUser.menuIdList)
          // this.$refs.jurisdictionTree.setCheckedKeys(this.sysUser.menuIdList)
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    updateData() { // 修改保存方法
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.sysUser)
          updateRole(tempData).then((response) => {
            if (response && response.code === 0) {
              this.dialogFormVisible = false
              this.$message({
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
              this.listQuery.page = 1
              this.getList()
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
  padding: 0 12px 0 30px;
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

<style>
.el-tree-node>.el-tree-node__children {
  overflow: inherit;
}
.el-tree {
  overflow-x: auto;
}
</style>


