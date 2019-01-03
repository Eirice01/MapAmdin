<template>
  <div style="width: 100%; height: 400px;" class="mapContainer">
    <div ref="bMap" id="allmap" style="width: 100%; height: 400px;"></div>
    <div class="buttonGroup" v-show="flag === 0">
      <div @click="draw">
        <img src="@/assets/mapicon/polyline.png" alt="添加线路">
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
      point: [108.898188, 34.220834],
      flag: '',
      drawingManager: null,
      polylineInfo: {}
    }
  },
  methods: {
    ready() {
      const vm = this
      var map = new BMap.Map('allmap')
      window.map = map
      var poi = new BMap.Point(this.point[0], this.point[1])
      map.centerAndZoom(poi, 16)
      map.enableScrollWheelZoom()
      window.overlays = []
      var overlaycomplete = function(e) {
        window.overlays.push(e.overlay)
      }
      var polylinecomplete = function(overlay) {
        vm.$emit('emitPolyline', { path: overlay.getPath() })
        drawingManager.close()
      }
      var styleOptions = {
        strokeColor: 'red', // 边线颜色。
        fillColor: '', // 填充颜色。当参数为空时，圆形将没有填充效果。
        strokeWeight: 3, // 边线的宽度，以像素为单位。
        strokeOpacity: 0.8, // 边线透明度，取值范围0 - 1。
        fillOpacity: 0.6, // 填充的透明度，取值范围0 - 1。
        strokeStyle: 'solid' // 边线的样式，solid或dashed。
      }
      // 实例化鼠标绘制工具
      var drawingManager = new window.BMapLib.DrawingManager(map, {
        isOpen: false, // 是否开启绘制模式
        enableDrawingTool: false, // 是否显示工具栏
        drawingToolOptions: {
          anchor: window.BMAP_ANCHOR_TOP_RIGHT, // 位置
          offset: new BMap.Size(5, 5), // 偏离值
          drawingModes : [BMAP_DRAWING_POLYLINE]
        },
        circleOptions: styleOptions, // 圆的样式
      })
      drawingManager.setDrawingMode(BMAP_DRAWING_POLYLINE)
      this.drawingManager = drawingManager
      // 添加鼠标绘制工具监听事件，用于获取绘制结果
      drawingManager.addEventListener('overlaycomplete', overlaycomplete)
      drawingManager.addEventListener('polylinecomplete', polylinecomplete)
    },
    clear() {
      window.map.clearOverlays()
      for (var i = 0; i < window.overlays.length; i++) {
        window.map.removeOverlay(window.overlays[i])
      }
      window.overlays.length = 0
      this.$emit('clearInfo', '1')
      this.drawingManager.close()
    },
    draw() {
      this.clear()
      this.drawingManager.open()
    },
    drawPolyline() {
      const arr = []
      for (let i = 0; i < this.polylineInfo.path.length; i++) {
        let tmp = this.polylineInfo.path[i]
        arr[i] = new BMap.Point(tmp.lng, tmp.lat)
      }
      var polyline = new BMap.Polyline(arr, { strokeColor:"red", strokeWeight:3, strokeOpacity:0.8 })
      window.map.addOverlay(polyline)
    }
  }
}
</script>

<style lang="scss" scoped>
.mapContainer {
  position: relative;
  .buttonGroup {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 40px;
    div {
      width: 40px;
      height: 40px;
      background-color: #fff;
      border-radius: 50%;
      text-align: center;
      img {
        width: 20px;
        height: 20px;
        margin-top: 10px;
      }
      &:first-of-type {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
