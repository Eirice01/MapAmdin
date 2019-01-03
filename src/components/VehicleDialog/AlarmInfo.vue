<template>
  <!-- dialog start -->
  <el-dialog :visible.sync="isShow" :before-close="closeDialog" :close-on-click-modal="false"
             center
             width="790px"
             @open="getRecordInfo"
             style="padding-top:15px;">
    <el-row slot="title">
      <el-col :span="6" style="color:#ffffff;font-size:14px;">{{monInfo.plateNo}}</el-col>
      <el-col :span="13" align="center" style="color:#ffffff;font-size:14px;">{{monInfo.alarmTypeName}}</el-col>
    </el-row>
    <el-dialog title="消息模板管理" :visible.sync="msgBox" append-to-body>
      <el-input v-model.trim="msgData.content" placeholder="请输入消息模板" size="small" style="width:70%"></el-input>
      <el-button @click="createMsg" type="primary" size="small">添加模板</el-button>
      <el-table :data="textList" border highlight-current-row stripe size="mini" style="margin-top:10px;">
        <el-table-column type="index" label="序号" align="center"></el-table-column>
        <el-table-column width="500px" prop="content" key="content" label="模板内容" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteMsg(scope.row)"><i style="font-size:18px" class="el-icon-delete"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-row :gutter="20">
      <el-col :span="8" style="height:36px;">
        <span style="line-height:36px;">{{defaultDataType.title}}</span>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <img class="iconButton" @click="openPlan(index)" v-for="(item,index) of iconButtons" :key="index"
             :src="item.selected?item.iconSelected:item.icon"/>
      </el-col>
    </el-row>
    <div class="dialog_content">
      <div v-show="defaultDataType.type === 0" style="height:340px;">
        <el-row :gutter="20">
          <el-col :span="12" v-show="monInfo.isCode ===1">
            <div style="height:268px;width:100%;overflow-y: auto;padding:5px;border:1px solid #696969'">
              <img class="viewDivNoBorder" :src="monInfo.mediaUrl">
            </div>
          </el-col>
          <el-col :span="monInfo.isCode ===1?12:24">
            <div class="viewDiv">
              <baidu-map :center="mapInit" @ready="handler" :zoom="12" :scroll-wheel-zoom="true" class="map">
                <bm-marker :position="{lng: monInfo.longitude, lat: monInfo.latitude}" :dragging="true"
                           @click="showInfoWindow">
                  <bm-info-window :height="infoWindow.height"
                                  :position="{lng: monInfo.longitude, lat: monInfo.latitude}" show
                                  @close="infoWindowClose" @open="infoWindowOpen">
                    <el-row style="height:20px">
                      <el-col :span="6" style="font-size: 12px">车牌号</el-col>
                      <el-col :span="18" style="font-size: 12px">{{monInfo.plateNo}}</el-col>
                    </el-row>
                    <el-row style="height:20px">
                      <el-col :span="6" style="font-size: 12px">速度</el-col>
                      <el-col :span="18" style="font-size: 12px">{{monInfo.speed}}</el-col>
                    </el-row>
                    <el-row style="height:20px">
                      <el-col :span="6" style="font-size: 12px">时间</el-col>
                      <el-col :span="18" style="font-size: 12px">{{monInfo.alarmStart}}</el-col>
                    </el-row>
                    <el-row style="height:20px">
                      <el-col :span="6" style="font-size: 12px">地址</el-col>
                      <el-col :span="18" style="font-size: 12px">{{monInfo.alarmAddress}}</el-col>
                    </el-row>
                  </bm-info-window>
                </bm-marker>
              </baidu-map>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-purple"><span style="line-height: 36px;">处理方式</span></div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light"><span style="line-height: 36px;">处理描述</span></div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-radio-group style="text-align: left" v-model="monInfo.handlerType" v-if="!isDisable && !isHandle">
              <!--<el-radio :disabled="isHandle" :label="1" style="line-height: 28px">电话通知</el-radio>-->
              <!--<el-radio :disabled="isHandle" :label="2" style="line-height: 28px">建议停车</el-radio>-->
              <!--<el-radio :disabled="isHandle" :label="3" style="line-height: 28px">警告提醒</el-radio>-->
              <!--<el-radio :disabled="isHandle" :label="4" style="line-height: 28px; margin-left:0px;">停车休息</el-radio>-->
              <!--<el-radio :disabled="isHandle" :label="5" style="line-height: 28px">语音下发</el-radio>-->
              <!--<el-radio :disabled="isHandle" :label="6" style="line-height: 28px">其他</el-radio>-->
              <el-radio :label="1" style="line-height: 28px">电话通知</el-radio>
              <el-radio  :label="2" style="line-height: 28px">建议停车</el-radio>
              <el-radio  :label="3" style="line-height: 28px">警告提醒</el-radio>
              <el-radio :label="4" style="line-height: 28px; margin-left:0px;">停车休息</el-radio>
              <el-radio  :label="5" style="line-height: 28px">语音下发</el-radio>
              <el-radio  :label="6" style="line-height: 28px">其他</el-radio>
            </el-radio-group>
            <span v-if="isHandle">{{handlerTypeformatter(monInfo.handlerType)}}</span>
          </el-col>
          <el-col :span="12">
            <span v-if="isHandle">无</span>
            <el-input v-else v-model="monInfo.content" type="textarea" :rows="2"
                        placeholder="请输入描述"></el-input>
          </el-col>
        </el-row>
      </div>
      <div v-show="defaultDataType.type === 1" style="height:340px;">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="viewDiv" style="text-align:center;overflow-y: auto">
              <img :src="photograph" style="width:100%;">
            </div>
          </el-col>
          <el-col :span="12">
            <div class="input-suffix">
              <span class="input-label">设备：</span>
              <el-select v-model="eqValue" size="small" style="width: 80%">
                <el-option label="疲劳一体机" value="VEHICLE_QH_ADAS"></el-option>
              </el-select>
            </div>
            <div class="input-suffix">
              <span class="input-label">摄像头：</span>
              <el-select v-model="cameraValue" size="small" style="width: 80%">
                <el-option label="ADAS设备" value="100"></el-option>
                <el-option label="DSM设备" value="101"></el-option>
              </el-select>
            </div>
            <div class="input-suffix" style="text-align: right">
              <el-button type="primary" @click="camera" size="small">拍照</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
      <div v-show="defaultDataType.type === 2" style="height:340px;">
        <el-form ref="textSend" label-position="left" label-width="20%" style="margin-top:20px;">
          <el-row>
            <el-col :span="16">
              <span style="width:15%;">设备</span>
              <el-select size="medium" v-model="messageEqValue" style="width:85%;">
                <el-option label="疲劳一体机" value="VEHICLE_QH_ADAS"></el-option>
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button @click="openMsgModel" size="small" type="text">消息模板管理</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="margin-top:15px;">
              <el-select class="selectTempt" @change="textChange" v-model="selectTempId" size="medium"
                         placeholder="请选择消息模板"
                         style="width:100%;border-bottom-right-radius: 0;border-bottom-left-radius: 0;">
                <el-option v-for="item in textList" :key="item.id" :label="item.content" :value="item.id"></el-option>
              </el-select>
              <el-input type="textarea" class="textarea" :rows="2" placeholder="请选择消息模板"
                        v-model="textSend" style=""></el-input>
            </el-col>
          </el-row>
          <p>
            <span>标志：</span>
          </p>
          <el-radio-group v-model="sendTextType">
            <el-radio label="1">紧急</el-radio>
            <el-radio label="4">终端显示器显示</el-radio>
            <el-radio label="8">TTS播读</el-radio>
            <el-radio label="16">广告屏显示</el-radio>
          </el-radio-group>
        </el-form>
      </div>
      <div v-show="defaultDataType.type === 3" style="height:340px;">
        <el-tabs v-model="activeElecTab">
          <el-tab-pane name="electric" label="电机数据">
            <el-row>
              <el-col :offset="4" :span="10">电驱个数：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight: normal;">{{realTimeData.driveData_.length}}个</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">驱动电机状态：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight: normal;">{{driveStatusFarmart(realTimeData.driveData_[0].driveStatus_)}}</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">驱动电机控制温度：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight: normal;">{{realTimeData.driveData_[0].ctrlTemp_}}℃</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">驱动电机转速：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight: normal;">{{realTimeData.driveData_[0].driveSpeed_}}r/min</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">驱动电机转矩：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight: normal;">{{realTimeData.driveData_[0].driveTorque_}}N/m</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">驱动电机温度：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight: normal;">{{realTimeData.driveData_[0].driveTemp_}}℃</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">电机控制器输入电压：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight: normal;">{{realTimeData.driveData_[0].busVoltage_}}V</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">电机控制器直流母线电流：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight: normal;">{{realTimeData.driveData_[0].busCurrent_}}A</el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="ele1" label="储能数据">
            <el-row>
              <el-col :offset="4" :span="10" style="color:#666666;font-weight:normal">1号可充电储能子系统：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight:normal">{{realTimeData.bmsVolData_[0].index_}}</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">子系统电压：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight:normal">{{realTimeData.bmsVolData_[0].voltage_}}V</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">子系统电流：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight:normal">{{realTimeData.bmsVolData_[0].current_}}A</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">单体电池总数：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight:normal">{{realTimeData.bmsVolData_[0].batteryCnt_}}个</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">单体电池温度探针总数：</el-col>
              <el-col class="black-font" :span="10" style="color:#444444;font-weight:normal">{{realTimeData.bmsTempData_[0].tempList_.length}}个</el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">单体电池电压值列表：</el-col>
              <el-col class="black-font" :offset="4" :span="20" style="height:64px;margin-bottom:5px; overflow: auto">
                <span style="display: inline-block; color:#444444;font-weight: normal;padding:0 2px;"  v-for="(item,index) of realTimeData.bmsVolData_[0].volList_" :key="index">
                                  {{index + 1 === realTimeData.bmsVolData_[0].volList_.length ? item :item + ','}}
                </span>
              </el-col>
            </el-row>
            <el-row>
              <el-col :offset="4" :span="10">探针温度值列表：</el-col>
              <el-col class="black-font" :offset="4" :span="20" style="height:64px; overflow: auto">
                  <span style="display: inline-block;color:#444444;font-weight: normal;" v-for="(item,index) of realTimeData.bmsTempData_[0].tempList_" :key="index">
                    {{index + 1 === realTimeData.bmsTempData_[0].tempList_.length ? item :item + ','}}
                  </span>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="ele2" label="极值数据">
            <el-row>
              <el-col :offset="2" :span="8">最高电压电池子系统号：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.maxVolIdx_}}</el-col>
              <el-col :offset="2" :span="8">最高温度子系统号：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.maxTempIdx_}}</el-col>
            </el-row>
            <el-row>
              <el-col :offset="2" :span="8">最高电压电池单体代号：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.maxVolPos_}}</el-col>
              <el-col :offset="2" :span="8">最高温度探针序号：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.maxTempPos_}}</el-col>
            </el-row>
            <el-row>
              <el-col :offset="2" :span="8">电池单体电压最高值：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.maxVolVal_}}V</el-col>
              <el-col :offset="2" :span="8">最高温度值：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.maxTempVal_}}℃</el-col>
            </el-row>
            <el-row>
              <el-col :offset="2" :span="8">最低电压电池子系统号：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.maxTempVal_}}</el-col>
              <el-col :offset="2" :span="8">最低温度子系统号：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.minVolIdx_}}</el-col>
            </el-row>
            <el-row>
              <el-col :offset="2" :span="8">最低电压电池单体代号：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.minVolPos_}}</el-col>
              <el-col :offset="2" :span="8">最低温度探针序号：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.minTempPos_}}</el-col>
            </el-row>
            <el-row>
              <el-col :offset="2" :span="8">电池单体电压最低值：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.minVolVal_}}V</el-col>
              <el-col :offset="2" :span="8">最低温度值：</el-col>
              <el-col class="black-font" :span="2" style="color:#444444;font-weight: normal;">{{realTimeData.extremeData_.minTempVal_}}℃</el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div v-show="defaultDataType.type === 4" style="height:340px;">
        <el-tabs v-model="activePeripheralTab">
          <el-tab-pane name="tire" label="胎温胎压数据">
            <el-table style="margin-top:5px;" border highlight-current-row stripe size="mini" :data="TyreData">
              <el-table-column prop="date" label="轮胎" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.index}}</span>
                </template>
              </el-table-column>
              <el-table-column label="温度" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.tyreTemp}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="" label="胎压" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.tyreStress}}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.tyreAlarm}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="fire" label="灭火装置数据">
            <el-table style="margin-top:5px;" border highlight-current-row stripe size="mini" :data="realTimeData.userData_.mapData.FireData">
              <el-table-column label="灭火装置" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row[0]}}号灭火</span>
                </template>
              </el-table-column>
              <el-table-column  label="预警级别" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row[1]}}</span>
                </template>
              </el-table-column>
              <el-table-column  label="故障等级" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row[2]}}</span>
                </template>
              </el-table-column>
              <el-table-column  label="故障码" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row[3]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div slot="footer" class="dialog-footer" style="text-align: center;margin-top:20px;">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button v-if="!isHandle" @click="submitParam" type="primary">确 定</el-button>
      <el-button v-else @click="closeDialog" type="primary">确 定</el-button>
      <!--<el-button v-if="activeName!='photograph'" type="primary" @click="submitParam"-->
      <!--v-text="!isView&&activeName==='msg'?'发送':'确 定'">确 定</el-button>-->
  </div>
  </el-dialog>
  <!-- dialog end -->
