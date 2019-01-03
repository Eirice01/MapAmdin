<template>
  <div class="early">
    <el-header class="header-plane" height="auto" >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="预警类型">
          <el-popover placement="bottom" >
            <menu-type-tree ref="menuType" style="height: 300px; overflow: auto" :treeMenuData="alarmMenus" :treeMenuProp="defaultProps" :checkedKeys="defaultChecked" @check-change="handleNodeChange"></menu-type-tree>
            <el-input  slot="reference" placeholder="请选择预警类型" v-model.trim="alarmTypeNames"  style="width:150px;" size="small" readonly></el-input>
          </el-popover>
          <span style="font-size: 14px; margin-right: 10px">已选择{{alarmCount}}种</span>
        </el-form-item>
        <el-form-item>
          <select-car-double ref="selectCarSingle" @selectedCar="selectedCar"></select-car-double>
        </el-form-item>
        <el-form-item label= "查询时间">
          <data-pickers ref="dataPickers" @startEnd="checkStartEnd"></data-pickers>
        </el-form-item>
        <el-form-item class="header-col" :md="{span:3}" :sm="{span:24}">
          <el-button @click="exportChecked" type="primary" size="mini" style="margin-left:10px; float: right">{{exportName}}</el-button>
          <el-button type="primary" size="mini"  @click="resetPage"  style="margin-left:10px; float: right">重置</el-button>
          <el-button @click="handleQuery" type="primary" size="mini" style="margin-left:10px; float: right">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <el-main>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>查询信息</span>
        </div>
        <el-collapse accordion >
          <el-collapse-item v-for="(obj,index) of resultData" :key="index" :label="index" >
            <template slot="title">
              <span style="color：'#fff' ">{{'车牌号：' + obj.plateNos }}</span>
              <span style="float: right">{{'总数：' + obj.totalCount }}</span>
            </template>
            <el-tabs v-model= "editableTabsValue" type="card">
              <el-tab-pane v-for = '(it,index2) of obj.lsit'
                  :key = 'index2'
                  :label = 'it.startTime + " (" + it.count + ")"'>
                <div style="margin-left:40%; color: red" v-if= "it.count == 0">当天没有数据</div>
                <el-checkbox-group v-model= "checkList"  @change= "changeBox">
                  <el-checkbox class='divfloat' 	 v-for= "(item,index) of it.alarmRecordList" :key= "index" :label= "item.rid" >
                    <div class='imgVideoShow' v-if= "item.media_type == 0">
                      <div  class='imgShow'>
                        <img class='imgss' :src= "item.media_url" @dblclick= "clickImg(item.media_url)"  title="单击选择导出，双击查看详细信息">
                      </div>
                      <div class='templateClass' >
                        <span>{{item.alarmTypeName }}</span>
                        <span style="float: right">{{item.alarmTime | formatDate}}</span>
                        <span style="float: right ">{{it.startTime}}&nbsp;&nbsp;</span>
                      </div>
                    </div>
                    <div class='imgVideoShow' v-if= "item.media_type == 2" >
                      <!-- <video class='videoShow' :src= "item.media_url" @dblclick= "clickVideo(item.media_url)"  title="单击选择导出，双击查看详细信息"></video> -->
                      <div class='videoShow'> 
                        <player class='videoShow'  :video-url= "item.media_url"></player> 
                      </div>
                      <div class='templateClass'>
                        <span>{{item.alarmTypeName }}</span>
                        <span style="float: right">{{item.alarmTime | formatDate}}</span>
                        <span style="float: right">{{it.startTime}}&nbsp;&nbsp;</span>
                      </div>
                      <!-- <p class="videoStart"  @click = "clickVideo(item.media_url)" title="播放"><i  class="el-icon-caret-right" ></i></p> -->
                    </div>
                  </el-checkbox>
                </el-checkbox-group>
              </el-tab-pane>
            </el-tabs>
          </el-collapse-item>
        </el-collapse>
      </el-card>  
    </el-main>
    <!-- <el-dialog class='videoDialog' :visible.sync="detialPlayVideo" @close="closePlay">
      <player :video-url= "videoUrl" :state= "state"></player> 
    </el-dialog> -->
    <!-- 放大图片 -->
    <big-img  class= "imgDialog" v-if= "showImg" @clickit="viewImg" :imgSrc= "imgSrc" style="z-index:99999"></big-img>
  <report-footer></report-footer>
  </div>
