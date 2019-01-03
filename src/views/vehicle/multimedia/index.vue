<template>
  <div class="app-container">
  <el-container style="padding-bottom:20px">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="在线状态">
            <el-select v-model.trim="listQuery.activeStatus" placeholder="请选择" style="width:100px" size="mini">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <select-car-single @selectedCar="selectedCar"></select-car-single>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery" type="primary" size="mini" style="margin-left:50px">查询</el-button>
            <el-button type="primary" @click="bulkSnap()" size="mini" style="margin-left:20px">批量抓拍</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main>
        <el-table style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc"
           :data="multiMediaData"
           :columns="columns" 
           @selection-change="handleSelectionChange"
           v-loading.body="listLoading" border stripe>
          <el-table-column align="center" type="selection" width="43" ></el-table-column>
          <el-table-column align="center" type="index" width="65" label="序号"></el-table-column>
          <el-table-column align="center"
             v-for="column in columns" 
             :formatter="column.formatter"
             :key="column.key" 
             :prop="column.key" 
             :label="column.title" 
             :width="column.width">
          </el-table-column>
          <el-table-column align="center" width="250" label="操作">
            <template slot-scope="scope">
              <el-button  type="primary" @click="multiMediaSnap(scope.row)" size="mini">抓拍</el-button>
              <el-button  type="primary" @click="multiMediaDetail(scope.row)" size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-footer>
      <el-dialog :visible.sync="multiMediaDetailDialog" :close-on-click-modal="false" center width="850px">
        <span slot="title" style="margin-left:10px; float: left;height:25px">查看抓拍</span>
        <div style="margin-top:10px;margin-bottom:10px">
          <span style="font-size: 14px">查询时间：</span>
          <el-date-picker
              v-model.trim="startEnd"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="——"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="left"
              size="small"
              style="width: 350px"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
          <span style="font-size: 14px">摄像头：</span>
          <el-select v-model.trim="operRecordQuery.cameraIndex" placeholder="请选择" style="width:100px" size="mini">
              <el-option v-for="item in cameras" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button type="primary" @click="secrchRecord" size="mini" style="margin-left:60px">查询</el-button>
          <el-button type="primary" @click="recordExport" size="mini" style="margin-left:20px">导出</el-button>
        </div>
        <div class="mybox">
          <el-checkbox-group v-model="checkList">
            <el-checkbox class="imgVideoShow" v-for="(item,index) of items" :key="item.id" :label="index">
              <div class='imgShow' v-if="item.fileUrl !== null">
                <img class='imgShow2' :src="item.fileUrl"><br>
                <span>状态：{{item.name}}</span><br>
                <span v-if="item.cameraIndex === 100">通道：ADAS设备</span>
                <span v-if="item.cameraIndex === 101">通道：DSM设备</span><br>
                <span>&#8195;&#8194;时间：{{item.happenTime}}</span>
              </div>
              <div v-else></div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="multiMediaSnapDialog" :close-on-click-modal="false" center width="350px">
        <span slot="title" style="margin-left:10px; float: left;height:25px">抓拍</span>
        <el-form :model="photoForm" ref="photoForm">
          <el-form-item style="margin-top:20px;margin-bottom:20px">
            <span style="font-weight:bold">设&#8195;备&#8194;:&#8194;</span>
            <el-select v-model="photoForm.equipment" size="mini" style="width:230px">
                <el-option label="疲劳一体机" value="VEHICLE_QH_ADAS"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <span style="font-weight:bold">摄像头&#8194;:&#8194;</span>
            <el-select v-model="photoForm.cam" size="mini" style="width:230px">
                <el-option v-for="item in cameras" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        <el-row style="text-align:center">
            <el-button type="primary" @click="capture" size="samll">拍 照</el-button>
        </el-row>
        </el-form>
      </el-dialog>
      <report-footer></report-footer>
    </el-container>
  </div>