</template>
<script>
  import { BmlMarkerClusterer } from 'vue-baidu-map'
  import { deleteTextMsg, createTextMsg, getTextMsg, getRecordInfoById } from '@/api/vehicleMonitor/textmessagesAS'
  import { artificialHandle } from '@/api/alarm/baseApi'
  import { isEmpty } from '@/utils/validate'
  import { getToken } from '@/utils/auth'
  import _ from 'lodash'
  export default {
    components: {
      BmlMarkerClusterer
    },
    inject: ['reload'],
    props: {
      isDisable: {
        type: Boolean,
        default: true
      },
      isShow: {
        type: Boolean,
        default: false
      },
      recordId: {
        type: String,
        default: ''
      },
      dialogTitle: {
        type: String,
        default: '详情'
      },
      isView: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        defaultDataType: {
          title: '监控信息',
          type: 0
        },
        pageType: 0,
        isSocket: false,
        isHandle: false,
        websocket: null,
        sendTextType: '1', // 文本下发选怎框
        monRadioValue: '', // 监控radio的值
        eqValue: 'VEHICLE_QH_ADAS', // 设备的值
        cameraValue: '100', // 摄像机的值
        messageEqValue: 'VEHICLE_QH_ADAS', // 文本下发的设备的值
        textList: [],
        selectTempId: null,
        textSend: '',
        msgBox: false,
        msgData: { content: '' },
        monInfo: {
          isCode: '',
          mediaUrl: '',
          mediaType: '',
          evidenceId: '',
          alarmAddress: '',
          alarmStart: '',
          speed: '',
          plateNo: '陕A12345',
          id: '',
          handlerType: null,
          content: '',
          latitude: 39.915,
          longitude: 116.404
        }, // 监控信息
        photograph: require('@/assets/operate/photograph.png'),
        mapInit: { lng: 116.404, lat: 39.915 },
        activeName: 'monitor',
        monitorImg: require('@/assets/images/empty.png'),
        innerVisible: false,
        activeElecTab: 'electric',
        activePeripheralTab: 'tire',
        infoWindow: {
          show: false,
          height: 0,
          offset: 10
        },
        markerInfo: {
          platNo: '',
          personNum: 0,
          speed: '',
          time: '',
          street: ''
        },
        TyreData: [],
        realTimeData: {
          extremeData_: {
            maxTempIdx_: 0,
            maxTempPos_: 0,
            maxTempVal_: 0,
            maxVolIdx_: 0,
            maxVolPos_: 0,
            maxVolVal_: 0,
            memoizedHashCode: 0,
            memoizedIsInitialized: 0,
            memoizedSize: 0,
            minTempIdx_: 0,
            minTempPos_: 0,
            minTempVal_: 0,
            minVolIdx_: 0,
            minVolPos_: 0,
            minVolVal_: 0
          },
          bmsVolData_: [{
            batteryCnt_: '',
            batteryIdx_: '',
            bitField0_: '',
            current_: '',
            index_: '',
            memoizedHashCode: '',
            memoizedIsInitialized: '',
            memoizedSize: '',
            volList_: [],
            voltage_: ''
          }],
          bmsTempData_: [{
            bitField0_: '',
            index_: '',
            tempList_: []
          }],
          driveData_: [{
            busCurrent_: 0,
            busVoltage_: 0,
            ctrlTemp_: 0,
            driveSpeed_: 0,
            driveStatus_: 0,
            driveTemp_: 0,
            driveTorque_: 0,
            index_: 0,
            memoizedHashCode: 0,
            memoizedIsInitialized: 0,
            memoizedSize: 0
          }],
          userData_: {
            mapData: {

            }
          }
        }
      }
    },
    computed: {
      showAlarm() {
        return this.$store.getters.showAlarm
      },
      textarea: {
        get() {
          const arr = this.textList
          const id = this.selectTempId
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
              this.textSend = arr[i].content
              return arr[i].content
            }
          }
          return ''
        },
        set(val) {
          this.textSend = val
        }
      },
      iconButtons() {
        const arr = [
          {
            name: '监控信息',
            type: 0,
            selected: false,
            isClick: true,
            icon: require('@/assets/icon/icon-monitor.png'),
            iconSelected: require('@/assets/icon/icon-monitor-selected.png')
          },
          {
            name: '图片抓拍',
            type: 1,
            selected: false,
            isClick: true,
            icon: require('@/assets/icon/icon-snap.png'),
            iconSelected: require('@/assets/icon/icon-snap-selected.png')
          },
          {
            name: '文本下发',
            type: 2,
            selected: false,
            isClick: true,
            icon: require('@/assets/icon/icon-message.png'),
            iconSelected: require('@/assets/icon/icon-message-selected.png')
          },
          {
            name: '三电数据',
            type: 3,
            selected: false,
            isClick: true,
            icon: require('@/assets/icon/icon-power.png'),
            iconSelected: require('@/assets/icon/icon-power-selected.png')
          },
          {
            name: '外设数据',
            type: 4,
            selected: false,
            isClick: true,
            icon: require('@/assets/icon/icon-per.png'),
            iconSelected: require('@/assets/icon/icon-per-selected.png')
          }
        ]
        if (this.isHandle) {
          arr[1].isClick = false
          arr[2].isClick = false
        }
        const type = this.defaultDataType.type
        arr[type].selected = true
        return arr
      }
    },
    methods: {
      /**
       * 获取监控信息页面信息
       */
      async getRecordInfo() {
        if (isEmpty(this.recordId)) {
          return false
        }
        await this.getMsg().catch(function(e) {
          this.reload()
          console.log(e)
        })
        const result = await getRecordInfoById(this.recordId)
        if (result.code === 0) {
          this.monInfo = result.data
          this.realTimeData = JSON.parse(result.data.realTimeData)
          const TyreData = this.realTimeData.userData_.mapData.TyreData
          const arr = []
          const arr1 = []
          const arr2 = []
          _.forEach(TyreData, function(v, k) {
            if (_.startsWith(k, 'Tyre') && _.endsWith(k, 'Alarm')) {
              arr.push(v)
            } else if (_.startsWith(k, 'Tyre') && _.endsWith(k, 'Temp')) {
              arr1.push(v)
            } else if (_.startsWith(k, 'Tyre') && _.endsWith(k, 'Stress')) {
              arr2.push(v)
            }
          })
          const resArr = []
          _.forEach(arr, function(v, i) {
            resArr.push({ 'tyreAlarm': v, 'tyreTemp': arr1[i], 'tyreStress': arr2[i], 'index': i + 1 + '号轮胎' })
          })
          this.TyreData = resArr
          console.log(resArr)
          if (parseInt(result.data.handlerType) !== 0) {
            this.isHandle = true
          }
          if (this.isDisable) {
            this.isHandle = true
          }
          this.mapInit.lat = result.data.latitude
          this.mapInit.lng = result.data.longitude
          this.markerInfo.platNo = result.data.plateNo
          this.markerInfo.speed = result.data.speed
          this.markerInfo.time = result.data.alarmStart
          this.markerInfo.street = result.data.alarmAddress
        } else {
          this.$message.error(result.msg)
        }
      },
      async getMsg() {
        const res = await getTextMsg()
        this.textList = res.data.modleList
      },
      // 选择文本消息模板
      textChange(val) {
        this.textList.forEach(element => {
          if (element.id === val) {
            this.textSend = element.content
          }
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
          switch (obj.Command) {
            case '8801':
              vm.photograph = obj.Body.fileUrl
              vm.getRecordInfo()
              break
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
      subscribe() {
        const data = {
          Command: 8801,
          CommandType: 'command',
          Token: getToken(),
          Body: {
            data: {
              // vehicleId: this.recordId,
              vehicleIds: [this.monInfo.vehicleId],
              channelId: this.cameraValue,
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
      sendText() {
        const data = {
          Command: 8300,
          CommandType: 'command',
          Token: getToken(),
          Body: {
            data: {
              vehicleIds: [this.monInfo.vehicleId], // 车辆ID
              type: this.sendTextType,
              text: this.textSend,
              deviceType: this.messageEqValue
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

      camera() {
        if (this.isSocket) {
          this.subscribe()
        }
      },
      openMsgModel() {
        this.msgData.content = ''
        this.getMsg()
        this.msgBox = true
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

      /**
       * 切换处理页面
       * @param index
       */
      openPlan(index) {
        if (index === 1 || index === 2 && !this.isSocket) {
          this.initWebSocket()
        }
        if (!this.iconButtons[index].selected) {
          for (let i = 0; i < this.iconButtons.length; i++) {
            if (i === index) {
              if (this.iconButtons[i].isClick) {
                this.iconButtons[i].selected = true
                this.defaultDataType.title = this.iconButtons[i].name
                this.defaultDataType.type = this.iconButtons[i].type
                this.pageType = index
              }
            } else {
              this.iconButtons[i].selected = false
            }
          }
        }
      },
      handler({ BMap, map }) {
        // var the = this
        // const point = new BMap.Point(this.mapInit.lng, this.mapInit.lat)
        // const geocoder = new BMap.Geocoder()
        // this.zoom = 15;
        // geocoder.getLocation(point, rs => {
        //   the.markerInfo.province =
        //     rs.addressComponents.province +
        //     rs.addressComponents.city +
        //     rs.addressComponents.district
        //   the.markerInfo.street =
        //     rs.addressComponents.street +
        //     rs.addressComponents.streetNumber
        // })
      },
      async handleSubmit() {
        const ids = []
        ids.push(parseInt(this.monInfo.id))
        const params = {
          id: ids.join(),
          handlerType: this.monInfo.handlerType,
          content: this.monInfo.content
        }
        const result = await artificialHandle(params)
        if (result.code === 0) {
          this.$store.commit('SHOW_ALARM', false)
          this.$alert('预警处理成功', '提示', {
            callback: (action, instance) => {
              this.reload()
            }
          })
        } else {
          this.$message.error('系统异常')
        }
      },
      showInfoWindow() {
        this.infoWindow.show = true
      },
      // 关闭dialog
      closeDialog() {
        this.isHandle = false
        this.$emit('close')
      },
      // 点击确定如果是view则直接关闭即可 否则将参数传递回调给调用方
      async submitParam() {
        if (this.pageType === 0) {
          await this.handleSubmit()
        }
        if (this.pageType === 2) {
          await this.sendText()
        }
      },
      msgModel() {
        this.innerVisible = true
      },
      infoWindowClose(e) {
        this.infoWindow.show = false
      },
      infoWindowOpen(e) {
        this.infoWindow.show = true
      },
      destroyed() {
        this.websocket.close()
      },
      driveStatusFarmart(n) {
        switch (n) {
          case 1:
            return '耗电'
          case 2:
            return '发电'
          case 3:
            return '关闭'
          case 4:
            return '准备'
          case 254:
            return '异常'
          case 255:
            return '无效'
        }
      },
      handlerTypeformatter(n) {
        switch (n) {
          case 0:
            return '无'
          case 1:
            return '电话通知'
          case 2:
            return '建议停车'
          case 3:
            return '警告提醒'
          case 4:
            return '停车休息'
          case 5:
            return '语音下发'
          case 6:
            return '其他'
          default:
            return '出错啦'
        }
      }

    }
  }
</script>
<style scope>
  .map {
    width: 100%;
    height: 266px;
  }

  .viewDiv {
    height: 268px;
    width: 100%;
    border: 1px solid #696969;
  }

  .viewDivNoBorder {
    width: 100%;
  }

  .black-font {
    color: black;
    font-weight: bold;
  }

  .el-dialog__header {
    text-align: left;
  }

  .iconButton {
    margin-left: 10px;
    cursor: pointer;
  }

  .selectTempt .el-input__inner {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-bottom: 0px;
  }

  .textarea .el-textarea__inner {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    height: 80px;
  }

  .input-label {
    width: 60px;
    display: inline-block;
    text-align: right;
  }

  .input-suffix {
    margin-top: 15px;
    margin-bottom: 15px;
  }

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
