<template>
  <div class="enterArea">
    <div class="filter">
      规则名称 <el-input size="small" placeholder="请输入名称" v-model="listQuery.alarmName" style="width: 200px; margin-left: 20px"></el-input>
      <el-button type="primary" size="small" style="float: right; margin-right: 20px" @click="handleAdd">新增</el-button>
      <el-button type="primary" size="small" style="float: right; margin-right: 20px" @click="search">查询</el-button>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        v-loading="loading"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          align="center">
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="规则名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="createName"
          label="创建用户"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="lineName"
          label="路线名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
          prop="areaType"
          label="围栏类型"
          align="center"
          show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column
          prop="banding"
          label="绑定车辆"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="300">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="6">
                <img src="@/assets/operate/allot.png" title="分配" @click="handleAllot(scope.row.id)">
              </el-col>
              <el-col :span="6">
                <img src="@/assets/operate/view.png" title="查看详情" @click="handleView(scope.row.id)">
              </el-col>
              <el-col :span="6">
                <img src="@/assets/operate/update.png" title="编辑" @click="handleUpdate(scope.row.id)">
              </el-col>
              <el-col :span="6">
                <img src="@/assets/operate/delete.png" title="删除" @click="handleDelete(scope.row.id)">
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="Pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 50]"
        :total="total">
      </el-pagination>
    </div>
    <!-- 弹出框 -->
    <el-dialog
     :title="title"
     :visible.sync="dialogVisible"
     :close-on-click-modal='false'>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" :disabled="isView">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" style="width: 50%" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="线路选择" prop="lineName">
          <el-input v-model="ruleForm.lineName" style="width: 50%" placeholder="请选择线路" readonly @focus="handleFence"></el-input>
        </el-form-item>
        <!-- <el-form-item label="最高速度" prop="maxSpeed">
          <el-input v-model="ruleForm.maxSpeed" style="width: 50%" placeholder="请输入最高速度"></el-input>（0表示无限制）
        </el-form-item>
        <el-form-item label="最低速度" prop="minSpeed">
          <el-input v-model="ruleForm.minSpeed" style="width: 50%" placeholder="请输入最低速度"></el-input>（0表示无限制）
        </el-form-item> -->
        <el-form-item label="偏移宽度" prop="offsetWidth">
          <el-input v-model="ruleForm.offsetWidth" style="width: 50%" placeholder="请输入偏移宽度"></el-input>（50—999米）
        </el-form-item>
        <el-form-item  label="分析时间">
          <el-date-picker
           v-model="ruleForm.startTime"
           type="datetime"
           placeholder="选择开始时间"
           format="yyyy-MM-dd HH:mm:ss"
           value-format="yyyy-MM-dd HH:mm:ss"
           :editable="false">
          </el-date-picker>
          ——
          <el-date-picker
           v-model="ruleForm.endTime"
           type="datetime"
           placeholder="选择结束日期"
           format="yyyy-MM-dd HH:mm:ss"
           value-format="yyyy-MM-dd HH:mm:ss"
           :editable="false">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="提醒间隔" prop="remindingInterval">
          <el-input v-model="ruleForm.remindingInterval" style="width: 50%; margin-right: 10px" placeholder="请输入提醒间隔"></el-input>（S）
        </el-form-item>

        <el-form-item label="提醒方式">
          <el-checkbox v-model="checked">平台报警</el-checkbox>
        </el-form-item>
        <!--<el-form-item label="提醒间隔">-->
          <!--<el-input v-model="ruleForm.remindingInterval" style="width: 50%; margin-right: 10px" placeholder="请输入提醒间隔"></el-input>（S）-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer" v-show="!isView">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" v-if="title==='添加路段偏移报警设置'" @click="confirmAdd">确 定</el-button>
        <el-button type="primary" v-else @click="confirmUpdate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择围栏弹出框 -->
    <el-dialog
     title="选择线路"
     :visible.sync="fenceDialogVisible"
     :close-on-click-modal='false'>
      <el-input size="small" v-model="fenceQuery.name" style="width: 200px" placeholder="请输入线路名称"></el-input>
      <el-button size="small" type="primary" @click="fenceSearch">查询</el-button>
      <el-table
        :data="fenceData"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 20px"
        border
        stripe
        :loading="loading">
        <el-table-column
          type="index"
          width="50"
          label="序号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="线路名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <!-- <el-table-column
          prop="drawingTypeName"
          label="围栏类型"
          align="center"
          show-overflow-tooltip>
        </el-table-column> -->
        <el-table-column
          prop="createUserName"
          label="创建用户"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="100">
          <template slot-scope="scope">
            <!-- <el-radio v-model="radio" :label="scope.row.id" @change="confirmFence(scope.row)"></el-radio> -->
            <span @click="confirmFence(scope.row)">选择</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @current-change="fenceCurrentChange"
        style="width: 100%; margin-top: 20px"
        :page-size="5"
        background
        layout="total, prev, pager, next"
        :total="fenceTotal">
      </el-pagination>
    </el-dialog>
    <!-- 分配弹出框 -->
    <el-dialog
     title="分配车辆"
     :visible.sync="allotDialogVisible"
     :close-on-click-modal='false'
     style="min-height: 400px;"
     width="60%">
      <el-row>
        <el-col :span="6">
          <el-tree :data="data" @node-click="deptFilter" :props="defaultProps" default-expand-all :expand-on-click-node="false" style="background: #fff; height: 400px; overflow: auto"></el-tree>
        </el-col>
        <el-col :span="18" style="min-height: 400px; box-shadow: -5px 1px 5px #eee;">
          <div style="border-bottom: 1px solid #eee; padding: 10px 20px">
            <el-input size="small" placeholder="请输入车牌号" v-model="carQuery.vehicleNum" class="input-with-select" style="width: 200px;">
              <el-button slot="append" icon="el-icon-search" @click="vnFilter"></el-button>
            </el-input>
            <el-button type="primary"  size="small" style="float: right" @click="choose" v-show="isAllot">分配</el-button>
            <el-button type="danger"  size="small" style="float: right" @click="relieve" v-show="!isAllot">取消分配</el-button>
            <el-select v-model="carQuery.stauts" style="width:120px; float: right; margin-right: 10px" size="small">
              <el-option
                v-for="item in allotOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div style="padding: 10px 20px">
            <el-table
            ref="multipleTable"
            :data="carData"
            style="margin-top: 10px;width:100%"
            stripe
            @selection-change="handleSelectChange"
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
                prop="vehicleNum">
              </el-table-column>
              <el-table-column
                prop="deptName"
                align="center"
                label="状态">
              </el-table-column>
              <el-table-column
                prop="deptName"
                align="center"
                label="司机">
              </el-table-column>
              <el-table-column
                prop="deptName"
                align="center"
                label="所属机构">
              </el-table-column>
            </el-table>
            <el-pagination background @current-change="handlePageChange" :current-page="carQuery.pageNum" :page-size="carQuery.pageSize" layout="total, prev, pager, next" :total="allotTotal" style="margin-top: 20px">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { subList, addLineAlarm, fetchInfo, deleteRule, updateRule } from '@/api/alarm/subsection'
