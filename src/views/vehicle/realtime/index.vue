<template>
  <div>
    <transition name="fade">
      <div class="left_aside" v-show="isShowTable">
        <!-- <el-radio-group v-model="status" style="margin-bottom:5px;" @change="radioChange">
          <el-radio-button label="all">
            <span>全部({{asideObj.allVehicle}})</span>
          </el-radio-button>
          <el-radio-button label="online">
            <span>在线({{asideObj.onlineVehicle}})</span>
          </el-radio-button>
          <el-radio-button label="offline">
            <span>离线({{asideObj.offlineVehicle}})</span>
          </el-radio-button>
        </el-radio-group> -->
        <div style="height:50px;width:100%;font-size:12px;padding-top:5px;padding-bottom:5px">
          <div class="left_top_veh" v-on:click="monitorChange(-1)">
            <div>
              <span class="veh_count" :class="activeStatus==-1? 'monitor_all_checked' : 'monitor_all_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==-1? 'font_active' : 'font_normal'">全部({{asideObj.allVehicle}})</span>
            </div>
          </div>
          <div class="left_top_veh" @click="monitorChange(1)">
            <div>
              <span class="veh_count" :class="activeStatus==1? 'monitor_online_checked' : 'monitor_online_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==1? 'font_active' : 'font_normal'">在线({{asideObj.onlineVehicle}})</span>
            </div>
          </div>
          <div class="left_top_veh" @click="monitorChange(0)">
            <div>
              <span class="veh_count" :class="activeStatus==0? 'monitor_offline_checked' : 'monitor_offline_normal'"></span>
            </div>
            <div>
              <span :class="activeStatus==0? 'font_active' : 'font_normal'">离线({{asideObj.offlineVehicle}})</span>
            </div>
          </div>
        </div>
        <el-popover trigger="manual" width="225" placement="bottom" v-model="resultPop">
          <div v-for="result in resultList" :key="result.vin" @click="selectCurVehicle(result)" class="search_result_item">
            <div style="padding:2px 0;">
              <div style="float:left">车牌号</div>
              <div style="float:right">{{result.plateNo}}</div>
              <br style="clear:both">
            </div>
            <div style="padding:2px 0;">
              <div style="float:left">VIN号</div>
              <div style="float:right">{{result.vin}}</div>
              <br style="clear:both">
            </div>
            <div style="padding:2px 0;">
              <div style="float:left">所属机构</div>
              <div style="float:right">{{result.deptName}}</div>
              <br style="clear:both">
            </div>
            <div style="padding:2px 0;" :class="result.activeStatus === '1' ? 'online' : 'offline'">
              <div style="float:left">车辆状态</div>
              <div style="float:right">{{result.activeStatus === '1' ? '在线' : '离线'}}</div>
              <br style="clear:both">
            </div>
          </div>
          <!-- <el-button v-show="loadmoreBtn" @click="loadmore" style="width:100%;text-align:center" type="text">查看更多</el-button> -->
          <el-input @focus="searchFocus" @blur="searchBlur" slot="reference" v-model.trim="queryStr" placeholder="请输入车牌号" prefix-icon="el-icon-search" size="mini"></el-input>
        </el-popover>
        <el-tree ref="tree" @node-click="handleNodeClick" @node-expand="handleNodeExpand" :default-checked-keys="checkedList" :default-expanded-keys="checkedList" :auto-expand-parent="true" :render-content="renderContent" @check="getCurrentKey" :show-checkbox="showCheckbox" :highlight-current="true" :data="treeData" :props="defaultProps" node-key="id" :expand-on-click-node="false" style="margin-top:5px;font-size:12px"></el-tree>
      </div>
    </transition>
    <!-- <el-button @click="tableBtnClick" type="primary" :class="tableBtnRealtime" size="mini"></el-button> -->
    <span :class="tableBtnRealtime" @click="tableBtnClick"></span>
    <el-container class="real_time" style="min-height: calc(100vh - 95px);">
      <el-main style="padding:0">
        <baidu-map center="泉州" @ready="handler" :zoom="12" :scroll-wheel-zoom="true" class="map">
          <bml-marker-clusterer :averageCenter="true">
            <bm-marker v-for="vehicle in vehicleList" :key="vehicle.vId" @click="openDialog(vehicle)" :position="{lng: vehicle.currInfo.PosData.Longitude, lat: vehicle.currInfo.PosData.Latitude}" :icon="{ url: require('../../../assets/realtime/carOnline.png'), size: {width: 50, height: 50 }}">
              <bm-label :content="vehicle.vNo" :offset="labelOffset" :zIndex="10" :labelStyle="{ color: 'black', fontSize : '12px', padding:'3px 5px', border: 'none', borderRadius:'10px'}"/>
            </bm-marker>
          </bml-marker-clusterer>
        </baidu-map>
      </el-main>
    <!-- 车辆信息弹出框 -->
      <transition name="slide-fade">
        <vehicle-dialog :class="infoDialog" @traceReview="traceReview" :vehicleInfo="vehicleInfo" :address="address" :street="street" v-if="isShowDialog" @dialogClose="dialogClose"></vehicle-dialog>
      </transition>
    </el-container>
    <footershow></footershow>
  </div>
