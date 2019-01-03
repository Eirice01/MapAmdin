<template>
<div class="organManagement">
  <!-- 搜索部分 -->
  <el-row class="organManagementHeader">
    <el-col :span="4">
      <div>
        <div class="slo" style="display: flex">
          <el-input placeholder="请输入机构名称" v-model.trim="input" class="input-with-select"autofocus>
          </el-input>
          <el-button style="background-color:#4077BC; color: #fff;border-radius:3px; margin-left: 4px" slot="append" @click="searchData">查询</el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="6" :offset="12 ">
      <div class="grid-content bg-purple-light">
        <div class="organManagementButton">
          <el-button type="primary" @click="addData">新增</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
  <!-- 表格主体 -->
  <el-row class="organManagementBody">
    <el-col :span="24">
      <el-table
      :data="tableData"
      border
      stripe
      v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="机构名称">
        </el-table-column>
        <el-table-column
          prop="industryName"
          align="center"
          label="所属行业">
        </el-table-column>
        <el-table-column
          prop="userName"
          align="center"
          label="主账户">
        </el-table-column>
        <el-table-column
          prop="contactPerson"
          align="center"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="phone"
          align="center"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="parentName"
          align="center"
          label="上级机构">
        </el-table-column>
        <el-table-column
         fixed="right"
         align="center"
         label="操作"
         width="270px">
          <template slot-scope="scope">
            <el-row>
              <el-button type="info" size="small" icon="el-icon-message" @click="viewDetails(scope.row)">查看</el-button>
              <el-button type="primary" size="small" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteData(scope.row)">删除</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <!-- 分页组件 -->
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 25, 50]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
  <!-- 弹出框 -->
  <!-- 新增弹出框 -->
  <el-dialog title="新增机构" :visible.sync="addDialogVisible">
    <el-form :model="form" :rules="rules" ref="addForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级机构" :label-width="formLabelWidth" prop="parentName" class="deptTreeInput">
            <el-input v-model="form.parentName" disabled style="float: left; width: 90%"></el-input>
            <el-button icon="el-icon-search" style="float: left; width: 10%" @click="showDeptTree"></el-button>
            <!-- <el-input v-model="form.parentName" @focus="showDeptTree"></el-input> -->
            <div class="deptTree" v-show="deptTreeShow">
              <el-tree :data="data"
              :props="defaultProps"
              @node-click="handleNodeClick"
              default-expand-all
              :expand-on-click-node='false'
              ></el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主账号" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="form.userName"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirmPwd">
            <el-input v-model="form.confirmPwd" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" :label-width="formLabelWidth" prop="contactPerson">
            <el-input v-model="form.contactPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" :label-width="formLabelWidth"  prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="经营范围" :label-width="formLabelWidth" prop="businessScope">
            <el-input v-model="form.businessScope"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属行业" :label-width="formLabelWidth" prop="industryType">
            <el-select v-model="form.industryType" placeholder="请选择" style="width: 100%">
              <el-option
               v-for="item in options"
               :key="item.code"
               :label="item.value"
               :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="法人" :label-width="formLabelWidth" prop="legalPerson">
            <el-input v-model="form.legalPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营许可证号" :label-width="formLabelWidth" prop="businessCertificate">
            <el-input v-model="form.businessCertificate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照号" :label-width="formLabelWidth" prop="businessLicense">
            <el-input v-model="form.businessLicense"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构类型" :label-width="formLabelWidth" prop="deptType">
            <el-select v-model="form.deptType" placeholder="请选择" style="width: 100%">
              <el-option
               v-for="item in deptTypeOption"
               :key="item.value"
               :label="item.label"
               :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
             type="textarea"
             :rows="5"
             placeholder="请输入内容"
             v-model="form.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false; $refs.addForm.resetFields()">取 消</el-button>
      <el-button type="primary" @click="submitAddForm('addForm')">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 查看详情弹出框 -->
  <el-dialog title="查看详情" :visible.sync="viewDetailsDialogVisible">
    <el-form :model="viewDetailsForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级机构" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.parentName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主账号" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.userName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.contactPerson" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.phone" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="经营范围" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.businessScope" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属行业" :label-width="formLabelWidth">
            <el-select v-model="viewDetailsForm.industryType" placeholder="请选择" style="width: 100%" disabled>
              <el-option
               v-for="item in options"
               :key="item.code"
               :label="item.value"
               :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="法人" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.legalPerson" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营许可证号" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.businessCertificate" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.address" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照号" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.businessLicense" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构类型" :label-width="formLabelWidth" prop="deptType">
            <el-select v-model="viewDetailsForm.deptType" placeholder="请选择" style="width: 100%" disabled>
              <el-option
               v-for="item in deptTypeOption"
               :key="item.value"
               :label="item.label"
               :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
             type="textarea"
             :rows="5"
             placeholder="请输入内容"
             v-model="viewDetailsForm.remark"
             disabled>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
  <!-- 编辑信息弹出框 -->
  <el-dialog title="编辑信息" :visible.sync="editDialogVisible">
    <el-form :model="editForm" :rules="rules" ref="editForm">
      <el-row>
        <!-- <el-col :span="24">
          <el-form-item label="上级机构" :label-width="formLabelWidth" prop="parentName" @focus="showEditDeptTree" class="deptTreeInput">
            <el-input v-model="editForm.parentName" disabled style="float: left; width: 90%"></el-input>
            <el-button icon="el-icon-search" style="float: left; width: 10%" @click="showEditDeptTree"></el-button>
            <div class="deptTree" v-show="editDeptTreeShow">
              <el-tree :data="data"
              :props="defaultProps"
              @node-click="editHandleNodeClick"
              default-expand-all
              :expand-on-click-node='false'
              ></el-tree>
            </div>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="上级机构" :label-width="formLabelWidth">
            <el-input v-model="editForm.parentName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主账号" :label-width="formLabelWidth" prop="userName">
            <el-input v-model="editForm.userName" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="联系人" :label-width="formLabelWidth" prop="contactPerson">
            <el-input v-model="editForm.contactPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系电话" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="经营范围" :label-width="formLabelWidth" prop="businessScope">
            <el-input v-model="editForm.businessScope"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属行业" :label-width="formLabelWidth" prop="industryType">
            <el-select v-model="editForm.industryType" placeholder="请选择" style="width: 100%">
              <el-option
               v-for="item in options"
               :key="item.code"
               :label="item.value"
               :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="法人" :label-width="formLabelWidth" prop="legalPerson">
            <el-input v-model="editForm.legalPerson"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经营许可证号" :label-width="formLabelWidth" prop="businessCertificate">
            <el-input v-model="editForm.businessCertificate"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="营业执照号" :label-width="formLabelWidth" prop="businessLicense">
            <el-input v-model="editForm.businessLicense"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="机构类型" :label-width="formLabelWidth" prop="deptType">
            <el-select v-model="editForm.deptType" placeholder="请选择" style="width: 100%">
              <el-option
               v-for="item in deptTypeOption"
               :key="item.value"
               :label="item.label"
               :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" :label-width="formLabelWidth">
            <el-input
             type="textarea"
             :rows="5"
             placeholder="请输入内容"
             v-model="editForm.remark">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitEditForm('editForm')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style lang="scss" scoped>
