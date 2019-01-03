<template>
  <el-container class="real_time" style="min-height: calc(100vh - 0px);">
    <el-main style="padding:0">
      <baidu-map @ready="handler" :center="markerPoint" :zoom="18" :scroll-wheel-zoom="true" style="max-height:1000px;height: 100%;width:100%;">
        <bm-marker v-if="isShow" @click="openDialog" :position="vehicleAdd" :icon="{ url: require('../../assets/realtime/carOnline.png'), size: {width: 50, height: 50 }}">
          <bm-label :content="vehicleInfo.vNo" :offset="labelOffset" :zIndex="10" :labelStyle="{ color: 'black', fontSize : '12px', padding:'3px 5px', border: 'none', borderRadius:'10px'}"/>
        </bm-marker>
        <bm-polyline @lineupdate="updatePolylinePath" :path="polylinePath" stroke-color="blue" :stroke-opacity="0.8" :stroke-weight="5"></bm-polyline>
      </baidu-map>
    </el-main>
    <!-- 车辆信息弹出框 -->
    <transition name="slide-fade">
      <vehicle-dialog :address="address" :street="street" :vehicleInfo="vehicleInfo" v-show="isShowDialog" @dialogClose="dialogClose"></vehicle-dialog>
    </transition>
  </el-container>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-10-15 14:37:24
import carOnline from '../../assets/realtime/carOnline.png'
// import vehicleDialog from './vehicleDialog'
import vehicleDialog from '../vehicle/realtime/vehicleDialog'
import { getToken } from '@/utils/auth'
import BMap from 'vue-baidu-map'
export default {
  name: 'specialMonitor',
  components: { vehicleDialog },
  data() {
    return {
      address: '',
      street: '',
      isShowDialog: false,
      markerPoint: {},
      vehicleAdd: {},
      zoom: 10,
      labelOffset: { width: -10, height: -22 },
      icon: {
        url: carOnline,
        size: { width: 50, height: 50 },
        opts: { anchor: { width: 20, height: 52 }}
      },
      polylinePath: [],
      isShow: true,
      websocket: null,
      vehicleInfo: {}
    }
  },
  mounted() {
    this.vehicleInfo = JSON.parse(localStorage.getItem('vehicleInfo'))
    console.log('车辆信息', this.vehicleInfo)
    document.title = this.vehicleInfo.vNo + '重点监控'
    this.markerPoint = { lng: this.vehicleInfo.currInfo.PosData.Longitude, lat: this.vehicleInfo.currInfo.PosData.Latitude }
    this.vehicleAdd = { lng: this.vehicleInfo.currInfo.PosData.Longitude, lat: this.vehicleInfo.currInfo.PosData.Latitude }
    this.polylinePath.push(this.markerPoint)
    this.initWebSocket()
  },
  created() {
    this.vehicleInfo = JSON.parse(localStorage.getItem('vehicleInfo'))
    document.title = this.vehicleInfo.vNo + '重点监控'
  },
  destroyed() {
    this.websocket.close()
  },
  methods: {
    initWebSocket() {
      const vm = this
      vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
      vm.websocket.onopen = function() {
        vm.subscribe(vm.vehicleInfo.vId + '')
      }
      vm.websocket.onmessage = function(evt) {
        const obj = JSON.parse(evt.data)
        console.log(obj)
        if (obj.Command === '43') {
          const point = new BMap.Point(obj.currInfo.PosData.Longitude, obj.currInfo.PosData.Latitude)
          new BMap.Geocoder().getLocation(point, function(rs) {
            obj.address = rs.addressComponents.province + rs.addressComponents.city
            obj.street = rs.addressComponents.district + rs.addressComponents.street + rs.addressComponents.streetNumber
          })
          vm.vehicleInfo = obj
          const obj1 = { lng: obj.currInfo.PosData.Longitude, lat: obj.currInfo.PosData.Latitude }
          vm.vehicleAdd = obj1
          vm.polylinePath.push(obj1)
        }
      }
      vm.websocket.onerror = function() {
        vm.initWebSocket()
      }
    },
    subscribe(id) { // 发送websocket消息，获取车辆或者机构下车辆经纬度信息
      const data = {
        Command: 1,
        CommandType: 'track',
        token: getToken('Admin-Token'),
        Body: {
          isdept: 1,
          id: id
        }
      }
      if (this.websocket.readyState === 1) {
        this.websocket.send(JSON.stringify(data))
      } else {
        console.log('websocket信息发送失败')
      }
    },
    handler({ BMap, bmap }) {
      console.log('地图加载完成')
    },
    dialogClose() {
      this.isShowDialog = false
    },
    updatePolylinePath(e) {
      this.polylinePath = e.target.getPath()
    },
    // 打开车辆信息dialog
    openDialog() {
      console.log(this.vehicleInfo)
      this.address = this.vehicleInfo.address
      this.street = this.vehicleInfo.street
      this.isShowDialog = true
    },
    // 车辆信息功能按钮改变
    dataTypeChange(val) {},
    // 拍照
    capture(form) {
      this.imgSrc = require('../../assets/realtime/1.jpeg')
    },
    // 取消下发
    cancelSend() {
      console.log('取消下发')
    },
    // 确认发送
    sendOut(form) {
      console.log(form)
    },
    // 选择文本消息模板
    textChange(val) {
      this.textSend.textDes = val
    },
    // 轨迹回放
    // traceReview() {
    //   this.isShow = false
    //   console.log(this.isShow)
    // },
    // 预警信息table行点击事件
    curDetail(row) {
      console.log(row)
    }
  }
}
</script>

<style>
.map_height{
  height: calc(100% - 50px);
}
  .real_time .el-dialog__body .el-radio-button__inner {
    padding: 10px 5px !important;
  }
  .real_time .el-dialog__body .dialog_content .el-radio-button__inner {
    padding: 10px 0 !important;
    border: none;
    border-radius: 0
  }
  .real_time .el-dialog__body {
    text-align: center;
    min-height: 500px;
  }
  .bottom_info {
    z-index: 2000;
    bottom: 0;
    width: 100%;
    background-color: #efefef;
    position: absolute;
    padding: 8px;
    font-size: 14px;
    text-align: center;
    color: #666666
  }
  .real_time .el-dialog__wrapper {
    left: 75%;
  }
  .real_time .el-dialog {
    margin-top: 10vh !important;
  }
  .real_time .el-dialog__header {
    padding: 10px 10px;
    background-color: #488aff;
  }
  .real_time .el-dialog__title {
    color: #ffffff;
  }
  .real_time .el-dialog__close {
    color: #ffffff !important;
  }
  .real_time .el-dialog__body {
    padding: 5px;
  }
  .real_time .el-dialog__headerbtn {
    top: 10px;
    right: 8px;
  }
  .real_time .dialog_content {
    text-align: left;
    margin: 10px 0 0 0;
    padding: 2px;
  }
  .leftStyle {
    width: 60%;
    float: left;
    color: #9a9a9a;
    text-align: right
  }
  .rightStyle {
    width: 40%;
    float: right;
    padding-left: 5px;
  }
  .infoLeft {
    width: 35%;
    float: left;
    color: #9a9a9a;
  }
  .infoRight {
    width: 65%;
    float: right
  }
  .monitorLeft {
    width: 25%;
    float: left;
    color: #9a9a9a
  }
  .monitorRight {
    width: 75%;
    float: right
  }
  .photo .el-form-item {
    margin-bottom: 3px;
  }
</style>
