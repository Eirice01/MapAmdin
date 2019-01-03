<template>
  <div class="app-container">
    <el-container>
      <el-container>
        <el-header style="font-size: 12px">
          <!-- 查询条件区 -->
          <div class="filter-container" style="float: left">
            <label class="radio-label" style="padding-left:0;">围栏名称</label>
            <el-input size="small" style="width: 150px;" class="filter-item" placeholder="请输入围栏名称" v-model.trim="listQuery.name"></el-input>
            <label class="radio-label" style="padding-left:0;">围栏类型</label>
            <el-select v-model="listQuery.drawingType" size="small" placeholder="请选择围栏类型" style="width: 150px;">
                <el-option
                 v-for="item in drawingOptions"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
                </el-option>
            </el-select>
            <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="small" class="filter-item" type="primary" v-waves icon="el-icon-refresh" @click="refresh">重置</el-button>
          </div>
          <!-- 工具栏 -->
          <div class="toolbar" style="float: right">
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleSquare">新建矩形围栏</el-button>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handleCircle">新建圆形围栏</el-button>
            <el-button size="small" type="primary" icon="el-icon-plus" @click="handlePolygon">新建多边形围栏</el-button>
          </div>
        </el-header>
        <el-main>
          <!-- 列表数据区  -->
          <el-table :data="list" v-loading.body="listLoading" border stripe fit style="width: 100%" @selection-change="handleSelect">

            <el-table-column type="index" width="50" label="序号"></el-table-column>

            <el-table-column align="center" label="围栏名称">
              <template slot-scope="scope">
                <span>{{scope.row.name}}</span>
              </template>
            </el-table-column>

            <el-table-column label="围栏类型" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.drawingTypeName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="创建用户" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.createUserName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="所属机构" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.deptName}}</span>
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
          :page-sizes="[10,20,30,50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next" :total="total">
        </el-pagination>
      </el-container>
    </el-container>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form :rules="rules" ref="dataForm" :model="sysUser" label-position="left" label-width="100px" style='margin:0 50px;'>
        <div style="height: 400px; width: 100%; margin-bottom: 30px">
          <b-map ref="BMAP" @emitRectangle="getDrawInfo" @emitCircle="getDrawInfo" @emitPolygon="getDrawInfo" @clearInfo="clearInfo"></b-map>
        </div>
        <el-form-item label="区域名称" prop="name" style="width: 400px;">
          <el-input size="small" v-model="sysUser.name" placeholder="请输入区域名称" :disabled="isView&&isUpdate"></el-input>
        </el-form-item>

        <el-form-item label="坐标点" prop="coordinate" style="width: 400px;">
          <el-input size="small" v-model="sysUser.coordinate" placeholder="请选择坐标点" disabled></el-input>
        </el-form-item>

        <el-form-item label="所属机构" prop="deptName" style="width: 400px;">
          <el-col :span="22">
            <el-input size="small" v-model="sysUser.deptName" :disabled="true" placeholder="请选择所属机构"></el-input>
          </el-col>
          <el-col :span="2" v-show="!isView&&isUpdate">
            <i class="el-icon-search" style="cursor:pointer" @click="chooseDept"></i>
          </el-col>
        </el-form-item>
        
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button size="small" v-if="dialogStatus=='create'" type="primary" @click="createData" :disabled="isView">确 定</el-button>
        <el-button size="small" v-else type="primary" @click="updateData" :disabled="isView&&isUpdate">确 定</el-button>
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
import { fetchList, addFence, updateFence, fetchFence, deleteFence } from '@/api/infomationM/fencem'
import waves from '@/directive/waves' // 水波纹指令
import { parseTime } from '@/utils'
import bMap from './map'
import deptTree from './dept/components/deptTree'

