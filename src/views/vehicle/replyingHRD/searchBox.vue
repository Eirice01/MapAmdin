<template>
	<div class="searchBox">
        <div style="height:100%;width:100%;padding:10px;">
          <el-row style="margin-bottom:10px;">
            <span class="m" style="padding:0 10px;">选择车辆</span>
            <el-input :disabled="getMessaged" size="mini" v-model="carValue" placeholder="请选择车辆" @focus="allotDialogVisible = true" style="display:inline-block; width:100px"></el-input>
            <span class="m" style="padding:0 10px;">回放时间</span>
            <el-date-picker
              style="width:325px;"
              size="mini"
              v-model="rePlayDate"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="-"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
            <el-button style="background-color:#628FA6;color:#fff;border-radius:5px;" size="mini" @click="searchDatas" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">查询</el-button>
            <el-button style="background-color:#628FA6;color:#fff;border-radius:5px;" size="mini" @click="handleExport">导出</el-button>
            <span style="padding:0 5px;">回放速度</span>
            <el-select @change="getLineSpeed" v-model="replaySpeedVal" size="mini" style="width:70px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button style="background-color:#628FA6;color:#fff;border-radius:5px;" size="mini" @click="replay" :disabled="permmsion">回放</el-button>
            <el-button style="background-color:#628FA6;color:#fff;border-radius:5px;" size="mini" @click="pause" :disabled="permmsion">暂停</el-button>
            <el-button style="background-color:#628FA6;color:#fff;border-radius:5px;" size="mini" @click="stop" :disabled="permmsion">停止</el-button>
            <!-- <span class="m" style="padding:0 10px;">回放进度</span>
            <el-progress :text-inside="true" :stroke-width="18" :percentage="percents" style="width:200px;display:inline-block;padding: 0 10px 0 0;top:-2px;"></el-progress> -->
          </el-row>
        </div>
        <el-dialog title="选择车辆" :visible.sync="allotDialogVisible" class="allotDialog" :close-on-click-modal="false">
          <el-row>
            <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px; overflow: hidden">
              <!-- <el-tree :highlight-current="true" :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :render-content="renderContent"></el-tree> -->
              <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </el-col>
            <el-col :span="17" :offset="1">
              <div class="searchInput" style="overflow: hidden">
                车牌号: <el-input placeholder="请输入内容" v-model="queryList.plateNo" style="width: 200px;" size="small"></el-input>
                  <el-button style="background-color:#628FA6;color:#fff;border-radius:5px;" size="small" @click="search">查询</el-button>
                <el-button size="small" style="float:right;background-color:#628FA6;color:#fff;border-radius:5px;" @click="choose">确定</el-button>
              </div>
              <div>
                <el-table
                ref="multipleTable"
                :data="tableData"
                style="margin-top: 10px;width:100%"
                stripe
                border>
                  <el-table-column
                   width="40px">
                    <template slot-scope="scope">
                      <el-radio v-model="radioVal" @change.native="getRow(scope.row)" :label="scope.row.id"></el-radio>
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="车牌号"
                    align="center"
                    prop="plateNo">
                  </el-table-column>
                  <el-table-column
                    prop="activeStatus"
                    align="center"
                    label="状态">
                  </el-table-column>
                  <el-table-column
                    prop="driverName"
                    align="center"
                    label="司机">
                  </el-table-column>
                  <el-table-column
                    prop="deptName"
                    align="center"
                    label="所属机构">
                  </el-table-column>
                </el-table>
              </div>
              <el-pagination background @current-change="handleCurrentChange" :current-page="queryList.page" :page-size="queryList.limit" layout="total, prev, pager, next" :total="total" style="margin-top: 20px">
              </el-pagination>
            </el-col>
          </el-row>
    </el-dialog>
      </div>
</template>

