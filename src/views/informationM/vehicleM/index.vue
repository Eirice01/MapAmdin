<template>
  <div class="deviceLayout">
    <!-- 头部条件查询区域 -->
    <div class="dataFilter">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="运行状态">
          <el-select clearable v-model="listQuery.activeStatus" placeholder="请选择" size="small" style="width:120px">
            <el-option v-for="item in activeStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆状态">
          <el-select clearable v-model="listQuery.status" placeholder="请选择" size="small" style="width:120px">
            <el-option v-for="item in vehicleStatusList" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车牌号">
          <el-input clearable maxlength="20" size="small" v-model.trim="listQuery.plateNo" placeholder="车牌号" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="VIN号">
          <el-input clearable maxlength="20" size="small" v-model.trim="listQuery.vin" placeholder="VIN号" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="主设备ID">
          <el-input clearable maxlength="20" size="small" v-model.trim="listQuery.mainDeviceIds" placeholder="主设备ID" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="副设备ID">
          <el-input clearable maxlength="20" size="small" v-model.trim="listQuery.viceDeviceIds" placeholder="副设备ID" style="width:120px"></el-input>
        </el-form-item>
        <el-form-item label="选择机构">
          <el-popover trigger="focus" placement="bottom" v-model="visible">
            <el-tree default-expand-all :data="deptList" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            <el-input slot="reference" readonly size="small" v-model.trim="listQuery.deptName" placeholder="所属机构"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" @click="handleQuery" type="primary" size="small">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-refresh" @click="handleReset" type="primary" size="small">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-plus" @click="handleCreate" type="primary" size="small">新增</el-button>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-delete" @click="handleDelete" type="primary" size="small">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-popover trigger="click" placement="bottom" v-model="deptVisible">
            <el-input prefix-icon="el-icon-search" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-tree default-expand-all :data="deptList" :props="defaultProps" ref="tree" node-key="id" @node-click="changeDept" :filter-node-method="filterNode" :highlight-current="true"></el-tree>
            <el-button type="primary" @click="editDept" size="mini" style="width:90%;margin:0 5%">确 定</el-button>
            <el-button slot="reference" @click="openDeptTree" icon="el-icon-edit" type="primary" size="small">修改机构</el-button>
          </el-popover>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-upload" @click="handleImport" type="primary" size="small">导入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-main>
      <el-table @selection-change="handleSelect" :data="data" :columns="columns" v-loading.body="listLoading" border stripe highlight-current-row style="width:100%;font-size:13px;">
        <el-table-column align="center" type="selection" width="40" @selection-change="handleSelect"></el-table-column>

        <el-table-column align="center" type="index" label="序号" fixed="left" width="60px"></el-table-column>

        <el-table-column align="center" v-for="column in columns" :key="column.key" :label="column.title" :width="column.width">
          <template slot-scope="scope">
            <span :class="scope.row[column.key] === '1' ? onlineClass : offlineClass" v-if="column.key === 'activeStatus'">{{scope.row[column.key] === '0' ? '离线' : scope.row[column.key] === '1' ? '在线' : '未知' }}</span>
            <span v-else>{{scope.row[column.key]}}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" fixed="right" width="300px">
          <template slot-scope="scope">
            <el-button type="info" size="small" icon="el-icon-message" @click="viewDetail(scope.row)">查看</el-button>
            <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-main>
      <!-- 分页区 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
      :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- 新增车辆dialog -->
    <el-dialog class="vehicle_create_dialog" :title="textMap[dialogStatus]" :visible.sync="addEquipmentDialog" center :close-on-click-modal="false">
      <!-- 新增设备dialog -->
      <el-dialog title="新增设备" :visible.sync="addDeviceDialog" center append-to-body :close-on-click-modal="false">
        <!-- 新增SIM卡dialog -->
        <el-dialog title="添加SIM卡" :visible.sync="addDeviceSimDialog" center append-to-body width="30%" :close-on-click-modal="false">
          <el-form :model="deviceSimForm" :rules="deviceSimRules" ref="deviceSimForm">
            <el-form-item label="SIM卡号" prop="code">
              <el-input maxlength="20" placeholder="请输入SIM卡号" v-model.trim="deviceSimForm.code" style="width:70%"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" style="text-align:right">
            <el-button @click="addDeviceSimDialog = false">取 消</el-button>
            <el-button type="primary" @click="createDeviceSim('deviceSimForm')">确 定</el-button>
          </div>
        </el-dialog>

        <!-- 选择SIM卡dialog -->
        <el-dialog title="选择SIM卡" :visible.sync="simDialog" center append-to-body :close-on-click-modal="false">
          <el-form :inline="true" :model="simQuery" class="demo-form-inline">
            <el-form-item label="SIM卡号">
              <el-input maxlength="11" size="small" v-model.trim="simQuery.simCode" placeholder="SIM卡号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-search" @click="querySim" type="primary" size="small">查询</el-button>
            </el-form-item>
          </el-form>

          <el-table :data="simData" border stripe highlight-current-row style="font-size:13px;">
            <el-table-column align="center" type="index" label="序号" fixed="left" width="50px"></el-table-column>
            <el-table-column align="center" prop="simCode" key="code" label="SIM卡号"></el-table-column>
            <el-table-column align="center" prop="deptName" key="name" label="所属机构"></el-table-column>

            <el-table-column align="center" label="操作" fixed="right" width="90px">
              <template slot-scope="scope">
                <el-button @click="selectSim(scope.row)" size="small" type="text">
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页区 -->
          <el-pagination background @size-change="handleSimSizeChange" @current-change="handleSimCurrentChange" :current-page="simQuery.pageNum"
            :page-sizes="[10,20,30, 50]" :page-size="simQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="simTotal" style="margin-top:20px;">
          </el-pagination>
        </el-dialog>

        <el-form :model="deviceForm" :rules="deviceRules" ref="deviceForm">
          <el-row class="create_dialog_row">
            <el-col :span="11">
              <el-form-item label="设备ID" prop="deviceId">
                <el-input maxlength="20" placeholder="请输入设备ID" v-model.trim="deviceForm.deviceId" style="width:70%"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <span>&nbsp;</span>
            </el-col>
            <el-col :span="11">
              <el-form-item label="序  列  号" prop="serialNumber">
                <el-input maxlength="20" v-model.trim="deviceForm.serialNumber" placeholder="请输入设备序列号" style="width:70%" size="small"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="create_dialog_row">
            <el-col :span="11">
              <el-form-item label="设备类型" prop="deviceType">
                <el-select disabled v-model="deviceForm.deviceType" placeholder="请选择设备类型" style="width:70%" size="small">
                  <el-option v-for="item in deviceTypeList" :key="item.deviceType" :label="item.deviceTypeDes" :value="item.deviceType"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <span>&nbsp;</span>
            </el-col>
            <el-col :span="11">
              <el-form-item label="SIM卡号" prop="simId">
                <el-input @focus="queryUnbindSim" placeholder="请选择SIM卡" v-model="deviceForm.simCode" class="input-with-select" style="width:60%"></el-input>
                <el-button @click="addDeviceSim" type="text" style="width:9%"><i class="el-icon-plus"></i></el-button>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="create_dialog_row">
            <el-col :span="11">
              <el-form-item label="设备型号" prop="model">
                <el-select v-model="deviceForm.model" placeholder="请选择设备型号" style="width:70%" size="small">
                  <el-option v-for="item in modelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <span>&nbsp;</span>
            </el-col>
            <el-col :span="11">
              <el-form-item label="设备厂商" prop="manufacturer">
                <el-select v-model="deviceForm.manufacturer" placeholder="设备厂商" style="width:70%" size="small">
                  <el-option v-for="item in manufacturerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer" style="text-align:right">
          <el-button @click="addDeviceDialog = false">取 消</el-button>
          <el-button type="primary" @click="deviceAdd('deviceForm')" :disabled="isDisable">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 分配司机dialog -->
      <el-dialog title="分配司机" :visible.sync="driverDialog" center append-to-body :close-on-click-modal="false">
        <el-form :inline="true" :model="driverQuery" class="demo-form-inline">
          <el-form-item label="司机姓名">
            <el-input maxlength="20" size="small" v-model.trim="driverQuery.driverName" placeholder="司机姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="queryDriver" type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table :data="driverData" :columns="driverCol" border stripe highlight-current-row style="font-size:13px;">
          <el-table-column align="center" type="index" label="序号" fixed="left" width="50px"></el-table-column>

          <el-table-column align="center" v-for="column in driverCol" :key="column.key" :label="column.title" :min-width="column.width">
            <template slot-scope="scope">
              <span>{{scope.row[column.key]}}</span>
            </template>
          </el-table-column>

          <el-table-column align="center" label="操作" fixed="right" width="90px">
            <template slot-scope="scope">
              <el-button @click="selectDriver(scope.row)" size="small" type="text">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination style="margin-top:20px" background @size-change="handleDriverSizeChange" @current-change="handleDriverCurrentChange" :current-page="driverQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="driverQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="driverTotal">
        </el-pagination>
      </el-dialog>

      <!-- 选择设备 -->
      <el-dialog title="选择设备" :visible.sync="deviceSelectDialog" center append-to-body :close-on-click-modal="false">
        <el-form :inline="true" :model="deviceListQuery" class="demo-form-inline">
          <el-form-item label="SIM卡号">
            <el-input maxlength="11" size="small" v-model.trim="deviceListQuery.simCode" placeholder="SIM卡号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" @click="queryDevice" type="primary" size="small">查询</el-button>
          </el-form-item>
        </el-form>

        <el-table size="mini" :data="deviceData" border stripe highlight-current-row style="font-size:13px;">
          <el-table-column align="center" type="index" label="序号" fixed="left" width="50px"></el-table-column>
          <el-table-column align="center" prop="deviceId" key="deviceId" label="设备ID"></el-table-column>
          <el-table-column align="center" prop="deviceTypeDes" key="deviceTypeDes" label="设备类型" width="100px"></el-table-column>
          <el-table-column align="center" prop="simCode" key="simCode" label="SIM卡号"></el-table-column>
          <el-table-column align="center" prop="deptName" key="deptName" label="所属机构"></el-table-column>

          <el-table-column align="center" label="操作" fixed="right" width="90px">
            <template slot-scope="scope">
              <el-button @click="deviceTableSelect(scope.row)" size="small" type="text">
                选择
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区 -->
        <el-pagination style="margin-top:20px" background @size-change="handleDeviceSizeChange" @current-change="handleDeviceCurrentChange" :current-page="deviceListQuery.page"
          :page-sizes="[10,20,30, 50]" :page-size="deviceListQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="deviceTotal">
        </el-pagination>
      </el-dialog>

      <el-tabs v-model="activeName">
        <el-tab-pane label="车辆信息" name="first">
          <el-form :model="form" :rules="rules" ref="addForm">
            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="车牌号" prop="plateNo">
                  <el-input :disabled="dialogStatus === 'detail'" maxlength="90" v-model.trim="form.plateNo" placeholder="车牌号" style="width:60%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="车牌颜色" prop="plateColor">
                  <el-select :disabled="dialogStatus === 'detail'" v-model="form.plateColor" placeholder="请选择" style="width:60%" size="small">
                    <el-option v-for="item in plateColorList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="所属机构" prop="deptId">
                  <el-popover :disabled="dialogStatus === 'detail'" trigger="focus" placement="bottom" v-model="dialogDeptVisable">
                    <el-tree default-expand-all :data="deptList" :props="defaultProps" @node-click="dialogNodeClick"></el-tree>
                    <el-input :disabled="dialogStatus === 'detail'" readonly slot="reference" size="small" v-model.trim="form.deptName" placeholder="所属机构" style="width:60%"></el-input>
                  </el-popover>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="车辆状态" prop="status">
                  <el-select :disabled="dialogStatus === 'detail'" v-model="form.status" placeholder="请选择" style="width:60%" size="small">
                    <el-option v-for="item in vehicleStatusList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="车辆类型" prop="vehicleType">
                  <el-select :disabled="dialogStatus === 'detail'" v-model="form.vehicleType" placeholder="请选择" style="width:60%" size="small">
                    <el-option v-for="item in vehicleTypeList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="VIN号" prop="vin">
                  <el-input maxlength="50" :disabled="dialogStatus === 'detail'" v-model.trim="form.vin" placeholder="vin号" size="small" style="width:60%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="车辆品牌">
                  <el-select :disabled="dialogStatus === 'detail'" v-model="form.vehicleBrand" placeholder="请选择" style="width:60%" size="small">
                    <el-option v-for="item in vehicleBrandList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="司机">
                  <el-input readonly @focus="openDriverDialog" :disabled="dialogStatus === 'detail'" placeholder="司机" v-model.trim="form.driverName" style="width:60%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="核载重量">
                  <el-input maxlength="10" :disabled="dialogStatus === 'detail'" placeholder="当前品牌车辆核载重量" v-model.trim="form.loadWeight" style="width:60%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <!-- <el-col :span="11">
                <el-form-item label="司机性别">
                  <el-input disabled placeholder="司机性别" v-model.trim="form.sexDes" style="width:60%"></el-input>
                </el-form-item>
              </el-col> -->
              <el-col :span="11">
                <el-form-item label="司机联系方式">
                  <el-input disabled placeholder="司机联系方式" v-model.trim="form.driverPhone" style="width:60%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="核载人数">
                  <el-input maxlength="10" :disabled="dialogStatus === 'detail'" placeholder="当前品牌车辆核载人数" v-model.trim="form.loadNumber" style="width:60%"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="车辆颜色">
                  <el-input maxlength="20" :disabled="dialogStatus === 'detail'" placeholder="车辆颜色" v-model.trim="form.vehicleColor" style="width:60%"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="23">
                <el-form-item label="服务时间段">
                  <el-date-picker :editable="false" :disabled="dialogStatus === 'detail'" style="width:80%" format="yyyy-MM-dd" value-format="yyyy-MM-dd" v-model="startEnd" type="daterange" range-separator="——" start-placeholder="服务开始时间" end-placeholder="服务结束时间"></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

          </el-form>
        </el-tab-pane>

        <el-tab-pane label="设备信息" name="second">
          <el-form :model="deviceObj" :rules="rules" ref="deviceObj">
            <div style="color:#488aff">主设备(定位设备)：</div>
            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="设备ID" prop="deviceId">
                  <el-input @focus="selectDevice" v-model.trim="deviceObj.deviceId" maxlength="20" readonly :disabled="dialogStatus === 'detail' || dialogStatus === 'update'" placeholder="设备ID" style="width:60%" size="small"></el-input>
                  <el-button @click="addDevice" v-if="dialogStatus === 'create'" type="text" style="width:9%"><i class="el-icon-plus"></i></el-button>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="SIM卡号">
                  <el-input maxlength="20" disabled v-model.trim="deviceObj.simCode" placeholder="sim卡号" style="width:60%" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="设备类型">
                  <el-select disabled v-model="deviceObj.deviceType" placeholder="设备类型" style="width:60%" size="small">
                    <el-option v-for="item in deviceTypeList" :key="item.deviceType" :label="item.deviceTypeDes" :value="item.deviceType"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="设备厂商">
                  <el-select disabled v-model="deviceObj.manufacturer" placeholder="设备厂商" style="width:70%" size="small">
                    <el-option v-for="item in mainManufacturerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="设备序列号">
                  <el-input maxlength="20" disabled v-model.trim="deviceObj.serialNumber" placeholder="设备序列号" style="width:60%" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="设备型号">
                  <el-input maxlength="20" disabled v-model.trim="deviceObj.model" placeholder="设备型号" style="width:60%" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form :model="viceDeviceObj" :rules="rules" ref="viceDeviceObj">
            <div style="color:#488aff">副设备(非定位设备)：</div>
            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="设备ID" prop="deviceId">
                  <el-input @focus="selectViceDevice" v-model.trim="viceDeviceObj.deviceId" maxlength="20" readonly :disabled="dialogStatus === 'detail' || dialogStatus === 'update'" placeholder="设备ID" style="width:60%" size="small"></el-input>
                  <el-button @click="viceAddDevice" v-if="dialogStatus === 'create'" type="text" style="width:9%"><i class="el-icon-plus"></i></el-button>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="SIM卡号">
                  <el-input maxlength="20" disabled v-model.trim="viceDeviceObj.simCode" placeholder="sim卡号" style="width:60%" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="设备类型">
                  <el-select disabled v-model="viceDeviceObj.deviceType" placeholder="设备类型" style="width:60%" size="small">
                    <el-option v-for="item in deviceTypeList" :key="item.deviceType" :label="item.deviceTypeDes" :value="item.deviceType"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="设备厂商">
                  <el-select disabled v-model="viceDeviceObj.manufacturer" placeholder="设备厂商" style="width:70%" size="small">
                    <el-option v-for="item in viceManufacturerList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="设备序列号">
                  <el-input maxlength="20" disabled v-model.trim="viceDeviceObj.serialNumber" placeholder="设备序列号" style="width:60%" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="设备型号">
                  <el-input maxlength="20" disabled v-model.trim="viceDeviceObj.model" placeholder="设备型号" style="width:60%" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="外设信息" name="third">
          <el-form :model="extraObj">
            <div style="color:#488aff">外设1：</div>
            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="外设类型">
                  <el-select @change="extraDevChange" :disabled="dialogStatus === 'detail'" v-model="extraObj.type" placeholder="外设类型" style="width:60%" size="small">
                    <el-option v-for="item in extraDeviceList" :key="item.code" :label="item.value" :value="item.code" :disabled="item.disabled"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="外设型号">
                  <el-select disabled v-model="extraObj.model" placeholder="外设型号" style="width:60%" size="small">
                    <el-option v-for="item in extraDeviceModelList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="安装位置">
                  <el-select disabled v-model="extraObj.installSite" placeholder="安装位置" style="width:60%" size="small">
                    <el-option v-for="item in extraDeviceInstallSiteList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="外设厂商">
                  <el-select disabled v-model="extraObj.manufacturer" placeholder="外设厂商" style="width:60%" size="small">
                    <el-option v-for="item in extraDeviceManufacturerList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row class="create_dialog_row">
              <el-col :span="11">
                <el-form-item label="参数">
                  <el-input maxlength="20" :disabled="dialogStatus === 'detail'" v-model.trim="extraObj.params" placeholder="参数" style="width:60%" size="small"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1">
                <span>&nbsp;</span>
              </el-col>
              <el-col :span="11">
                <el-form-item label="备注">
                  <el-input maxlength="20" :disabled="dialogStatus === 'detail'" v-model.trim="extraObj.remark" placeholder="备注" style="width:60%" size="small"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-show="extra" style="float:right;margin-right:30px;">
              <el-button @click="addExtra" type="text">
                <i style="font-size:16px;margin-right:5px;" class="el-icon-circle-plus-outline"></i>添加外设
              </el-button>
            </div>

            <div v-show="extra2" style="margin-top:30px;">
              <div style="color:#488aff">外设2：</div>
              <el-form :model="extraObj2">
                <el-row class="create_dialog_row">
                  <el-col :span="11">
                    <el-form-item label="外设类型">
                      <el-select @change="extraDevChange2" :disabled="dialogStatus === 'detail'" v-model="extraObj2.type" placeholder="外设类型" style="width:60%" size="small">
                        <el-option v-for="item in extraDeviceList2" :key="item.code" :label="item.value" :value="item.code" :disabled="item.disabled"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="外设型号">
                      <el-select disabled v-model="extraObj2.model" placeholder="外设型号" style="width:60%" size="small">
                        <el-option v-for="item in extraDeviceModelList2" :key="item.code" :label="item.value" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="create_dialog_row">
                  <el-col :span="11">
                    <el-form-item label="安装位置">
                      <el-select disabled v-model="extraObj2.installSite" placeholder="安装位置" style="width:60%" size="small">
                        <el-option v-for="item in extraDeviceInstallSiteList2" :key="item.code" :label="item.value" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="外设厂商">
                      <el-select disabled v-model="extraObj2.manufacturer" placeholder="外设厂商" style="width:60%" size="small">
                        <el-option v-for="item in extraDeviceManufacturerList2" :key="item.code" :label="item.value" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="create_dialog_row">
                  <el-col :span="11">
                    <el-form-item label="参数">
                      <el-input maxlength="20" :disabled="dialogStatus === 'detail'" v-model.trim="extraObj2.params" placeholder="参数" style="width:60%" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="备注">
                      <el-input maxlength="20" :disabled="dialogStatus === 'detail'" v-model.trim="extraObj2.remark" placeholder="备注" style="width:60%" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div v-show="extraBtn" style="float:right;margin-right:30px;">
                <el-button @click="addExtra2" type="text">
                  <i style="font-size:16px;margin-right:5px;" class="el-icon-circle-plus-outline"></i>添加外设
                </el-button>
              </div>
            </div>

            <div v-show="extra3" style="margin-top:30px;">
              <div style="color:#488aff">外设3：</div>
              <el-form :model="extraObj3">
                <el-row class="create_dialog_row">
                  <el-col :span="11">
                    <el-form-item label="外设类型">
                      <el-select @change="extraDevChange3" :disabled="dialogStatus === 'detail'" v-model="extraObj3.type" placeholder="外设类型" style="width:60%" size="small">
                        <el-option v-for="item in extraDeviceList3" :key="item.code" :label="item.value" :value="item.code" :disabled="item.disabled"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="外设型号">
                      <el-select disabled v-model="extraObj3.model" placeholder="外设型号" style="width:60%" size="small">
                        <el-option v-for="item in extraDeviceModelList3" :key="item.code" :label="item.value" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="create_dialog_row">
                  <el-col :span="11">
                    <el-form-item label="安装位置">
                      <el-select disabled v-model="extraObj3.installSite" placeholder="安装位置" style="width:60%" size="small">
                        <el-option v-for="item in extraDeviceInstallSiteList3" :key="item.code" :label="item.value" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="外设厂商">
                      <el-select disabled v-model="extraObj3.manufacturer" placeholder="外设厂商" style="width:60%" size="small">
                        <el-option v-for="item in extraDeviceManufacturerList3" :key="item.code" :label="item.value" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="create_dialog_row">
                  <el-col :span="11">
                    <el-form-item label="参数">
                      <el-input maxlength="20" :disabled="dialogStatus === 'detail'" v-model.trim="extraObj3.params" placeholder="参数" style="width:60%" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1">
                    <span>&nbsp;</span>
                  </el-col>
                  <el-col :span="11">
                    <el-form-item label="备注">
                      <el-input maxlength="20" :disabled="dialogStatus === 'detail'" v-model.trim="extraObj3.remark" placeholder="备注" style="width:60%" size="small"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </el-form>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer" style="text-align:right">
        <el-button @click="addEquipmentDialog = false">取 消</el-button>
        <el-button v-if="dialogStatus === 'create'" type="primary" @click="submit('addForm')">确 定</el-button>
        <el-button v-else-if="dialogStatus === 'update'" type="primary" @click="confirmUpdate('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 导入车辆dialog -->
    <el-dialog title="导入车辆" width="35%" :visible.sync="importVehicleDialog" center :close-on-click-modal="false">
      <el-upload :action="uploadUrl" ref="upload" :file-list="uploadFiles" :auto-upload="false" :on-success="uploadSuccess" :limit="1" style="padding-bottom:30px;text-align:center" class="upload-demo" drag>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传模板指定格式文件，如无模板请点击
          <el-button type="text"><a :href="modelUrl">下载模板</a></el-button>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button @click="importVehicleDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitUpload()">确定上传</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// @Author: outman_qiaopeng  Date: 2018-09-17 14:14:13
