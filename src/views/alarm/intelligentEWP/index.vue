<template>
  <div class="app-container">
    <el-container>
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="处理情况">
            <el-select v-model.trim="listQuery.handlerType"  placeholder="请选择" style="width:90px;" size="small">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="预警类型">
            <el-popover placement="bottom">
            <menu-type-tree ref="menuType" style="height: 300px; overflow: auto" :treeMenuData="alarmMenus"
            :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"
            @check-change="handleNodeChange"></menu-type-tree>
            <el-input slot="reference" placeholder="请选择预警类型" v-model.trim="alarmTypeName" style="width:150px;"
            size="small" readonly></el-input>
            </el-popover>
            <span style="font-size: 14px">已选择{{alarmCount}}种</span>
          </el-form-item>
          <el-form-item v-if="listQuery.handlerType ==='0'"  >
            <batch-handle :selectRows="selectRows"></batch-handle>
          </el-form-item>
          <el-form-item>
            <select-car-single @selectedCar="selectedCar"></select-car-single>
          </el-form-item>
          <el-form-item label="查询时间">
            <data-pickers @startEnd="checkStartEnd"></data-pickers>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery" type="primary" size="mini" style="margin-left:10px;">查询</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main style="padding-bottom:0px;">
        <el-table :data="tableList" :columns="columns" v-loading.body="listLoading" border stripe
                  style=" border-radius: 5px; box-shadow: 0 0 10px #ccc" @selection-change="handleSelect">
          <el-table-column align="center" type="selection" width="40"
                           @selection-change="handleSelect"></el-table-column>
          <el-table-column align="center" type="index" width="50" label="序号"></el-table-column>
          <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title"
                           :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmName'" type="text" @click="handleDetail(scope.row)">
                {{scope.row[column.key]}}
              </el-button>
              <!--<span v-else-if="column.key ==='handlerType'">-->
                <!--{{handlerTypeformatter(scope.row[column.key])}}-->
              <!--</span>-->
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination class="pagination-plane" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper" :total="tableToatal">
        </el-pagination>
      </el-footer>
    </el-container>
    <alarm-info :dialogTitle="dialogTitle" :is-disable="false" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
    <report-footer></report-footer>
  </div>
</template>