</template>
<script>
import { fetchList, getAlarmType, exportImgVideo } from '@/api/alarm/earlyWEI'
import menuTree from '@/components/MenuTree'
import selectCarDouble from '@/components/SelectCar/selectCarSingle'
// include  dateUtil
import { formatDate } from '@/utils/date'
// include  menuTypeTree
import menuTypeTree from '@/components/menuTypeTree'
import bigImg from '@/components/ImgShow/bigImg'
import player from '@/components/VideoPlayer/player'
// include lodash
import _ from 'lodash'
import mixins from '@/common/mixins'
export default {
  mixins: [mixins],
  components: { menuTree, menuTypeTree, selectCarDouble, player, bigImg },
  data() {
    return {
      // 预警类型开始
      alarmMenus: [],
      alarmTypeNames: '', // 已选择预警类型
      alarmTypeName: '', // 报警类型说明
      alarmCount: 0, // 已选预警类型数量
      // 预警类型结束
      resultData: [],
      state: false,
      exportName: '导出',
      exportData: {
        currentDate: '',
        rid: ''
      },
      listQuery: {
        page: 1,
        pageSize: 10,
        handlerType: '0',
        alarmType: '',
        plateNo: '',
        startTime: '',
        endTime: ''
      },
      // 图片视频区显示开始
      editableTabsValue: '0',
      showImg: false,
      detialPlayVideo: false,
      videoUrl: '',
      imgSrc: '',
      checkList: [],
      // 图片视频区显示结束
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultChecked: [],
      tableData: [{ num: '陕A123453', count: '111个' }],
      total: 0
    }
  },
  watch: {
    editableTabsValue: function() {
      this.state = true
    }
  },
  async created() {
    // 默认值
    await this.getAlarmTree()
    // 默认选择全部类型
    await this.initDefaultTypes()
  },
  filters: {
    formatDate(time) {
      const date = new Date(time)
      return formatDate(date, 'hh:mm:ss')
    }
  },
  methods: {
    // 预警类型开始
    /**
     * 初始化预警类型数据
     * @param
     */
    async getAlarmTree() {
      const result = await getAlarmType()
      this.alarmMenus = [result.data.驾驶员状态预警, result.data.车辆状态预警]
    },
    /**
     * 初始化表格数据
     * @param
     */
    async getList() {
      const result = await fetchList(this.listQuery)
      this.tableToatal = result.data.totalCount
    },
    // 选中默认类型
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
    // 预警类型结束
    // 选择车辆开始
    /**
     * 子组件传给父组件的值
     * @param val
     */
    selectedCar(val) {
      this.listQuery.plateNo = val
    },
    // 选择车辆结束
    // 图片视频区显示开始
    clickVideo(e) {
      this.detialPlayVideo = true
      this.videoUrl = e
    },
    // 图片放大
    clickImg(e) {
      this.showImg = true
      // 获取当前图片地址
      this.imgSrc = e
    },
    viewImg() {
      this.showImg = false
    },
    closePlay() {
      this.detialPlayVideo = false
    },
    changeBox() {
      if (this.checkList.length > 0) {
        this.exportName = '确定'
      } else {
        this.exportName = '导出'
      }
    },
    // 图片视频区显示结束
    /**
     * 根据筛选条件查询列表
     * @param
     */
    open() {
      this.$message('请选择你要查询的车辆的车牌号')
    },
    async handleQuery() {
      if (this.alarmCount === 0) {
        this.$message('预警类型不能为空')
      }
      this.editableTabsValue = '0'
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.resultData = []
      const result = await fetchList(this.listQuery)
      this.tableToatal = result.data.totalCount
      this.resultData = result.data
    },
    async resetPage() {
      this.$refs.selectCarSingle.clearSelected()
      this.listQuery.page = 1
      this.listQuery.pageSize = 10
      this.listQuery.handlerType = 0
      this.listQuery.alarmType = ''
      this.listQuery.plateNo = ''
      this.$refs.dataPickers.resetDate()
      await this.initDefaultTypes()
      const the = this
      // 重置需要延迟 因为选择全部需要一个时间段 data的数据还未被刷新
      setTimeout(function() {
        the.handleQuery()
      }, 300)
    },
    // 导出
    exportChecked() {
      this.exportData.currentDate = this.resultData[0].lsit[
        this.editableTabsValue
      ].startTime
      this.exportData.rid = this.checkList.join()
      exportImgVideo(this.exportData)
        .then(res => {
          this.downloads(res)
        })
        .catch(res => {
          this.downloads(res)
        })
    },

    downloads(data) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]), {
        type: 'application/octet-stream'
      })
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', this.exportData.currentDate + '.zip')
      document.body.appendChild(link)
      link.click()
    },

    /**
     * 选择预警类型
     * @param val
     */
    async handleNodeChange(val) {
      const arr = []
      const tmp = []
      this.alarmCount = val.length
      val.forEach(item => {
        arr.push(item.code)
        tmp.push(item.label)
      })
      this.listQuery.alarmType = arr.join()
      this.alarmTypeNames = tmp.join()
    }
  }
}
</script>
<style scoped>
.detialPlayVideo {
  width: 80%;
  height: 60%;
}
.clearfix{
  color: #4077bc
}
.early .el-popover {
  height: 300px;
  overflow-y: scroll;
}
/* .early .el-radio-group {
    margin: 36px 0 0 50px;
  } */
