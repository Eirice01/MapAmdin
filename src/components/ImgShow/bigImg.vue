<template>
  <!-- 过渡动画 -->
  <transition name="fade">
      <div class="img-view" @click="bigImg">
        <!-- 遮罩层 -->
        <div class="img-layer"></div>
        <div class="imgdiv">
            <img ref="BigImg" class="imgClass" :src= "imgSrc">
        </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    imgSrc: String
  },
  watch: {
    imgSrc: function(val) {
      alert(val)
      if (val !== '') {
        this.$refs.BigImg.src(val)
      }
    }
  },
  methods: {
    bigImg() {
      // 发送事件
      this.$emit('clickit')
    }
  }
}
</script>
<style scoped>
/*动画*/
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s linear;
  transform: translate3D(0, 0, 0);
}
.fade-enter,
.fade-leave-active {
  transform: translate3D(100%, 0, 0);
}
/* bigimg */
.img-view {
  position:initial;
  width: 100%;
  height: 100%;
}
/*遮罩层样式*/
.img-view .img-layer {
  position: fixed;
  z-index: 999;
  top: 0%;
  left: 0%;
  background: darkgrey;
  width: 100%;
  height: 100%;
  overflow: hidden;
  filter:alpha(Opacity=30);
  -moz-opacity:0.2;
  opacity: 0.9 
}

/*不限制图片大小，实现居中*/
.img-view .imgdiv img{
  max-width: 100%;
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 1000;
}
.imgClass{
   position:fixed; 
   top:-40px;
}
</style>