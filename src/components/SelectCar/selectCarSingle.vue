<template>
<div style="display: inline-block">
  <label class="el-form-item__label" style="font-size:14px;">{{titleBox}}</label>
  <el-input :disabled="getMessaged" size="small" v-model="selectPlate"  :placeholder=titlePlaceholder @focus="allotDialogVisible = true" style="display:inline-block; width:100px"></el-input>
  <span style="font-size: 14px" v-if="selectCars.length>0">已选择{{selectCars.length }}辆</span>
  <el-dialog :title=titleBox :visible.sync="allotDialogVisible" class="allotDialog" :close-on-click-modal="false">
    <el-row>
      <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
        <el-tree :data="treeData" :props="defaultTreeProp" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="17" :offset="1">
        <div class="searchInput" style="overflow: hidden">
          车牌号: <el-input placeholder="请输入内容" v-model="queryList.plateNo" style="width: 200px;" size="small"></el-input>
          <el-button type="primary" size="mini" @click="search">查询</el-button>
          <el-button type="primary"  size="mini" style="float: right" @click="choose">确定</el-button>
        </div>
        <div>
          <el-table
            ref="selectCarMultipleTable"
            :data="tableData"
            @selection-change="selectionChange"
            style="margin-top: 10px;width:100%"
            stripe
            border>
            <!--<el-table-column-->
            <!--width="40px">-->
            <!--<template slot-scope="scope">-->
            <!--<el-radio v-model="radioVal" @change.native="getRow(scope.row)" :label="scope.row.id"></el-radio>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="车牌号"
              align="center"
              prop="plateNo">
            </el-table-column>
            <el-table-column
              prop="activeStatus"
              align="center"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="driverName"
              align="center"
              label="司机">
            </el-table-column>
            <el-table-column
              prop="deptName"
              align="center"
              label="所属机构">
            </el-table-column>
          </el-table>
        </div>
        <el-pagination background @current-change="handleCurrentChange" :current-page="queryList.page" :page-size="queryList.limit" layout="total, prev, pager, next" :total="total" style="margin-top: 20px">
        </el-pagination>
      </el-col>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
  import { vehicleStatusList } from '@/api/base/vehicle'
  import { deptTree } from '@/api/system/dept'
  export default {
    name: 'selectCarSingle',
    data() {
      return {
        getMessaged: false,
        allotDialogVisible: false,
        defaultTreeProp: {
          children: 'children',
          label: 'text'
        },
        treeData: [],
        tableData: [],
        queryList: {
          page: 1,
          limit: 5,
          deptId: '',
          plateNo: ''
        },
        total: 0,
        selectCars: [],
        selectPlate: ''
      }
    },
    props: {
      titleBox: {
        type: String,
        default: '选择车辆'
      },
      titlePlaceholder: {
        type: String,
        default: '请选择车辆'
      }
    },
    methods: {
      // 清空选择
      clearSelected() {
        if (this.$refs.selectCarMultipleTable) {
          this.$refs.selectCarMultipleTable.clearSelection()
          this.selectPlate = ''
        }
      },
      /**
       * 获取机构树
       * @param null
       */
      async getDeptTree() {
        const result = await deptTree()
        this.treeData = [result.data]
      },
      /**
       * 根据部门ID获取车辆
       * @param null
       */
      async handleNodeClick(val) {
        this.queryList.deptId = val.id
        await this.getCarList()
      },
      /**
       * 获取车辆
       * @param null
       */
      async getCarList() {
        const result = await vehicleStatusList(this.queryList)
        result.data.rows.forEach(item => {
          if (item.activeStatus === '1') {
            item.activeStatus = '在线'
          } else {
            item.activeStatus = '离线'
          }
        })
        this.tableData = result.data.rows
        this.total = result.data.totalCount
      },
      /**
       * 选择车辆分页
       * @param val
       */
      async handleCurrentChange(val) {
        this.queryList.page = val
        await this.getCarList()
      },

      /**
       * 选择车辆
       * @param selection
       */
      selectionChange(selection) {
        this.selectCars = selection
      },
      /**
       * 搜索车辆
       * @param null
       */
      async search() {
        await this.getCarList()
      },
      /**
       * 确认选择
       */
      choose() {
        // if (this.selectCars.length < 1) {
        //   this.$message({
        //     type: 'error',
        //     message: '请选择车辆'
        //   })
        // } else {
        const arr = []
        const ids = []
        const lineids = []
        const selection = this.selectCars
        selection.forEach(item => {
          arr.push(item.plateNo)
          ids.push(item.id)
          lineids.push(item.deptId)
        })
        this.selectPlate = arr.join()
        this.$emit('selectedCar', this.selectPlate)
        this.$emit('selectedCarId', ids.join())
        this.$emit('selectedLineId', lineids.join())
        this.allotDialogVisible = false
        // }
      }
    },
    async created() {
      await this.getDeptTree()
      await this.getCarList()
    }
  }
</script>

<style scoped>

</style>