import { getCarList, allotCar } from '@/api/alarm/vehicle'
import { fetchList } from '@/api/infomationM/linem'
import { getDeptTree } from '@/api/system/user'

export default {
  data() {
    return {
      tableData: [],
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        alarmName: '',
        analyzeType: 1
      },
      dialogVisible: false,
      title: '',
      loading: true,
      ruleForm: {
        analyzeType: 1,
        name: '',
        lineId: '',
        startTime: '',
        endTime: '',
        remindingInterval: '',
        offsetWidth: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入规则名称', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        lineName: [
          { required: true, message: '请选择线路', trigger: 'change' }
        ],
        maxSpeed: [
          { required: true, message: '请输入最高速度', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        minSpeed: [
          { required: true, message: '请输入最低速度', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        offsetWidth: [
          { required: true, message: '请输入偏移宽度', trigger: 'blur' },
          { max: 3, message: '偏移宽度应该在50-999之间', trigger: 'blur' }
        ],
        remindingInterval: [
          { required: true, message: '请输入时间间隔', trigger: 'blur' },
          { max: 2, message: '时间间隔应该在0-60之间', trigger: 'blur' }
        ]
      },
      checked: true,
      isView: false,
      fenceDialogVisible: false,
      fenceQuery: {
        page: 1,
        limit: 5,
        name: ''
      },
      fenceData: [],
      fenceTotal: 0,
      allotDialogVisible: false,
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      data: [],
      allotOptions: [
        {
          value: '1',
          label: '未分配'
        },
        {
          value: '2',
          label: '已分配'
        }
      ],
      isAllot: true,
      allotLoading: false,
      carData: [],
      allotTotal: 0,
      carQuery: {
        alarmType: 1,
        stauts: '1',
        vehicleNum: '',
        alarmId: '',
        pageNum: 1,
        pageSize: 5
      },
      allotCar: ''
    }
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    reset() {
      this.ruleForm = {
        analyzeType: 1,
        name: '',
        lineId: '',
        startTime: '',
        endTime: '',
        remindingInterval: '60',
        offsetWidth: ''
      }
    },
    getList() {
      this.loading = true
      subList(this.listQuery).then(res => {
        if (res.code === 0) {
          this.tableData = res.data.rows
          this.total = res.data.totalCount
          console.log(res)
          this.loading = false
        }
      })
    },
    getCar() {
      this.allotLoading = true
      getCarList(this.carQuery).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.allotLoading = false
          res.data.rows.forEach(item => {
            if (item.vehicleStatus === '1') {
              item.vehicleStatusName = '在线'
            } else if (item.vehicleStatus === '2') {
              item.vehicleStatusName = '离线'
            }
          })
          this.carData = res.data.rows
          this.allotTotal = res.data.totalCount
        }
      })
    },
    search() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    getLineList() {
      fetchList(this.fenceQuery).then(res => {
        console.log(res)
        this.fenceData = res.data.rows
        this.fenceTotal = res.data.totalCount
      })
    },
    fenceCurrentChange(val) {
      this.fenceQuery.page = val
      this.getLineList()
    },
    fenceSearch() {
      this.getLineList()
    },
    // 点击分配车辆
    handleAllot(id) {
      this.carQuery = {
        alarmType: 5,
        stauts: '1',
        vehicleNum: '',
        alarmId: '',
        pageNum: 1,
        pageSize: 5
      }
      this.allotDialogVisible = true
      this.carQuery.alarmId = id
      this.getCar()
    },
    // 机构树筛选
    deptFilter(val) {
      this.carQuery.deptId = val.id
      this.getCar()
    },
    // 车牌号筛选
    vnFilter() {
      this.getCar()
    },
    // 确定分配车辆
    choose() {
      if (this.allotCar === '') {
        this.$message.error('请选择车辆')
        return
      }
      const data = {
        id: this.carQuery.alarmId,
        ids: this.allotCar,
        allot: 0,
        alarmType: 5
      }
      allotCar(data).then(res => {
        if (res.code === 0) {
          this.$message.success('分配车辆成功')
          this.getCar()
          this.getList()
        }
      })
    },
    // 确定解绑车辆
    relieve() {
      if (this.allotCar === '') {
        this.$message.error('请选择车辆')
        return
      }
      const data = {
        id: this.carQuery.alarmId,
        ids: this.allotCar,
        allot: 1,
        alarmType: 5
      }
      allotCar(data).then(res => {
        if (res.code === 0) {
          this.$message.success('取消分配成功')
          this.getCar()
          this.getList()
        }
      })
    },
    // 绑定车辆多选框
    handleSelectChange(val) {
      const arr = []
      val.forEach(item => {
        arr.push(item.id)
      })
      this.allotCar = arr.join()
    },
    handlePageChange(val) {
      this.carQuery.pageNum = val
      console.log(val)
    },
    // 点击选择围栏文本框
    handleFence() {
      this.fenceDialogVisible = true
      this.getLineList()
    },
    // 选择围栏
    confirmFence(row) {
      this.fenceDialogVisible = false
      this.ruleForm.lineName = row.name
      this.ruleForm.lineId = row.id
      console.log(row)
    },
    // 点击添加
    handleAdd() {
      this.title = '添加路段偏移报警设置'
      this.reset()
      this.isView = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    // 确定添加
    confirmAdd() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          console.log(this.ruleForm)
          if (!this.ruleForm.startTime || !this.ruleForm.endTime) {
            this.$message.error('请选择分析时间')
          } else {
            if (new Date(this.ruleForm.startTime).getTime() > new Date(this.ruleForm.endTime).getTime()) {
              this.$message.error('开始时间不能大于结束时间!')
            } else {
              addLineAlarm(this.ruleForm).then(res => {
                if (res.code === 0) {
                  this.$message.success('新增报警规则成功!')
                  this.listQuery.pageNum = 1
                  this.getList()
                  this.dialogVisible = false
                }
              })
            }
          }
        }
      })
    },
    // 点击查看
    handleView(id) {
      this.title = '查看路段偏移报警设置'
      this.reset()
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.isView = true
      this.dialogVisible = true
      console.log(id)
      fetchInfo(id).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.ruleForm = res.data
        }
      })
    },
    // 点击编辑
    handleUpdate(id) {
      this.title = '编辑路段偏移报警设置'
      this.reset()
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
      this.isView = false
      this.dialogVisible = true
      this.ruleForm.id = id
      fetchInfo(id).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.ruleForm = res.data
        }
      })
    },
    // 确定编辑
    confirmUpdate() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (!this.ruleForm.startTime || !this.ruleForm.endTime) {
            this.$message.error('请选择分析时间')
          } else {
            if (new Date(this.ruleForm.startTime).getTime() > new Date(this.ruleForm.endTime).getTime()) {
              this.$message.error('开始时间不能大于结束时间!')
            } else {
              this.ruleForm.analyzeType = 1
              updateRule(this.ruleForm).then(res => {
                if (res.code === 0) {
                  this.$message.success('修改成功!')
                  this.listQuery.pageNum = 1
                  this.getList()
                  this.dialogVisible = false
                }
              })
            }
          }
        }
      })
    },
    // 点击删除
    handleDelete(id) {
      this.$confirm('是否删除此报警设置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRule(id).then(res => {
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
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
    }
  },
  mounted() {
    this.getList()
    getDeptTree().then(res => {
      this.data = [res.data]
    })
  },
  computed: {
    allotStatus() {
      return this.carQuery.stauts
    }
  },
  watch: {
    allotStatus: {
      handler(val, oldVal) {
        if (val === '1') {
          this.isAllot = true
          this.getCar()
        } else {
          this.isAllot = false
          this.getCar()
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .enterArea {
    margin-top: 10px;
    .table {
      margin-top: 30px;
      margin: 30px 5px 0;
      box-shadow: 1px 2px 10px #ccc;
      background-color: #fff;
      border-radius: 6px;
      .el-table {
        border-radius: 6px;
      }
    }
    .filter {
      background-color: #fff;
      padding: 15px 20px;
      border-radius: 4px;
      margin: 0 5px;
      box-shadow: 1px 2px 10px #ccc;
    }
    .Pagination {
      margin-top: 20px;
    }
  }
</style>
