<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label">监控信息</span>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">操&#12288;作：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">
              <el-tooltip content="重点跟踪" placement="top">
                <el-button @click="newWindow" type="text"><i class="el-icon-location-outline"></i></el-button>
              </el-tooltip>
              <el-tooltip content="轨迹回放" placement="top">
                <el-button @click="traceReview" type="text"><i class="el-icon-share"></i></el-button>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">车牌号：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple">{{carDetail.plateNo}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">状&#12288;态：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.statue}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple-light grid-content-left">电&#12288;量：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple">{{carDetail.volume}}%</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">速&#12288;度：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.speed}}km/h</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">时&#12288;间：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.time}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">地&#12288;址：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.addr}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="车辆信息">
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">车&#12288;牌&#12288;号：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.plateNo}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple-light grid-content-left">所 属 机 构：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple">{{carDetail.deptName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">V&nbsp;I&nbsp;N&#12288; &nbsp;号：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.vin}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple grid-content-left">设备ID&nbsp;(主)：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.firstDeviceId}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple-light grid-content-left">设备ID&nbsp;(副)：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple">{{carDetail.secondDeviceId}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="6" :xl="1">
            <div class="grid-content bg-purple-light grid-content-left">车 辆 品 牌：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple">{{carDetail.vehicleBrand}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="司机信息">
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="8" :xl="1">
            <div class="grid-content bg-purple">司 机 姓 名：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.driverName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="8" :xl="1">
            <div class="grid-content bg-purple-light">所 属 机 构：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple">{{carDetail.deptName}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="8" :xl="1">
            <div class="grid-content bg-purple">工&#12288;&#12288;&#8194;&nbsp;号：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.jobNumber}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="8" :xl="1">
            <div class="grid-content bg-purple-light">驾驶证/身份证号：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple">{{carDetail.IDNumber}}</div>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="8" :sm="6" :md="4" :lg="8" :xl="1">
            <div class="grid-content bg-purple">准 驾 类 型：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.driverType}}</div>
          </el-col>
          <el-col :xs="8" :sm="6" :md="4" :lg="8" :xl="1">
            <div class="grid-content bg-purple">联 系 电 话：</div>
          </el-col>
          <el-col :xs="4" :sm="6" :md="8" :lg="14" :xl="11">
            <div class="grid-content bg-purple-light">{{carDetail.phone}}</div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  export default {
    props: {
      vehicleInfo: Object
    },
    data() {
      return {
        carDetail: {
          address: '',
          deptName: '', // 部门名称
          driverType: '', // 准驾类型1-A1  2-A2  3-B1  4-B2  5-C1  6-C2
          addr: '', // 详细地址
          firstDeviceId: '', // 主设备ID
          time: '', // 时间
          plateNo: '', // 车牌号
          vehicleBrand: '', // 车辆品牌
          speed: '', // 速度
          volume: '', // 电量（百分比值）
          secondDeviceId: '', // 副设备ID
          phone: '', // 联系电话
          jobNumber: '', // 工号
          vin: '', // vin
          driverName: '', // 驾驶员姓名
          tradeType: '', // 行业类型
          statue: '', // 车辆状态
          IDNumber: '' // 驾驶证号/身份证号
        },
        curPath: '',
        //    this.vehicleObj.currInfo.PosData.Latitude = val.data.latitude
        //   this.vehicleObj.currInfo.PosData.Longitude = val.data.longitude
        //   this.vehicleObj.address = val.data.addr
        // vehicleObj: {
        //   address: '',
        //   street: '',
        //   currInfo: {
        //     PosData: {
        //       Latitude: '',
        //       Longitude: ''
        //     }
        //   }
        // },
        Latitude: '',
        Longitude: '',
        address: ''
      }
    },
    mounted() {
      // this.subHref()
    },
    methods: {
      getInfoDeatil(val, vin) {
        console.log('车辆详情信息')
        this.clearData()
        this.carDetail = val.data
        this.carDetail.vin = vin.vin
        this.Latitude = vin.latitude
        this.Longitude = vin.longitude
        this.address = vin.addr
        console.log(this.carDetail)
      },
      clearData() {
        this.carDetail.deptName = ''
        this.carDetail.driverType = ''
        this.carDetail.addr = ''
        this.carDetail.firstDeviceId = ''
        this.carDetail.time = ''
        this.carDetail.plateNo = ''
        this.carDetail.vehicleBrand = ''
        this.carDetail.speed = ''
        this.carDetail.volume = ''
        this.carDetail.secondDeviceId = ''
        this.carDetail.phone = ''
        this.carDetail.jobNumber = ''
        this.carDetail.vin = ''
        this.carDetail.driverName = ''
        this.carDetail.tradeType = ''
        this.carDetail.statue = ''
        this.carDetail.IDNumber = ''
      },
      // 重点跟踪
      newWindow() {
        //   console.log('中那个店跟踪')
        //   console.log(this.vehicleObj)
        //   console.log(JSON.stringify(this.vehicleObj))
        //   localStorage.setItem('vehicleInfo', JSON.stringify(this.vehicleObj))
        //   window.open(this.curPath + '#/specialMonitor', '_blank')
        this.$emit('newWindow')
      },
      // 轨迹回放
      traceReview() {
        this.$emit('traceReview')
      },
      subHref() {
        const curHref = location.href
        const arr = curHref.split('#')
        this.curPath = arr[0]
        console.log('*************************' + this.curPath)
      }
    },
    watch: {
      // vehicleInfo(vehicle) {
      //   console.log(vehicle)
      //   this.vehicleObj = vehicle
      //   this.vehicleObj.vNo = vehicle.plateNo
      //   this.vehicleObj.vId = vehicle.vId
      //   const currInfo = {}
      //   this.vehicleObj.currInfo = currInfo
      //   const PosData = {
      //     Latitude: '',
      //     Longitude: ''
      //   }
      //   this.vehicleObj.currInfo.PosData = PosData
      //   this.vehicleObj.currInfo.PosData.Latitude = this.Latitude
      //   this.vehicleObj.currInfo.PosData.Longitude = this.Longitude
      //   this.vehicleObj.address = this.address
      //   console.log('监听中vehicleObj' + this.vehicleObj)
      // }
    }
  }

</script>
<style>
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .grid-content-left {
    /* text-align-last:justify; */
    text-align: left;
    /* text-justify:distribute-all-lines;
    width: 150px; */
  }

</style>