export default {
  name: 'fenceList',
  directives: {
    waves
  },
  components: { bMap, deptTree },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      isView: false,
      listQuery: {
        page: 1,
        limit: 10,
        name: '',
        drawingType: ''
      },
      activeIndex: '1',
      dialogVisible: false,
      drawingOptions: [
        {
          value: '1',
          label: '圆形状围栏'
        },
        {
          value: '2',
          label: '矩形围栏'
        },
        {
          value: '3',
          label: '多边形围栏'
        }
      ],
      isUpdate: false,
      options: [],
      sysUser: {
        name: null,
        drawingType: null,
        longitude: null,
        latitude: null,
        areaLonlat: null,
        graphLonlat: null,
        deptId: null,
        address: null,
        radius: null,
        coordinate: null
      },
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑围栏',
        create: '新增围栏',
        view: '查看详情'
      },
      rules: { // 表单验证规则
        name: [
          { required: true, message: '请填写区域名称', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        coordinate: [
          { required: true, message: '请选择坐标点', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择机构', trigger: 'blur' }
        ]
      }
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
  },
  methods: {
    refresh() {
      this.listQuery = {
        page: 1,
        limit: 10,
        name: '',
        drawingType: ''
      }
    },
    clearInfo(val) {
      this.sysUser.coordinate = ''
    },
    getList() { // 分页获取用户列表
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        response.data.rows.forEach(item => {
          if (item.drawingType === '1') {
            item.drawingTypeName = '圆形围栏'
          } else if (item.drawingType === '2') {
            item.drawingTypeName = '矩形围栏'
          } else if (item.drawingType === '3') {
            item.drawingTypeName = '多边形围栏'
          }
        })
        this.list = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    getDrawInfo(val) {
      if (!val.center) {
        let minLng = val.path[0].lng
        let maxLng = val.path[0].lng
        let minLat = val.path[0].lat
        let maxLat = val.path[0].lat
        val.path.forEach(item => {
          if (item.lng < minLng) {
            minLng = item.lng
          } else if (item.lng > maxLng) {
            maxLng = item.lng
          }
          if (item.lat < minLat) {
            minLat = item.lat
          } else if (item.lat > maxLat) {
            maxLat = item.lat
          }
        })
        val.center = { lng: (maxLng + minLng) / 2, lat: (maxLat + minLat) / 2 }
        if (val.type === '3') {
          val.path.push(val.path[0])
          const arr = []
          val.path.forEach(item => {
            arr.push(item.lng + '|' + item.lat)
          })
          this.sysUser.areaLonlat = arr.join()
        } else {
          const arr = []
          val.path.forEach(item => {
            arr.push(item.lng + '|' + item.lat)
          })
          this.sysUser.areaLonlat = arr.join()
        }
      } else {
        this.sysUser.radius = val.radius
      }
      this.sysUser.longitude = val.center.lng
      this.sysUser.latitude = val.center.lat
      this.sysUser.coordinate = `${val.center.lng}, ${val.center.lat}`
    },
    getFenceDetail(id) { // 获取单个用户详情信息
      fetchFence(id).then(res => {
        console.log(res)
        this.sysUser = res.data
        this.sysUser.coordinate = `${res.data.longitude}, ${res.data.latitude}`
        this.$refs.BMAP.isView = !this.isView
        if (res.data.drawingType === '1') {
          this.$refs.BMAP.point = [res.data.longitude, res.data.latitude]
          this.$refs.BMAP.flag = 2
          this.$refs.BMAP.ready()
          this.$nextTick(() => {
            this.$refs.BMAP.circleInfo = { coordinate: [res.data.longitude, res.data.latitude], radius: res.data.radius }
            this.$refs.BMAP.drawCircle()
          })
        } else if (res.data.drawingType === '2') {
          this.$refs.BMAP.point = [res.data.longitude, res.data.latitude]
          this.$refs.BMAP.flag = 1
          this.$refs.BMAP.ready()
          const arr = []
          res.data.areaLonlat.split(',').forEach(item => {
            const tmp = {}
            const ary = item.split('|')
            tmp.lng = ary[0]
            tmp.lat = ary[1]
            arr.push(tmp)
          })
          this.$nextTick(() => {
            this.$refs.BMAP.rectangleInfo = { path: arr }
            this.$refs.BMAP.drawRectangle()
          })
        } else if (res.data.drawingType === '3') {
          this.$refs.BMAP.point = [res.data.longitude, res.data.latitude]
          this.$refs.BMAP.flag = 3
          this.$refs.BMAP.ready()
          const arr = []
          res.data.areaLonlat.split(',').forEach(item => {
            const tmp = {}
            const ary = item.split('|')
            tmp.lng = ary[0]
            tmp.lat = ary[1]
            arr.push(tmp)
          })
          arr.pop()
          this.$nextTick(() => {
            this.$refs.BMAP.polygonInfo = { path: arr }
            this.$refs.BMAP.drawPolygon()
          })
        }
      })
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleDelete(id) { // 删除事件
      this.$confirm('是否删除此围栏?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFence(id).then(response => {
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
      this.isView = true
      this.isUpdate = true
      this.activeIndex = '1'
      this.getFenceDetail(row.id)
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
        const filterVal = ['name', 'driverNo', 'plateNumber', 'deptName', 'phone', 'drivingLicence', 'dateOfIssuing', 'expiryTime', 'drivingState']
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
        name: null,
        drawingType: null,
        longitude: null,
        latitude: null,
        areaLonlat: null,
        graphLonlat: null,
        deptId: null,
        address: null,
        radius: null,
        coordinate: null
      }
    },
    handleSquare() { // 新增矩形
      this.dialogFormVisible = true
      this.isView = false
      this.isUpdate = true
      this.resetForm()
      this.dialogStatus = 'create'
      this.sysUser.drawingType = '2'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.BMAP.flag = 1
        this.$refs.BMAP.ready()
        this.$refs.BMAP.isView = !this.isView
      })
    },
    handleCircle() { // 新增圆形
      this.dialogFormVisible = true
      this.isView = false
      this.isUpdate = true
      this.resetForm()
      this.dialogStatus = 'create'
      this.sysUser.drawingType = '1'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.BMAP.flag = 2
        this.$refs.BMAP.ready()
        this.$refs.BMAP.isView = !this.isView
      })
    },
    handlePolygon() { // 新增多边形
      this.dialogFormVisible = true
      this.isView = false
      this.isUpdate = true
      this.resetForm()
      this.dialogStatus = 'create'
      this.sysUser.drawingType = '3'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
        this.$refs.BMAP.flag = 3
        this.$refs.BMAP.ready()
        this.$refs.BMAP.isView = !this.isView
      })
    },
    createData() { // 新增保存方法
      console.log(this.sysUser)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addFence(this.sysUser).then((res) => {
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
        }
      })
    },
    handleUpdate(id) { // 修改按钮方法
      this.isView = true
      this.isUpdate = false
      this.activeIndex = '1'
      this.resetForm()
      this.sysUser.id = id
      this.getFenceDetail(id)
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
          const tempData = Object.assign({}, this.sysUser)
          updateFence(tempData).then((response) => {
            console.log(response)
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
