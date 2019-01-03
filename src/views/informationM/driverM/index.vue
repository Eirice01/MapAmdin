<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-header style="font-size: 12px">
          <!-- 查询条件区 -->
          <div class="filter-container" style="float: left">
            <label class="radio-label" style="padding-left:0;">司机姓名</label>
            <el-input size="small" style="width: 120px;" class="filter-item" placeholder="请输入司机姓名" v-model.trim="listQuery.driverName"></el-input>
            <label class="radio-label" style="padding-left:0;">司机工号</label>
            <el-input size="small" style="width: 120px;" class="filter-item" placeholder="请输入司机工号" v-model.trim="listQuery.driverNo"></el-input>
            <label class="radio-label" style="padding-left:0;">驾照状态</label>
            <el-select v-model="listQuery.drivingState" size="small" placeholder="请选择驾照状态" style="width: 150px;">
                <el-option
                 v-for="item in drivingOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
                </el-option>
            </el-select>
            <label class="radio-label" style="padding-left:0;">所属机构</label>
            <el-input size="small" style="width: 130px;" class="filter-item" placeholder="请输入所属机构" v-model="listQuery.deptName" @focus="chooseDeptFilter" readonly></el-input>
            <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-refresh" @click="refresh">重置</el-button>
          </div>
          <!-- 工具栏 -->
          <div class="toolbar" style="float: right">
              <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
              <el-button size="small" type="primary" icon="el-icon-download" @click="handleDownload">导出</el-button>
          </div>
        </el-header>
        <el-main>
          <!-- 列表数据区  -->
          <el-table :data="list" v-loading.body="listLoading" border stripe fit style="width: 100%" @selection-change="handleSelect">

            <el-table-column type="index" width="50" label="序号"></el-table-column>

            <el-table-column align="center" label="司机姓名">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="司机工号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.driverNo}}</span>
              </template>
            </el-table-column>

            <el-table-column label="所属车辆" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.plateNumber}}</span>
              </template>
            </el-table-column>

            <el-table-column label="所属机构" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.deptName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="联系电话" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.phone}}</span>
              </template>
            </el-table-column>

            <el-table-column label="驾驶证号" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.drivingLicence}}</span>
              </template>
            </el-table-column>

            <el-table-column label="发证时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.dateOfIssuing}}</span>
              </template>
            </el-table-column>

            <el-table-column label="过期时间" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.expiryTime}}</span>
              </template>
            </el-table-column>

            <el-table-column label="驾驶证状态" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.drivingStateDes}}</span>
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
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-container>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleTab" style="margin-bottom: 20px">
        <el-menu-item index="1">基础信息</el-menu-item>
        <el-menu-item index="2">驾驶证信息</el-menu-item>
      </el-menu>
      <el-form v-if="activeIndex==='1'" :rules="rules" ref="dataForm" :model="sysUser" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;' :disabled="isView">

        <el-form-item label="司机姓名" prop="name">
          <el-input size="small" v-model="sysUser.name" placeholder="请输入司机姓名" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="司机工号" prop="driverNo">
          <el-input size="small" v-model="sysUser.driverNo" placeholder="请输入司机工号" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="所属机构" prop="deptName">
          <el-col :span="22">
            <el-input size="small" v-model="sysUser.deptName" :disabled="true" placeholder="请选择所属机构"></el-input>
          </el-col>
          <el-col :span="2" v-show="!isView">
            <i class="el-icon-search" style="cursor:pointer" @click="chooseDept"></i>
          </el-col>
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input size="small" v-model="sysUser.phone" placeholder="请输入联系电话" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="身份证号" prop="identitycard">
          <el-input size="small" v-model="sysUser.identitycard" placeholder="请输入身份证号" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="出生日期">
          <el-date-picker v-model="sysUser.birthday" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择出生日期" :disabled="isView" :editable='false'>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="驾照类型">
          <el-select v-model="sysUser.quasiDrivingModel" placeholder="请选择驾照类型" style="width:300px" :disabled="isView">
            <el-option
              v-for="item in roles"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="年审日期">
          <el-date-picker v-model="sysUser.yearCheckTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择年审日期" :disabled="isView" :editable='false'>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="司机照片" prop="headImg">
          <el-upload
            class="upload-demo"
            ref="upload"
            name="headImg"
            :action="action"
            :on-success="uploadSuccess"
            multiple
            :limit="1"
            :show-file-list="false"
            :on-exceed="handleExceed"
            :on-progress="uploading"
            :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>

        <el-form-item v-show="imgShow">
          <img :src="imgSrc" alt="" style="width: 300px">
        </el-form-item>

        <el-form-item label="备注">
            <el-input
             type="textarea"
             autosize
             placeholder="请输入内容"
             v-model="sysUser.remarks">
            </el-input>
        </el-form-item>
      </el-form>
      <el-form v-else :rules="rules" ref="dataForm" :model="sysUser" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;' :disabled="isView">

        <el-form-item label="驾驶证号" prop="drivingLicence">
          <el-input size="small" v-model="sysUser.drivingLicence" placeholder="请输入驾驶证号" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="发证机构" prop="issuingAgency">
          <el-input size="small" v-model="sysUser.issuingAgency" placeholder="请输入发证机构" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="发证时间">
          <el-date-picker v-model="sysUser.dateOfIssuing" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择发证时间" :disabled="isView" :editable='false'>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="过期时间">
          <el-date-picker v-model="sysUser.expiryTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择过期时间" :disabled="isView" :editable='false'>
          </el-date-picker>
        </el-form-item>

        <el-form-item label="监督机构" prop="supervisoryAuthority">
          <el-input size="small" v-model="sysUser.supervisoryAuthority" placeholder="请输入监督机构" :disabled="isView"></el-input>
        </el-form-item>

        <el-form-item label="监督电话" prop="supervisePhone">
          <el-input size="small" v-model="sysUser.supervisePhone" placeholder="请输入监督电话" :disabled="isView"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="isView" :loading="confirmLoading">确 定</el-button>
        <el-button size="small" v-else type="primary" @click="updateData" :disabled="isView" :loading="confirmLoading">确 定</el-button>
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
import { fetchList, addDriver, fetchDriver, updateDriver, deleteDriver } from '@/api/infomationM/driverm'
import waves from '@/directive/waves' // 水波纹指令
import deptTree from './dept/components/deptTree'
import { parseTime } from '@/utils'
import { validatePhoneNum, validateIdCardNum } from '@/utils/validate'

