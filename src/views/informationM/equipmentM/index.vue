<template>
  <div class="deviceLayout">
    <!-- 头部条件查询区域 -->
    <div class="dataFilter">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="设备ID">
          <el-input clearable maxlength="20" size="small" v-model.trim="listQuery.deviceId" placeholder="设备ID"></el-input>
        </el-form-item>
        <el-form-item label="SIM卡号">
          <el-input clearable maxlength="11" size="small" v-model.trim="listQuery.simCode" placeholder="SIM卡号"></el-input>
        </el-form-item>
        <el-form-item label="绑定状态">
          <el-select clearable v-model="listQuery.useFlag" placeholder="请选择" size="small" style="width:140px;">
            <el-option v-for="item in useFlagList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select clearable v-model="listQuery.deviceType" placeholder="请选择" size="small" style="width:140px;">
            <el-option v-for="item in deviceTypeList" :key="item.deviceType" :label="item.deviceTypeDes" :value="item.deviceType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属机构">
          <el-popover trigger="focus" placement="bottom" v-model="visible">
            <el-tree default-expand-all :data="deptList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            <el-input slot="reference" readonly size="small" v-model.trim="deptName" placeholder="所属机构"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="handleQuery" type="primary" size="small">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" @click="handleCreate" type="primary" size="small">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表数据区域 -->
    <el-main style="padding:0 20px 10px 20px">
      <el-table :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%;font-size:13px;">

        <el-table-column align="center" type="index" label="序号" fixed="left" width="60px"></el-table-column>

        <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
          <template slot-scope="scope">
            <span v-if="column.key === 'manufacturer'">{{scope.row[column.key] === '1' ? '厦门雅讯' : scope.row[column.key] === '2' ? '安徽阿瑞特' : scope.row[column.key] === '3' ? '清研威视(护驾卫士)' : '未知'}}</span>
            <span v-else>{{scope.row[column.key]}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right" width="300px">
          <template slot-scope="scope">
            <el-button type="info" size="small" icon="el-icon-message" @click="viewDetail(scope.row)">查看</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-main>
    <!-- 分页区 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>

    <!-- 新增设备dialog -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="addEquipmentDialog" center :close-on-click-modal="false">
      <!-- 新增SIM卡dialog -->
      <el-dialog title="添加SIM卡" :visible.sync="addSimDialog" center append-to-body width="30%" :close-on-click-modal="false">
        <el-form :model="simForm" :rules="simRules" ref="simForm">
          <el-form-item label="SIM卡号" prop="code">
            <el-input maxlength="20" placeholder="请输入SIM卡号" v-model.trim="simForm.code" style="width:70%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" style="text-align:right">
          <el-button @click="addSimDialog = false">取 消</el-button>
          <el-button type="primary" @click="createSim('simForm')">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 选择SIM卡dialog -->
      <el-dialog title="选择SIM卡" :visible.sync="simDialog" center append-to-body :close-on-click-modal="false">
        <el-form :inline="true" :model="simQuery" class="demo-form-inline">
          <el-form-item label="SIM卡号">
            <el-input maxlength="11" size="small" v-model.trim="simQuery.simCode" placeholder="SIM卡号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="querySim" type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="simData" border stripe highlight-current-row style="font-size:13px;">
          <el-table-column align="center" type="index" label="序号" fixed="left" width="50px"></el-table-column>
          <el-table-column align="center" prop="simCode" key="simCode" label="SIM卡号"></el-table-column>
          <el-table-column align="center" prop="deptName" key="deptName" label="所属机构"></el-table-column>

          <el-table-column align="center" label="操作" fixed="right" width="90px">
            <template slot-scope="scope">
              <el-button @click="selectSim(scope.row)" size="small" type="text">
                选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSimSizeChange" @current-change="handleSimCurrentChange" :current-page="simQuery.pageNum"
          :page-sizes="[10,20,30, 50]" :page-size="simQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="simTotal">
        </el-pagination>
      </el-dialog>

      <el-form :model="form" :rules="rules" ref="addForm">
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="设备ID" prop="deviceId">
              <el-input maxlength="20" :disabled="dialogStatus === 'detail'" placeholder="请输入设备ID" v-model.trim="form.deviceId" style="width:70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="1"><span>&nbsp;</span></el-col>
          <el-col :span="11"></el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="所属机构" prop="deptId">
              <el-popover :disabled="dialogStatus === 'detail'" trigger="focus" placement="bottom" v-model="dialogDeptVisable">
                <el-tree default-expand-all :data="deptList" :props="defaultProps" @node-click="dialogNodeClick"></el-tree>
                <el-input readonly :disabled="dialogStatus === 'detail'" slot="reference" size="small" v-model.trim="form.deptName" placeholder="所属机构" style="width:70%"></el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="SIM卡号" prop="simId">
              <el-input @focus="queryUnbindSim" :disabled="dialogStatus === 'detail'" placeholder="请选择SIM卡" v-model="form.code" class="input-with-select" style="width:60%"></el-input>
              <el-button v-if="dialogStatus === 'create'" @click="addSimCard" type="text" style="width:9%"><i class="el-icon-plus"></i></el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="设备类型" prop="deviceType">
              <el-select @change="deviceTypeChange" :disabled="dialogStatus === 'detail'" v-model="form.deviceType" placeholder="请选择设备类型" style="width:70%" size="small">
                <el-option v-for="item in deviceTypeList" :key="item.deviceType" :label="item.deviceTypeDes" :value="item.deviceType"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="设备厂商" prop="manufacturer">
              <el-select :disabled="dialogStatus === 'detail'" v-model="form.manufacturer" placeholder="设备厂商" style="width:70%" size="small">
                <el-option v-for="item in manufacturerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="11">
            <el-form-item label="设备型号" prop="model">
              <el-select :disabled="dialogStatus === 'detail'" v-model="form.model" placeholder="请选择设备型号" style="width:70%" size="small">
                <el-option v-for="item in deviceModelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <span>&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="序  列  号" prop="serialNumber">
              <el-input maxlength="20" :disabled="dialogStatus === 'detail'" v-model.trim="form.serialNumber" placeholder="请输入设备序列号" style="width:70%" size="small"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="create_dialog_row">
          <el-col :span="23">
            <el-form-item label="备注" prop="remark">
              <el-input maxlength="200" type="textarea" v-model.trim="form.remark" rows="3" placeholder="备注(最多200个字)" style="width:85%;" size="small" :disabled="dialogStatus === 'detail'"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="addEquipmentDialog = false">取 消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="confirmCreate('addForm')">确 定</el-button>
        <el-button v-else-if="dialogStatus === 'update'" type="primary" @click="confirmUpdate('addForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-17 14:14:13
import deptTree from '../../system/dept/components/deptTree'
import { createSim, getSimList, getDeptTree, fetchList, deleteDevice, detailDevice, updateDevice, createDevice } from '@/api/base/device'
import { validatePhoneNum, numAndLetter } from '@/utils/validate'
export default {
  name: 'device',
  components: { deptTree },
  data() {
    return {
      total: 0,
      listLoading: false,
      addEquipmentDialog: false,
      useFlagList: [ // 绑定状态
        {
          id: 0,
          name: '未绑定'
        },
        {
          id: 1,
          name: '已绑定'
        }
      ],
      deviceTypeList: [ // 设备类型
        {
          deviceType: 'VEHICLE_GB32960',
          deviceTypeDes: 'TBOX设备'
        },
        {
          deviceType: 'VEHICLE_QH_ADAS',
          deviceTypeDes: '疲劳一体机设备'
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      deptList: [],
      visible: false,
      deptName: '',
      dialogDeptVisable: false,
      addSimDialog: false,
      simForm: {},
      simRules: {
        simCode: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      deviceModelList: [],
      manufacturerList: [],
      data: [],
      columns: [
        {
          key: 'deviceId',
          title: '设备ID',
          width: '180'
        },
        {
          key: 'deviceTypeDes',
          title: '设备类型'
        },
        {
          key: 'vehicleCode',
          title: '所属车辆'
        },
        {
          key: 'deptName',
          title: '所属机构'
        },
        {
          key: 'manufacturer',
          title: '设备厂商'
        },
        {
          key: 'model',
          title: '设备型号'
        },
        {
          key: 'simCode',
          title: 'SIM卡号',
          width: '130'
        },
        {
          key: 'useFlagDes',
          title: '绑定状态'
        },
        {
          key: 'installTime',
          title: '安装日期',
          width: '120'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        deviceId: '',
        simCode: '',
        useFlag: '',
        deviceType: '',
        deptId: ''
      },
      form: {},
      rules: {
        deviceId: [{ required: true, message: '必填项', trigger: 'blur' }],
        deptId: [{ required: true, message: '必填项', trigger: 'change' }],
        simId: [{ required: true, message: '必须通过弹窗选择SIM卡', trigger: 'change' }],
        deviceType: [{ required: true, message: '必选项', trigger: 'change' }]
      },
      textMap: {
        update: '修改设备信息',
        create: '新增设备',
        detail: '查看详情'
      },
      dialogStatus: '',
      simCode: '',
      simDialog: false,
      simQuery: {
        pageSize: 10,
        pageNum: 1,
        deviceId: '',
        simCode: '',
        deviceType: '',
        deptName: '',
        status: '0'
      },
      simData: [],
      simTotal: 0
    }
  },
  mounted() {
    this.getList()
    this.getTree()
  },
  methods: {
    deviceTypeChange(val) {
      this.form.manufacturer = ''
      if (val === 'VEHICLE_GB32960') {
        this.manufacturerList = [{ id: '1', name: '厦门雅讯' }, { id: '2', name: '安徽阿瑞特' }]
      } else {
        this.manufacturerList = [{ id: '3', name: '清研威视(护驾卫士)' }]
      }
    },
    getSimList() {
      getSimList(this.simQuery).then(res => {
        if (res.code === 0) {
          this.simData = res.data.rows
          this.simTotal = res.data.totalCount
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    queryUnbindSim() {
      if (!this.form.deptName || this.form.deptName === '') {
        this.$message({
          message: '请先选择所属机构',
          type: 'info'
        })
        return
      }
      this.simQuery = {
        pageSize: 10,
        pageNum: 1,
        deviceId: '',
        simCode: '',
        deviceType: '',
        name: this.form.deptName,
        status: '1',
        deptId: this.form.deptId
      }
      this.simDialog = true
      this.getSimList()
    },
    querySim() {
      this.getSimList()
    },
    getTree() { // 获取机构树
      getDeptTree().then(res => {
        this.deptList = JSON.parse('[' + JSON.stringify(res.data) + ']')
      })
    },
    handleNodeClick(data) { // 选择机构
      this.deptName = data.text
      this.listQuery.deptIdAll = data.id
      this.visible = false
    },
    dialogNodeClick(data) { // 新增设备选择机构
      this.form.deptName = data.text
      this.form.deptId = data.id
      this.dialogDeptVisable = false
    },
    viewDetail(row) { // 查看详情
      this.resetForm()
      this.dialogStatus = 'detail'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.handleDetail(row.id)
    },
    selectSim(row) { // 选择sim卡
      console.log(row)
      this.simDialog = false
      this.form.simId = row.id
      this.form.code = row.simCode
    },
    resetSimDialog() { // 重置新增SIM卡dialog
      this.simForm = {
        code: '',
        deptId: this.form.deptId,
        status: 0,
        useFlag: 0,
        registDate: '',
        remark: ''
      }
    },
    addSimCard() { // 打开添加新sim卡对话框
      if (!this.form.deptName || this.form.deptName === '') {
        this.$message({
          message: '请先选择所属机构',
          type: 'info'
        })
        return
      }
      this.resetSimDialog()
      this.addSimDialog = true
      this.$nextTick(() => {
        this.$refs['simForm'].clearValidate()
      })
    },
    createSim(form) { // 确认添加新SIM卡
      this.$refs[form].validate((valid) => {
        if (!validatePhoneNum(this.simForm.code)) {
          this.$message({
            message: 'SIM卡号有误',
            type: 'error'
          })
          return
        }
        if (valid) {
          createSim(this.simForm).then(response => {
            if (response.code === 0) {
              this.addSimDialog = false
              this.form.simId = response.data.id
              this.form.code = response.data.code
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
    getList() { // 初始化列表
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        console.log(response)
        if (response.code === 0) {
          this.data = response.data.rows
          this.total = response.data.totalCount
        } else {
          this.$message.error(response.msg)
        }
        this.listLoading = false
      })
    },
    handleQuery() { // 头部查询方法
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() { // 重置查询条件
      this.listQuery.deviceId = ''
      this.listQuery.simCode = ''
      this.listQuery.useFlag = ''
      this.listQuery.deviceType = ''
      this.listQuery.deptIdAll = ''
      this.deptName = ''
    },
    handleSizeChange(val) { // 改变pageSize
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) { // 改变pageNumber
      this.listQuery.page = val
      this.getList()
    },
    handleSimSizeChange(val) { // 改变sim卡pageSize
      this.simQuery.pageSize = val
      this.getSimList()
    },
    handleSimCurrentChange(val) { // 改变pageNumber
      this.simQuery.pageNum = val
      this.getSimList()
    },
    // 重置表单
    resetForm() {
      this.form = {
        deptId: '',
        deptName: '',
        simId: '',
        deviceType: '',
        manufacturer: '',
        serialNumber: '',
        model: '',
        deviceId: '',
        installTime: '',
        vehicleId: '',
        isMaster: '',
        remark: ''
      }
    },
    handleCreate() { // 头部新增
      this.resetForm()
      this.dialogStatus = 'create'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
    },
    confirmCreate(formName) { // 新增设备提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!numAndLetter(this.form.deviceId)) {
            this.$message({
              message: '设备ID只能输入数字和字母的组合',
              type: 'error'
            })
            return
          }
          this.listLoading = true
          createDevice(this.form).then(response => {
            this.listLoading = false
            if (response.code === 0) {
              this.getList()
              this.addEquipmentDialog = false
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
    confirmUpdate(formName) { // 修改设备提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!numAndLetter(this.form.deviceId)) {
            this.$message({
              message: '设备号只能输入数字和字母的组合',
              type: 'error'
            })
            return
          }
          this.listLoading = true
          updateDevice(this.form).then(response => {
            this.listLoading = false
            if (response.code === 0) {
              this.getList()
              this.addEquipmentDialog = false
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
    handleDetail(id) { // 设备详情
      this.listLoading = true
      detailDevice(id).then(response => {
        console.log(response)
        this.listLoading = false

        this.form = response.data
        this.form.code = response.data.simCode

        if (this.form.deviceType === 'VEHICLE_GB32960') {
          this.manufacturerList = [{ id: '1', name: '厦门雅讯' }, { id: '2', name: '安徽阿瑞特' }]
        } else {
          this.manufacturerList = [{ id: '3', name: '清研威视(护驾卫士)' }]
        }
      })
    },
    handleUpdate(row) { // 修改设备
      this.resetForm()
      this.dialogStatus = 'update'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.handleDetail(row.id)
    },
    handleDelete(row) { // 删除设备
      this.$confirm('此操作将删除设备信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        deleteDevice(row.id).then(response => {
          this.listLoading = false
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
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    }
  }
}
</script>

<style>
  .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  .el-dialog__body {
    padding: 5px 20px !important;
  }
  .create_dialog_row {
    text-align:right;
    padding: 0;
  }
  .create_dialog_row el-col span {
    width: 30%
  }
</style>
<style lang="scss" scoped>
  .deviceLayout {
    .dataFilter {
      padding: 20px 20px 0 20px;
    }
    .el-pagination {
      padding: 20px;
    }
  }
</style>

