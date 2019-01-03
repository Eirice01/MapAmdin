<template>
  <div>
    <el-table :data="historyQuery" v-loading.body="listLoading" border stripe fit style="width: 100%;margin-top:13px">
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          <span>
            <div>
              <el-date-picker v-model="scope.row.startTime" :title="scope.row.startTime" type="datetime" placeholder="选择开始时间" format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          <span>
            <div>
              <el-date-picker v-model="scope.row.endTime" :title="scope.row.endTime" type="datetime" placeholder="选择结束时间" format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="开始经度" align="center" width="115">
        <template slot-scope="scope">
          <span>{{scope.row.startlongitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始纬度" align="center" width="115">
        <template slot-scope="scope">
          <span>{{scope.row.startlatitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束经度" align="center" width="115">
        <template slot-scope="scope">
          <span>{{scope.row.endlongitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束纬度" align="center" width="115">
        <template slot-scope="scope">
          <span>{{scope.row.endlatitude}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80">
        <template slot-scope="scope">
          <span>
            <el-button type="text"><span title="删除" @click="deleteRow(scope.$index, historyQuery)">删除</span></el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  // import { aaa } from '@/api/vehicleMonitor/regional'
  export default {
    name: 'historyQueryDialog',
    props: {
      list: Array,
      firstData: Object,
      historyList: Array
    },
    data() {
      return {
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
      this.historyQuery.splice(0, 1)
    },
    methods: {
      deleteRow(index, rows) { // 删除该行
        rows.splice(index, 1)
      },
      // 根据条件查询历史车辆
      queryVehicleList() {
        console.log(this.historyQuery)
        this.$message.error('此功能暂不可用')
        // this.$emit('vehicleList', 'res.data')
      },
      getFirstData(val) {
        console.log('历史查车添加的数据')
        console.log(val)
        this.historyQuery.push({
          startTime: new Date(),
          endTime: new Date(),
          startlongitude: val.startlongitude,
          startlatitude: val.startlatitude,
          endlongitude: val.endlongitude,
          endlatitude: val.endlatitude
        })
      },
      clearTable() {
        this.historyQuery = []
      }
    },
    watch: {
      firstData: {
        handler(newValue, oldValue) {
        },
        deep: true
      }
    }
  }

</script>
<style>

</style>
