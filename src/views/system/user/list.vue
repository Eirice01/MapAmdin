<template>
  <div class="app-container">
    <el-container style="border: 1px solid #eee">
      <el-aside width="220px" style="background-color: rgb(238, 241, 246);">
        <!-- <el-tree :data="treeData" :props="defaultProps" ref="deptTree" @node-click="handleNodeClick" :filter-node-method="filterNode"></el-tree> -->
        <dept-tree @nodeClick="handleNodeClick"></dept-tree>
      </el-aside>
      <el-container>
        <el-header style="height: 60px;font-size: 12px">
          <!-- 查询条件区 -->
          <div class="filter-container" style="float: left">
            <label class="radio-label" style="padding-left:0;">账号</label>
            <el-input size="small" label="账号" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="请输入账号" v-model.trim="listQuery.username"></el-input>
            <el-button size="small"  type="primary" icon="el-icon-search" class="filter-item" v-waves @click="handleFilter">查询</el-button>
          </div>
          <!-- 工具栏 -->
          <div class="toolbar" style="float: right">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
              <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          </div>
        </el-header>
        <el-main>
          <!-- 列表数据区 -->
          <el-table :data="list" v-loading.body="listLoading" border fit stripe style="width: 100%" @selection-change="handleSelect">
            <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect">
            </el-table-column>

            <el-table-column align="center" label='序号' type="index" width="50" fixed="left"></el-table-column>

            <el-table-column min-width="120px" align="center" label="账号" fixed="left">
              <template slot-scope="scope">
                <span>{{scope.row.username}}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120px" align="center" label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.realname}}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120px" label="所属机构" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.deptName}}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120px" label="所属角色" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.roleNameList}}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="120px" label="帐号状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.status | statuFilter}}</span>
              </template>
            </el-table-column>

            <el-table-column min-width="200px" label="修改日期" align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.updateTime}}</span>
              </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="400px" fixed="right">
              <template slot-scope="scope">
                <el-button type="warning" size="small" icon="el-icon-message" @click="updatePwd(scope.row)">重置密码</el-button>
                <el-button type="info" size="small" icon="el-icon-message" @click="handleView(scope.row)">查看</el-button>
                <el-button type="success" size="small" icon="el-icon-setting" @click="handleSAllot(scope.row.userId)">分配</el-button>
                <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row.userId)">编辑</el-button>
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
    <!-- 修改密码弹出框 -->
    <el-dialog title="修改密码" :visible.sync="dialogUpdatePwdVisible" :close-on-click-modal="false">
      <el-form :rules="pwdRules" ref="pwdForm" :model="pwdForm" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item label="新密码" prop="password">
          <el-input size="small" v-model="pwdForm.password" placeholder="请输入密码" :disabled="isView"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input size="small" v-model="pwdForm.confirmPwd" placeholder="请输入用户姓名" :disabled="isView"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogUpdatePwdVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="updatePassword('pwdForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 增改查弹出框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :rules="rules" ref="dataForm" :model="sysUser" label-width="110px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="deptName">
              <el-col :span="22">
                <el-input size="small" v-model="sysUser.deptName" :disabled="true" placeholder="请选择所属机构"></el-input>
              </el-col>
              <el-col :span="2" v-show="!isView">
                <i class="el-icon-search" style="cursor:pointer" @click="chooseDept"></i>
              </el-col>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户姓名" prop="realname">
              <el-input size="small" v-model="sysUser.realname" placeholder="请输入用户姓名" :disabled="isView"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" prop="username">
              <el-input size="small" v-model="sysUser.username" placeholder="请输入登录账号" :disabled="isView"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="登录密码" prop="password" v-if="dialogStatus=='create'">
              <el-input size="small" v-model="sysUser.password" type="password" placeholder="请输入登录密码"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPwd" v-if="dialogStatus=='create'">
              <el-input size="small" v-model="sysUser.confirmPwd" type="password" placeholder="请确认密码"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="所属角色" prop="roleIdList">
              <el-select v-model="sysUser.roleIdList" multiple placeholder="请选择" :disabled="isView" style="width: 100%">
                <el-option
                  v-for="item in roles"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="服务开始时间">
              <el-date-picker v-model="sysUser.enableTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择时间" :disabled="isView" style="width: 100%" :editable='false'>
              </el-date-picker>
               <!-- <el-date-picker
                v-model="enableTime"
                type="datetime"
                placeholder="选择日期时间"
                :disabled="isView"
                :clearable="false"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                style="width: 100%">
               </el-date-picker> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务结束时间">
              <el-date-picker v-model="sysUser.disableTime" :clearable="false" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择时间" :disabled="isView" :picker-options="pickerOptions" style="width: 100%" :editable='false'>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

          <!-- <el-col :span="12">
            <el-form-item label="上传用户头像">
              <el-upload
                class="upload-demo"
                action="192.168.1.1"
                :on-preview="handlePreview"
                multiple
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="12">
            <el-form-item label="车辆授权" v-if="dialogStatus=='create'">
              <el-input size="small" v-model="sysUser.sq" type="password" placeholder="请选择分配车联" readonly @focus="allotVisible = true"></el-input>
            </el-form-item>
          </el-col> -->
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="dialogStatus!=='view'">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" v-if="dialogStatus=='create'" type="primary" @click="createData">确 定</el-button>
        <el-button size="small" v-else type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 机构树弹框 -->
    <el-dialog title="选择所属机构" :visible.sync="dialogDeptVisible" width="300px" :close-on-click-modal="false">
      <dept-tree ref="selectDeptTree"></dept-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogDeptVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="chooseDeptConfirm">确 认</el-button>
      </div>
    </el-dialog>
    <!-- 分配弹出框 -->
    <el-dialog title="分配车辆" :visible.sync="allotVisible" :close-on-click-modal="false" width="60%">
      <el-row>
        <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: auto;">
          <el-tree :data="data" :props="defaultProps" default-expand-all :expand-on-click-node="false" @node-click="deptFilter" style="background: #fff"></el-tree>
        </el-col>
        <el-col :span="17" :offset="1">
          <div class="searchInput" style="overflow: hidden">
            <el-select v-model="queryList.type" style="width:120px">
              <el-option
                v-for="item in allotOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-input placeholder="请输入车牌号" v-model="queryList.vehicleNo" style="width: 200px;" size="small"></el-input> -->
            <!-- <el-button type="primary" size="small" @click="search">查询</el-button> -->
            <el-button type="primary"  size="small" style="float: right" @click="choose" v-show="isAllot">分配</el-button>
            <el-button type="danger"  size="small" style="float: right" @click="relieve" v-show="!isAllot">解除</el-button>
          </div>
          <div>
            <el-table
            ref="multipleTable"
            :data="tableData"
            style="margin-top: 10px;width:100%"
            stripe
            @selection-change="handleSelectionChange"
            v-loading="allotLoading"
            border>
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                label="序号"
                width="50px"
                align="center"
                type="index">
              </el-table-column>
              <el-table-column
                label="车牌号"
                align="center"
                prop="plateNo">
              </el-table-column>
              <el-table-column
                prop="deptName"
                align="center"
                label="企业">
              </el-table-column>
            </el-table>
          </div>
          <el-pagination background @current-change="handlePageChange" :current-page="queryList.page" :page-size="queryList.size" layout="total, prev, pager, next" :total="allotTotal" style="margin-top: 20px">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchUser, createUser, updateUser, deleteUser, updatePwd, getDeptTree, getCarByUser, allotCar } from '@/api/system/user'
