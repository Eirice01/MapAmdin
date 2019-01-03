<template>
  <div class="tableBox">
    <el-table
      :header-cell-style="{ 'background-color': 'rgba(98,143,166,1)', 'color': '#fff' }"
      height="200"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        min-width="100"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="dataTime"
        label="上报时间"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="longitude"
        label="经度"
        align="center"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="latitude"
        align="center"
        label="纬度"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="currentSpeed"
        align="center"
        label="车速"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="currentMileage"
        align="center"
        label="里程"
        min-width="100">
      </el-table-column>
      <el-table-column
        prop="site"
        align="center"
        label="位置"
        min-width="100">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import news from './news'
  export default {
    props: ['tableData', 'play'],
    data() {
      return {
      }
    },
    mounted() {
      // console.log('1111111' + this.tableData)
      // news.$emit('sendData', this.tableData)
    },
    watch: {
      tableData(val) {
        news.$emit('sendData', val)
      }
    },
    methods: {

    }
  }
</script>

<style>
  .tableBox {
    width:100%;
    height:200px;
    position: absolute;
    bottom: 30px;
    left: 0;
  }
  .tableBox .el-table--medium td, .el-table--medium th {
  	padding: 4px 0;
  }


  .tableBox .el-table__body{
    position: absolute;
    top: 0;
  }
</style>
