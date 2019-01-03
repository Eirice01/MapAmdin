<template>
  <div style="padding-left:18px">
    <el-container>
      <el-form style="padding-bottom:0">
        <el-form-item label="设备">
          <el-select v-model.trim="equipmentValue" style="width:40%">
            <el-option label="疲劳一体机" value="VEHICLE_QH_ADAS"></el-option>
          </el-select>
          <i class="el-icon-tickets msgManager" style="margin-left: 120px;text-decoration:underline" @click="updateMsgDialog = true">消息模版管理</i>
        </el-form-item>
        <el-form-item>
          <el-select v-model.trim="messageModelValue" @change="getvalue" placeholder="选择消息模板" style="width:100%">
            <el-option v-for="item in messageModelList" :key="item.id" :label="item.content" :value="item.content"></el-option>
          </el-select>
          <el-input type="textarea" :rows="5" placeholder="请输入下发消息" v-model.trim="textarea"></el-input>
        </el-form-item>
        <el-form-item label="标志" style="margin:0 30px 0 0">
          <br />
          <!-- <el-checkbox-group v-model.trim="checkList">
            <el-checkbox label="紧急" value="1" style="margin-left:30px;"></el-checkbox>
            <el-checkbox label="终端显示器显示" value="4"></el-checkbox>
            <el-checkbox label="TTS播读" value="8"></el-checkbox>
            <el-checkbox label="广告屏显示" value="16"></el-checkbox>
          </el-checkbox-group>-->
          <el-radio v-model.trim="checkList" label="1">紧急</el-radio>
          <el-radio v-model.trim="checkList" label="4">终端显示器显示</el-radio>
          <el-radio v-model.trim="checkList" label="8">TTS播读</el-radio>
          <el-radio v-model.trim="checkList" label="16">广告屏显示</el-radio>
        </el-form-item>
      </el-form>
      <el-dialog :visible.sync="updateMsgDialog" :append-to-body='true' :close-on-click-modal="false" title="消息模板管理" center>
        <el-input placeholder="输入消息模版" size="small" style="width: 80%; float: left; margin: 20px 5% 0 0" v-model.trim="messageAddValue"></el-input>
        <el-button type="primary" size="small" style="width: 15%; margin-top: 20px" @click="addMessageModel">添加模版</el-button>
        <el-table :data="messageModelList" style="width: 100%; margin-top: 20px" border stripe>
          <el-table-column label="序号" type="index" width="100" align="center">
          </el-table-column>
          <el-table-column prop="content" label="模版内容" align="center">
          </el-table-column>
          </el-table-column>
          <el-table-column label="删除" width="100" align="center">
            <template slot-scope="scope">
              <img src="@/assets/operate/delete.png" title="删除" style="cursor: pointer;" @click="deleteMessageModel(scope.row)">
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updateMsgDialog = false">取 消</el-button>
        </div>
      </el-dialog>
    </el-container>
  </div>
</template>
<script>
  import {
    getMsgList,
    addMsg,
    deleteMsg
  } from '@/api/alarm/intelligentEWP'
  export default {
    data() {
      return {
        textarea: '',
        updateMsgDialog: false,
        activeIndex: '1',
        messageAddValue: '', // 新添消息模板框
        messageModelList: [], // 消息模板列表
        checkList: '', // 单选框
        equipmentValue: 'VEHICLE_QH_ADAS', // 设备选择框
        messageModelValue: '', // 消息模板选择的值(要发的消息)
        equipment: [],
        messageModel: [], // 消息模板下拉框列表
        openMessageModelDialog: false
      }
    },
    async mounted() {
      await this.getMsg()
    },
    methods: {
      clearData() {
        this.textarea = ''
        this.checkList = ''
        this.messageModelValue = ''
      },
      // 父页面调用此方法将下发的消息传给父页面
      getData() {
        if (this.textarea === '') {
          this.$message({
            message: '请输入下发消息',
            type: 'warning'
          })
          return false
        } else {
          var data = {
            deviceType: this.equipmentValue, // 设备
            textarea: this.textarea, // 文本消息
            type: this.checkList // 选择框的值 // 标志
          }
          this.$emit('getMes', data)
        }
      },
      getvalue() {
        this.textarea = this.messageModelValue
      },
      // 删除消息模板
      deleteMessageModel(val) {
        const id = val.id
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
      // 新增消息模板
      addMessageModel() {
        if (!this.messageAddValue) {
          this.$message.error('请输入模版内容!')
        } else {
          addMsg({
            content: this.messageAddValue
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('添加模版成功!')
              this.messageAddValue = ''
              this.getMsg()
            }
          })
        }
      },
      getMsg() {
        getMsgList().then(res => {
          this.messageModelList = res.data
        })
      }
    }
  }

</script>
<style scoped>
  .msgManager:hover {
    color: #4077BC;
    cursor: pointer;
  }

</style>
