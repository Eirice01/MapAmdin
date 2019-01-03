<template>
  <div>
    <el-table :data="historyList" v-loading.body="listLoading" border stripe fit style="width: 100%;margin-top:13px">
      <el-table-column label="车牌号" align="center">
        <template slot-scope="scope">
          <span class="clickDetail" @click="detailDialog(scope.row.vin)">{{scope.row.startlatitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="VIN号" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startlongitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属机构" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.startlatitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终位置" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endlongitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终纬度" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endlatitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终经度" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endlatitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最终时间" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endlatitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.endlatitude}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog class="cinfoDialog" title="车辆信息" :append-to-body='true' :visible.sync="isShowDetailDialog" width="40%" height="60%" >
        <vehicle-dialog ref="carInfo"></vehicle-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { realTimeData } from '@/api/vehicleMonitor/regional'
import vehicleDialog from './vehicleDialog.vue'
export default {
  name: 'historyVehicleDialog',
  props: {
    list: Array,
    firstData: Object,
    historyList: Array
  },
  components: {
    vehicleDialog
  },
  data() {
    return {
      isShowDetailDialog: false,
      listLoading: false,
      startEnd: [],
      historyQuery: [{
        startTime: '',
        endTime: '',
        startlongitude: '', // 开始经度
        startlatitude: '', // 开始纬度
        endlongitude: '', // 结束经度
        endlatitude: '' // 结束纬度
      }]
    }
  },
  created() {
    //
  },
  methods: {
    // 查看车辆详情信息
    async detailDialog(val) {
      this.isShowDetailDialog = true
      // 此处打开车辆信息Dialog
      const list = {
        vin: val
      }
      console.log(list)
      const result = await realTimeData(list)
      console.log(result)
      this.$refs.carInfo.getInfoDeatil(result, val)
    }
  },
  watch: {
    //
  }
}

</script>
<style>
.cinfoDialog{
    margin-top:5%;
}
.clickDetail{
    cursor: pointer;
    color: blue
}
</style>
