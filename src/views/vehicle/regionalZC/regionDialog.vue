<template>
  <div>
    <span>
      <el-button  @click="batchProcess" type="primary" plain>消息批量下发</el-button>
      <el-button class="maleft"  @click="refreshTable" type="primary" plain>刷新</el-button>
      <el-table :data="list" max-height="275"  v-loading.body="listLoading" @selection-change="handleSelectionChange" border stripe fit style="width: 100%;margin-top:13px">
        <el-table-column type="selection" width="40">
        </el-table-column>
        <el-table-column align="center" label="车牌号" width="100">
          <template slot-scope="scope">
            <span style='white-space:nowrap;text-overflow:ellipsis;overflow:hidden;' :title="scope.row.plateNo">{{scope.row.plateNo}}</span>
          </template>
        </el-table-column>
        <el-table-column label="VIN号" align="center" width="170">
          <template slot-scope="scope">
            <span :title="scope.row.vin">{{scope.row.vin}}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属机构" align="center">
          <template slot-scope="scope">
            <span style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;" :title="scope.row.deptName">{{scope.row.deptName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="位置" align="center" width="200">
          <template slot-scope="scope">
            <span style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;" :title="scope.row.addr">{{scope.row.addr}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center" width="155">
          <template slot-scope="scope">
            <span style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;" :title="scope.row.time">{{scope.row.time}}</span>
          </template>
        </el-table-column>
        <el-table-column label="速度" align="center" width="70">
          <template slot-scope="scope">
            <span style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;" :title="scope.row.speed">{{scope.row.speed}}km/h</span>
          </template>
        </el-table-column>
        <el-table-column label="上线状态" align="center" width="80">
          <template slot-scope="scope">
            <span style="white-space:nowrap;text-overflow:ellipsis;overflow:hidden;" :title="scope.row.statue">{{scope.row.statue}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="60">
          <template slot-scope="scope">
            <el-button type="text"><span class="el-icon-tickets" title="查看详情" @click="detailDialog(scope.row)"></span></el-button>
          </template>
        </el-table-column>
      </el-table>
    </span>
    <el-dialog class="cinfoDialog" :close-on-click-modal="false" title="消息批量下发" :append-to-body='true' :visible.sync="isShowDialog" width="550px" height="60%" >
        <send-message-dialog ref="mesDia" @getMes="getMessageData"></send-message-dialog>
        <div slot="footer" class="dialog-footer" style="text-align:center">
            <el-button @click="isShowDialog = false">取 消</el-button>
            <el-button type="primary" @click="sendMessage()">发 送</el-button>
        </div>
    </el-dialog>
    <!-- 车辆详情 -->
    <el-dialog class="cinfoDialog" :close-on-click-modal="false" title="车辆信息" :append-to-body='true' :visible.sync="isShowDetailDialog" width="485px" height="60%" >
        <vehicle-dialog ref="carInfo" @traceReview="traceReview" @newWindow="newWindow" :vehicleInfo="vehicleInfo"></vehicle-dialog>
        <div slot="footer" class="dialog-footer" style="text-align:center">
            <!-- <el-button @click="isShowDetailDialog = false">关闭</el-button> -->
        </div>
    </el-dialog>
  </div>
</template>
<script>
import sendMessageDialog from './sendMessageDialog.vue'
import vehicleDialog from './vehicleDialog.vue'
import { realTimeData } from '@/api/vehicleMonitor/regional'
import { getToken } from '@/utils/auth'
export default {
  name: 'regionDialog',
  props: {
    list: Array
  },
  components: {
    sendMessageDialog,
    vehicleDialog
  },
  data() {
    return {
      multipleSelection: [],
      isShowDetailDialog: false,
      listLoading: false,
      dialogTitle: '',
      isShowDialog: false,
      vehicleInfo: {}
    }
  },
  created() {
    this.initWebSocket()
  },
  destroyed() {
    this.websocket.close()
  },
  methods: {
    traceReview() { // 跳转轨迹回放
      this.isShowDetailDialog = false
      this.$emit('closeDia')
      this.$router.push({ name: 'replyingHRD', params: { vId: this.vehicleInfo.vehicleId, vNo: this.vehicleInfo.plateNo }})// vId此处应传车辆ID
    },
    newWindow() { // 重点跟踪
      this.isShowDetailDialog = false
      this.$emit('closeDia')
      this.$router.push({ name: 'realtime', params: { vehicleId: this.vehicleInfo.vehicleId }})
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    // 分页，暂时不用
    // handleSizeChange(val) { // 每页显示条数变化
    //   this.listQuery.limit = val
    //   this.getList()
    // },
    // handleCurrentChange(val) { // 页数变化
    //   this.listQuery.page = val
    //   this.getList()
    // },
    // 刷新按钮
    refreshTable() {
      this.$emit('refreshTab')
    },
    batchProcess() { // 批量处理按钮
      console.log(this.multipleSelection)
      if (this.multipleSelection.length > 0) {
        this.isShowDialog = true
      } else {
        this.$message.warning('请至少选择一行')
      }
    },
    async detailDialog(val) {
      // 此处打开车辆信息Dialog
      this.isShowDetailDialog = true

      const list = {
        vin: val.vin
      }
      console.log(list)
      const result = await realTimeData(list)
      this.$refs.carInfo.clearData()
      if (result.code === 0) {
        console.log('result', result)
        this.$refs.carInfo.getInfoDeatil(result, val)
        this.vehicleInfo = result.data
      }
    },
    sendMessageDialog() {
      // 此处打开发送消息的Dialog，将multipleSelection的值传过去
      this.isShowDialog = true
    },
    // 调用子页面获取要发送的文本消息
    sendMessage() {
      this.$refs.mesDia.getData()// 调用子页面获取要发送的文本消息
    },
    // 获取到的子页面消息文本的值
    getMessageData(val) {
      console.log(this.multipleSelection, val)
      // 在这里真正的请求后台 传入multipleSelection发送信息 发送数据，调用WebSocked
      var ids = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].vehicleId)
      }
      this.sendText(ids, val.type, val.textarea, val.deviceType)
      this.$refs.mesDia.clearData()
    },
    initWebSocket() { // 初始化websocket
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      vm.websocket.onopen = function() {
        console.log('websocket连接成功')
      }
      vm.websocket.onmessage = function(evt) {
        console.log(evt)
        const obj = JSON.parse(evt.data)
        console.log(obj)
        if (obj.Body.code === 1) {
          vm.$alert('消息发送成功', '提示', {
            confirmButtonText: '确定'
          })
        }
      }
      vm.websocket.onerror = function() {
        vm.initWebSocket()
      }
      vm.websocket.onclose = function(evnt) {
        console.log('  websocket.onclose  ')
      }
    },
    sendText(vehicleIds, type, textarea, deviceType) { // 发送websocket消息
      const data = {
        Command: 8300,
        CommandType: 'command',
        Token: getToken(),
        Body: {
          data: {
            vehicleIds: vehicleIds, // 车辆ID
            type: type, // 选择框的值
            text: textarea, // 文本下发消息
            deviceType: deviceType// 设备类型
          }
        }

      }
      console.log('ws请求参数：', data)
      if (this.websocket.readyState === 1) {
        this.websocket.send(JSON.stringify(data))
        this.isShowDialog = false
      } else {
        console.log('websocket信息发送失败')
      }
    }
  }

}

</script>
<style>
.cell{max-height: 25px !important;}
.el-dialog__title{
    color: white;
}
.cinfoDialog{
    margin-top:5%;
}
.maleft{
  position: absolute;
  right: 20px
}
</style>