import deptTree from '../../system/dept/components/deptTree'
import { updateDept, extraDeviceDetail, getDriverList, vehicleList, deleteVehicle, createVehicle, updateVehicle, detailVehicle } from '@/api/base/vehicle'
import { createDevice, createSim, getSimList, getDeptTree, fetchList } from '@/api/base/device'
import { getDownMenu } from '@/api/infomationM/dict'
import { validatePhoneNum, numAndLetter } from '@/utils/validate'
export default {
  name: 'vehicleInfo',
  components: { deptTree },
  data() {
    const plateNo = (rule, value, callback) => {
      if (value.length === 7) {
        const express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
        value = express.test(value)
        if (value) {
          callback()
        } else {
          callback(new Error('请输入合法的车牌号!'))
        }
      } else {
        callback(new Error('请输入合法的车牌号!'))
      }
    }
    return {
      uploadFiles: [],
      uploadUrl: '',
      modelUrl: '',
      importVehicleDialog: false,
      filterText: '',
      onlineClass: 'onlineClass',
      offlineClass: 'offlineClass',
      mainManufacturerList: [{ id: '1', name: '厦门雅讯' }, { id: '2', name: '安徽阿瑞特' }],
      viceManufacturerList: [{ id: '3', name: '清研威视(护驾卫士)' }],
      extraDeviceModelList: [],
      extraDeviceModelList2: [],
      extraDeviceModelList3: [],
      extraDeviceInstallSiteList: [],
      extraDeviceInstallSiteList2: [],
      extraDeviceInstallSiteList3: [],
      extraDeviceManufacturerList: [],
      extraDeviceManufacturerList2: [],
      extraDeviceManufacturerList3: [],
      extra: true,
      extra2: false,
      extraBtn: true,
      extra3: false,
      deviceSelectDialog: false,
      deviceListQuery: { deviceId: '', simCode: '', useFlag: 0, deviceType: 'VEHICLE_GB32960', deptId: '', page: 1, limit: 10 },
      deviceTotal: 0,
      modelList: [],
      driverTotal: 0,
      activeStatusList: [{ id: '1', name: '在线' }, { id: '0', name: '离线' }],
      vehicleStatusList: [],
      activeName: 'first',
      vehicleBrandList: [],
      plateColorList: [],
      defaultProps: { children: 'children', label: 'text' },
      dialogDeptVisable: false,
      deptList: [],
      deviceObj: {
        deviceId: '',
        simCode: '',
        deviceType: 'VEHICLE_GB32960',
        manufacturer: '',
        serialNumber: '',
        model: ''
      },
      deviceTypeList: [{ deviceType: 'VEHICLE_GB32960', deviceTypeDes: 'TBOX设备' }, { deviceType: 'VEHICLE_QH_ADAS', deviceTypeDes: '疲劳一体机设备' }],
      deviceList: [],
      extraDeviceList: [],
      extraDeviceList2: [],
      extraDeviceList3: [],
      extraObj: {},
      extraObj2: {},
      extraObj3: {},
      driverQuery: {
        page: 1,
        limit: 10,
        driverName: '',
        driverNo: '',
        drivingState: '',
        deptId: ''
      },
      driverDialog: false,
      driverData: [],
      driverCol: [{ key: 'driverNo', title: '工号', width: '20px' }, { key: 'name', title: '姓名', width: '30px' }, { key: 'deptName', title: '所属机构' }],
      simDialog: false,
      simQuery: {
        pageSize: 1,
        pageNum: 10,
        deviceId: '',
        code: '',
        deviceType: '',
        name: '',
        status: '0'
      },
      simData: [],
      deviceData: [],
      deviceForm: [],
      addDeviceSimDialog: false,
      deviceSimForm: {},
      deviceSimRules: {
        code: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      total: 0,
      visible: false,
      deptVisible: false,
      listLoading: false,
      addEquipmentDialog: false,
      addDeviceDialog: false,
      deviceRules: {
        deviceId: [{ required: true, message: '必填项', trigger: 'blur' }],
        deptId: [{ required: true, message: '必填项', trigger: 'change' }],
        simId: [{ required: true, message: '必选项', trigger: 'change' }],
        deviceType: [{ required: true, message: '必选项', trigger: 'change' }]
      },
      form: {}, // 新增表单数据
      vehicleTypeList: [], // 车辆类型下拉框
      transTypeList: [], // 运输行业类型下拉框
      data: [],
      columns: [
        {
          key: 'plateNo',
          title: '车牌号',
          width: '120'
        },
        {
          key: 'vin',
          title: 'VIN号',
          width: '180'
        },
        {
          key: 'mainDeviceIds',
          title: '主设备ID',
          width: '120'
        },
        {
          key: 'viceDeviceIds',
          title: '副设备ID',
          width: '120'
        },
        {
          key: 'activeStatus',
          title: '运行状态',
          width: '100'
        },
        {
          key: 'vehicleStatus',
          title: '车辆状态',
          width: '100'
        },
        {
          key: 'deptName',
          title: '所属机构',
          width: '180'
        },
        {
          key: 'onlineLastTime',
          title: '最后上线时间',
          width: '200'
        },
        {
          key: 'validEndTime',
          title: '到期时间',
          width: '200'
        },
        {
          key: 'createTime',
          title: '创建时间',
          width: '200'
        }
      ],
      listQuery: {
        page: 1,
        limit: 10,
        plateNo: '',
        mainDeviceIds: '',
        viceDeviceIds: '',
        vin: '',
        deptId: '',
        deptName: '',
        activeStatus: '',
        status: ''
      },
      rules: {
        plateNo: [{ required: true, message: '必填项', trigger: 'blur' }, { validator: plateNo, trigger: 'blur' }],
        vin: [{ required: true, message: '必填项', trigger: 'blur' }],
        plateColor: [{ required: true, message: '必选项', trigger: 'change' }],
        deptId: [{ required: true, message: '必选项', trigger: 'change' }],
        status: [{ required: true, message: '必选项', trigger: 'change' }],
        vehicleType: [{ required: true, message: '必选项', trigger: 'change' }],
        deviceId: [{ required: true, message: '必选项', trigger: 'change' }]
      },
      viceRules: {
        deviceId: [{ required: true, message: '必选项', trigger: 'change' }]
      },
      textMap: { update: '修改车辆信息', create: '新增车辆', detail: '查看车辆详情' },
      dialogStatus: '',
      selectRows: [],
      startEnd: [],
      viceDeviceObj: { deviceId: '', simCode: '', deviceType: 'VEHICLE_QH_ADAS', manufacturer: '', serialNumber: '', model: '' },
      manufacturerList: [],
      simTotal: 0,
      editBody: {},
      isDisable: false
    }
  },
  mounted() {
    // 获取下拉框数据
    this.getDownMenuList('vehicle_type')
    this.getDownMenuList('vehicle_brand')
    this.getDownMenuList('plate_color')
    this.getDownMenuList('extraDevice_type')
    this.getDownMenuList('vehicle_status')
    this.getList()
    this.getTree()
    this.modelUrl = process.env.BASE_API + '/upload/excel/VehicleExcel.xlsx'
    this.uploadUrl = process.env.BASE_API + '/base/vehicle/excelImport'
  },
  watch: {
    startEnd: {
      handler(val, oldVal) {
        if (val) {
          this.form.validStartTime = val[0]
          this.form.validEndTime = val[1]
        }
      },
      deep: true
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit()
    },
    uploadSuccess(res, file) {
      console.log(res)
      this.importVehicleDialog = false
      if (res.code === 0) {
        this.$message({ message: res.msg, type: 'success' })
      } else {
        this.$notify.error({
          title: '错误提示',
          message: res.msg,
          duration: 0
        })
      }
    },
    filterNode(value, data) { // 树节点过滤方法
      if (!value) return true
      return data.text.indexOf(value) !== -1
    },
    openDeptTree() {
      if (this.selectRows.length === 0) {
        this.$message({
          message: '请选择要修改机构的车辆',
          type: 'warning'
        })
        setTimeout(() => {
          this.deptVisible = false
        }, 10)
        return
      }
    },
    changeDept(data) {
      this.editBody.deptId = data.id
    },
    editDept(row) {
      let vehicleIds = ''
      if (this.selectRows.length === 0) {
        this.$message({
          message: '请选择要修改机构的车辆',
          type: 'warning'
        })
        return
      }
      for (let i = 0; i < this.selectRows.length; i++) {
        const element = this.selectRows[i]
        if (i < this.selectRows.length - 1) {
          vehicleIds = vehicleIds + element.id + ','
        } else {
          vehicleIds = vehicleIds + element.id
        }
      }
      this.editBody.ids = vehicleIds
      updateDept(this.editBody).then(res => {
        this.deptVisible = false
        if (res.code === 0) {
          this.$message({ message: '修改成功', type: 'success' })
          this.getList()
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    handleImport() {
      this.uploadFiles = []
      this.importVehicleDialog = true
    },
    handleSimSizeChange(val) { // 改变sim卡pageSize
      this.simQuery.pageSize = val
      this.getSimList()
    },
    handleSimCurrentChange(val) { // 改变pageNumber
      this.simQuery.pageNum = val
      this.getSimList()
    },
    getSimList() {
      getSimList(this.simQuery).then(res => {
        if (res.code === 0) {
          this.simData = res.data.rows
          this.simTotal = res.data.totalCount
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
      })
    },
    querySim() {
      this.getSimList()
    },
    selectSim(row) { // 选择sim卡
      this.simDialog = false
      this.deviceForm.simId = row.id
      this.deviceForm.simCode = row.simCode
    },
    queryDevice() {
      this.getDevice()
    },
    deviceTableSelect(row) {
      this.deviceSelectDialog = false
      if (this.deviceListQuery.deviceType === 'VEHICLE_GB32960') {
        this.deviceObj = row
      } else {
        this.viceDeviceObj = row
      }
    },
    deviceTypeChange(val) {
      if (val === 'VEHICLE_GB32960') {
        this.manufacturerList = [{ id: '1', name: '厦门雅讯' }, { id: '2', name: '安徽阿瑞特' }]
      } else {
        this.manufacturerList = [{ id: '3', name: '清研威视(护驾卫士)' }]
      }
    },
    viceAddDevice() { // 新增车辆副设增加设备
      this.manufacturerList = [{ id: '3', name: '清研威视(护驾卫士)' }]
      this.resetDeviceForm()
      this.deviceForm.deviceType = 'VEHICLE_QH_ADAS'
      if (!this.form.deptName || this.form.deptName === '') {
        this.$message({
          message: '请先在车辆信息中选择所属机构',
          type: 'info'
        })
        return
      }
      this.addDeviceDialog = true
      this.$nextTick(() => {
        this.$refs['deviceForm'].clearValidate()
      })
    },
    addExtra() {
      this.extra = false
      this.extra2 = true
      this.extraBtn = true
    },
    addExtra2() {
      this.extraBtn = false
      this.extra3 = true
    },
    getExtraDetail(val, obj) {
      extraDeviceDetail(val).then(response => {
        if (response.code === 0) {
          switch (obj) {
            case 'extra1':
              this.extraObj = response.data
              if (response.data) {
                this.extraObj = response.data
              } else {
                // this.$message({ message: '该外设暂无详情', type: 'info' })
                this.extraObj = { type: val, model: '', installSite: '', manufacturer: '', params: '', remark: '' }
              }
              break
            case 'extra2':
              this.extraObj2 = response.data
              if (response.data) {
                this.extraObj2 = response.data
              } else {
                // this.$message({ message: '该外设暂无详情', type: 'info' })
                this.extraObj2 = { type: val, model: '', installSite: '', manufacturer: '', params: '', remark: '' }
              }
              break
            case 'extra3':
              this.extraObj3 = response.data
              if (response.data) {
                this.extraObj3 = response.data
              } else {
                // this.$message({ message: '该外设暂无详情', type: 'info' })
                this.extraObj3 = { type: val, model: '', installSite: '', manufacturer: '', params: '', remark: '' }
              }
              break
            default:
              break
          }
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          })
        }
      })
    },
    extraDevChange(val) { // 选择外设change事件
      // this.extraDeviceList2.forEach(element => {
      //   if (element.code === val) {
      //     element.disabled = true
      //   }
      // })
      // this.extraDeviceList3.forEach(element => {
      //   if (element.code === val) {
      //     element.disabled = true
      //   }
      // })
      this.getExtraDetail(val, 'extra1')
    },
    extraDevChange2(val) { // 选择外设2change事件
      // this.extraDeviceList.forEach(element => {
      //   if (element.code === val) {
      //     element.disabled = true
      //   }
      // })
      // this.extraDeviceList3.forEach(element => {
      //   if (element.code === val) {
      //     element.disabled = true
      //   }
      // })
      this.getExtraDetail(val, 'extra2')
    },
    extraDevChange3(val) { // 选择外设3change事件
      // this.extraDeviceList2.forEach(element => {
      //   if (element.code === val) {
      //     element.disabled = true
      //   }
      // })
      // this.extraDeviceList.forEach(element => {
      //   if (element.code === val) {
      //     element.disabled = true
      //   }
      // })
      this.getExtraDetail(val, 'extra3')
    },
    viewDetail(row) { // 查看详情
      this.resetForm()
      this.activeName = 'first'
      this.dialogStatus = 'detail'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['deviceObj'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['viceDeviceObj'].clearValidate()
      })
      this.handleDetail(row.id)
    },
    getDevice() {
      fetchList(this.deviceListQuery).then(response => {
        if (response.code === 0) {
          this.deviceData = response.data.rows
          this.deviceTotal = response.data.totalCount
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          })
        }
      })
    },
    getDeviceList(str) {
      if (str === 'main') {
        this.deviceListQuery.deviceType = 'VEHICLE_GB32960'
        this.deviceListQuery.simCode = ''
        this.deviceListQuery.deptId = this.form.deptId
      } else {
        this.deviceListQuery.deviceType = 'VEHICLE_QH_ADAS'
        this.deviceListQuery.simCode = ''
        this.deviceListQuery.deptId = this.form.deptId
      }
      this.getDevice()
    },
    dialogNodeClick(data) { // 新增设备选择机构
      this.form.deptName = data.text
      this.form.deptId = data.id
      this.dialogDeptVisable = false
    },
    getTree() { // 获取机构树
      getDeptTree().then(res => {
        this.deptList = JSON.parse('[' + JSON.stringify(res.data) + ']')
      })
    },
    queryUnbindSim() { // 新增设备sim卡获取焦点
      this.simQuery = {
        pageSize: 10,
        pageNum: 1,
        deviceId: '',
        code: '',
        deviceType: '',
        name: this.form.name,
        deptId: this.form.deptId,
        status: '0'
      }
      this.simDialog = true
      this.getSimList()
    },
    selectDevice() { // 选择设备dialog
      if (!this.form.deptName || this.form.deptName === '') {
        this.$message({
          message: '请先在车辆信息中选择所属机构',
          type: 'info'
        })
        return
      }
      this.deviceSelectDialog = true
      this.getDeviceList('main')
    },
    selectViceDevice() { // 选择设备dialog
      if (!this.form.deptName || this.form.deptName === '') {
        this.$message({
          message: '请先在车辆信息中选择所属机构',
          type: 'info'
        })
        return
      }
      this.deviceSelectDialog = true
      this.getDeviceList('vice')
    },
    resetDeviceSim() { // 重置新增SIM卡dialog
      this.deviceSimForm = {
        code: '',
        deptId: this.deviceForm.deptId,
        status: 0,
        useFlag: 0,
        registDate: '',
        remark: ''
      }
    },
    addDeviceSim() { // 打开添加新sim卡对话框
      if (!this.form.deptName || this.form.deptName === '') {
        this.$message({
          message: '请选择所属机构',
          type: 'info'
        })
        return
      }
      this.resetDeviceSim()
      this.addDeviceSimDialog = true
      this.$nextTick(() => {
        this.$refs['deviceSimForm'].clearValidate()
      })
    },
    openDriverDialog() { // 打开司机列表dialog
      if (!this.form.deptName || this.form.deptName === '') {
        this.$message({
          message: '请先选择所属机构',
          type: 'info'
        })
        return
      }
      this.driverDialog = true
      this.driverQuery.driverName = ''
      this.driverQuery.deptId = this.form.deptId
      this.getDriverList()
    },
    getDriverList() {
      getDriverList(this.driverQuery).then(response => {
        this.driverData = response.data.rows
        this.driverTotal = response.data.totalCount
      })
    },
    queryDriver() { // 司机列表查询
      this.getDriverList()
    },
    selectDriver(row) { // 选择司机
      console.log(row)
      this.driverDialog = false
      this.form.driverId = row.id
      this.form.driverName = row.name
      this.form.sexDes = row.sexDes
      this.form.driverPhone = row.phone
    },
    createDeviceSim(form) { // 确认添加新SIM卡
      this.$refs[form].validate((valid) => {
        if (!validatePhoneNum(this.deviceSimForm.code)) {
          this.$message({
            message: 'SIM卡号有误',
            type: 'error'
          })
          return
        }
        if (valid) {
          createSim(this.deviceSimForm).then(response => {
            console.log(response)
            if (response.code === 0) {
              this.$message({
                message: '新增SIM卡成功',
                type: 'success'
              })
              this.addDeviceSimDialog = false
              this.deviceForm.simId = response.data.id
              this.deviceForm.simCode = response.data.code
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    // 获取下拉框数据
    getDownMenuList(type) {
      getDownMenu(type).then(response => {
        switch (type) {
          case 'plate_color':
            this.plateColorList = response.data
            break
          case 'vehicle_type':
            this.vehicleTypeList = response.data
            break
          case 'vehicle_brand':
            this.vehicleBrandList = response.data
            break
          case 'extraDevice_type':
            this.extraDeviceList = response.data
            this.extraDeviceList2 = response.data
            this.extraDeviceList3 = response.data
            break
          case 'extraDevice_model':
            this.extraDeviceModelList = response.data
            this.extraDeviceModelList2 = response.data
            this.extraDeviceModelList3 = response.data
            break
          case 'extraDevice_install_site':
            this.extraDeviceInstallSiteList = response.data
            this.extraDeviceInstallSiteList2 = response.data
            this.extraDeviceInstallSiteList3 = response.data
            break
          case 'extraDevice_manufacturerm':
            this.extraDeviceManufacturerList = response.data
            this.extraDeviceManufacturerList2 = response.data
            this.extraDeviceManufacturerList3 = response.data
            break
          case 'vehicle_status':
            this.vehicleStatusList = response.data
            break
          default:
            break
        }
      })
    },
    resetDeviceForm() { // 重置设备dialog
      this.deviceForm = {
        deptId: this.form.deptId,
        deptName: this.form.deptName,
        deviceId: '',
        simId: '',
        deviceType: '',
        manufacturer: '',
        model: ''
      }
    },
    addDevice() { // 新增车辆页面增加主设备
      this.manufacturerList = [{ id: '1', name: '厦门雅讯' }, { id: '2', name: '安徽阿瑞特' }]
      this.resetDeviceForm()
      this.deviceForm.deviceType = 'VEHICLE_GB32960'
      if (!this.form.deptName || this.form.deptName === '') {
        this.$message({
          message: '请先在车辆信息中选择所属机构',
          type: 'info'
        })
        return
      }
      this.addDeviceDialog = true
      this.$nextTick(() => {
        this.$refs['deviceForm'].clearValidate()
      })
    },
    deviceAdd(formName) { // 添加设备
      this.isDisable = true
      setTimeout(() => {
        this.isDisable = false
      }, 1000)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!numAndLetter(this.deviceForm.deviceId)) {
            this.$message({
              message: '设备ID只能输入数字和字母的组合',
              type: 'error'
            })
            return
          }
          createDevice(this.deviceForm).then(response => {
            if (response.code === 0) {
              console.log('设备信息：', response)
              this.addDeviceDialog = false
              if (this.deviceForm.deviceType === 'VEHICLE_GB32960') {
                this.deviceObj = this.deviceForm
                this.deviceObj.id = response.data.Id
              } else {
                this.viceDeviceObj = this.deviceForm
                this.viceDeviceObj.id = response.data.Id
              }
              this.$message({
                message: '新增设备成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    getList() {
      this.listLoading = true
      vehicleList(this.listQuery).then(response => {
        console.log('车辆列表：', response)
        this.data = response.data.rows
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    handleQuery() { // 头部查询方法
      this.listQuery.page = 1
      this.getList()
    },
    handleReset() {
      this.listQuery.activeStatus = ''
      this.listQuery.plateNo = ''
      this.listQuery.status = ''
      this.listQuery.vin = ''
      this.listQuery.mainDeviceIds = ''
      this.listQuery.viceDeviceIds = ''
      this.listQuery.deptId = ''
      this.listQuery.deptName = ''
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleDeviceSizeChange(val) {
      this.deviceListQuery.limit = val
      this.getDevice()
    },
    handleDeviceCurrentChange(val) {
      this.deviceListQuery.page = val
      this.getDevice()
    },
    handleDriverSizeChange(val) {
      this.driverQuery.limit = val
      this.getDriverList()
    },
    handleDriverCurrentChange(val) {
      this.driverQuery.page = val
      this.getDriverList()
    },
    // 重置表单
    resetForm() {
      this.form = {
        plateNo: '',
        plateColor: '',
        deptId: '',
        deptName: '',
        status: '',
        vin: '',
        vehicleType: '',
        vehicleBrand: '',
        vehicleColor: '',
        loadNumber: '',
        loadWeight: '',
        driverId: '',
        validStartTime: '',
        vaildEndTime: '',
        mainDeviceIds: '',
        viceDeviceIds: '',
        deviceExtendIds: ''
      }
      this.extra = true
      this.extra2 = false
      this.extra3 = false
      this.deviceObj = { deviceId: '', simId: '', deviceType: 'VEHICLE_GB32960', manufacturer: '', serialNumber: '', model: '' }
      this.viceDeviceObj = { deviceId: '', simId: '', deviceType: 'VEHICLE_QH_ADAS', manufacturer: '', serialNumber: '', model: '' }
      this.extraObj = { type: '', model: '', installSite: '', manufacturer: '', params: '', remark: '' }
      this.extraObj2 = { type: '', model: '', installSite: '', manufacturer: '', params: '', remark: '' }
      this.extraObj3 = { type: '', model: '', installSite: '', manufacturer: '', params: '', remark: '' }
    },
    handleCreate() { // 头部新增
      this.resetForm()
      this.extra = true
      this.extraBtn = true
      this.getDownMenuList('extraDevice_model')
      this.getDownMenuList('extraDevice_install_site')
      this.getDownMenuList('extraDevice_manufacturer')
      this.startEnd = []
      this.activeName = 'first'
      this.dialogStatus = 'create'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['deviceObj'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['viceDeviceObj'].clearValidate()
      })
      this.extraDeviceList.forEach(element => {
        element.disabled = false
      })
      this.extraDeviceList2.forEach(element => {
        element.disabled = false
      })
      this.extraDeviceList3.forEach(element => {
        element.disabled = false
      })
    },
    submit(formName) { // 表单内容提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$refs['deviceObj'].validate((devValid) => {
            if (devValid) {
              this.$refs['viceDeviceObj'].validate((viceValid) => {
                if (viceValid) {
                  this.form.mainDeviceIds = this.deviceObj.id
                  this.form.viceDeviceIds = this.viceDeviceObj.id
                  if (this.extraObj.type) {
                    if (this.extraObj2.type) {
                      if (this.extraObj3.type) {
                        this.form.deviceExtendIds = this.extraObj.type + ',' + this.extraObj2.type + ',' + this.extraObj3.type
                      } else {
                        this.form.deviceExtendIds = this.extraObj.type + ',' + this.extraObj2.type
                      }
                    } else {
                      this.form.deviceExtendIds = this.extraObj.type
                    }
                  }
                  if (!this.form.validStartTime) {
                    this.form.validStartTime = ''
                    this.form.validEndTime = ''
                  }
                  createVehicle(this.form).then(response => {
                    console.log('请求参数：', this.form)
                    console.log('新增成功：', response)
                    if (response.code === 0) {
                      this.getList()
                      this.addEquipmentDialog = false
                      this.$message({
                        message: '新增成功',
                        type: 'success'
                      })
                    } else {
                      this.$message({
                        message: response.msg,
                        type: 'error'
                      })
                    }
                  })
                }
              })
            } else {
              this.$message({
                message: '请完善设备信息栏目',
                type: 'error'
              })
              return
            }
          })
        } else {
          this.$message({
            message: '请完善车辆信息栏目',
            type: 'error'
          })
        }
      })
    },
    confirmUpdate(formName) { // 修改
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const updateObj = {}
          updateObj.mainDeviceIds = this.deviceObj.id
          updateObj.viceDeviceIds = this.viceDeviceObj.id
          updateObj.plateNo = this.form.plateNo
          updateObj.plateColor = this.form.plateColor
          updateObj.deptId = this.form.deptId
          updateObj.status = this.form.status
          updateObj.vin = this.form.vin
          updateObj.vehicleType = this.form.vehicleType
          updateObj.vehicleColor = this.form.vehicleColor
          updateObj.vehicleBrand = this.form.vehicleBrand
          updateObj.loadNumber = this.form.loadNumber
          updateObj.loadWeight = this.form.loadWeight
          updateObj.driverId = this.form.driverId
          updateObj.validStartTime = this.form.validStartTime
          updateObj.vaildEndTime = this.form.vaildEndTime
          updateObj.deviceExtendIds = this.form.deviceExtendIds
          updateObj.id = this.form.id
          console.log('修改参数：', updateObj)
          updateVehicle(updateObj).then(response => {
            if (response.code === 0) {
              this.getList()
              this.addEquipmentDialog = false
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: response.msg,
                type: 'error'
              })
            }
          })
        }
      })
    },
    handleDetail(id) { // 车辆详情
      detailVehicle(id).then(response => {
        console.log('车辆详情：', response)
        if (response.code === 0) {
          this.form = response.data
          this.form.status = response.data.status + ''
          const obj0 = response.data.deviceList[0]
          const obj1 = response.data.deviceList[1]
          const arr = response.data.deviceExtendList
          this.extra = false
          this.extraBtn = false
          if (arr.length < 2) {
            this.extra2 = false
            this.extra3 = false
            if (arr.length === 1) {
              this.extraObj = arr[0]
            }
          } else if (arr.length === 2) {
            this.extra2 = true
            this.extra3 = false
            this.extraObj = arr[0]
            this.extraObj2 = arr[1]
          } else if (arr.length === 3) {
            this.extra2 = true
            this.extra3 = true
            this.extraObj = arr[0]
            this.extraObj2 = arr[1]
            this.extraObj3 = arr[2]
          }
          if (obj0.isMaster && obj0.isMaster === 1) {
            this.deviceObj = obj0
          } else {
            this.viceDeviceObj = obj0
          }
          if (obj1.isMaster && obj1.isMaster === 1) {
            this.deviceObj = obj1
          } else {
            this.viceDeviceObj = obj1
          }
        } else {
          this.$message({
            message: response.msg,
            type: 'error'
          })
        }
      })
    },
    handleUpdate(row) { // 修改车辆
      this.resetForm()
      this.activeName = 'first'
      this.dialogStatus = 'update'
      this.addEquipmentDialog = true
      this.$nextTick(() => {
        this.$refs['addForm'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['deviceObj'].clearValidate()
      })
      this.$nextTick(() => {
        this.$refs['viceDeviceObj'].clearValidate()
      })
      this.handleDetail(row.id)
    },
    handleSelect(val) { // 选择处理事件
      this.selectRows = val
    },
    handleDelete(row) { // 删除车辆
      const userIds = []
      if (row && row.id) {
        userIds.push(row.id)
      } else {
        if (this.selectRows.length === 0) {
          this.$message({
            message: '请选择要删除的车辆',
            type: 'warning'
          })
          return
        }
        this.selectRows.forEach(row => {
          userIds.push(row.id)
        })
      }
      this.$confirm('此操作将删除车辆信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteVehicle(userIds).then(response => {
          if (response.code === 0) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getList()
          } else {
            this.$message({
              message: response.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          message: '已取消删除',
          type: 'info'
        })
      })
    },
    handleNodeClick(data) { // 树节点点击回调方法
      this.listQuery.deptId = data.id
      this.listQuery.deptName = data.text
      this.visible = false
    }
  }
}
</script>

<style>
  /* .vehicle_create_dialog .el-table td, .el-table th {
    padding: 0 !important
  } */
  .onlineClass {
    color: #67C23A
  }
  .offlineClass {
    color: #606266
  }
  .el-popover {
    height: 300px;
    overflow-y: scroll;
  }
  .deviceLayout .el-dialog__body {
    padding: 5px 20px !important;
    max-height: 400px;
  }
  .deviceLayout .el-tabs__content {
    max-height: 340px;
    overflow-y: auto;
  }
  .create_dialog_row {
    text-align: right;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  /*在chrome下移除input[number]的上下箭头*/
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
  }
  /*在firefox下移除input[number]的上下箭头*/
  input[type="number"] {
    -moz-appearance: textfield;
  }
</style>
<style lang="scss" scoped>
  .deviceLayout {
    .dataFilter {
      padding: 20px 20px 0 20px;
    }
    .el-pagination {
      padding: 20px;
    }
  }
</style>
