<template>
  <div class="app-container">
    <el-container>
      <el-header class="header-plane" height="auto">
        <el-form :inline="true"  class="demo-form-inline">
          <el-form-item label="处理情况">
            <el-select v-model.trim="listQuery.handlerType"placeholder="请选择" style="width:90px;"size="small">
              <el-option v-for="item in options":key="item.value":label="item.label":value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报警来源">
            <el-select v-model.trim="listQuery.alarmSource"
                       placeholder="请选择"
                       style="width:90px;"
                       size="small">
              <el-option v-for="item in optionsSource"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报警类型">
            <el-popover placement="bottom"
                        width="250">
              <menu-type-tree ref="menuType" style="height: 300px; overflow: auto" :treeMenuData="alarmMenus"
                              :treeMenuProp="defaultProps" :checkedKeys="defaultChecked"
                              @check-change="handleNodeChange"></menu-type-tree>
              <el-input slot="reference"
                        placeholder="请选择报警类型"
                        v-model.trim="alarmTypeName"
                        style="width:140px;"
                        size="small" readonly></el-input>
            </el-popover>
            <span style="font-size: 14px">已选择{{alarmCount}}种</span>
          </el-form-item>
          <el-form-item  v-show="listQuery.handlerType === '0'">
            <batch-handle :selectRows="selectRows" seccuss-message="报警处理成功"></batch-handle>
          </el-form-item>
          <el-form-item>
            <select-car-single @selectedCar="selectedCar"></select-car-single>
          </el-form-item>
          <el-form-item label="查询时间">
            <data-pickers @startEnd="checkStartEnd"></data-pickers>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"type="primary"size="mini">查询</el-button>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main style="padding-bottom: 0px">
        <el-table :data="tableData"
                  :columns="tableColumns"
                  v-loading.body="listLoading" border stripe
                  style="width:100%; border-radius: 5px; box-shadow: 0 0 10px #ccc"
                  @selection-change="handleSelect">
          <el-table-column align="center"
                           type="selection"
                           width="40"
                           @selection-change="handleSelect">
          </el-table-column>
          <el-table-column align="center"
                           v-for="column in tableColumns"
                           :key="column.key"
                           :label="column.title"
                           :width="column.width">
            <template slot-scope="scope">
              <el-button v-if="column.key === 'alarmName'" type="text" @click="handleDetail(scope.row)">
                {{scope.row[column.key]}}
              </el-button>
              <span v-else-if="column.key === 'handlerType'" v-text="handlerTypeformatter(scope.row[column.key])"></span>
              <span v-else>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer>
        <!-- 分页区 -->
        <el-pagination class="pagination-plane" background
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="listQuery.page"
                       :page-sizes="[10, 20, 30, 50]"
                       :page-size="listQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="tableToatal">
        </el-pagination>
      </el-footer>
    </el-container>
    <alarm-info :dialogTitle="dialogTitle" :is-disable="false" :is-show="isAalarm" @close="closeAlarm" :recordId="recordId"></alarm-info>
    <report-footer></report-footer>
  </div>
</template>

<script>
  import mixins from '@/common/mixins'
  import { callAlarmtype, fetchList } from '@/api/vehicleMonitor/realtime'
  import selectCarSingle from '@/components/SelectCar/selectCarSingle'
  import menuTree from '../intelligentEWP/menuTree'
  import vehicleDialog from '../intelligentEWP/vehicleDialog'
  import _ from 'lodash'
  export default {
    name: 'vehicleAP',
    components: { menuTree, vehicleDialog, selectCarSingle },
    mixins: [mixins],
    data() {
      return {
        total: 0,
        option: 1,
        warningProcessDialog: false,
        alarmTypeName: '', // 已选择报警类型
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
        optionsSource: [
          {
            label: '全部',
            value: '0'
          },
          {
            label: '平台报警',
            value: '1'
          },
          {
            label: '整车报警',
            value: '2'
          }
        ],
        tableData: [],
        tableToatal: 0,
        tableColumns: [],
        columns: [
          {
            key: 'plateNo',
            title: '车牌号',
            width: '100'
          },
          {
            key: 'deptName',
            title: '所属机构',
            width: '100'
          },
          {
            key: 'driverName',
            title: '司机',
            width: '100'
          },
          {
            key: 'phone',
            title: '联系电话',
            width: '140'
          },
          {
            key: 'alarmName',
            title: '报警类型',
            width: '200'
          },
          {
            key: 'alarmSourceName',
            title: '报警来源',
            width: '200'
          },
          {
            key: 'alarmTime',
            title: '报警时间',
            width: '200'
          },
          {
            key: 'alarmAddress',
            title: '报警位置'
          }
        ],
        columnsTwo: [
          {
            key: 'plateNo',
            title: '车牌号',
            width: '80'
          },
          {
            key: 'deptName',
            title: '所属机构',
            width: '100'
          },
          {
            key: 'driverName',
            title: '司机',
            width: '70'
          },
          {
            key: 'phone',
            title: '联系电话',
            width: '110'
          },
          {
            key: 'alarmName',
            title: '报警类型',
            width: '100'
          },
          {
            key: 'alarmSourceName',
            title: '报警来源',
            width: '100'
          },
          {
            key: 'alarmTime',
            title: '报警时间',
            width: '120'
          },
          {
            key: 'handlerTime',
            title: '处理时间',
            width: '120'
          },
          {
            key: 'handleTimeLong',
            title: '处理时长',
            width: '80'
          },
          {
            key: 'userName',
            title: '处理用户',
            width: '80'
          },
          {
            key: 'handlerType',
            title: '处理方式',
            width: '100'
          },
          {
            key: 'content',
            title: '处理内容',
            width: '140'
          },
          {
            key: 'alarmAddress',
            title: '报警位置'
          }
        ],
        listQuery: {
          page: 1,
          pageSize: 10,
          handlerType: '0',
          alarmSource: '0',
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
    async created() {
      if (this.listQuery.handlerType === '1') {
        this.tableColumns = this.columnsTwo
      } else {
        this.tableColumns = this.columns
      }
      await this.getAlarmTree()
      await this.initDefaultTypes()
    },
    async mounted() {
      await this.getCautionList()
    },
    methods: {
      /**
       * 初始化报警类型数据
       * @param
       */
      async getAlarmTree() {
        const result = await callAlarmtype()
        this.alarmMenus = [result.data.平台报警, result.data.整车报警]
      },
      /**
       * 处理情况
       * @param
       */
      refshTable() {
        if (this.listQuery.handlerType === '1') {
          this.tableColumns = this.columnsTwo
        } else {
          this.tableColumns = this.columns
        }
        this.getCautionList()
      },
      /**
       * 初始化表格数据
       * @param
       */
      async getCautionList() {
        debugger
        this.listLoading = true
        const result = await fetchList(this.listQuery)
        const handlingType = this.listQuery.handlerType
        if (handlingType === '1') {
          this.tableColumns = this.columnsTwo
        } else {
          this.tableColumns = this.columns
        }
        this.tableData = result.data.rows
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
        await this.getCautionList()
        this.listLoading = false
      },

      /**
       * table点击下一页
       * @param
       */
      async handleCurrentChange(val) {
        this.listLoading = true
        this.listQuery.page = val
        await this.getCautionList()
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
        await this.getCautionList()
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
       * 选择报警类型
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

