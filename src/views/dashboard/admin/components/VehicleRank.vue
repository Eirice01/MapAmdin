<template>
 <el-card class="box-card">
  <div slot="header" >
    <span>车辆预警排名</span>
    <el-button-group style="float: right;">
     <el-button  :type="btnFlag ? 'primary' : ''" @click="changeRack(0)">最好</el-button>
     <el-button :type="btnFlag ? '' : 'primary' " @click="changeRack(1)">最差</el-button>
    </el-button-group>
  </div>
   <el-table :data="tireData" height="300" border stripe style="width:100%; border-radius: 5px; ">
          <el-table-column prop="orderNum" :formatter="function (row, col) { return row.orderNum + 1}" label="排名" align="center"></el-table-column>
          <el-table-column prop="plateNo" label="车牌号" align="center"></el-table-column>
          <el-table-column prop="deptName" label="所属机构" align="center"></el-table-column>
          <el-table-column prop="hundredKMAlarmProbability" label="百公里报警数" align="center"></el-table-column>
        </el-table>
</el-card>
</template>
<script>
import { queryVehicleRank } from '@/api/dashboard/dashboard'

export default {
  data() {
    return {
      tireData: [],
      tireReportQuery: {},
      btnFlag: true
    }
  },
  async created() {
    this.tireReportQuery = { rankType: 0 }
    await this.queryVehicleRank()
  },
  mounted() {},
  methods: {
    async queryVehicleRank() {
      this.tireData = []
      const result = await queryVehicleRank(this.tireReportQuery)
      this.tireData = result.data
    },
    changeRack(rankType) {
      this.btnFlag = rankType === 0
      this.tireReportQuery = { rankType: rankType }
      this.queryVehicleRank()
    }
  }
}
</script>