</template>

<script>
  /* eslint-disable */
  // @Author: outman_qiaopeng  Date: 2018-10-15 14:37:24
  const debounce = (function() {
    let timer = 0
    return function(func, delay) {
      clearTimeout(timer)
      timer = setTimeout(func, delay)
    }
  })()
  import footershow from  './footershow'
  import { BmlMarkerClusterer } from 'vue-baidu-map'
  import vehicleDialog from './vehicleDialog'
  import { getBaseDept, getVehicleList } from '@/api/vehicleMonitor/realtime'
  import { detailVehicle } from '@/api/base/vehicle'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'realtime',
    components: { BmlMarkerClusterer, vehicleDialog ,footershow},
    data() {
      return {
        activeStatus:-1,
        tableBtnRealtime: 'tableBtnRealtime',
        infoDialog: 'infoDialog',
        isShowTable: true,
        showCheckbox: true,
        loadmoreBtn: false,
        queryStr: '',
        deptTreeQuery: { id: '' },
        tyreData: [],
        fireData: [],
        bmsData: [],
        extremeData: {},
        driveDataList: [],
        vehicleInfo: {},
        address: '',
        street: '',
        resultPop: false,
        resultCard: false,
        status: 'all',
        isShowDialog: false,
        zoom: 10,
        labelOffset: { width: -10, height: -22 },
        treeData: [],
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        asideObj: {
          allVehicle:0,
          onlineVehicle:0,
          offlineVehicle:0
        },
        websocket: null,
        vehicleList: [],
        resultList: [],
        checkedList: [],
        vehicleId: '',
        topDeptId: ''
      }
    },
    created() {
      this.initWebSocket()
    },
    destroyed() {
      this.websocket.close()
    },
    activated () {
      const vm = this
      const params = this.$route.params
      if(params.vehicleId != undefined){
        this.checkedList = []
        setTimeout(function(){
          vm.selectCurVehicle(params)
        },300)
      }
    },
    mounted() {
      this.getBaseTree()
    },
    watch: {
      queryStr(queryStr) {
        if (this.queryStr.length < 4) {
          return
        }
        debounce(() => {
          this.searchList()
        }, 100)
      },
      status(status) {
        this.$refs.tree.filter(status)
      },
      isShowTable() {
        if (this.isShowTable) {
          this.infoDialog = 'infoDialogOther'
          this.tableBtnRealtime = 'tableBtnRealtime'
        } else {
          this.infoDialog = 'infoDialog'
          this.tableBtnRealtime = 'tableBtnRealtimeOther'
        }
      }
    },
    methods: {
      monitorChange(status){
        this.activeStatus = status
        this.getBaseTree()
        vm.subscribeTop(24, vm.topDeptId.substring(2))
      },
      getBaseTree() {
        this.deptTreeQuery = { id: '', activeStatus: this.activeStatus==-1?'':this.activeStatus }
        getBaseDept(this.deptTreeQuery).then(res => { // 加载机构树顶级节点
          if (res.code === 0) {
            if (this.websocket.readyState === 1) {
              this.subscribeTop(24, res.data[0].id.substring(2))
              this.subscribeTop(5, res.data[0].id.substring(2))
              this.subscribeExpend(4, 'online', res.data[0].id.substring(2))
            }
            this.topDeptId = res.data[0].id
            this.treeData = res.data
            console.log(this.treeData)
            this.$set(this.treeData[0], 'allVehicle', res.data.allCount)
            this.$set(this.treeData[0], 'onlineVehicle', res.data.onlineVehicle)
            this.$set(this.treeData[0], 'offlineVehicle', res.data.offlineVehicle)
            this.$set(this.treeData[0], 'children', [])
            this.treeData[0].children.push({})
          } else {
            this.$message({ message: res.msg, type: 'error' })
          }
        })
      },
      searchFocus() {
        if (this.queryStr.length > 4) {
          this.searchList()
        }
      },
      searchBlur() {
        this.resultPop = false
      },
      tableBtnClick() {
        this.isShowTable = !this.isShowTable
        if (this.isShowTable) {
          this.infoDialog = 'infoDialogOther'
          this.tableBtnRealtime = 'tableBtnRealtime'
        } else {
          this.infoDialog = 'infoDialog'
          this.tableBtnRealtime = 'tableBtnRealtimeOther'
        }
      },
      traceReview() { // 跳转轨迹回放
        this.$router.push({name: 'replyingHRD', params: { vId: this.vehicleInfo.vId, vNo: this.vehicleInfo.vNo }})
      },
      searchList() { // 搜索框查询车辆列表
        const queryObj = { text: this.queryStr, activeStatus: this.activeStatus==-1?'':this.activeStatus }
        getVehicleList(queryObj).then(res => {
          console.log(res)
          if (res.code === 0) {
            this.resultList = res.data
            if (res.data.length > 0) {
              this.resultPop = true
              // this.loadmoreBtn = true
            } else {
              this.resultPop = false
              // this.$message.info('暂无数据')
              // this.loadmoreBtn = false
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      getDeptVehicleCount(id) { // 企业车辆总数和在线数统计
        const data = {
          Command: 24,
          CommandType: 'online',
          Token: getToken(),
          Body: {
            UnitId: id
          }
        }
        console.log('-------企业车辆总数和在线数统计 发送WS请求------' + JSON.stringify(data))
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
        } else {
          this.$message.error('机构车辆数量获取失败，请稍候重试!')
        }
      },
      handleQuery() { // 查询框获得焦点
        this.resultPop = false
      },
      // loadmore() { // 加载更多
      //   this.resultCard = true
      // },
      // radioChange() { // 条件查询
      //   switch (this.status) {
      //     case 'all':
      //       this.getBaseTree('all')
      //       break
      //     case 'online':
      //       this.getBaseTree('online')
      //       break
      //     case 'offline':
      //       this.getBaseTree('offline')
      //       break
      //     default:
      //       break
      //   }
      // },
      async selectCurVehicle(vehicle) { // 订阅选择查到的车辆
        if (this.checkedList.indexOf('3-' + vehicle.vehicleId) > -1) {
          this.$message.info('当前车辆已经订阅位置信息')
        } else {
          console.log('调用赋值方法')
          this.checkedList.push('3-' + vehicle.vehicleId)
         this.$refs.tree.setCheckedKeys(this.checkedList)
        }
        await this.subscribe(1, 1, vehicle.vehicleId)
        this.resultPop = false
      },
      contains(arrays, obj) { // 返回数组包含指定元素的下标
        var i = arrays.length
        while (i--) {
          if (arrays[i] === obj) {
            return i
          }
        }
        return false
      },
     initWebSocket() { // 初始化websocket
        const vm = this
        vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
        // vm.websocket = new WebSocket('ws://192.168.5.137:6947')
        vm.websocket.onopen = function() {
          console.log('websocket连接成功')
          if (vm.topDeptId && vm.topDeptId !== '') {
            vm.subscribeTop(5, vm.topDeptId.substring(2))
            vm.subscribeTop(24, vm.topDeptId.substring(2))
            vm.subscribeExpend(4, 'online', vm.topDeptId.substring(2))
          }
        }
        vm.websocket.onmessage = function(evt) {
          const obj = JSON.parse(evt.data)
          //console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
          switch (obj.Command) {
            case '43': // 订阅->轨迹数据
              const point = new BMap.Point(obj.currInfo.PosData.Longitude, obj.currInfo.PosData.Latitude)
              new BMap.Geocoder().getLocation(point, function(rs) {
                obj.address = rs.addressComponents.province + rs.addressComponents.city
                obj.street = rs.addressComponents.district + rs.addressComponents.street + rs.addressComponents.streetNumber
              })
              if (vm.vehicleList.length === 0) {
                vm.vehicleList.push(obj)
              } else {
                const arr = []
                for (let i = 0; i < vm.vehicleList.length; i++) {
                  arr.push(vm.vehicleList[i].vId)
                }
                if (arr.indexOf(obj.vId) > -1) {
                  const j = vm.contains(arr, obj.vId)
                  vm.vehicleList[j] = obj
                } else {
                  vm.vehicleList.push(obj)
                }
                if (vm.vehicleId && vm.vehicleId !== '') {
                  if (vm.vehicleId === obj.vId) {
                    vm.vehicleInfo = obj
                  }
                }
              }
              break
            case '27': // 实时接收已展开过的节点下车辆上下线通知
              console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))

              const offlineVeh = obj.Body.Offline
              const onlineVeh = obj.Body.Online

              offlineVeh.forEach(vid => {
                vm.setDataTotree(vm.treeData, vid+'', {online:'0'})
              });

              onlineVeh.forEach(vid => {
                vm.setDataTotree(vm.treeData, vid+'', {online:'1'})
              })

              /*
              const keys = []
              const values = []
              for (const key in obj.data) {
                if (obj.data.hasOwnProperty(key)) {
                  keys.push(key)
                  values.push(obj.data[key])
                }
              }
              for (let i = 0; i < keys.length; i++) {
                const obj2 = { online: values[i] }
                //console.log('update online status:'+keys[i]+','+JSON.stringify(values[i]))
                vm.setDataTotree(vm.treeData, keys[i], obj2)
              }
              */
              break
            case '33': // 企业车辆总数和在线数统计
              console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
              vm.asideObj = obj.Body
              vm.treeData[0].onlineVehicle = obj.Body.onlineVehicle
              vm.treeData[0].allVehicle = obj.Body.allVehicle
              break
            case '32': // 获取企业所有节点车辆在线数
              console.log('['+new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds()+'] receive command('+obj.Command+') message:' + JSON.stringify(obj))
              const nodeArr = []
              const data = obj.Body
              for (const key in data) {
                if (data.hasOwnProperty(key)) {
                  const obj1 = { id: key, count: data[key] }
                  nodeArr.push(obj1)
                }
              }
              //更新下级机构的车辆总数
              for (let i = 0; i < nodeArr.length; i++) {
                vm.setDataTotree(vm.treeData[0].children, nodeArr[i].id, nodeArr[i].count)
              }
              break
            default:
              break
          }
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      setDataTotree(treeData, pId, obj) { // 机构树填值
        if (treeData) {
          for (let i = 0; i < treeData.length; i++) {
            const td = treeData[i]
            if (td.type !== '3') {
              //console.log('---->tree data:'+JSON.stringify(td)+',obj data:'+JSON.stringify(obj))
              if (td.id) {
                if (td.id.substring(2) === pId && obj.hasOwnProperty('allVehicle') && obj.hasOwnProperty('onlineVehicle')) {
                  //console.log('update tree node:'+ pId +','+JSON.stringify(obj))
                  treeData[i].allVehicle = obj.allVehicle||0
                  treeData[i].onlineVehicle = obj.onlineVehicle||0
                  treeData[i].offlineVehicle = obj.offlineVehicle||0
                  return
                } else {
                  this.setDataTotree(treeData[i].children, pId, obj)
                }
              }
            } else {
              if (td.id.substring(2) === pId) {
                treeData[i].online = obj.online
              } else {
                this.setDataTotree(treeData[i].children, pId, obj)
              }
            }
          }
        }
      },
      subscribe(command, isdept, id) { // 发送websocket消息，获取车辆或者机构下车辆经纬度信息
        const data = {
          Command: command,
          CommandType: 'track',
          Token: getToken(),
          Body: {
            isdept: isdept,
            id: id
          }
        }
        // console.log('ws请求参数：', data)
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket信息发送失败')
        }
      },
      renderContent(h, { node, data, store }) { // 渲染tree
        if (data.type === '1') {
          return (
            <span style="height:18px;line-height:18px">
              <i class='tree_dept_icon'></i>
              <span>{node.label}</span>
              <span>({data.onlineVehicle}/{data.allVehicle})</span>
            </span>
          )
        } else if (data.type === '3') {
          if (data.online === '1') {
            return (
              <span class="online">
                <i class='tree_veh_online_icon'></i>
                <span>{node.label}</span>
              </span>
            )
          } else {
            return (
              <span class="offline">
                <i class='tree_veh_offline_icon'></i>
                <span>{node.label}</span>
              </span>
            )
          }
        } else if (data.type === '2') {
          return (
            <span>
              <i class='tree_line_icon'></i>
              <span>{node.label}</span>
              <span>({data.onlineVehicle}/{data.allVehicle})</span>
            </span>
          )
        }
        // } else {
        //   this.showCheckbox = false
        //   if (data.type === '1') {
        //     return (
        //       <span>
        //         <i class='iconfont icon-my-icon-company'></i>
        //         <span>{node.label}</span>
        //         <span>({data.onlineVehicle})</span>
        //       </span>
        //     )
        //   } else if (data.type === '3') {
        //     if (data.online === '1') {
        //       return (
        //         <span class="online">
        //           <i class='iconfont icon-my-icon-car-offline'></i>
        //           <span>{node.label}</span>
        //         </span>
        //       )
        //     }
        //   } else {
        //     return (
        //       <span>
        //         <i class='iconfont icon-my-icon-line'></i>
        //         <span>{node.label}</span>
        //         <span>({data.onlineVehicle})</span>
        //       </span>
        //     )
        //   }
        // }
      },
      subscribeExpend(command, commandType, deptId) { // 实时接收已展开过的节点下车辆上下线通知
        const data = {
          Command: command,
          CommandType: commandType,
          Token: getToken(),
          Body: {
            deptId: deptId
          }
        }
        console.log('实时接收已展开过的节点下车辆上下线通知请求参数：', data)
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket信息发送失败')
        }
      },
      subscribeTop(command, deptId) { // 获取企业节点车辆在线数
        const data = {
          Command: command,
          CommandType: 'online',
          Token: getToken(),
          Body: {
            TopDeptId: deptId
          }
        }
        console.log('获取企业节点车辆在线数请求参数：', data)
        if (this.websocket.readyState === 1) {
          this.websocket.send(JSON.stringify(data))
        } else {
          console.log('websocket信息发送失败')
        }
      },
      handleNodeExpand(data, node) {
        console.log(data)
        const deptId = data.id.substring(2)
        // if (data.children.length > 1) {
        //   return
        // } else {
        this.deptTreeQuery = { id: data.id,activeStatus:this.activeStatus==-1?'':this.activeStatus}
        getBaseDept(this.deptTreeQuery).then(res => {
          console.log(res)
          if (res.code === 0) {
            const checkArr = this.checkedList
            const arr = res.data
            const _this = this
            if (arr.length === 0) {
              node.expanded = false
              this.$message.info('暂无下级数据')
              return
            }
            for (let i = 0; i < arr.length; i++) {
              const element = arr[i]
              if (this.checkedList.indexOf(data.id) > -1) {
                checkArr.push(element.id)
              }
              if (element.type !== '3') {
                if (!element.children) {
                  this.$set(element, 'children', [])
                  element.children.push({})
                }
                this.$set(element, 'text', element.text)
                this.$set(element, 'allVehicle', 0)
                this.$set(element, 'onlineVehicle', 0)
                this.$set(element, 'offlineVehicle', 0)
              } else {
                this.$set(element, 'online', '0')
              }
            }
            data.children = arr
            this.subscribeExpend(4, 'online', deptId)
            setTimeout(() => {
              if (arr.length > 0) {
                _this.$refs.tree.setCheckedKeys(checkArr)
              } else {
                _this.$refs.tree.setCheckedKeys(_this.checkedList)
              }
            }, 10)
          } else {
            this.$message.error(res.msg)
          }
        })
        // }
      },
      getCurrentKey(data, node) { // 获取当前选中节点的key
        const id = data.id.substring(2)
        this.checkedList = node.checkedKeys
        if (this.checkedList.indexOf(data.id) > -1) {
          if (data.type === '3') {
            this.subscribe(1, 1, id)
          } else {
            this.subscribe(1, 0, id)
          }
        } else {
          if (data.type === '3') {
            if (id === this.vehicleInfo.vId + '') {
              this.isShowDialog = false
            }
            this.subscribe(15, 1, id)
            this.deleteArray(this.vehicleList, data.id.substring(2))
          } else {
            this.subscribe(15, 0, id)
            const vehicleArray = []
            const arr = this.getSelectArr(vehicleArray, this.treeData[0].children, data.id)
            for (let i = 0; i < arr.length; i++) {
              this.deleteArray(this.vehicleList, arr[i].id.substring(2))
            }
          }
        }
      },
      getSelectArr(vehicleArray, arr, deptId) {
        if (arr) {
          for (let i = 0; i < arr.length; i++) {
            const td = arr[i]
            if (td.type === '3') {
              vehicleArray.push(td)
            } else {
              this.getSelectArr(vehicleArray, arr[i].children, deptId)
            }
          }
          return vehicleArray
        }
      },
      deleteArray(list, id) { // 删除数组中的某个元素
        for (let i = 0; i < list.length; i++) {
          if (list[i].vId + '' === id) {
            if (i === 0) {
              list.shift()
              return list
            } else if (i === list.length - 1) {
              list.pop()
              return list
            } else {
              list.splice(i, 1)
              return list
            }
          }
        }
      },
      handler({ BMap, map }) { // 地图加载完成
        this.zoom = 15
      },
      handleNodeClick(val) { // 结点点击事件
        console.log(val)
      },
      dialogClose() { // 关闭车辆信息dialog
        this.isShowDialog = false
      },
      openDialog(vehicle) { // 打开车辆信息dialog
        this.vehicleId = vehicle.vId
        this.vehicleInfo = vehicle
        this.address = vehicle.address
        this.street = vehicle.street
        this.isShowDialog = true
        if (this.isShowTable) {
          this.infoDialog = 'infoDialogOther'
        } else {
          this.infoDialog = 'infoDialog'
        }
      }
    }
  }
</script>

<style>
  body{
    color:#333333
  }
  .monitor_all_normal{
    background-image: url('../../../assets/realtime/monitor_all_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_all_checked{
    background-image: url('../../../assets/realtime/monitor_all_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .monitor_online_normal{
    background-image: url('../../../assets/realtime/monitor_online_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_online_checked{
    background-image: url('../../../assets/realtime/monitor_online_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .monitor_offline_normal{
    background-image: url('../../../assets/realtime/monitor_offline_normal.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #333333
  }
  .monitor_offline_checked{
    background-image: url('../../../assets/realtime/monitor_offline_checked.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    color: #4178bd
  }
  .font_normal{
    color: #333333
  }
  .font_active{
    color: #4178bd
  }
  .tree_dept_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/dept.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_line_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/line.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_veh_online_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/veh_online.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .tree_veh_offline_icon{
    width: 14px;
    height: 14px;
    display: inline-block;
    background-image: url('../../../assets/realtime/veh_offline.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    margin-right: 5px
  }
  .left_close{
    background-image: url('../../../assets/realtime/close.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }
  .left_open{
    background-image: url('../../../assets/realtime/open.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
  }
  .left_top_veh{
    float:left;
    width:33.33333%;
    height:40px;
    text-align:center;
    cursor:pointer
  }
  .left_top_veh div{
    height:20px;
    line-height:20px;
  }
  .left_top_veh .veh_count{
    width:18px;
    height:18px;
    display:inline-block
  }
  .real_time {
    max-width: 100%;
  }
  .left_aside {
    z-index: 50;
    padding: 5px;
    width: 235px;
    max-width: 235px;
    float: left;
    min-height: calc(100vh - 95px);
    background-color: #FFFFFF
  }
  .el-popover {
    height: 350px;
    overflow-y: scroll;
    font-size: 12px;
    color: #333333;
  }
  .left_aside .el-radio-button--medium .el-radio-button__inner {
    padding: 5px 5px;
    font-size: 12px;
    border-radius: 0;
    width: 75px;
  }
  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin: 0;
  }
  .el-tree--highlight-current .el-tree-node.is-checked>.el-tree-node__content .demo {
    /* border: 1px solid #409EFF;
    padding: 0 3px;
    border-radius: 4px; */
    color: #409EFF;
  }
  .online {
    color: #36ab60;
  }
  .offline {
    color: #333333;
  }
  .tableBtnRealtime {
    transition : 'all .5s ease';
    position: absolute;
    top: 82px;
    left: 235px;
    z-index: 100;
    display: inline-block;
    width: 22px;
    height: 26.4px;
    background-image: url('../../../assets/realtime/close.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    cursor: pointer
  }
  .tableBtnRealtimeOther {
    transition : 'all .5s ease';
    position: absolute;
    top: 82px;
    left: 0;
    z-index: 100;
    display: inline-block;
    width: 22px;
    height: 26.4px;
    background-image: url('../../../assets/realtime/open.png');
    background-repeat:no-repeat;
    background-size:100% 100%;
    cursor: pointer
  }
  .infoDialog {
    margin-left: calc(100vw - 360px);
  }

  .el-tree-node__content:hover {
    /* background-color: #f5f7fa; */
  }
  .el-checkbox__input .is-checked{
    background-image: url('../../../assets/realtime/vehicle_check.png');
    background-repeat:no-repeat;
  }

  .search_result_item{
    border-bottom:1px solid #dddddd;
    margin:0 0 10px 0;
    cursor:pointer
  }
  .search_result_item:hover{
    background-color: rgb(184, 208, 233)
  }

  @media screen and (max-width: 1366px) {
    .infoDialogOther {
      margin-left: calc(100vw - 595px);
    }
  }

  @media screen and (min-width: 1400px) and (max-width: 1920px) {
    .infoDialogOther {
      margin-left: calc(100vw - 700px);
    }
  }
</style>
