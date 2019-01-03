<template>
  <div class="bottBox">
    <el-row>
      <el-col :span="4"><div class="content">所有车辆：755</div></el-col>
      <el-col :span="4"><div class="content">车辆上线：564</div></el-col>
      <el-col :span="4"><div class="content">在线率：82%</div></el-col>
      <el-col :span="4"><div class="content">今日报警：13280</div></el-col>
      <el-col :span="4"><div class="content">今日处理：2980</div></el-col>
      <el-col :span="4">
        <div class="content">
          <el-switch
            v-model="switchValue"
            active-text="报警声音"
            active-color="#628FA6"
            inactive-color="#ff4949">
          </el-switch>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        switchValue: true
      }
    }
  }
</script>

<style>
  .bottBox {
    width:100%;
    height:31px;
    padding: 0 20px;
    line-height: 31px;
    background-color: #F7F7F7;
    position:fixed;
    bottom:0;
    left: 0;
    font-size: 13px;
  }
  .content {
    text-align: center;
  }
</style>
