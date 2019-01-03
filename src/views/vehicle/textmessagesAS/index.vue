<template>
    <el-container class="app-container" style="padding-bottom:20px">
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="在线状态">
            <el-select v-model.trim="listQuery.status" placeholder="请选择" style="width:100px" size="mini">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <select-car-single @selectedCar="selectedCar"></select-car-single>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery" type="primary" size="mini" style="margin-left:50px">查询</el-button>
            <el-button type="primary" @click="bulkIssued()" size="mini" style="margin-left:20px">批量下发</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main style="padding-bottom:0px">
        <el-table style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc"
           :data="textMessageData"
           :columns="columns"
           @selection-change="handleSelectionChange"
           v-loading.body="listLoading" border stripe>
          <el-table-column align="center" type="selection" width="40" ></el-table-column>
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
              <el-button  type="primary" @click="textIssued(scope.row)" size="mini">文本下发</el-button>
              <el-button  type="primary" @click="multiMediaDetail(scope.row)" size="mini">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalList">
        </el-pagination>
      </el-footer>
      <el-dialog :visible.sync="textViewDialog" :close-on-click-modal="false" center width="850px">
        <span slot="title" style="margin-left:10px; float: left;height:25px">查询文本下发信息</span>
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
            <el-button type="primary" @click="textExport" size="mini" style="margin-left:20px; float: right">导出</el-button>
            <el-button type="primary" @click="selectRecordList" size="mini" style="margin-left:20px; float: right">查询</el-button>
          </div>
          <el-table border highlight-current-row stripe size="mini" style="margin-top:10px;"
            :data="operRecordData"
            @selection-change="handleSelectionChangeRecord"
            v-loading.body="listLoading" height="300px">
            <el-table-column type="selection" width="49" align="center" ></el-table-column>
            <el-table-column type="index" width="80" label="序号" align="center" ></el-table-column>
            <el-table-column prop="username" label="操作用户" align="center" width="150px"></el-table-column>
            <el-table-column prop="sendTime" label="发送时间" align="center" width="180px"></el-table-column>
            <el-table-column prop="sendContent" label="发送内容" align="center" width="350px"></el-table-column>
          </el-table>
          <el-footer>
          <!-- 分页区 -->
            <el-pagination class="pagination-plane" background @size-change="handleSizeChangeRecord" @current-change="handleCurrentChangeRecord" :current-page="operRecordQuery.page"
              :page-sizes="[5,10,15, 20]" :page-size="operRecordQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="totalRecord">
            </el-pagination>
          </el-footer>
      </el-dialog>
      <el-dialog :visible.sync="textIssuedDialog" :close-on-click-modal="false" @close="closeDialog" center width="400px">
          <span slot="title" style="margin-left:10px; float: left;height:25px">文本下发</span>
          <div style="width:90%;margin:0 5%;">
            <el-form :model="textSend" ref="textSend">
              <el-form-item style="margin-top:10px;margin-bottom:10px" label="设备:">
                <el-select v-model="textSend.value" size="mini">
                  <el-option label="疲劳一体机" value="VEHICLE_QH_ADAS"></el-option>
                </el-select>
                <el-button style="float:right" @click="msgModel" size="small" type="text">消息模板管理</el-button>
              </el-form-item>
              <el-form-item>
                <el-select style="width:100%" @change="textChange" v-model="textSend.id" size="mini" placeholder="请选择消息模板">
                  <el-option v-for="item in textList" :key="item.id" :label="item.content" :value="item.id"></el-option>
                </el-select>
                <el-input type="textarea" :rows="2" placeholder="请输入文本信息" v-model="textSend.sendContent"></el-input>
              </el-form-item>
              <el-form-item label="标志:"><br>
                  <div>
                    <el-radio v-model="checkList" label="1">紧急</el-radio>
                    <el-radio v-model="checkList" label="4">终端显示器显示</el-radio>
                  </div>
                  <div>
                    <el-radio v-model="checkList" label="8">TTS播读</el-radio>
                    <el-radio v-model="checkList" label="16">广告屏显示</el-radio>
                  </div>
              </el-form-item>
              <el-row style="text-align:center">
                <el-button @click="cancelSend">取 消</el-button>
                <el-button type="primary" @click="sendOut">发 送</el-button>
              </el-row>
            </el-form>
          </div>
      </el-dialog>
      <el-dialog title="消息模板管理" :visible.sync="msgBox">
        <el-input v-model.trim="msgData.content" placeholder="请输入消息模板" size="small" style="width:70%"></el-input>
        <el-button @click="createMsg" type="primary" size="small">添加模板</el-button>
        <el-table :data="msgTableData" border highlight-current-row stripe size="mini" style="margin-top:10px;">
          <el-table-column type="index" label="序号" align="center" width="50px"></el-table-column>
          <el-table-column prop="content" key="content" label="模板内容" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="50px">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteMsg(scope.row)"><i style="font-size:18px" class="el-icon-delete"></i></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <report-footer></report-footer>
    </el-container>
