<template>
<!-- 区域查车 -->
  <div>
    <el-container class="real_time" style="min-height: calc(100vh - 95px);">
      <el-main style="padding:0">
        <b-map ref="BMAP"  @emitRectangle="getDrawInfo" @emitCircle="getDrawInfo" @emitPolygon="getDrawInfo" ></b-map>
      </el-main>
      <transition name="slide-fade">
      </transition>
      <!-- 实时查车dialog框 -->
      <el-dialog class="cinfoDialog" :close-on-click-modal="false" :modal-append-to-body='true' title="实时查车" :visible.sync="isShowDialog" width="1000px" >
        <region-dialog :list="list" @closeDia="closeDia" @refreshTab="sonRefresh"></region-dialog>
      </el-dialog>
      <!-- 历史查车 -->
      <el-dialog class="cinfoDialog" :close-on-click-modal="false" :modal-append-to-body='true' title="历史查车" :before-close="handleClose" :visible.sync="isShowHistoryDialog" width="1000px" >
        <history-vehicle-dialog ref='hisVehicle' :historyList="historyList" v-show="!vehicleShow"></history-vehicle-dialog>
        <history-query-dialog ref="historyquery"  @vehicleList="getVehicleList" v-show="vehicleShow" ></history-query-dialog>
        <div slot="footer" v-show="vehicleShow" class="dialog-footer" style="text-align:center">
            <el-button @click="addQuery">添加</el-button>
            <el-button type="primary" @click="queryHistory">查询</el-button>
        </div>
      </el-dialog>
      <report-footer></report-footer>
    </el-container>
  </div>