.early .el-dialog__body {
  padding: 5px 20px;
}
.myTheader {
  background-color: #4077bc;
  color: #fff;
}
.early .el-dialog__header {
  background-color: #4077bc;
  height: 40px;
  padding-top: 10px;
}
.early .el-dialog__header span {
  color: #fff;
  font-size: 14px;
}
.early .el-dialog__header i {
  color: #fff;
}
.el-card__header {
  background-color: #4077bc
}
.early .el-checkbox__inner {
  /* position: absolute;
    margin-top: 100px; */
  border: 2px solid black;
}
.msgManager:hover {
  color: #4077bc;
  cursor: pointer;
}
.early .el-dialog__headerbtn {
  top: 10px;
}
.early .el-tabs__content {
  width: 1380px;
}
.divfloat {
  margin-top: 20px;
  margin-right: 5%;
  width: 20%;
  float: left;
}
.divfloat .imgVideoShow {
  width: 100%;
  height: 100%;
}
.imgVideoShow .templateClass {
  margin-left: 2%;
  margin-top: 5px;
  width: 100%;
  z-index: 50;
  color: black;
}
.imgVideoShow .imgShow {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
}
.imgShow .imgss {
  z-index: 50;
  width: 100%;
  overflow: hidden;
}
.imgVideoShow .videoShow {
  width: 100%;
  height: 180px;
  background-color: black;
  z-index: 999;
}
.imgVideoShow .videoShow .vjs-tech{
  margin-left: 20%;
  width: 100%;
  height: 180px;
  z-index: 999;
}
.videoStart {
  position: absolute;
  margin-top: -130px;
  margin-left: 100px;
  z-index: 100;
  color: whitesmoke;
  font-size: 40px;
}
.iconSuccess {
  position: absolute;
  margin-top: -160px;
  margin-left: 10px;
  z-index: 100;
  font-size: 30px;
}
</style>
