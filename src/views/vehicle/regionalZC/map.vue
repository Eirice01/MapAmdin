<template>
  <div style="width: 100%; height: 100%;" class="mapContainer">
    <div ref="bMap" id="allmap" style="width: 100%; height: 100%;"></div>
    <div class="buttonGroup" v-if="flag===1" v-show="isView">
      <div @click="draw">
        <img src="@/assets/mapicon/map_now.png" >
        <div class="historyList">实时查车</div>
      </div>
      <div style="display:none" @click="historyQuery">
        <img src="@/assets/mapicon/map_his.png" >
        <div class="historyList">历史查车</div>
      </div>
      <!-- <div @click="clear">
        <img src="@/assets/mapicon/delete.png" alt="删除">
      </div> -->
    </div>
    <div class="buttonGroup" v-else-if="flag===2" v-show="isView">
      <div @click="draw">
        <img src="@/assets/mapicon/circle.png" alt="添加圆形区域">
      </div>
      <div @click="clear">
        <img src="@/assets/mapicon/delete.png" alt="删除">
      </div>
    </div>
    <div class="buttonGroup" v-else-if="flag===3" v-show="isView">
      <div @click="draw">
        <img src="@/assets/mapicon/polygon.png" alt="添加多边形区域">
      </div>
      <div @click="clear">
        <img src="@/assets/mapicon/delete.png" alt="删除">
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import BMap from 'BMap'
export default {
  data() {
    return {
      overlays: [],
      point: [118.684169, 24.874183],
      flag: '',
      drawingManager: null,
      circleInfo: {},
      rectangleInfo: {},
      polygonInfo: {},
      isView: true,
    }
  },
  mounted() {

  },
  methods: {
    ready(data) {
      const vm = this
      var map = new BMap.Map('allmap')
      window.map = map
      var poi = new BMap.Point(this.point[0], this.point[1])
      map.centerAndZoom(poi, 12)
      map.enableScrollWheelZoom()
      window.overlays = []
      var overlaycomplete = function(e) {
        window.overlays.push(e.overlay)
      }

      var rectanglecomplete = function(overlay) {
        vm.$emit('emitRectangle', { path: overlay.getPath(), flag: data})
        drawingManager.close()
      }
      var circlecomplete = function(overlay) {
        vm.$emit('emitCircle', { radius: overlay.getRadius(), center: overlay.getCenter() })
        drawingManager.close()
      }
      var polygoncomplete = function(overlay) {
        vm.$emit('emitPolygon', { path: overlay.getPath(), type: '3' })
      }

      var styleOptions = {
        strokeColor: 'red', // 边线颜色。
        fillColor: 'red', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.3, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }
      // 实例化鼠标绘制工具
      if (vm.flag === 1) {
        var drawingManager = new window.BMapLib.DrawingManager(map, {
          isOpen: false, // 是否开启绘制模式
          enableDrawingTool: false, // 是否显示工具栏
          drawingToolOptions: {
            anchor: window.BMAP_ANCHOR_TOP_LEFT, // 位置
            offset: new BMap.Size(5, 5),// 偏离值
            drawingModes : [BMAP_DRAWING_RECTANGLE]
          },
          rectangleOptions: styleOptions // 矩形的样式
        })
        drawingManager.setDrawingMode(BMAP_DRAWING_RECTANGLE)
      } else if (vm.flag === 2) {
        var drawingManager = new window.BMapLib.DrawingManager(map, {
          isOpen: false, // 是否开启绘制模式
          enableDrawingTool: false, // 是否显示工具栏
          drawingToolOptions: {
            anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
            offset: new BMap.Size(5, 5), // 偏离值
            drawingModes : [BMAP_DRAWING_CIRCLE]
          },
          circleOptions: styleOptions, // 圆的样式
        })
        drawingManager.setDrawingMode(BMAP_DRAWING_CIRCLE)
      } else if (vm.flag === 3) {
        var drawingManager = new window.BMapLib.DrawingManager(map, {
          isOpen: false, // 是否开启绘制模式
          enableDrawingTool: false, // 是否显示工具栏
          drawingToolOptions: {
            anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
            offset: new BMap.Size(5, 5), // 偏离值
            drawingModes : [BMAP_DRAWING_POLYGON]
          },
          polygonOptions: styleOptions, // 多边形的样式
        })
        drawingManager.setDrawingMode(BMAP_DRAWING_POLYGON)
      }
      this.drawingManager = drawingManager
      this.drawingManager.addEventListener('overlaycomplete', overlaycomplete)
        // 添加鼠标绘制工具监听事件，用于获取绘制结果
      this.drawingManager.addEventListener('rectanglecomplete', rectanglecomplete)
      this.drawingManager.addEventListener('circlecomplete', circlecomplete)
      this.drawingManager.addEventListener('polygoncomplete', polygoncomplete)
    },
    clear() {
      window.map.clearOverlays()
      for (var i = 0; i < window.overlays.length; i++) {
        window.map.removeOverlay(window.overlays[i])
      }
      window.overlays.length = 0
      this.$emit('clearInfo', '1')
    },
    draw() {
      this.ready(0)
      this.drawingManager.open()
    },
    historyQuery(){
      this.ready(1)
      this.drawingManager.open()
    },
    openHistory(){
      this.drawingManager.open()
    },
    drawCircle() {
      var circle = new BMap.Circle(new BMap.Point(this.circleInfo.coordinate[0], this.circleInfo.coordinate[1]),this.circleInfo.radius, { strokeColor:"red", strokeWeight:3, strokeOpacity:0.8 })
      window.map.addOverlay(circle)
    },
    drawRectangle() {
      var rectangle = new BMap.Polygon([
        new BMap.Point(this.rectangleInfo.path[0].lng, this.rectangleInfo.path[0].lat),
        new BMap.Point(this.rectangleInfo.path[1].lng, this.rectangleInfo.path[1].lat),
        new BMap.Point(this.rectangleInfo.path[2].lng, this.rectangleInfo.path[2].lat),
        new BMap.Point(this.rectangleInfo.path[3].lng, this.rectangleInfo.path[3].lat)
      ], { strokeColor:"red", strokeWeight:3, strokeOpacity:0.8 })
      window.map.addOverlay(rectangle)
    },
    drawPolygon() {
      const arr = []
      for (let i = 0; i < this.polygonInfo.path.length; i++) {
        let tmp = this.polygonInfo.path[i]
        arr[i] = new BMap.Point(tmp.lng, tmp.lat)
      }
      var polygon = new BMap.Polygon(arr, { strokeColor:"red", strokeWeight:3, strokeOpacity:0.8 })
      window.map.addOverlay(polygon)
    }
  }
}
</script>

<style lang="scss" scoped>
.mapContainer {
  position: relative;
  .buttonGroup {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 40px;
    > div {
      width: 60px;
      height: 60px;
      background-color: #fff;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0px 0px 2px 2px #aaa;
      img {
        width: 20px;
        height: 20px;
        margin-top: 10px;
      }
      div {
        width: 40px;
        height: 20px;
        color: #4077BC;
      }
      &:first-of-type {
        margin-bottom: 10px;
      }
      // &:last-of-type {
      //   margin-top: 10px;
      // }
    }
  }
}
.historyList{
  display:inline-block;
  cursor: default;
  font-size:10px
}
// .historyList :hover{
//   cursor: nw-resize
// }
</style>