export default {
  name: 'driverList',
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
        page: 1,
        limit: 10,
        driverName: '',
        driverNo: '',
        drivingState: '',
        deptId: ''
      },
      activeIndex: '1',
      dialogVisible: false,
      drivingOptions: [
        {
          value: '0',
          label: '已过期'
        },
        {
          value: '1',
          label: '未过期'
        }
      ],
      imgShow: false,
      action: '',
      options: [],
      sysUser: {
        name: '',
        driverNo: '',
        deptId: '',
        phone: '',
        identitycard: '',
        birthday: '',
        quasiDrivingModel: '',
        yearCheckTime: '',
        remarks: '',
        drivingLicence: '',
        issuingAgency: '',
        dateOfIssuing: '',
        expiryTime: '',
        supervisoryAuthority: '',
        supervisePhone: ''
      },
      roles: [
        {
          value: 1,
          label: 'A1'
        },
        {
          value: 2,
          label: 'A2'
        },
        {
          value: 3,
          label: 'B1'
        },
        {
          value: 4,
          label: 'B2'
        },
        {
          value: 5,
          label: 'C1'
        },
        {
          value: 6,
          label: 'C2'
        }],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑司机信息',
        create: '新增司机',
        view: '查看详情'
      },
      rules: { // 表单验证规则
        name: [
          { required: true, message: '请填写司机姓名', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        driverNo: [
          { required: true, message: '请填写司机工号', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请填写联系电话', trigger: 'blur' }
        ],
        identitycard: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        drivingLicence: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        issuingAgency: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        supervisoryAuthority: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        supervisePhone: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ]
      },
      fileList: [],
      confirmLoading: false,
      imgSrc: ''
    }
  },
  computed: {
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
    },
    statuFilter(statu) {
      return statu === 1 ? '未过期' : '已过期'
    }
  },
  mounted() {
    this.getList()
    this.action = process.env.BASE_API + '/sys/driver/upload'
  },
  methods: {
    uploading() {
      console.log('正在上传...')
      this.confirmLoading = true
    },
    uploadSuccess(res) {
      console.log(res)
      if (res.code === 0) {
        this.sysUser.headImg = res.data.uploadUrl
        this.$message.success('上传成功!')
        this.imgShow = true
        this.imgSrc = process.env.UPLOAD_API + res.data.uploadUrl
        console.log(this.imgSrc)
      } else {
        this.$message.error(res.msg)
      }
      this.confirmLoading = false
      this.$refs.upload.clearFiles()
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择1个文件,本次选择了${files.length}个文件，共选择了${files.length + fileList.length}个文件`)
    },
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        driverName: '',
        driverNo: '',
        drivingState: '',
        deptId: ''
      }
    },
    handleTab(index) {
      this.activeIndex = index
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getList() { // 分页获取用户列表
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response)
        this.list = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    getDriverDetail(id) { // 获取单个用户详情信息
      fetchDriver(id).then(res => {
        console.log(res)
        this.sysUser = res.data
        if (res.data.headImg) {
          this.imgSrc = res.data.headImg
          this.imgShow = true
        } else {
          this.imgShow = false
        }
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleDelete(id) { // 删除事件
      this.$confirm('是否删除此司机?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDriver(id).then(response => {
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
      this.resetForm()
      this.isView = true
      this.activeIndex = '1'
      console.log(row.id)
      this.getDriverDetail(row.id)
      // this.sysUser = row
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
    handleFilter() {
      console.log(this.listQuery)
      this.listQuery.page = 1
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
        this.listQuery.deptId = deptNode.id
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
        const tHeader = ['司机姓名', '司机工号', '所属车辆', '所属机构', '联系电话', '驾驶证号', '发证时间', '过期时间', '驾驶证状态']
        const filterVal = ['name', 'driverNo', 'plateNumber', 'deptName', 'phone', 'drivingLicence', 'dateOfIssuing', 'expiryTime', 'drivingStateDes']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '司机列表'
        })
        this.downloadLoading = false
      })
    },
    resetForm() { // 重置表单
      this.sysUser = {
        name: '',
        driverNo: '',
        deptId: '',
        phone: '',
        identitycard: '',
        birthday: '',
        quasiDrivingModel: '',
        yearCheckTime: '',
        remarks: '',
        drivingLicence: '',
        issuingAgency: '',
        dateOfIssuing: '',
        expiryTime: '',
        supervisoryAuthority: '',
        supervisePhone: ''
      }
    },
    handleCreate() { // 新增按钮方法
      this.dialogFormVisible = true
      this.activeIndex = '1'
      this.isView = false
      this.imgShow = false
      this.resetForm()
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() { // 新增保存方法
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (validatePhoneNum(this.sysUser.phone)) {
            if (!this.sysUser.identitycard || validateIdCardNum(this.sysUser.identitycard)) {
              console.log(this.sysUser)
              addDriver(this.sysUser).then((res) => {
                console.log(res)
                if (res && res.code === 0) {
                  this.listQuery.page = 1
                  this.getList()
                  this.dialogFormVisible = false
                  this.$message({
                    message: '新增成功',
                    type: 'success'
                  })
                }
              })
            } else {
              this.$message.error('请输入正确的身份证号!')
            }
          } else {
            this.$message.error('请输入正确的联系电话!')
          }
        }
      })
    },
    handleUpdate(id) { // 修改按钮方法
      this.isView = false
      this.activeIndex = '1'
      this.resetForm()
      this.getDriverDetail(id)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() { // 修改保存方法
      console.log(this.sysUser)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (validatePhoneNum(this.sysUser.phone)) {
            if (!this.sysUser.identitycard || validateIdCardNum(this.sysUser.identitycard)) {
              const tempData = Object.assign({}, this.sysUser)
              updateDriver(tempData).then((response) => {
                if (response && response.code === 0) {
                  this.listQuery.page = 1
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
                }
              })
            } else {
              this.$message.error('请输入正确的身份证号!')
            }
          } else {
            this.$message.error('请输入正确的联系电话!')
          }
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