</template>
<script>
import selectCarSingle from '@/components/SelectCar/selectCarSingle'
import { formatDate } from '@/utils/date'
import { getTextMessageList, getTextRecordList, textRecordExport, deleteTextMsg, createTextMsg, getTextMsg } from '@/api/vehicleMonitor/textmessagesAS'
import { getToken } from '@/utils/auth'
import mixins from '@/common/mixins'
export default {
  name: 'textMessagesAS',
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
      multipleSelection: [],
      totalList: 0,
      textViewDialog: false,
      textIssuedDialog: false,
      option: '1',
      listLoading: false,
      textMessageData: [],
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
          title: '设备类型（文本）',
          width: '200',
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
          key: 'simCode',
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
          key: 'status',
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
        limit: 10,
        plateNo: '',
        status: ''
      },

      selectionRecord: [],
      operRecordData: [],
      textList: [],
      textSend: { value: 'VEHICLE_QH_ADAS', id: '', sendContent: '' },
      vehicleArray: [],
      checkList: '',
      msgData: { content: '' },

      msgBox: false,
      msgTableData: [],
      totalRecord: 0,
      operRecordQuery: {
        page: 1,
        limit: 5,
        vechileId: '',
        startTime: '',
        endTime: ''
      },
      exportQuery: {
        vechileId: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  async created() {
    await this.getList()
    await this.getMsg()
    this.initWebSocket()
  },
  destroyed() {
    this.websocket.close()
  },
  methods: {
    async getList() { // 分页获取文本下发数据列表
      this.listLoading = true
      const res = await getTextMessageList(this.listQuery)
      if (res.code === 0) {
        this.listLoading = false
        this.textMessageData = res.data.rows
        this.totalList = res.data.totalCount
      }
    },
    async getRecordList() {
      const res = await getTextRecordList(this.operRecordQuery)
      if (res.code === 0) {
        this.operRecordData = res.data.rows
        this.totalRecord = res.data.totalCount
      }
    },
    initWebSocket() {
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      vm.websocket.onopen = function() {
      }
      vm.websocket.onmessage = function(evt) {
        const obj = JSON.parse(evt.data)
        if (obj.Command === '8300') {
          vm.$message({
            message: '文本信息下发成功！',
            type: 'success'
          })
          vm.textIssuedDialog = false
        }
        if (obj.Command !== '8300') {
          vm.$message({
            message: '文本信息下发失败！',
            type: 'warning'
          })
          vm.textIssuedDialog = false
        }
      }
      vm.websocket.onerror = function() {
        vm.initWebSocket()
      }
    },
    searchDatas() {
      const data = {
        Command: '8300',
        CommandType: 'command',
        token: getToken('Admin-Token'),
        Body: {
          data: {
            vehicleIds: this.vehicleArray,
            type: this.checkList,
            text: this.textSend.sendContent,
            deviceType: this.textSend.value
          }
        }
      }
      this.websocket.send(JSON.stringify(data))
    },
    selectRecordList() {
      this.getRecordList()
    },
    handleSizeChangeRecord(val) {
      this.operRecordQuery.limit = val
      this.getRecordList()
    },
    handleCurrentChangeRecord(val) {
      this.operRecordQuery.page = val
      this.getRecordList()
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
    handleSelectionChangeRecord(val) {
      this.selectionRecord = val
    },
    /**
     * 查看
     */
    multiMediaDetail(row) {
      this.operRecordQuery.vechileId = row.vechileId
      this.getRecordList()
      this.textViewDialog = true
    },
    /**
     * 批量下发
     */
    bulkIssued() {
      this.vehicleArray = []
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
      const selectionText = this.multipleSelection
      selectionText.forEach(item => {
        if (item.status === 0) {
          this.$message({
            message: '请选择在线车辆进行操作',
            type: 'warning',
            duration: '1500'
          })
          isOpenDialog = false
          return
        }
        this.vehicleArray.push(item.vechileId)
      })
      this.textIssuedDialog = isOpenDialog
    },
    /**
     * 文本下发
     */
    textIssued(row) {
      this.vehicleArray = []
      if (row.status === 0) {
        this.$message({
          message: '请选择在线车辆',
          type: 'warning',
          duration: '1500'
        })
        return
      }
      this.vehicleArray.push(row.vechileId)
      this.textIssuedDialog = true
    },
    closeDialog() {
      this.cancelSend()
    },
    // 取消下发
    cancelSend() {
      this.textIssuedDialog = false
      this.textSend.sendContent = ''
      this.textSend.id = ''
      this.checkList = ''
    },
    // 确认发送
    sendOut() {
      if (this.textSend.sendContent === '') {
        this.$message({
          message: '文本下发信息不能为空！',
          type: 'warning',
          duration: '1500'
        })
        return
      }
      this.searchDatas()
    },
    // 消息下发记录导出
    textExport() {
      textRecordExport(this.exportQuery).then((result) => {
        this.downloads(result)
      }).catch((result) => {
        this.downloads(result)
      })
    },
    downloads(data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]), { type: 'application/vnd.ms-excel' })
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', '文本下发信息.xls')
      document.body.appendChild(link)
      link.click()
    },
    msgModel() {
      this.msgData.content = ''
      this.getMsg()
      this.msgBox = true
    },
    async getMsg() {
      const res = await getTextMsg()
      this.textList = res.data.modleList
      this.msgTableData = res.data.modleList
    },
    async createMsg() {
      if (this.msgData.content) {
        const res = await createTextMsg(this.msgData)
        if (res.code === 0) {
          this.$message({
            message: '新增成功',
            type: 'success'
          })
          this.msgData = { content: '' }
          this.getMsg()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      } else {
        this.$message({
          message: '消息模板不能为空',
          type: 'info'
        })
      }
    },
    async deleteMsg(row) {
      const id = row.id
      const res = await deleteTextMsg(id)
      if (res.code === 0) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.getMsg()
      } else {
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    // 选择文本消息模板
    textChange(val) {
      this.textList.forEach(element => {
        if (element.id === val) {
          this.textSend.sendContent = element.content
        }
      })
    },
    handleQuery() {
      this.listQuery.page = 1
      this.listQuery.limit = 10
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
        this.exportQuery.startTime = formatDate(val[0], 'yyyy-MM-dd hh:mm:ss')
        this.exportQuery.endTime = formatDate(val[1], 'yyyy-MM-dd hh:mm:ss')
      } else {
        this.operRecordQuery.startTime = formatDate(val[0], 'yyyy-MM-dd hh:mm:ss')
        this.operRecordQuery.endTime = formatDate(val[1], 'yyyy-MM-dd hh:mm:ss')
        this.exportQuery.startTime = formatDate(val[0], 'yyyy-MM-dd hh:mm:ss')
        this.exportQuery.endTime = formatDate(val[1], 'yyyy-MM-dd hh:mm:ss')
      }
    },
    operRecordQuery: {
      handler(val, oldVal) {
        this.exportQuery.vechileId = val.vechileId
      },
      deep: true
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
</style>