</template>
<script>
import selectCarSingle from '@/components/SelectCar/selectCarSingle'
import { formatDate, getStartEnd } from '@/utils/date'
import { getMediaList, getMediaRecordList, getMediaRecordExport } from '@/api/vehicleMonitor/multimedia'
import { getToken } from '@/utils/auth'
import mixins from '@/common/mixins'
export default {
  name: 'multiMedia',
  mixins: [mixins],
  components: { selectCarSingle },
  data() {
    return {
      options: [
        {
          label: '全部',
          value: ''
        },
        {
          label: '在线',
          value: 1
        },
        {
          label: '离线',
          value: 0
        }
      ],
      cameras: [
        {
          label: 'ADAS设备',
          value: 100
        },
        {
          label: 'DSM设备',
          value: 101
        }
      ],
      exportVehicleId: '',
      checkList: [],
      items: [],
      multipleSelection: [],
      total: 0,
      multiMediaDetailDialog: false,
      multiMediaSnapDialog: false,
      photoForm: {
        equipment: 'VEHICLE_QH_ADAS',
        cam: 100,
        vehicleId: []
      },
      option: '1',
      listLoading: false,
      multiMediaData: [],
      columns: [
        {
          key: 'plateNo',
          title: '车牌号',
          formatter: function(row, column, cellValue, index) {
            return cellValue
          }
        },
        {
          key: 'deviceType',
          title: '设备类型（抓拍）',
          formatter: function(row, column, cellValue, index) {
            return cellValue
          }
        },
        {
          key: 'deviceId',
          title: '设备ID',
          formatter: function(row, column, cellValue, index) {
            return cellValue
          }
        },
        {
          key: 'sim',
          title: 'SIM卡号',
          formatter: function(row, column, cellValue, index) {
            return cellValue
          }
        },
        {
          key: 'deptName',
          title: '所属机构',
          formatter: function(row, column, cellValue, index) {
            return cellValue
          }
        },
        {
          key: 'activeStatus',
          title: '在线状态',
          formatter: function(row, column, cellValue, index) {
            if (cellValue === 0) {
              return '离线'
            }
            if (cellValue === 1) {
              return '在线'
            }
          }
        }
      ],
      listQuery: {
        page: 1,
        pageSize: 10,
        plateNo: '',
        activeStatus: ''
      },
      operRecordQuery: {
        startTime: '',
        endTime: '',
        cameraIndex: 100
      }
    }
  },
  async created() {
    this.initWebSocket()
    await this.getList()
  },
  destroyed() {
    this.websocket.close()
  },
  methods: {
    async getList() {
      // this.listLoading = true
      const res = await getMediaList(this.listQuery)
      if (res.code === 0) {
        this.multiMediaData = res.data.rows
        this.total = res.data.totalCount
      }
    },
    initWebSocket() {
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      vm.websocket.onopen = function() {
      }
      vm.websocket.onmessage = function(evt) {
        const obj = JSON.parse(evt.data)
        if (obj.Command === '8801') {
          vm.$message({
            message: '多媒体抓拍成功！',
            type: 'success'
          })
          vm.multiMediaSnapDialog = false
        }
        if (obj.Command !== '8801') {
          vm.$message({
            message: '多媒体抓拍失败！',
            type: 'warning'
          })
          vm.multiMediaSnapDialog = false
        }
      }
      vm.websocket.onerror = function() {
        vm.initWebSocket()
      }
    },
    searchDatas() {
      const data = {
        Command: '8801',
        CommandType: 'command',
        token: getToken('Admin-Token'),
        Body: {
          data: {
            vehicleIds: this.photoForm.vehicleId,
            deviceType: this.photoForm.equipment,
            channelId: this.photoForm.cam
          }
        }
      }
      this.websocket.send(JSON.stringify(data))
    },
    async getRecordList() {
      const res = await getMediaRecordList(this.operRecordQuery)
      if (res.code === 0) {
        // this.listLoading = false
        this.operRecordData = res.data.rows
        this.totalRecord = res.data.totalCount
      }
    },
    // 历史记录搜索
    secrchRecord() {
      this.getRecordDetail(this.exportVehicleId)
    },
    // 历史抓拍记录导出
    recordExport() {
      getMediaRecordExport(this.exportVehicleId).then((result) => {
        this.downloads(result)
      }).catch((result) => {
        this.downloads(result)
      })
    },
    downloads(data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]), { type: 'application/octet-stream' })
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '多媒体抓拍.zip')
      document.body.appendChild(link)
      link.click()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async getRecordDetail(id) {
      const res = await getMediaRecordList(id, this.operRecordQuery)
      this.items = res.data
    },
    /**
     * 查看详情
     */
    multiMediaDetail(row) {
      this.checkList = []
      this.startEnd = getStartEnd()
      this.operRecordQuery.cameraIndex = 100
      const id = row.vehicleId
      this.exportVehicleId = row.vehicleId
      const the = this
      setTimeout(function() {
        the.getRecordDetail(id)
      }, 300)
      this.multiMediaDetailDialog = true
    },
    /**
     * 批量抓拍
     */
    bulkSnap() {
      this.photoForm.vehicleId = []
      let isOpenDialog = true
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请至少勾选一项，再进行操作',
          type: 'warning',
          duration: '1500'
        })
        isOpenDialog = false
        return
      }
      const selectionMedia = this.multipleSelection
      selectionMedia.forEach(item => {
        if (item.activeStatus === 0) {
          this.$message({
            message: '请选择在线车辆进行操作',
            type: 'warning',
            duration: '1500'
          })
          isOpenDialog = false
          return
        }
        this.photoForm.vehicleId.push(item.vehicleId)
      })
      this.multiMediaSnapDialog = isOpenDialog
    },
    /**
     * 抓拍
     */
    multiMediaSnap(row) {
      this.photoForm.vehicleId = []
      if (row.activeStatus === 0) {
        this.$message({
          message: '请抓拍在线车辆',
          type: 'warning',
          duration: '1500'
        })
        return
      }
      this.photoForm.vehicleId.push(row.vehicleId)
      this.multiMediaSnapDialog = true
    },
    /**
     * 拍照
     */
    capture() {
      this.searchDatas()
    },
    handleQuery() {
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.getList()
    },
    selectedCar(val) {
      this.listQuery.plateNo = val
    }
  },
  watch: {
    startEnd(val) {
      if (val) {
        this.operRecordQuery.startTime = formatDate(val[0], 'yyyy-MM-dd hh:mm:ss')
        this.operRecordQuery.endTime = formatDate(val[1], 'yyyy-MM-dd hh:mm:ss')
      } else {
        this.operRecordQuery.startTime = formatDate(val[0], 'yyyy-MM-dd hh:mm:ss')
        this.operRecordQuery.endTime = formatDate(val[1], 'yyyy-MM-dd hh:mm:ss')
      }
    }
  }
}
</script>