.organManagement{
  .organManagementHeader {
    padding-left: 30px;
    padding-top: 15px;
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
    .organManagementButton {
      float: right;
    }
  }
  .organManagementBody {
    margin: 20px;
    .pl-10 {
      padding-left: 10px
    }
  }
  .pagination {
    margin-left: 20px;
  }
  .deptTreeInput {
    position: relative;
    .deptTree {
      position: absolute;
      top: 36px;
      left: 0;
      z-index: 9;
      width: 100%;
      border: 1px solid #ccc;
      box-sizing: border-box;
    }
  }
}
</style>
<script>
import { getDeptList, getDeptTree, addDept, updateDept, deleteDept, getDownMenu, getDeptById } from '@/api/infomationM/organizational'
import { validatePhoneNum } from '@/utils/validate'

export default {
  data() {
    return {
      input: '',
      page: 1,
      total: 5,
      limit: 10,
      data: [],
      addDialogVisible: false,
      viewDetailsDialogVisible: false,
      editDialogVisible: false,
      formLabelWidth: '120px',
      deptTreeShow: false,
      editDeptTreeShow: false,
      tableList: [],
      loading: true,
      form: {},
      viewDetailsForm: {},
      editForm: {},
      options: [],
      deptTypeOption: [{
        value: '1',
        label: '机构'
      },
      {
        value: '2',
        label: '线路'
      }],
      tableData: [],
      rules: {
        parentName: [
          { required: true, message: '请输入上级机构名称', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入主账号', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        contactPerson: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        phone: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        industryType: [
          { required: true, message: '所属行业', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        legalPerson: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        deptType: [
          { required: true, message: '请选择机构类型', trigger: 'blur' },
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        businessCertificate: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        businessScope: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        address: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        businessLicense: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ]

      },
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.page = val
      this.getList()
    },
    showEditDeptTree() {
      this.editDeptTreeShow = !this.editDeptTreeShow
    },
    addData() {
      this.deptTreeShow = false
      this.addDialogVisible = true
      this.form = {
        industryType: '',
        deptType: ''
      }
      this.$nextTick(() => {
        this.$refs.addForm.resetFields()
      })
    },
    handleNodeClick(data) {
      if (data.attributes.deptType === 1) {
        this.form.parentId = data.id
        this.form.parentName = data.text
        this.$refs.addForm.validateField('parentName')
        this.deptTreeShow = false
      } else {
        this.$message.error('线路下不能新增机构或者线路!')
      }
    },
    editHandleNodeClick(data) {
      if (this.editForm.parentId !== parseInt(data.id)) {
        if (data.attributes.deptType === 1) {
          this.editForm.parentId = data.id
          this.editForm.parentName = data.text
          this.editDeptTreeShow = false
          this.$refs.editForm.validateField('parentName')
        } else {
          this.$message.error('线路下不能新增机构或者线路!')
        }
      } else {
        this.$message.error('上级机构不能选择该机构!')
      }
    },
    showDeptTree() {
      this.deptTreeShow = !this.deptTreeShow
    },
    // 表格筛选业务处理
    searchData() {
      this.page = 1
      this.getList()
    },
    // 提交表单业务处理
    submitAddForm(formName) {
      console.log(this.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.form)
          if (this.form.password === this.form.confirmPwd) {
            if (!this.form.phone || this.form.phone === '' || validatePhoneNum(this.form.phone)) {
              addDept(this.form).then(res => {
                console.log(res)
                if (res.code === 0) {
                  this.form = {}
                  this.$message({
                    type: 'success',
                    message: '提交成功!'
                  })
                  this.page = 1
                  this.getList()
                  this.getDept()
                  this.addDialogVisible = false
                  this.$nextTick(() => {
                    this.$refs[formName].resetFields()
                  })
                }
              })
            } else {
              this.$message.error('请输入正确的电话号码!')
            }
          } else {
            this.$message.error('请确认两次密码是否一致!')
          }
        }
      })
    },
    // 查看详情业务处理
    viewDetails(row) {
      this.viewDetailsDialogVisible = true
      getDeptById(row.deptId).then(res => {
        console.log(res.data)
        this.viewDetailsForm = res.data
        this.viewDetailsForm.industryType = String(res.data.industryType)
        this.viewDetailsForm.deptType = String(res.data.deptType)
      })
    },
    // 点击编辑业务处理
    edit(row) {
      this.editDeptTreeShow = false
      this.editDialogVisible = true
      this.editForm = {
        industryType: '',
        deptType: ''
      }
      getDeptById(row.deptId).then(res => {
        this.editForm = res.data
        console.log(res.data)
        this.editForm.industryType = String(res.data.industryType)
        this.editForm.deptType = String(res.data.deptType)
      })
      this.$nextTick(() => {
        this.$refs.editForm.resetFields()
      })
    },
    // 提交编辑业务处理
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 校验通过的逻辑处理
          console.log(this.editForm)
          if (!this.editForm.phone || this.editForm.phone === '' || validatePhoneNum(this.editForm.phone)) {
            updateDept(this.editForm).then(res => {
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: '编辑信息成功!'
                })
                this.editForm = {}
                this.page = 1
                this.getList()
                this.getDept()
                this.editDialogVisible = false
              }
            })
          } else {
            this.$message.error('请输入正确的电话号码!')
          }
        }
      })
    },
    // 删除业务处理
    deleteData(row) {
      this.$confirm('确定要删除该机构吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 在这里做删除的业务逻辑处理
        deleteDept(row.deptId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.page = 1
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getList() {
      getDeptList({ deptName: this.input, page: this.page, limit: this.limit }).then((res) => {
        console.log(res)
        const data = res.data.rows
        this.total = res.data.totalCount
        this.tableData = data
        this.loading = false
      }).catch(() => {
      })
    },
    getDept() {
      getDeptTree().then(res => {
        const data = JSON.parse('[' + JSON.stringify(res.data) + ']')
        console.log(data)
        this.data = data
      })
    }
  },
  mounted() {
    this.getList()
    this.getDept()
    getDownMenu({ type: 'industry_type' }).then(res => {
      this.options = res.data
    })
  }
}
</script>