</template>
<script>
  import bMap from './map.vue'
  import regionDialog from './regionDialog.vue'
  import historyQueryDialog from './historyQueryDialog.vue'
  import historyVehicleDialog from './historyVehicleDialog.vue'
  import { formatDate } from '@/utils/date'
  import { getVehicles } from '@/api/vehicleMonitor/regional'
  export default {
    name: 'regionalZC',
    components: {
      bMap,
      regionDialog,
      historyQueryDialog,
      historyVehicleDialog
    },
    data() {
      return {
        isShowHistoryDialog: false, // 历史查车Dialog
        isShowDialog: false, // 实时查车Dialog
        vehicleShow: false, // 历史查车条件列表
        // hisdialog: false,
        multipleSelection: [], // 实时查车选择的行 （发送消息）
        list: [], // 实时查车回显数据
        historyList: [], // 历史查车回显数据
        total: 0,
        currentPage: 1,
        listQuery: {
          latitude: '', // 地图中心点纬度
          longitude: '', // 地图中心点经度
          areaType: '', // 区域类型 0 圆形，1矩形
          radius: '', // 圆形半径，矩形对角线的1/2
          areaLonlat: []// 矩形 四角点位坐标 --格式：经1|纬1，经2|纬2，经3|纬3，经4|纬4
        },
        firstData: {// 向历史查询条件中添加的参数
          startlongitude: '', // 开始经度
          startlatitude: '', // 开始纬度
          endlongitude: '', // 结束经度
          endlatitude: ''// 结束纬度
        }

      }
    },
    async mounted() {
      await this.handleSquare()
    },
    methods: {
      closeDia() {
        this.isShowDialog = false
      },
      handleSquare() { // 新增矩形
        this.$nextTick(() => {
          this.$refs.BMAP.flag = 1
          this.$refs.BMAP.ready(0)
          this.$refs.BMAP.isView = !this.isView
        })
      },
      handleClose() {
        this.$refs.historyquery.clearTable()
        // this.hisdialog = false
        this.isShowHistoryDialog = false
      },
      // 历史查车添加查询条件
      addQuery() {
        this.isShowHistoryDialog = false
        this.$refs.BMAP.openHistory()
      },
      // 获取子组件传过来的车辆列表
      getVehicleList(data) {
        this.vehicleShow = false
        this.historyList = data
      },
      queryHistory() {
        // 调用子组件方法发送后台查询列表数据
        this.$refs.historyquery.queryVehicleList()
      },
      // 实时区域选取完毕
      getDrawInfo(val) {
        console.log(val)
        if (!val.center) {
          let minLng = val.path[0].lng
          let maxLng = val.path[0].lng
          let minLat = val.path[0].lat
          let maxLat = val.path[0].lat
          val.path.forEach(item => {
            if (item.lng < minLng) {
              minLng = item.lng
            } else if (item.lng > maxLng) {
              maxLng = item.lng
            }
            if (item.lat < minLat) {
              minLat = item.lat
            } else if (item.lat > maxLat) {
              maxLat = item.lat
            }
          })
          val.center = { lng: (maxLng + minLng) / 2, lat: (maxLat + minLat) / 2 }
          // 中心点坐标经纬度小数点后最多六位
          val.center.lng = this.getCaption(val.center.lng)
          val.center.lat = this.getCaption(val.center.lat)
          console.log('处理过后的中心经纬度', val.center.lng, val.center.lat)
          const value = this.rectangleGetRadio(minLng, maxLat, val.center.lng, val.center.lat)
          const endvalue = this.getCaption(value)
          this.listQuery.radius = endvalue
          this.listQuery.latitude = val.center.lat
          this.listQuery.longitude = val.center.lng
          if (val.type === '3') { // 多边形
            val.path.push(val.path[0])
            const arr = []
            val.path.forEach(item => {
              arr.push(item.lng + '|' + item.lat)
            })
          } else { // 矩形
            const arr = []
            val.path.forEach(item => {
              const lng = this.getCaption(item.lng)
              const lat = this.getCaption(item.lat)
              arr.push(lng + '|' + lat)
            })
            this.listQuery.areaLonlat = arr.join()
            this.listQuery.areaType = 1
            if (val.flag === 1) {
              // 历史查车
              this.isShowHistoryDialog = true
              this.vehicleShow = true
              // this.hisdialog = true
              this.firstData.startlongitude = minLng
              this.firstData.startlatitude = maxLat
              this.firstData.endlongitude = maxLng
              this.firstData.endlatitude = minLat
              this.$nextTick(() => {
                this.$refs.historyquery.getFirstData(this.firstData)
              })
            }
            if (val.flag === 0) { // 实时查车
              this.getList()
            }
          }
        } else { // 圆形区域
          console.log(val.radius)
        }

        /**
         * 此处可以请求后台 发送两个经纬度
         * 下面的可以删除
         * 左上角经纬度为 minLng + maxLat
         * 右下角经纬度为 maxLng + minLat
         * 请求获得后台数据后调用openDialog()
         */
      },
      // 截取小数点后位数 规定小数点后最多六位
      getCaption(num) {
        var obj = num.toString()
        var index = obj.indexOf('\.')
        var leftnum = obj.substring(0, index)
        obj = obj.substring(index + 1, obj.length)
        if (obj.length > 6) {
          obj = obj.substring(0, 6)
        }
        obj = leftnum + '.' + obj
        return obj
      },
      /**
       * 画好矩形请求后台返回在此范围车辆
       */
      async getList() { // 分页获取车辆列表
        this.openDialog() // data为返回结果
        this.listLoading = true
        console.log(this.listQuery)
        const result = await getVehicles(this.listQuery)// 这里传递查询参数
        console.log('------------')
        console.log(result)
        if (result === undefined) {
          this.listLoading = false
        } else {
          this.list = result.data
          this.listLoading = false
        }
      },
      async sonRefresh() {
        const result = await getVehicles(this.listQuery)// 这里传递查询参数
        this.list = result.data
        console.log(result)
      },
      dialogClose() { // 关闭车辆信息dialog
        this.isShowDialog = false
      },
      openDialog() { // 打开实时车辆列表dialog
        this.isShowDialog = true
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      // handleSizeChange(val) { // 每页显示条数变化
      //   this.listQuery.limit = val
      //   this.getList()
      // },
      // handleCurrentChange(val) { // 页数变化
      //   this.listQuery.page = val
      //   this.getList()
      // },
      rectangleGetRadio(ltLng, ltLat, cenLng, cenLat) {
        const lat1 = ltLat * Math.PI / 180.00
        const lat2 = cenLat * Math.PI / 180.00
        const latva = lat1 - lat2 // 两点纬度差
        const lngva = ltLng * Math.PI / 180.00 - cenLng * Math.PI / 180.00 // 两点经度差
        const s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latva / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(lngva / 2), 2)))
        const m = s * 6378137.0// 弧长乘地球半径（半径为米）
        const endvalue = Math.round(m * 10000) / 10000
        return endvalue
      }

    },
    filters: {
      formatDate(time) {
        const date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    }
  }

</script>
<style >
  .cinfoDialog {
    margin-top: 20%;
    margin-left: auto;
  }
  .el-dialog__body{
    padding:10px 20px
  }
.el-dialog__header{
    background: #3E63AB;
    color: white
}
.el-dialog__title{
    color: white;
}
.el-dialog__headerbtn .el-dialog__close{
  color: #fff
}
</style>
