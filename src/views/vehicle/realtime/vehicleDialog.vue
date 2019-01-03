<template>
  <div class="vehicle_dialog">
    <div class="head_content">

      <div class="dlg_veh_ico"><span></span></div>
      <div class="head_left"><span>{{vehicleObj.vNo}}</span></div>
      <div class="head_right"><el-button @click="close" type="text"><i class="el-icon-close"></i></el-button></div>
      <br style="clear:both">
    </div>
    <div class="dialog_body">
      <div class="firstTabs">
      <el-tabs v-model="dataType" @tab-click="dataTypeChange">
        <el-tab-pane label="监控信息" name="first">
          <div>
          <div style="margin:0 0 0 0px;">
            <div style="width:35%;float:left;height:140px;">
              <div style="text-align: left;font-size: 12px;margin-left: 5px;height: 20px;line-height: 20px;">当前司机：{{driverInfo.name}}</div>
              <img :src="driverInfo.headImg" :onerror="defaultHeadImg" style="margin: 5px 0px 0px 0px;" height="110px" width="110px">
              <br style="clear:both">
            </div>
            <div style="width:65%;float:right">
              <div>
                <div class="monitorLeft" style="line-height:36px">操作：</div>
                <div class="monitorRight">
                  <el-tooltip content="重点跟踪" placement="top">
                    <el-button @click="newWindow" type="text"><i class="el-icon-location-outline"></i></el-button>
                  </el-tooltip>
                  <el-tooltip content="轨迹回放" placement="top">
                    <el-button @click="traceReview" type="text"><i class="el-icon-share"></i></el-button>
                  </el-tooltip>
                </div>
                <br style="clear:both">
              </div>
              <div>
                <div class="monitorLeft">车牌号：</div><div class="monitorRight">{{vehicleObj.vNo}}</div>
                <br style="clear:both">
              </div>
              <div>
                <div class="monitorLeft">状态：</div><div class="monitorRight">{{vehicleObj.vOnlineStatus === 1 ? '在线' : '离线'}}</div>
                <br style="clear:both">
              </div>
              <div>
                <div class="monitorLeft">人数：</div><div class="monitorRight">{{vehicleObj.number ? vehicleObj.number : '暂无数据'}}</div>
                <br style="clear:both">
              </div>
              <div>
                <div class="monitorLeft">速度：</div><div class="monitorRight">{{vehicleObj.currInfo.OvrallData.CurrentSpeed}}km/h</div>
                <br style="clear:both">
              </div>
              <div>
                <div class="monitorLeft">电量：</div><div class="monitorRight">{{vehicleObj.currInfo.OvrallData.SocStatus}}%</div>
                <br style="clear:both">
              </div>
            </div>
            <div></div>
            <div>
              <div class="monitorLeft" style="width:15%">时间：</div><div class="monitorRight" style="width:85%">{{vehicleObj.posTime}}</div>
              <br style="clear:both">
            </div>
            <div>
              <div class="monitorLeft" style="width:15%">省市：</div><div class="monitorRight" style="width:85%">{{currentAddress}}</div>
              <br style="clear:both">
            </div>
            <div>
              <div class="monitorLeft" style="width:15%">街道：</div><div class="monitorRight" style="width:85%">{{currentStreet}}</div>
              <br style="clear:both">
            </div>
            <br style="clear:both">
          </div>
          <div class="secondTabs" style="border-top:1px solid #DAE2EB">
            <el-tabs stretch=true value="first">
              <el-tab-pane label="预警信息" name="first">
                <div style="max-height:200px;" class="table_header">
                  <el-table :data="tableData" max-height="200" style="width: 100%;;" @row-click="curDetail" border highlight-current-row stripe size="mini">
                    <el-table-column prop="alarmTime" label="时间" align="center" :formatter="timeFormatter"></el-table-column>
                    <el-table-column prop="alarmTypeName" label="类型" align="center"></el-table-column>
                    <el-table-column prop="handlerTypeName" label="状态" align="center"></el-table-column>
                  </el-table>
                </div>
              </el-tab-pane>
            <el-tab-pane label="车辆信息" name="second">
              <div class="static_content">
                <div>
                  <div class="infoLeft">车牌号：</div><div class="infoRight">{{vehicleInfoObj.plateNo}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">所属机构：</div><div class="infoRight">{{vehicleInfoObj.deptName}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">VIN号：</div><div class="infoRight">{{vehicleInfoObj.vin}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">设备ID(主)：</div><div class="infoRight">{{vehicleInfoObj.deviceIdMaster ? vehicleInfoObj.deviceIdMaster : '暂无数据'}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">设备ID(副)：</div><div class="infoRight">{{vehicleInfoObj.deviceIdSlave ? vehicleInfoObj.deviceIdSlave : '暂无数据'}}</div>
                  <br style="clear:both">
                </div>
                <!-- <div>
                  <div class="infoLeft">行业类型：</div><div class="infoRight">{{vehicleInfoObj.type ? vehicleInfoObj.type : '暂无数据'}}</div>
                  <br style="clear:both">
                </div> -->
                <div>
                  <div class="infoLeft">车辆品牌：</div><div class="infoRight">{{vehicleInfoObj.vehicleBrand ? vehicleInfoObj.vehicleBrand : '暂无数据'}}</div>
                  <br style="clear:both">
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="司机信息" name="third">
              <div class="static_content">
                <div>
                  <div class="infoLeft">司机姓名：</div><div class="infoRight">{{driverInfo.name}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">所属机构：</div><div class="infoRight">{{driverInfo.deptName}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">工号：</div><div class="infoRight">{{driverInfo.driverNo}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">身份证号：</div><div class="infoRight">{{driverInfo.identitycard}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">准驾类型：</div><div class="infoRight">{{driverInfo.quasiDrivingModelDes}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">驾驶证号：</div><div class="infoRight">{{driverInfo.drivingLicence}}</div>
                  <br style="clear:both">
                </div>
                <div>
                  <div class="infoLeft">联系电话：</div><div class="infoRight">{{driverInfo.phone}}</div>
                  <br style="clear:both">
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
          </div>
        </div>
        </el-tab-pane>
        <el-tab-pane label="图片抓拍" name="second">
          <div style="width:94%;margin:0 5% 0 2%;">
          <el-form :model="photoForm" ref="photoForm" class="photo">
            <!-- <el-row style="text-align:right">
              <el-form-item>
                <span class="form_label">设备</span>
                <el-select v-model="photoForm.value" size="mini" style="width:80%">
                  <el-option label="疲劳一体机" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-row> -->
            <el-row style="text-align:right">
              <el-form-item>
                <span class="form_label">摄像头</span>
                <el-select v-model="photoForm.value1" size="mini" style="width:80%">
                  <el-option label="驾驶室" value="1"></el-option>
                  <el-option label="驾驶外" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row style="text-align:right">
              <el-form-item>
                <span class="form_label">分辨率</span>
                <el-select v-model="photoForm.value1" size="mini" style="width:80%">
                  <el-option label="320*240" value="1"></el-option>
                  <el-option label="640*480" value="2"></el-option>
                  <el-option label="800*600" value="3"></el-option>
                  <el-option label="1024*768" value="4"></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row style="text-align:center">
              <el-button type="primary" @click="capture('photoForm')" size="mini" style="width:45%">拍 照</el-button>
            </el-row>
          </el-form>
          <div style="text-align:center;margin-top:30px;">
            <img width="282px" height="220px" :src="imgSrc">
          </div>
        </div>
        </el-tab-pane>
        <el-tab-pane label="文本下发" name="third">
          <div style="width:90%;margin:0 5%;">
            <el-form :model="textSend" ref="textSend">
              <!-- <el-form-item label="设备">
                <el-select v-model="textSend.value" size="mini">
                  <el-option label="疲劳一体机" value="1"></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-row>
                  <el-col style="width:70%;text-align:left">
                    <el-select @change="textChange" v-model="textSend.id" size="mini" placeholder="请选择消息模板">
                      <el-option v-for="item in textList" :key="item.id" :label="item.content" :value="item.id"></el-option>
                    </el-select>
                  </el-col>
                  <el-col style="width:30%;">
                    <el-button @click="msgModel" size="small" type="text">消息模板管理</el-button>
                  </el-col>
                </el-row>
                <el-input type="textarea" :rows="4" placeholder="请选择消息模板" v-model="textSend.sendContent"></el-input>
              </el-form-item>
              <!-- <el-form-item>
                <span>标志：</span>
                <el-checkbox-group v-model="checkList">
                  <div>
                    <el-checkbox label="紧急" disabled></el-checkbox>
                    <el-checkbox label="终端显示器显示" disabled></el-checkbox>
                  </div>
                  <div>
                    <el-checkbox label="TTS播读" disabled></el-checkbox>
                    <el-checkbox label="广告屏显示" disabled></el-checkbox>
                  </div>
                </el-checkbox-group>
              </el-form-item> -->
              <el-row style="text-align:center">
                <!-- <el-button @click="cancelSend">取 消</el-button> -->
                <el-button type="primary" @click="sendOut('textSend')">发 送</el-button>
              </el-row>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="三电数据" name="fourth">
          <div style="width:92%;margin:0 4%;">
            <el-tabs v-model="infoType" type="border-card" class="realTimeTab">
              <el-tab-pane label="电机数据" name="electricData">
                <div v-for="driveData in driveDatalist" :key="driveData.index">
                  <div class="leftStyle">电驱序号：</div><div class="rightStyle">{{driveData.Index}}</div>
                  <div class="leftStyle">驱动电机状态：</div><div class="rightStyle">{{driveData.DriveStatus}}</div>
                  <div class="leftStyle">驱动电机控制温度：</div><div class="rightStyle">{{driveData.CtrlTemp}}°C</div>
                  <div class="leftStyle">驱动电机转速：</div><div class="rightStyle">{{driveData.DriveSpeed}}r/min</div>
                  <div class="leftStyle">驱动电机转矩：</div><div class="rightStyle">{{driveData.DriveTorque}}N/m</div>
                  <div class="leftStyle">驱动电机温度：</div><div class="rightStyle">{{driveData.DriveTemp}}°C</div>
                  <div class="leftStyle">电机控制器输入电压：</div><div class="rightStyle">{{driveData.BusVoltage}}V</div>
                  <div class="leftStyle">电机控制器直流母线电流：</div><div class="rightStyle">{{driveData.BusCurrent}}A</div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="储能数据" name="powerData">
                <div style="border-bottom:1px solid #efefef">
                  <div class="leftStyle">可充电储能系统个数：</div>
                  <div class="rightStyle">{{bmsData.length}}个</div>
                  <br style="clear:both">
                </div>
                <div v-for="storageEnergy in bmsData" :key="storageEnergy.index">
                  <div style="font-size:16px;color:#488aff;margin:10px 0 0 0;">{{storageEnergy.index}}号可充电储能子系统：</div>
                  <div class="leftStyle">子系统电压：</div><div class="rightStyle">{{storageEnergy.Voltage}}V</div>
                  <div class="leftStyle">子系统电流：</div><div class="rightStyle">{{storageEnergy.Current}}A</div>
                  <div class="leftStyle">单体电池总数：</div><div class="rightStyle">{{storageEnergy.vol.length}}</div>
                  <div class="leftStyle">单体电池温度探针总数：</div><div class="rightStyle">{{storageEnergy.temp.length}}</div>
                  <div>
                    <div class="leftStyle">单体电池电压值列表：</div>
                    <div class="rightStyle" style="height:100px;overflow-y:auto">{{storageEnergy.vol}}</div>
                    <br style="clear:both">
                  </div>
                  <div>
                    <div class="leftStyle">探针温度值列表：</div>
                    <div class="rightStyle" style="height:100px;overflow-y:auto">{{storageEnergy.temp}}</div>
                    <br style="clear:both">
                  </div>
                  <br style="clear:both">
                </div>
              </el-tab-pane>
              <el-tab-pane label="极值数据" name="extremumData">
                <div class="leftStyle">最高电压电池子系统号：</div><div class="rightStyle">{{ExtremeData.MaxVolIdx}}</div>
                <div class="leftStyle">最高电压电池单体代号：</div><div class="rightStyle">{{ExtremeData.MaxVolPos}}</div>
                <div class="leftStyle">电池单体电压最高值：</div><div class="rightStyle">{{ExtremeData.MaxVolVal}}V</div>
                <div class="leftStyle">最低电压电池子系统号：</div><div class="rightStyle">{{ExtremeData.MinVolIdx}}</div>
                <div class="leftStyle">最低电压电池单体代号：</div><div class="rightStyle">{{ExtremeData.MinVolPos}}</div>
                <div class="leftStyle">电池单体电压最低值：</div><div class="rightStyle">{{ExtremeData.MinVolIdx}}V</div>
                <div class="leftStyle">最高温度子系统号：</div><div class="rightStyle">{{ExtremeData.MaxTempIdx}}</div>
                <div class="leftStyle">最高温度探针序号：</div><div class="rightStyle">{{ExtremeData.MaxTempPos}}</div>
                <div class="leftStyle">最高温度值：</div><div class="rightStyle">{{ExtremeData.MaxTempVal}}°C</div>
                <div class="leftStyle">最低温度子系统号：</div><div class="rightStyle">{{ExtremeData.MinTempIdx}}</div>
                <div class="leftStyle">最低温度探针序号：</div><div class="rightStyle">{{ExtremeData.MinTempPos}}</div>
                <div class="leftStyle">最低温度值：</div><div class="rightStyle">{{ExtremeData.MinTempVal}}°C</div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
        <el-tab-pane label="外设数据" name="five">
          <div style="width:92%;margin:0 4%;" class="table_header">
            <el-tabs v-model="extraType" type="border-card" class="ext_device_tab">
              <el-tab-pane label="胎温胎压数据" name="temperatureData" >
                <el-table :data="extraData1" style="margin-top:5px;" border highlight-current-row stripe size="mini">
                  <el-table-column type="index" label="轮胎" align="center"></el-table-column>
                  <el-table-column prop="Temp" label="温度(°C)" align="center"></el-table-column>
                  <el-table-column prop="Stress" label="胎压(kPa)" align="center"></el-table-column>
                  <el-table-column prop="Alarm" label="状态" align="center"></el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="灭火装置数据" name="fireData">
                <el-table :data="extraData2" style="margin-top:5px;" border highlight-current-row stripe size="mini">
                  <el-table-column prop="index" label="灭火装置" align="center"></el-table-column>
                  <el-table-column prop="name" label="预警级别" align="center"></el-table-column>
                  <el-table-column prop="address" label="故障等级" align="center"></el-table-column>
                  <el-table-column prop="status" label="故障码" align="center"></el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-tab-pane>
      </el-tabs>
      </div>
    </div>
    <el-dialog title="消息模板管理" :visible.sync="msgBox">
      <el-input v-model.trim="msgData.content" placeholder="请输入消息模板" size="small" style="width:70%"></el-input>
      <el-button @click="createMsg" type="primary" size="small">添加模板</el-button>
      <el-table :data="msgTableData" border highlight-current-row stripe size="mini" style="margin-top:10px;">
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column width="500px" prop="content" key="content" label="模板内容" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteMsg(scope.row)"><i style="font-size:18px" class="el-icon-delete"></i></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getVehicleInfo, createMsg, getMsg, deleteMsg } from '@/api/vehicleMonitor/realtime'
import { formatDate } from '@/utils/date.js'
export default {
  props: {
    vehicleInfo: Object,
    address: String,
    street: String
  },
  data() {
    return {
      currentAddress: '',
      currentStreet: '',
      vehicleInfoObj: {},
      driverInfo: {
        headImg: require('../../../assets/realtime/avatar.png')
      },
      defaultHeadImg: 'this.src="' + require('../../../assets/realtime/avatar.png') + '"',
      bmsData: [],
      bmsVolData: [],
      bmsTempData: [],
      ExtremeData: {},
      driveDatalist: [],
      vehicleObj: { address: '', street: '' },
      vehicleNo: '陕A12312',
      name: '王杰',
      avatar: require('../../../assets/realtime/avatar.png'),
      status: 'all',
      dialogVisible: false,
      dataType: 'first',
      activeName: '预警信息',
      tableData: [],
      photoForm: {
        value: '1',
        value1: '1'
      },
      imgSrc: require('../../../assets/realtime/2.png'),
      textSend: { value: '1', id: '', content: '' },
      textList: [],
      checkList: ['紧急', 'TTS播读'],
      infoType: 'electricData',
      extraType: 'temperatureData',
      extraData1: [],
      extraData2: [],
      curPath: '',
      isShowDialog: false,
      msgBox: false,
      msgData: { content: '' },
      msgTableData: [],
      tyreObj: {}
    }
  },
  created() {
    this.currentAddress = this.address
    this.currentStreet = this.street
    this.vehicleObj = this.vehicleInfo
    this.driveDatalist = this.vehicleInfo.currInfo.DriveData
    this.ExtremeData = this.vehicleInfo.currInfo.ExtremeData
    this.tyreObj = this.vehicleInfo.currInfo.TyreData
    this.bmsVolData = this.vehicleInfo.currInfo.BmsVolData
    this.bmsTempData = this.vehicleInfo.currInfo.BmsTempData
    for (let i = 0; i < this.bmsVolData.length; i++) {
      const obj = { index: this.bmsVolData[i].Index, Voltage: this.bmsVolData[i].Voltage, Current: this.bmsVolData[i].Current, vol: this.bmsVolData[i].VolList, temp: this.bmsTempData[i].TempList }
      this.bmsData.push(obj) // 储能数据
    }
    // this.extraData2 = this.fireData
  },
  watch: {
    vehicleInfo(vehicle) {
      this.vehicleObj = vehicle
    },
    address(address) {
      this.currentAddress = address
    },
    street(street) {
      this.currentStreet = street
    }
  },
  mounted() {
    this.subHref()
    console.log(this.vehicleObj)
    const obj = { plateNo: this.vehicleObj.vNo }
    getVehicleInfo(obj).then(res => { // 车辆基础信息
      console.log(res)
      if (res.code === 0) {
        if (res.data.length === 0) {
          this.$message.info('车辆基础信息暂无数据')
          return
        }
        this.vehicleInfoObj = res.data.vehicleInfo
        this.tableData = res.data.alarmInfoList
        this.driverInfo = res.data.driverInfo
      } else {
        this.$message.error(res.msg)
      }
    })
    const obj1 = { Temp: this.tyreObj.Tyre1Temp, Stress: this.tyreObj.Tyre1Stress, Alarm: this.tyreObj.Tyre1Alarm }
    const obj2 = { Temp: this.tyreObj.Tyre2Temp, Stress: this.tyreObj.Tyre2Stress, Alarm: this.tyreObj.Tyre2Alarm }
    const obj3 = { Temp: this.tyreObj.Tyre3Temp, Stress: this.tyreObj.Tyre3Stress, Alarm: this.tyreObj.Tyre3Alarm }
    const obj4 = { Temp: this.tyreObj.Tyre4Temp, Stress: this.tyreObj.Tyre4Stress, Alarm: this.tyreObj.Tyre4Alarm }
    const obj5 = { Temp: this.tyreObj.Tyre5Temp, Stress: this.tyreObj.Tyre5Stress, Alarm: this.tyreObj.Tyre5Alarm }
    const obj6 = { Temp: this.tyreObj.Tyre6Temp, Stress: this.tyreObj.Tyre6Stress, Alarm: this.tyreObj.Tyre6Alarm }
    this.extraData1.push(obj1)
    this.extraData1.push(obj2)
    this.extraData1.push(obj3)
    this.extraData1.push(obj4)
    this.extraData1.push(obj5)
    this.extraData1.push(obj6)
  },
  methods: {
    timeFormatter(row, column, cellValue, index) {
      return cellValue ? formatDate(new Date(cellValue), 'hh:mm:ss') : ''
    },
    getMsg() {
      getMsg().then(res => {
        this.textList = res.data
        this.msgTableData = res.data
      })
    },
    createMsg() {
      if (this.msgData.content) {
        createMsg(this.msgData).then(res => {
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
        })
      } else {
        this.$message({
          message: '消息模板不能为空',
          type: 'info'
        })
      }
    },
    deleteMsg(row) {
      const obj = { id: row.id }
      deleteMsg(obj).then(res => {
        console.log('删除消息：', res)
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
      })
    },
    msgModel() {
      this.msgData.content = ''
      this.getMsg()
      this.msgBox = true
    },
    close() {
      this.$emit('dialogClose')
    },
    subHref() {
      const curHref = location.href
      const arr = curHref.split('#')
      this.curPath = arr[0]
    },
    // 车辆信息功能按钮改变
    dataTypeChange(val) {
      console.log('val---->' + val)
      switch (val) {
        case '文本下发':
          this.getMsg()
          this.textSend = { value: '1', id: '', content: '' }
          break
        default:
          break
      }
    },
    // 拍照
    capture(form) {
      this.$emit('capture', form)
      // this.imgSrc = require('../../../assets/realtime/1.jpeg')
      this.$message.info('指令功能正在完善')
    },
    // 取消下发
    cancelSend() {},
    // 确认发送
    sendOut(form) {
      this.$message.info('指令功能正在完善')
    },
    // 选择文本消息模板
    textChange(val) {
      this.textList.forEach(element => {
        if (element.id === val) {
          this.textSend.sendContent = element.content
        }
      })
    },
    // 重点跟踪
    newWindow() {
      localStorage.setItem('vehicleInfo', JSON.stringify(this.vehicleObj))
      window.open(this.curPath + '#/specialMonitor', '_blank')
    },
    // 轨迹回放
    traceReview() {
      this.$emit('traceReview')
    },
    // 预警信息table行点击事件
    curDetail(row) {
      console.log(row)
    }
  }
}
</script>

<style>
/* 针对不同的屏幕分辨率设置样式 */
@media screen and (max-width: 1366px) {
  .vehicle_dialog {
    position: absolute;
    /* margin: 10px 0 0 calc(100vw - 360px); */
    margin-top: 10px;
    width: 304px;
    height: 535px;
    /* max-height: 535px; */
    float: right;
    text-align: center;
    right: 50px;
    /* background-color: #fff; */
  }

  .head_left {
    float: left;
    font-size: 16px;
    color: #fff;
    height: 43px;
    line-height: 43px;
  }

  .firstTabs .el-tabs__item {
      padding: 0 6.3px;
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 12px;
      /* font-weight: 500; */
      color: #303133;
      position: relative;
      text-align: center;
  }

  .secondTabs .el-tabs__item {
      /* padding: 0 37px; */
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 12px;
      font-weight: 500;
      color: #303133;
      position: relative;
      text-align: center;
      width: 33.33%;
  }
  .vehicle_dialog .dialog_body {
    padding: 0 5px;
    background-color: #fff;
    border-bottom-left-radius:8px;
    border-bottom-right-radius:8px;
    -moz-border-bottom-radius:8px;
    padding-bottom: 10px;
    height: 500px;
  }
  .ext_device_tab{
    height: 440px;
  }
  .realTimeTab{
    height: 440px;
  }
  .static_content{
    margin: 5px;
    max-height: 200px;
    padding: 5px;
    background-color: #F7F7F7;
    border: 1px solid #E8E8E8;
    line-height: 15px;
  }
}

@media screen and (min-width: 1400px) and (max-width: 1920px) {
.vehicle_dialog {
    position: absolute;
    /* margin: 10px 0 0 calc(100vw - 360px); */
    margin-top: 10px;
    width: 428px;
    height: 752px;
    /* max-height: 752px; */
    /* width: 304px;
    height: 535px; */
    float: right;
    text-align: center;
    right: 50px;
  }

  .vehicle_dialog .dialog_body {
    padding: 0 5px;
    background-color: #fff;
    border-bottom-left-radius:8px;
    border-bottom-right-radius:8px;
    -moz-border-bottom-radius:8px;
    padding-bottom: 10px;
    height: 650px;
  }

  .head_left {
    float: left;
    font-size: 16px;
    color: #fff;
    height: 43px;
    line-height: 43px;
  }

  .firstTabs .el-tabs__item {
      /* padding: 0 22.3px; */
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 12px;
      /* font-weight: 500; */
      color: #303133;
      position: relative;
      text-align: center;
      width: 20%;
  }

  .secondTabs .el-tabs__item {
      /* padding: 0 60px; */
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 12px;
      font-weight: 500;
      color: #303133;
      position: relative;
      text-align: center;
      width: 33.33%;
  }

  .realTimeTab{
    height: 590px;
  }

  .ext_device_tab{
    height: 590px;
  }

  .realTimeTab .el-tabs__item {
      /* padding: 0 6.3px; */
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 12px;
      /* font-weight: 500; */
      color: #303133;
      position: relative;
      text-align: center;
      width: 33.33%;
  }

  .ext_device_tab .el-tabs__item {
      /* padding: 0 6.3px; */
      height: 40px;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      line-height: 40px;
      display: inline-block;
      list-style: none;
      font-size: 12px;
      /* font-weight: 500; */
      color: #303133;
      position: relative;
      text-align: center;
      width: 50%;
  }

  .static_content{
    margin: 5px;
    padding: 5px;
    background-color: #F7F7F7;
    border: 1px solid #E8E8E8;
    line-height: 36px;
  }

}

  body{
    font-size: 12px;
  }

  .dlg_veh_ico{
    float:left;
    height: 43px;
    line-height: 43px;
    width:36px
  }
  .dlg_veh_ico span{
    display:inline-block;
    width: 16px;
    height: 20px;
    background-image: url('../../../assets/realtime/dlg_veh_ico.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-top: 12px;
  }

  .el-tabs__nav {
    position: relative;
    -webkit-transition: -webkit-transform .3s;
    transition: -webkit-transform .3s;
    transition: transform .3s;
    transition: transform .3s, -webkit-transform .3s;
    transition: transform .3s,-webkit-transform .3s;
    float: left;
    z-index: 2;
    width: 100%;
  }

  /* .vehicle_dialog .dialog_body .dialog_content .el-table td, .el-table th {
    padding: 0 !important
  } */
  .vehicle_dialog .el-dialog__body {
    max-height: 400px;
    overflow-y: auto
  }
  .vehicle_dialog .el-checkbox__inner {
    z-index: 0;
  }

  .vehicle_dialog .dialog_content {
    text-align: left;
    margin: 10px 0 0 0;
    padding: 2px;
    font-size: 13px;
  }
  .vehicle_dialog .el-radio-button__inner {
    padding: 10px 5px !important;
  }
  .vehicle_dialog .dialog_content .el-radio-button__inner {
    padding: 10px 0 !important;
    border: none;
    border-radius: 0
  }
  .head_content {
    background-color:#4178BD;
    /* border-top:1px solid #4178BD; */
    border-top-left-radius:8px;
    border-top-right-radius:8px;
    -moz-border-top-radius:8px;
  }
  .head_content .el-button {
    color: #ffffff;
    font-size: 20px
  }

  .head_right {
    float: right;
    margin-right: 15px
  }
  .leftStyle {
    padding: 7px 0;
    width: 60%;
    float: left;
    color: #9a9a9a;
    text-align: right
  }
  .rightStyle {
    padding: 7px 0;
    width: 40%;
    float: right;
    padding-left: 20px;
    text-align: left;
  }
  .infoLeft {
    padding: 5px 0;
    width: 35%;
    float: left;
    color: #282828;
    text-align: right;
    padding-right: 15px;
  }
  .infoRight {
    padding: 5px 0;
    width: 65%;
    float: right;
    text-align: left
  }
  .monitorLeft {
    padding: 3px 0;
    width: 40%;
    float: left;
    color: #282828;
    text-align: right;
    padding-right: 5px;
  }
  .monitorRight {
    padding: 3px 0;
    width: 60%;
    float: right;
    text-align: left;
  }
  .photo .el-form-item {
    margin-bottom: 3px;
  }
  .el-tabs__header{
    padding: 0;
    position: relative;
    margin: 0 0 5px;
  }

  .table_header th{
    height: 15px;
    background-color: #4178BB;
    color: #ffffff;
    border: 0px
  }
</style>