<script>
  import mixins from '@/common/mixins'
  import { fetchList, getAlarmType } from '@/api/alarm/intelligentEWP'
  import selectCarSingle from '@/components/SelectCar/selectCarSingle'
  import menuTree from './menuTree'
  import vehicleDialog from './vehicleDialog'
  import _ from 'lodash'

  export default {
    name: 'intelligentEWP',
    inject: ['reload'],
    components: { menuTree, vehicleDialog, selectCarSingle },
    mixins: [mixins],
    data() {
      return {
        eqValue: 'VEHICLE_QH_ADAS', // 设备的值
        total: 0,
        option: 1,
        alarmTypeName: '', // 已选择预警类型
        alarmMenus: [],
        checkedCities: ['紧急', 'TTS播读'],
        selectRows: [], // 选中的行数据
        alarmCount: 0,
        options: [
          {
            label: '未处理',
            value: '0'
          },
          {
            label: '已处理',
            value: '1'
          }
        ],
        tableList: [],
        tableToatal: 0,
        columns: [],
        columns1: [
          {
            key: 'plateNo',
            title: '车牌号'
          },
          {
            key: 'deptName',
            title: '所属机构'
          },
          {
            key: 'driverName',
            title: '司机'
          },
          {
            key: 'phone',
            title: '联系电话'
          },
          {
            key: 'alarmName',
            title: '预警类型'
          },
          {
            key: 'alarmTime',
            title: '预警时间'
          },
          {
            key: 'alarmAddress',
            title: '预警位置'
          }
        ],
        columns2: [
          {
            key: 'plateNo',
            title: '车牌号'
          },
          {
            key: 'deptName',
            title: '所属机构'
          },
          {
            key: 'driverName',
            title: '司机'
          },
          {
            key: 'phone',
            title: '联系电话'
          },
          {
            key: 'alarmName',
            title: '预警类型'
          },
          {
            key: 'alarmTime',
            title: '预警时间'
          },
          {
            key: 'handlerTime',
            title: '处理时间'
          },
          {
            key: 'handleTimeLong',
            title: '处理时长'
          },
          {
            key: 'userName',
            title: '处理用户'
          },
          {
            key: 'handlerType',
            title: '处理方式'
          },
          {
            key: 'content',
            title: '处理内容'
          },
          {
            key: 'alarmAddress',
            title: '预警位置'
          }
        ],
        listQuery: {
          page: 1,
          pageSize: 10,
          handlerType: '0',
          alarmType: '',
          plateNo: '',
          startTime: '',
          endTime: ''
        },
        defaultChecked: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    computed: {
      textarea: {
        get() {
          const arr = this.msgTemplate
          const id = this.listQuery.timeZone
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].id === id) {
              this.messageTextarea = arr[i].content
              return arr[i].content
            }
          }
          return ''
        },
        set(val) {
          this.messageTextarea = val
        }
      }
    },
    watch: {
      // startEnd(val) {
      //   if (val) {
      //     this.listQuery.startTime = val[0]
      //     this.listQuery.endTime = val[1]
      //   } else {
      //     this.listQuery.startTime = ''
      //     this.listQuery.endTime = ''
      //   }
      // }
    },
    async created() {
      if (this.listQuery.handlerType === '0') {
        this.columns = this.columns1
      } else {
        this.columns = this.columns2
      }
      await this.getAlarmTree()
      await this.initDefaultTypes()
    },
    async mounted() {
      await this.getList()
    },
    methods: {
      /**
       * 初始化报警类型
       * @param
       */
      async getAlarmTree() {
        const result = await getAlarmType()
        this.alarmMenus = [result.data.外设检测预警, result.data.车辆状态预警, result.data.驾驶员状态预警]
      },
      /**
       * 初始化表格数据
       * @param
       */
      async getList() {
        this.listLoading = true

        const result = await fetchList(this.listQuery)
        this.tableList = result.data.rows
        this.tableToatal = result.data.totalCount
        this.listLoading = false
      },
      handleSelect(val) { // 选择处理事件
        this.selectRows = val
      },
      /**
       * 选择table每页显示条数并查询
       * @param
       */
      async handleSizeChange(val) {
        this.listLoading = true
        this.listQuery.pageSize = val
        await this.getList()
        this.listLoading = false
      },

      /**
       * table点击下一页
       * @param
       */
      async handleCurrentChange(val) {
        this.listLoading = true
        this.listQuery.page = val
        await this.getList()
        this.listLoading = false
      },
      /**
       * 根据筛选条件查询列表
       * @param
       */
      async handleQuery() {
        this.listLoading = true
        this.listQuery.page = 1
        this.listQuery.pageSize = 10
        if (this.listQuery.handlerType === '0') {
          this.columns = this.columns1
        } else {
          this.columns = this.columns2
        }
        await this.getList()
        this.listLoading = false
      },
      /**
       * 子组件传给父组件的值
       * @param val
       */
      selectedCar(val) {
        this.listQuery.plateNo = val
      },
      async initDefaultTypes() {
        const the = this
        var defaultChecked = []
        _.forEach(the.alarmMenus, function(v, i) {
          if (_.get(v, 'children')) {
            defaultChecked.push(_.get(v, 'code'))
          }
        })
        the.$refs.menuType.$refs.menu.setCheckedKeys(defaultChecked)
      },
      /**
       * 选择预警类型
       * @param val
       */
      handleNodeChange(val) {
        const arr = []
        const tmp = []
        this.alarmCount = val.length
        val.forEach(item => {
          arr.push(item.code)
          tmp.push(item.label)
        })
        this.listQuery.alarmType = arr.join()
        this.alarmTypeName = tmp.join()
      },
      handlerTypeformatter(n) {
        switch (n) {
          case 0:
            return '未处理'
          case 1:
            return '电话通知'
          case 2:
            return '建议停车'
          case 3:
            return '警告提醒'
          case 4:
            return '停车休息'
          case 5:
            return '语音下发'
          case 6:
            return '其他'
          default:
            return '出错啦'
        }
      }

    }
  }
</script>

<style scope>
  .canClick {
    color: #488aff
  }

  .app-container .el-popover {
    height: 300px;
    overflow-y: scroll;
  }

  .app-container .el-dialog__body {
    padding: 5px 20px;
  }

  .app-container .el-table__header-wrapper table thead tr th {
    background-color: #4077BC;
    color: #fff
  }

  .app-container .el-dialog__header {
    background-color: #4077BC;
    height: 40px;
    padding-top: 10px;
  }

  .app-container .el-dialog__header span {
    color: #fff;
    font-size: 14px
  }

  .app-container .el-dialog__header i {
    color: #fff;
  }

  .msgManager:hover {
    color: #4077BC;
    cursor: pointer;
  }

  .app-container .el-dialog__headerbtn {
    top: 10px
  }

</style>