import { fetchAllRole } from '@/api/system/role'
import waves from '@/directive/waves' // 水波纹指令
import deptTree from '../dept/components/deptTree'

export default {
  name: 'userList',
  components: { deptTree },
  directives: {
    waves
  },
  data() {
    const LastDate = () => {
      const nowDate = new Date()
      nowDate.setTime(nowDate.getTime() + 3600 * 1000 * 24 * 365)
      return nowDate
    }
    return {
      enableTime: new Date(),
      disableTime: LastDate(),
      queryList: {
        page: 1,
        size: 5,
        userId: '',
        type: '0',
        deptId: null
      },
      allotLoading: true,
      isAllot: true,
      allotTotal: 1,
      radioVal: '1',
      fileList: [],
      tableData: [],
      list: null,
      allotVisible: false,
      total: 0,
      listLoading: true,
      downloadLoading: false,
      selectRows: [], // 选中的行数据
      isView: false,
      listQuery: {
        page: 1,
        limit: 10,
        deptId: '',
        realname: '',
        username: ''
      },
      pwdForm: {
        userId: '',
        password: '',
        confirmPwd: ''
      },
      dialogUpdatePwdVisible: false,
      // dialogUpdatePwdEdit: false,
      options: [],
      sysUser: {
        id: undefined,
        username: '',
        realname: '',
        password: '',
        confirmPwd: '',
        deptId: '',
        deptName: '',
        enableTime: '',
        disableTime: '',
        roleIdList: []
      },
      roles: [],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户',
        view: '查看详情'
      },
      rules: { // 表单验证规则
        username: [
          { required: true, message: '请填写帐号', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请填写姓名', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择所属机构', trigger: 'blur' }
        ],
        roleIdList: [
          { required: true, message: '请选择所属角色', trigger: 'blur' }
        ]
      },
      pwdRules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { max: 20, message: '长度不应超过20个字符', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate: (time) => {
          if (this.sysUser.enableTime && this.sysUser.disableTime) {
            return time.getTime() < new Date(this.sysUser.enableTime.replace(/-/g, '/')).getTime()
          }
        }
      },
      allotDept: [],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      allotOptions: [
        {
          value: '0',
          label: '未分配'
        },
        {
          value: '1',
          label: '已分配'
        }
      ],
      allotStr: ''
    }
  },
  created() {
    this.sysUser.enableTime = new Date()
    console.log(this.sysUser.enableTime)
  },
  computed: {
    allotType() {
      return this.queryList.type
    }
  },
  watch: {
    allotType: {
      handler(val, oldVal) {
        if (val === '0') {
          this.isAllot = true
        } else {
          this.isAllot = false
        }
        this.getAllotCar()
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
    this.getList()
    getDeptTree().then(res => {
      this.data = [res.data]
    })
  },
  methods: {
    choose() {
      const data = {
        userId: this.queryList.userId,
        vehicleId: this.allotStr,
        type: '1'
      }
      if (data.vehicleId) {
        allotCar(data).then(res => {
          if (res.code === 0) {
            this.$message.success('分配车辆成功!')
            this.allotVisible = false
          }
        })
      } else {
        this.$message.error('请先选择车辆!')
      }
    },
    relieve() {
      const data = {
        userId: this.queryList.userId,
        vehicleId: this.allotStr,
        type: '0'
      }
      if (data.vehicleId) {
        allotCar(data).then(res => {
          if (res.code === 0) {
            this.$message.success('解绑车辆成功!')
            this.allotVisible = false
          }
        })
      } else {
        this.$message.error('请先选择车辆!')
      }
    },
    search() {
    },
    getAllotCar() {
      this.allotLoading = true
      getCarByUser(this.queryList).then(res => {
        this.tableData = res.data.rows
        this.allotTotal = res.data.totalCount
        this.allotLoading = false
        console.log(res)
      })
    },
    handleSelectionChange(val) {
      const arr = []
      if (val.length !== 0) {
        val.forEach(item => {
          arr.push(item.vehicleId)
        })
      }
      this.allotStr = arr.join()
    },
    deptFilter(val) {
      if (val.id === '0') {
        this.queryList.deptId = ''
      } else {
        this.queryList.deptId = val.id
      }
      this.getAllotCar()
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length}个文件，共选择了${files.length + fileList.length}个文件`)
    },
    // 点击修改密码按钮
    updatePwd(row) {
      this.pwdForm = {
        userId: '',
        password: '',
        confirmPwd: ''
      }
      this.pwdForm.userId = row.userId
      this.isView = false
      this.dialogUpdatePwdVisible = true
      this.$nextTick(() => {
        this.$refs['pwdForm'].clearValidate()
      })
    },
    // 修改密码确定操作
    updatePassword(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.pwdForm.password === this.pwdForm.confirmPwd) {
            console.log(this.pwdForm)
            updatePwd(this.pwdForm).then(res => {
              if (res.code === 0) {
                this.$message.success('修改密码成功!')
                this.isView = true
                this.dialogUpdatePwdVisible = false
              }
            })
          } else {
            this.$message.error('请确认新密码是否一致!')
          }
        }
      })
    },
    // 点击分配按钮
    handleSAllot(userId) {
      this.allotVisible = true
      this.queryList = {
        page: 1,
        size: 5,
        userId: '',
        type: '0',
        deptId: null
      }
      this.queryList.userId = userId
      this.getAllotCar()
    },
    getList() { // 分页获取用户列表
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        response.data.rows.forEach(item => {
          if (item.roleNameList) {
            item.roleNameList = item.roleNameList.join()
          }
        })
        this.list = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    getAllRole() { // 获取所有角色列表
      fetchAllRole().then(response => {
        this.roles = response.data
      })
    },
    getUserDetail(userId) { // 获取单个用户详情信息
      fetchUser(userId).then(response => {
        console.log(response)
        const temp = response.data
        this.sysUser.userId = temp.userId
        this.sysUser.username = temp.username
        this.sysUser.realname = temp.realname
        this.sysUser.deptId = temp.deptId
        this.sysUser.deptName = temp.deptName
        this.sysUser.enableTime = temp.enableTime
        this.sysUser.disableTime = temp.disableTime
        this.sysUser.roleIdList = temp.roleIdList
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleDelete() { // 删除事件
      const userIds = []
      if (this.selectRows.length === 0) {
        this.$message({
          message: '请选择要删除的用户',
          type: 'warning'
        })
        return
      }
      this.$confirm('此操作将删除用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectRows.forEach(element => {
          userIds.push(element.userId)
        })
        // const data = { userIds: userIds }
        deleteUser(userIds).then(response => {
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
    handleView(row) {
      this.dialogStatus = 'view'
      this.getAllRole()
      this.isView = true
      this.getUserDetail(row.userId)
      // this.sysUser = row
      this.dialogFormVisible = true
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    // 分配车辆分页
    handlePageChange(val) {
      this.queryList.page = val
      this.getAllotCar()
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
      //   this.listQuery.realname = ''
      //   this.listQuery.username = ''
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
        username: '',
        realname: '',
        password: '',
        confirmPwd: '',
        deptId: '',
        deptName: '',
        enableTime: '',
        disableTime: '',
        roleIdList: []
      }
    },
    handleCreate() { // 新增按钮方法
      this.isView = false
      this.resetForm()
      this.roles = []
      this.getAllRole()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() { // 新增保存方法
      // this.sysUser.enableTime = this.enableTime
      // this.sysUser.disableTime = this.disableTime
      let flag = true
      if (this.sysUser.enableTime && this.sysUser.disableTime) {
        if (new Date(this.sysUser.enableTime.replace(/-/g, '/')).getTime() >= new Date(this.sysUser.disableTime.replace(/-/g, '/')).getTime()) {
          this.$message({
            message: '服务开始时间应小于服务结束时间',
            type: 'error'
          })
          flag = false
        }
      }
      if (flag) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            if (this.sysUser.password === this.sysUser.confirmPwd) {
              createUser(this.sysUser).then((response) => {
                if (response && response.code === 0) {
                  // this.list.unshift(this.sysUser)
                  this.dialogFormVisible = false
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                  this.listQuery.page = 1
                  this.getList()
                }
              })
            } else {
              this.$message.error('请确认密码是否一致!')
            }
          }
        })
      }
    },
    handleUpdate(userId) { // 修改按钮方法
      this.isView = false
      this.resetForm()
      this.roles = []
      this.getAllRole()
      this.getUserDetail(userId)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() { // 修改保存方法
      let flag = true
      if (this.sysUser.enableTime && this.sysUser.disableTime) {
        if (new Date(this.sysUser.enableTime.replace(/-/g, '/')).getTime() >= new Date(this.sysUser.disableTime.replace(/-/g, '/')).getTime()) {
          this.$message({
            message: '服务开始时间应小于服务结束时间',
            type: 'error'
          })
          flag = false
        }
      }
      if (flag) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.sysUser)
            updateUser(tempData).then((response) => {
              if (response && response.code === 0) {
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
                this.getList()
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style>
.el-tree-node>.el-tree-node__children {
  overflow: inherit;
}
.el-tree {
  overflow-x: auto;
}
</style>


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

<style lang="scss">
  .el-button--mini, .el-button--mini:focus, .el-button--mini:hover {
    background: rgb(98, 143, 166);
    color: #fff;
  }
</style>