<style scope>
  .canClick {
    color: #488aff
  }
  .app-container .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  .app-container .el-dialog__body {
    padding: 5px 20px;
  }
  .app-container .el-table__header-wrapper table thead tr th {
    background-color: #4077BC;
    color: #fff
  }
  .app-container .el-dialog__header {
    background-color: #4077BC;
    height: 40px;
    padding-top: 10px;
  }
  .app-container .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }
  .app-container .el-dialog__header i {
    color: #fff;
  }
  .msgManager:hover {
    color: #4077BC;
    cursor: pointer;
  }
  .app-container .el-dialog__headerbtn {
    top: 10px
  }
  .imgVideoShow {
    margin-top: 10px;
    padding-right: 1%;
    width: 25%;
    float: left;
  }
  .mybox {
    height: 400px;
    overflow-x: hidden;
    overflow-y: scroll;
    text-align: left;
  }
  .mybox::-webkit-scrollbar {
        display: none;
  }
  .imgVideoShow .imgShow {
    width: 100%;
    height: 150px;
    position: relative;
    left: -25px;
  }
  .imgShow .imgShow2 {
    margin-left: 0px;
    width: 100%;
    height: 100%;
  }
  .el-checkbox+.el-checkbox {
    margin-left: 0px;
  }
</style>
