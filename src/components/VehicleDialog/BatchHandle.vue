<template>
  <div>
    <el-button class="commonBtn" @click="batchProcess" type="primary" size="mini" style="margin-left: 10px;background:#4077BC;">批量处理</el-button>
    <el-dialog title="批量处理" :visible.sync="batchDialog" :close-on-click-modal="isCloseModal" @open="getDialogInfo"
               center>
      <el-tabs v-model.trim="activeIndex" @tab-click="tabClick">
        <el-tab-pane label="人工批量处理" name="1">
          <el-form label-position="top">
            <el-form-item label="处理方式" style="margin-bottom:0">
              <el-radio-group v-model.trim="handleStyle">
                <el-row style="margin-bottom: 20px">
                  <el-radio label="1">电话通知</el-radio>
                  <el-radio label="2" style="margin-left:50px;">建议停车</el-radio>
                  <el-radio label="3" style="margin-left:50px;">警告提醒</el-radio>
                </el-row>
                <el-row>
                  <el-radio label="4">停车休息</el-radio>
                  <el-radio label="5" style="margin-left:50px;">语音下发</el-radio>
                  <el-radio label="6" style="margin-left:50px;">其他</el-radio>
                </el-row>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="处理描述">
              <el-input type="textarea" :rows="5" placeholder="请输入处理描述信息" v-model.trim="handleTextarea"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="消息批量下发" name="2">
          <el-form style="padding-bottom:0">
            <el-form-item label="设备">
              <el-select v-model.trim="eqValue" placeholder="自定义" style="width:40%">
                <el-option label="疲劳一体机" value="VEHICLE_QH_ADAS"></el-option>
              </el-select>
              <i class="el-icon-tickets msgManager" style="margin-left: 20px;"
                 @click="updateMsgDialog = true">消息模版管理</i>
            </el-form-item>
            <el-form-item>
              <el-select ref="selectTemp" v-model.trim="selectTempId" placeholder="选择消息模板" style="width:100%">
                <el-option v-for="item in msgTemplate" :key="item.value" :label="item.content"
                           :value="item.id"></el-option>
              </el-select>
              <el-input type="textarea" :rows="5" placeholder="请输入下发消息" v-model.trim="textarea"></el-input>
            </el-form-item>
            <el-form-item label="标志" style="margin:0 30px 0 0">
              <el-radio-group v-model="checkedCities">
                <el-radio label="1">紧急</el-radio>
                <el-radio label="4">终端显示器显示</el-radio>
                <el-radio label="8">TTS播读</el-radio>
                <el-radio label="16">广告屏显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button class="commonCanBtn" @click="batchDialog = false">取 消</el-button>
        <el-button class="commonBtn" type="primary" @click="Submit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑模版弹框 -->
    <el-dialog :visible.sync="updateMsgDialog" :close-on-click-modal="false" title="批量处理" center>
      <el-input placeholder="输入消息模版" size="small" style="width: 80%; float: left; margin: 20px 5% 0 0"
                v-model.trim="content"></el-input>
      <el-button type="primary" size="small" style="width: 15%; margin-top: 20px" @click="addTemplate">添加模版</el-button>
      <el-table
        :data="msgTemplate"
        style="width: 100%; margin-top: 20px"
        border
        stripe>
        <el-table-column
          label="序号"
          type="index"
          width="100"
          align="center">
        </el-table-column>
        <el-table-column
          prop="content"
          label="模版内容"
          align="center">
        </el-table-column>
        <el-table-column
          label="删除"
          width="100"
          align="center">
          <template slot-scope="scope">
            <img src="@/assets/operate/delete.png" title="删除" style="cursor: pointer;"
                 @click="deleteTemplate(scope.row.id)">
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateMsgDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { getMsgList, addMsg, deleteMsg } from '@/api/alarm/intelligentEWP'
  import { artificialHandle } from '@/api/alarm/baseApi'
  import { getToken } from '@/utils/auth'
  import { isEmpty } from '@/utils/validate'

  export default {
    name: 'BatchHandle',
    inject: ['reload'],
    props: {
      selectRows: {
        type: Array,
        default: []
      },
      seccussMessage: {
        type: String,
        default: '预警处理成功'
      }
    },
    data() {
      return {
        websocket: null,
        eqValue: 'VEHICLE_QH_ADAS', // 设备的值
        handleStyle: '1', // 处理方式
        batchDialog: false,
        isCloseModal: false,
        isSocket: false,
        activeIndex: '1',
        messageTextarea: '',
        handleTextarea: '',
        queryParams: {
          text: ''
        },
        content: '',
        msgTemplate: [],
        checkedCities: '1',
        updateMsgDialog: false,
        selectTempId: null
      }
    },
    computed: {
      textarea: {
        get() {
          const arr = this.msgTemplate
          const id = this.selectTempId
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
              this.messageTextarea = arr[i].content
              return arr[i].content
            }
          }
          return ''
        },
        set(val) {
          this.messageTextarea = val
        }
      }

    },
    methods: {
      async getDialogInfo() {
        await this.getMsg()
      },

      async Submit() {
        if (this.activeIndex === '1') {
          await this.handleSubmit()
        }
        if (this.activeIndex === '2') {
          this.sendText()
        }
      },

      /**
       * 人工批量处理
       * @param val
       */
      async handleSubmit() {
        const selectRows = this.selectRows
        const ids = []
        selectRows.forEach(item => {
          ids.push(item.id)
        })
        if (isEmpty(this.handleTextarea)) {
          this.$alert('请输入处理内容')
          return
        }
        const params = {
          id: ids.join(),
          handlerType: this.handleStyle,
          content: this.handleTextarea
        }
        const result = await artificialHandle(params)
        if (result.code === 0) {
          this.batchDialog = false
          this.$alert(this.seccussMessage, '提示', {
            callback: (action, instance) => {
              this.reload()
            }
          })
        } else {
          this.$message.error('系统异常')
        }
      },

      /**
       * 打开批量处理模型
       * @param val
       */
      batchProcess() { // 批量处理按钮
        if (this.selectRows.length > 0) {
          this.batchDialog = true
        } else {
          this.$message.warning('请至少选择一行')
        }
      },
      async getMsg() {
        const result = await getMsgList()
        this.msgTemplate = result.data
      },
      async addTemplate() {
        if (!this.content) {
          this.$message.error('请输入模版内容!')
        } else {
          const result = await addMsg({ content: this.content })
          if (result.code === 0) {
            this.$message.success('添加模版成功!')
            this.content = ''
            await this.getMsg()
          }
        }
      },
      deleteTemplate(id) {
        this.$confirm('是否删除此模版?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteMsg(id).then(res => {
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getMsg()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      initWebSocket() { // 初始化websocket
        const vm = this
        vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
        vm.websocket.onopen = function() {
          console.log('websocket连接成功')
          vm.isSocket = true
        }
        vm.websocket.onmessage = function(evt) {
          const obj = JSON.parse(evt.data)
          console.log(obj)
          // const plateNo = JSON.parse(obj.Body.vehicleId).plateNo
          switch (obj.Command) {
            case '8300':
              vm.$alert('发送成功', '提示', {
                confirmButtonText: '确定'
              })
              break
          }
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      sendText() {
        const data = {
          Command: 8300,
          CommandType: 'command',
          Token: getToken(),
          Body: {
            data: {
              vehicleIds: this.selectRows, // 车辆ID
              type: this.checkedCities,
              text: this.messageTextarea,
              deviceType: this.eqValue
            }
          }
        }
        // console.log('ws请求参数：', data)
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
          console.log('消息发送成功')
        } else {
          console.log('websocket信息发送失败')
        }
      },
      tabClick() {
        if (this.activeIndex === '2') {
          if (!this.isSocket) {
            this.initWebSocket()
          }
        }
      }
    }
  }
</script>

<style scoped>
  .commonBtn{
    background: #4077BC;
    border-color:#4077BC;
  }
  .commonCanBtn {
    background: #ffffff;
    color:#4077BC;
    border-color:#4077BC;
  }
</style>
