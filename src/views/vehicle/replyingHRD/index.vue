<template>
  <div>
    <el-container style="min-height: calc(100vh - 95px);">
      <el-main style="padding:0;">
        <baidu-map class="map" :center="startPoint" :zoom="13" :scroll-wheel-zoom="true">
          <bml-marker-clusterer :averageCenter="true">
            <bm-marker v-for="marker of markers" :key="marker.lng" :position="{lng: marker.lng, lat: marker.lat}" :icon="{url: 'http://192.168.5.10:7000/upload/Icon/startSite.png', size: {width: 38, height: 48}}"></bm-marker>
          </bml-marker-clusterer>
          <bml-marker-clusterer :averageCenter="true">
            <bm-marker v-for="marker of endmarkers" :key="marker.lng" :position="{lng: marker.lng, lat: marker.lat}" :icon="{url: 'http://192.168.5.10:7000/upload/Icon/endSite.png', size: {width: 38, height: 48}}"></bm-marker>
          </bml-marker-clusterer>
          <bm-polyline :path="path" stroke-color="blue" :stroke-opacity="0.5" :stroke-weight="0" :editing="false"></bm-polyline>
          <bml-lushu
            @start="start"
            @stop="reset"
            :path="path"
            :icon="icon"
            :speed="speed"
            :play="play"
            :infoWindow="true"
            :autoView="true"
            :content="contentInfo"
            :rotation="false">
          </bml-lushu>
        </baidu-map>
      </el-main>
    </el-container>
    <search-box ref="searchContent" @searchDatas="getDatas" @isrePlay="getRePlay" @isPause="getPause" @isStop="getStop" @speed="getSpeed" :message="rtCar"></search-box>
    <!-- <div class="pointBox">
      <ul>
        <li tabindex="1"><img src="../../../assets/realtime/line.png" alt=""><span>轨迹点</span></li>
        <li tabindex="2"><img src="../../../assets/realtime/ringBal.png" alt=""><span>报警点</span></li>
        <li tabindex="3"><img src="../../../assets/realtime/lineCharts.png" alt=""><span>曲线图</span></li>
      </ul>
    </div> -->
    <transition name="fade">
      <source-table ref="sorTable" v-show="isShowTable" :tableData='tableData'></source-table>
    </transition>
    <div @click="tableBtnClick" icon="el-icon-arrow-down" class="tableBtn">
      <img class="dropDown" src="../../../assets/realtime/dropDown.png">
    </div>
    <footer-box></footer-box>
  </div>
</template>

<script>
  import footerBox from './footerBox'
  import searchBox from './searchBox'
  import sourceTable from './sourceTable'
  import { BmlLushu } from 'vue-baidu-map'
  import { BmlMarkerClusterer } from 'vue-baidu-map'
  export default {
    components: {
      footerBox,
      searchBox,
      sourceTable,
      BmlLushu,
      BmlMarkerClusterer
    },
    data() {
      return {
        speed: 100,
        markers: [],
        endmarkers: [],
        websocket: '',
        startPoint: '天安门',
        endPoint: '百度大厦',
        play: false,
        pause: false,
        path: [],
        icon: {
          url: 'http://192.168.5.10:7000/upload/Icon/lineCar.png',
          size: { width: 55, height: 56 },
          opts: { anchor: { width: 27, height: 13 }}
        },
        contentInfo: '1',
        isShowTable: true,
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        plineData: [],
        tableData: [],
        lastColor: null,
        rtCar: []
        // totalMerage: '',
        // playTimes: ''
      }
    },
    methods: {
      getSpeed(val) { // 回放速度
        this.speed = val
      },
      // 轨迹点数据
      getDatas(val) {
        console.log(val)
        this.isShowTable = true
        document.getElementsByClassName('tableBtn')[0].style.bottom = '230px'
        document.getElementsByClassName('dropDown')[0].style.transform = 'rotate(0deg)'
        this.play = false
        this.getStop()
        if (val.length !== 0) {
          for (var i = 0; i < val.length; i++) {
            const dataList = []
            dataList.push(val[i].PosData)
            this.tableData.push({ dataTime: val[i].DataTime, longitude: val[i].PosData.Longitude, latitude: val[i].PosData.Latitude, currentSpeed: val[i].OvrallData.CurrentSpeed + 'KM/H', currentMileage: val[i].OvrallData.CurrentMileage + 'KM' })
            this.plineData.push({ lng: val[i].PosData.Longitude, lat: val[i].PosData.Latitude })
          }
          this.path = this.plineData
          this.contentInfo = this.$refs.searchContent.carValue
          this.startPoint = this.plineData[0]
          this.endPoint = this.plineData[this.plineData.length - 1]
          this.markers.push(this.startPoint)
          this.endmarkers.push(this.endPoint)
          this.$refs.searchContent.permmsion = false
          this.$message.success('查询成功！')
        } else {
          this.$message.error('暂无数据！')
        }
      },
      start(v) {
      },
      reset() {
        this.play = false
      },
      getRePlay(val) {
        this.play = val
        this.path = []
        if (this.plineData) {
          this.path = this.plineData
        }
      },
      getPause(val) {
        this.play = val
      },
      getStop(val) {
        this.path = []
        this.startPoint = ''
        this.endPoint = ''
        this.markers = []
        this.endmarkers = []
        this.plineData = []
        this.contentInfo = ''
        this.tableData = []
      },
      tableBtnClick() {
        this.isShowTable = !this.isShowTable
        document.getElementsByClassName('tableBtn')[0].style.transition = 'all .5s ease'
        if (this.isShowTable) {
          document.getElementsByClassName('tableBtn')[0].style.bottom = '230px'
          document.getElementsByClassName('dropDown')[0].style.transform = 'rotate(0deg)'
        } else {
          document.getElementsByClassName('tableBtn')[0].style.bottom = '30px'
          document.getElementsByClassName('dropDown')[0].style.transform = 'rotate(180deg)'
        }
      }
    },
    mounted() {
      this.rtCar = this.$route.params
    }
  }
</script>

<style>
  .leftBox {
    background-color: rgb(238, 241, 246);
    position: absolute;
    top: 0;
    left: 0;
    overflow:auto
  }
  .map {
    width: 100%;
    height: 100%;
    overflow: hidden;
    margin:0;
  }
  .tableBtn {
    position: absolute;
    bottom:230px;
    left:50%;
    width:71px;
    height:27px;
    background:rgba(98,143,166,1);
    border-radius:10px 10px 0px 0px;
    cursor: pointer;
  }
  .tableBtn .dropDown {
    margin: 7px 0 0 22px;
  }
  .anchorBL{
    display:none;
  }
  .fade-enter-active, .fade-leave-active {
    transition: all .5s ease;
  }
  .fade-leave-to,.fade-enter{
    bottom: -200px
  }
  .fade-leave,.fade-enter-to{
    bottom: 0
  }
/*  .pointBox {
    width: 369px;
    height: 40px;
    background-color: #fff;
    border-radius:5px;
    position: absolute;
    left: 10px;
    bottom:240px;
  }
  .pointBox ul {
    width: 369px;
    height: 40px;
    padding: 0;
    margin: 0;
  }
  .pointBox ul li {
    cursor: pointer;
    width: 120px;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    text-align: center;
    display: inline-block;
    margin: 0;
    padding: 0;
  }
  .pointBox ul li img {
    margin-right: 5px;
  }
  .pointBox ul li img, .pointBox ul li span {
    vertical-align: middle;
  }*/
</style>
