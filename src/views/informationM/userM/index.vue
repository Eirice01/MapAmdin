<template>
<div class="userM">
  <!-- 搜索部分 -->
  <el-row class="userMHeader">
    <el-col :span="18">
        登录帐号  <el-input v-model="roleInput" placeholder="请输入内容" style="width:150px"></el-input>
        用户状态  <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
        <!-- <el-input v-model="stateInput" placeholder="请输入内容" style="width:150px"></el-input> -->
        所属机构  <el-input v-model="organizationInput" placeholder="请输入内容" style="width:150px"></el-input>
        <el-button type="primary" @click="searchData">查询</el-button>
    </el-col>
    <el-col :span="4">
      <div class="grid-content bg-purple-light">
        <div class="userMButton">
          <el-button type="primary" @click="addData">新增</el-button>
          <el-button type="primary">导出</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
  <!-- 表格主体 -->
  <el-row class="userMBody">
    <el-col :span="23">
      <el-table
      :data="tableList"
      border
      stripe
      v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="name"
          label="登录帐号">
        </el-table-column>
        <el-table-column
          prop="blong"
          label="用户名称">
        </el-table-column>
        <el-table-column
          prop="account"
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="linkman"
          label="关联角色">
        </el-table-column>
        <el-table-column
          prop="phonenumber"
          label="帐号状态">
        </el-table-column>
        <el-table-column
          prop="higher"
          label="修改日期">
        </el-table-column>
        <el-table-column
         fixed="right"
         label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="4" class="pl-15"><el-button type="text"><span class="el-icon-setting" title="修改密码" @click="updatePassword(scope.row)"></span></el-button></el-col>
              <el-col :span="4" class="pl-15"><el-button type="text"><span class="el-icon-plus" title="分配车辆" @click="allotCar(scope.row)"></span></el-button></el-col>
              <el-col :span="4" class="pl-15"><el-button type="text"><span class="el-icon-edit-outline" title="查看详情" @click="viewDetails(scope.row)"></span></el-button></el-col>
              <el-col :span="4" class="pl-15"><el-button type="text"><span class="el-icon-edit" title="编辑" @click="edit(scope.row)"></span></el-button></el-col>
              <el-col :span="4" class="pl-15"><el-button type="text"><span class="el-icon-delete" title="删除" @click="deleteData(scope.row)"></span></el-button></el-col>
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
      :current-page="currentPage"
      :page-sizes="[10, 25, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next"
      :total="5">
    </el-pagination>
  </div>
  <!-- 弹出框 -->
  <!-- 新增弹出框 -->
  <el-dialog title="新增用户" :visible.sync="addDialogVisible">
    <el-form :model="form" :rules="rules" ref="addForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属机构" :label-width="formLabelWidth" prop="higher">
            <el-input v-model="form.higher"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录帐号" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="account">
            <el-input v-model="form.account"></el-input>
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
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirm">
            <el-input v-model="form.confirm" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色选择" :label-width="formLabelWidth">
            <el-input v-model="form.linkman"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆授权" :label-width="formLabelWidth">
            <el-input v-model="form.phonenumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="服务开始时间" :label-width="formLabelWidth">
            <el-input v-model="form.businessScope"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务到期时间" :label-width="formLabelWidth">
            <el-input v-model="form.businessScope"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上传用户头像" :label-width="formLabelWidth">
            <el-upload
             class="upload-demo"
             action="https://jsonplaceholder.typicode.com/posts/"
             :on-preview="handlePreview"
             :on-remove="handleRemove"
             :before-remove="beforeRemove"
             multiple
             :limit="3"
             :on-exceed="handleExceed"
             :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitAddForm('addForm')">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 修改密码弹出框 -->
  <el-dialog title="修改密码" :visible.sync="updatePasswordDialogVisible">
    <el-form :model="updatePasswordForm" :rules="rules" ref="updatePasswordForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="新密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="updatePasswordForm.password" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="确认密码" :label-width="formLabelWidth"  prop="confirm">
            <el-input v-model="updatePasswordForm.confirm" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="updatePasswordDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitUpdatePasswordForm('updatePasswordForm')">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 分配车辆弹出框 -->
  <el-dialog title="分配车辆" :visible.sync="allotDialogVisible" class="allotDialog">
    <el-row>
      <el-col :span="6" style="border: 1px solid #ccc; min-height: 400px; max-height: 600px">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-col>
      <el-col :span="17" :offset="1">
        <div class="searchInput">
          <el-select v-model="value1" placeholder="请选择" style="width: 150px; float: left">
            <el-option
              v-for="item in searchOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input placeholder="请输入内容" v-model="allotInput" style="width: 200px;">
            <template slot="append">查询</template>
          </el-input>
        </div>
        <div class="tableBody">
          <el-table
          ref="multipleTable"
          :data="allotTableData"
          tooltip-effect="dark"
          style="width: 100%; margin-top: 10px"
          stripe
          border
          @selection-change="handleSelectionChange">
            <el-table-column
              type="selection">
            </el-table-column>
            <el-table-column
              type="index">
            </el-table-column>
            <el-table-column
              label="车牌号"
              prop="name">
            </el-table-column>
            <el-table-column
              prop="name"
              label="企业">
            </el-table-column>
            <el-table-column
              prop="name"
              label="车队"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
            fixed="right"
            label="操作">
              <template slot-scope="scope">
                <el-checkbox v-model="checked"></el-checkbox>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </el-dialog>
  <!-- 查看详情弹出框 -->
  <el-dialog title="查看详情" :visible.sync="viewDetailsDialogVisible">
    <el-form :model="form" :rules="rules" ref="viewDetailsForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属机构" :label-width="formLabelWidth" prop="higher">
            <el-input v-model="viewDetailsForm.higher" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录帐号" :label-width="formLabelWidth" prop="name">
            <el-input v-model="viewDetailsForm.name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="account">
            <el-input v-model="viewDetailsForm.account" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="viewDetailsForm.password" type="password" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirm">
            <el-input v-model="viewDetailsForm.confirm" type="password" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色选择" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.linkman" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆授权" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.phonenumber" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="服务开始时间" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.businessScope" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务到期时间" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.businessScope" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上传用户头像" :label-width="formLabelWidth">
            <el-upload
             disabled
             class="upload-demo"
             action="https://jsonplaceholder.typicode.com/posts/"
             :on-preview="handlePreview"
             :on-remove="handleRemove"
             :before-remove="beforeRemove"
             multiple
             :limit="3"
             :on-exceed="handleExceed"
             :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
  <!-- 编辑信息弹出框 -->
  <el-dialog title="编辑信息" :visible.sync="editDialogVisible">
    <el-form :model="form" :rules="rules" ref="editForm">
      <el-row>
        <el-col :span="24">
          <el-form-item label="所属机构" :label-width="formLabelWidth" prop="higher">
            <el-input v-model="editForm.higher"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录帐号" :label-width="formLabelWidth" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="account">
            <el-input v-model="editForm.account"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="editForm.password" type="password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" :label-width="formLabelWidth" prop="confirm">
            <el-input v-model="editForm.confirm" type="password"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色选择" :label-width="formLabelWidth">
            <el-input v-model="editForm.linkman"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="车辆授权" :label-width="formLabelWidth">
            <el-input v-model="editForm.phonenumber"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="服务开始时间" :label-width="formLabelWidth">
            <el-input v-model="editForm.businessScope"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="服务到期时间" :label-width="formLabelWidth">
            <el-input v-model="editForm.businessScope"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="上传用户头像" :label-width="formLabelWidth">
            <el-upload
             class="upload-demo"
             action="https://jsonplaceholder.typicode.com/posts/"
             :on-preview="handlePreview"
             :on-remove="handleRemove"
             :before-remove="beforeRemove"
             multiple
             :limit="3"
             :on-exceed="handleExceed"
             :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
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
<style lang="scss">
.userM{
    .el-input {
        margin: 0 20px 0 10px;
    }
  .userMHeader {
    padding-left: 30px;
    padding-top: 15px;
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
    .userMButton {
      float: right;
    }
  }
  .userMBody {
    margin: 20px;
    .pl-15 {
      padding-left: 15px;
      box-sizing: border-box;
    }
  }
  .pagination {
    margin-left: 20px;
  }
}
</style>
<script>
export default {
  data() {
    return {
      roleInput: '',
      stateInput: '',
      organizationInput: '',
      allotInput: '',
      currentPage: 1,
      addDialogVisible: false,
      updatePasswordDialogVisible: false,
      viewDetailsDialogVisible: false,
      editDialogVisible: false,
      allotDialogVisible: false,
      formLabelWidth: '120px',
      tableList: [],
      loading: false,
      form: {},
      updatePasswordForm: {},
      viewDetailsForm: {},
      editForm: {},
      fileList: [],
      value: '',
      value1: '1',
      allotTableData: [],
      multipleSelection: [],
      checked: true,
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      options: [{
        value: '1',
        label: '未过期'
      },
      {
        value: '2',
        label: '已过期'
      }],
      searchOption: [{
        value: '1',
        label: '未分配'
      },
      {
        value: '2',
        label: '已分配'
      }],
      tableData: [
        {
          name: 'xx公司',
          blong: '互联网',
          account: 115665165165,
          linkman: 'xxx',
          phonenumber: 4195185,
          higher: 'xx公司'
        },
        {
          name: 'xx公司',
          blong: '互联网',
          account: 115665165165,
          linkman: 'bb',
          phonenumber: 4195185,
          higher: 'xx公司'
        },
        {
          name: 'xx公司',
          blong: '互联网',
          account: 115665165165,
          linkman: 'xxx',
          phonenumber: 4195185,
          higher: 'xx公司'
        },
        {
          name: 'ss公司',
          blong: '互联网',
          account: 115665165165,
          linkman: 'xxx',
          phonenumber: 4195185,
          higher: 'xx公司'
        },
        {
          name: 'xx公司',
          blong: '互联网',
          account: 115665165165,
          linkman: 'xxx',
          phonenumber: 4195185,
          higher: 'xx公司'
        }],
      rules: {
        name: [
          { required: true, message: '请输入公司名称', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入主账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        confirm: [
          { required: true, message: '请确认密码', trigger: 'blur' }
        ],
        higher: [
          { required: true, message: '请输入上级企业', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
    },
    handleCurrentChange(val) {
      console.log(val)
    },
    addData() {
      this.addDialogVisible = true
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除${file.name}`)
    },
    // 表格筛选业务处理
    searchData() {
      const newTableData = []
      this.tableData.forEach(item => {
        for (const key in item) {
          if (String(item[key]).includes(this.input)) {
            newTableData.push(item)
            return
          }
        }
      })
      this.tableList = newTableData
    },
    // 提交表单业务处理
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.form.password === this.form.confirm) {
          const { name, blong, account, linkman, phonenumber, higher } = this.form
          const newObj = {
            name,
            blong,
            account,
            linkman,
            phonenumber,
            higher
          }
          this.tableData.push(newObj)
          this.addDialogVisible = false
          this.form = {}
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '请完整填写表单并确认密码填写是否一致!'
          })
          return false
        }
      })
    },
    // 修改密码业务处理
    updatePassword(row) {
      this.updatePasswordDialogVisible = true
      // 在row中拿到要修改企业的id
    },
    // 密码修改提交业务处理
    submitUpdatePasswordForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.updatePasswordForm.password === this.updatePasswordForm.confirm) {
          // 校验通过的逻辑处理
          this.$message({
            type: 'success',
            message: '修改密码成功!'
          })
          this.updatePasswordForm = {}
          this.updatePasswordDialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '请完整填写表单并确认密码填写是否一致!'
          })
        }
      })
    },
    // 查看详情业务处理
    viewDetails(row) {
      this.viewDetailsDialogVisible = true
      this.viewDetailsForm = row
    },
    // 点击编辑业务处理
    edit(row) {
      this.editDialogVisible = true
      this.editForm = row
      console.log(row)
    },
    // 提交编辑业务处理
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && this.editForm.password === this.editForm.confirm) {
          // 校验通过的逻辑处理
          this.$message({
            type: 'success',
            message: '编辑信息成功!'
          })
          this.editForm = {}
          this.editDialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '请完整填写表单并确认密码填写是否一致!'
          })
        }
      })
    },
    // 删除业务处理
    deleteData(row) {
      this.$confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 在这里做删除的业务逻辑处理
        console.log(row)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击分配车辆
    allotCar(row) {
      this.allotDialogVisible = true
    //   this.$store.dispatch('GetDeptTree')
    //     .then(function(res) {
    //       console.log(JSON.parse(res.data))
    //     })
    //     .catch((data) => {
    //       console.log('error')
    //     })
    //   this.$store.dispatch('GetDept')
    //     .then(function(res) {
    //       console.log(res.data)
    //     })
    //     .catch((data) => {
    //       console.log('error')
    //     })
    },
    handleNodeClick(data) {
      console.log(data)
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  mounted() {
    this.tableList = this.tableData
  }
}
</script>