<script>
  import { deptTree } from '@/api/system/dept'
  import { vehicleStatusList } from '@/api/base/vehicle'
  import { parseTime } from '@/utils'
  import news from './news'
  import { getToken } from '@/utils/auth'
  export default {
    props: ['message'],
    data() {
      return {
        fullscreenLoading: false,
        getMessaged: false,
        // percents: 0,
        permmsion: true,
        acceptData: [],
        activeName: '',
        checked: true,
        carValue: '',
        allotDialogVisible: false,
        radioVal: '-1',
        rePlayDate: '',
        pickerOptions: {
          shortcuts: [{
            text: '4小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 4)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '8小时',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 8)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近一天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近两天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '近三天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        replaySpeedVal: 100,
        options: [{
          value: 100,
          label: '1x'
        }, {
          value: 300,
          label: '3x'
        }, {
          value: 500,
          label: '5x'
        }, {
          value: 1000,
          label: '10x'
        }],
        queryList: {
          page: 1,
          limit: 5,
          deptId: '',
          plateNo: ''
        },
        treeData: [],
        tmp: {},
        tableData: [],
        onlineCount: '',
        allCount: '',
        defaultProps: {
          children: 'children',
          label: 'text'
        },
        total: 0,
        startDate: '',
        endDate: ''
      }
    },
    watch: {
      message(val) {
        this.carValue = ''
        this.tmp.id = ''
        if (val) {
          this.carValue = val.vNo
          this.tmp.id = val.vId
          if (this.carValue) {
            this.getMessaged = true
          } else {
            this.getMessaged = false
          }
        }
      },
      replaySpeedVal(val) {
        console.log(val)
        this.$emit('speed', val)
      },
      rePlayDate(val) {
        console.log(val)
        if (val) {
          this.startDate = val[0]
          this.endDate = val[1]
          console.log(this.startDate, this.endDate)
        }
      }
    },
    mounted() {
      this.getMessaged = false
      deptTree().then(res => {
        console.log(res.data)
        this.treeData = [res.data]
      })
      news.$on('sendData', msg => {
        this.acceptData = msg
      })
    },
    created() {
      this.initWebSocket()
    },
    destroyed() {
      this.websocket.close()
    },
    methods: {
      getLineSpeed(val) {
        this.$emit('speed', val)
      },
      getRow(row) {
        console.log(row.id)
        this.tmp = row
      },
      initWebSocket() {
        const vm = this
        vm.websocket = new WebSocket(process.env.WEBSOCKET_API)
        vm.websocket.onopen = function() {
          console.log('数据发送中...')
        }
        vm.websocket.onmessage = function(evt) {
          console.log('数据已接收...')
          console.log(JSON.parse(evt.data).Body)
          vm.loading = false
          vm.wsStatus = JSON.parse(evt.data).Body.status
          vm.$emit('searchDatas', JSON.parse(evt.data).Body.TrackItems)
          vm.fullscreenLoading = false
        }
        vm.websocket.onerror = function() {
          vm.initWebSocket()
        }
      },
      // renderContent(h, { node, data, store }) {
      //   return (
      //     <span class='demo'>
      //       <i class='el-icon-menu'></i>
      //       <span>{node.label}</span>
      //       <span>({data.attributes.allCount})</span>
      //     </span>
      //   )
      // },
      replay() {
        this.$emit('isrePlay', true)
      },
      searchDatas() {
        if (this.carValue && this.rePlayDate) {
          this.fullscreenLoading = true
          const data = {
            Command: '22',
            CommandType: 'track',
            token: getToken('Admin-Token'),
            Body: {
              VehicleID: this.tmp.id,
              StartTime: this.startDate,
              EndTime: this.endDate,
              Interval: 30
            }
          }
          console.log(data)
          this.websocket.send(JSON.stringify(data))
        } else {
          this.$message.error('请选择查询条件！')
        }
      },
      pause() {
        this.$emit('isPause', false)
      },
      stop() {
        this.$emit('isStop', true)
        this.carValue = ''
        this.rePlayDate = ''
        this.getMessaged = false
      },
      handleNodeClick(val) {
        this.queryList.deptId = val.id
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryList.page = val
        this.getList()
      },
      search() {
        this.getList()
      },
      getList() {
        vehicleStatusList(this.queryList).then(res => {
          console.log(res)
          res.data.rows.forEach(item => {
            if (item.activeStatus === '1') {
              item.activeStatus = '在线'
            } else {
              item.activeStatus = '离线'
            }
          })
          this.tableData = res.data.rows
          this.total = res.data.totalCount
        })
      },
      choose() {
        if (this.radioVal === '-1') {
          this.$message({
            type: 'error',
            message: '请选择车辆'
          })
        } else {
          // this.$emit('emitInfo', this.tmp)
          this.carValue = this.tmp.plateNo
          this.allotDialogVisible = false
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      handleExport() {
        console.log(this.acceptData)
        news.$on('sendData', msg => {
          this.acceptData = msg
        })
        if (this.acceptData.length !== 0) {
          import('@/vendor/Export2Excel').then(excel => {
            const tHeader = ['上报时间', '经度', '纬度', '车速', '里程', '位置']
            const filterVal = ['dataTime', 'longitude', 'latitude', 'currentSpeed', 'currentMileage', 'site']
            const list = this.acceptData
            const data = this.formatJson(filterVal, list)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: '轨迹回放',
              autoWidth: true
            })
          })
        } else {
          this.$message.error('暂无数据！')
        }
      }
    }
  }
</script>

<style>
  .searchBox {
    width: 100%;
    height: 47px;
    background-color: #FFFFFF;
    position: absolute;
    top: 0;
    left: 0;
    font-size:12px;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .demo {
    border: 1px solid #467CBC;
    padding: 0 3px;
    border-radius: 4px;
    color: #467CBC;
  }
  .allotDialog .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: #628FA6;
  }
</style>
