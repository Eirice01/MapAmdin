<template>
<div class="roleM">
  <!-- 搜索部分 -->
  <el-row class="roleMHeader">
    <el-col :span="14">
        角色名称  <el-input v-model="roleInput" placeholder="请输入内容" style="width:200px"></el-input>
        所属机构  <el-input v-model="organizationInput" placeholder="请输入内容" style="width:200px"></el-input>
        <el-button type="primary" @click="searchData">查询</el-button>
    </el-col>
    <el-col :span="6" :offset="2">
      <div class="grid-content bg-purple-light">
        <div class="roleMButton">
          <el-button type="primary" @click="addData">新增</el-button>
          <el-button type="primary">导出</el-button>
        </div>
      </div>
    </el-col>
  </el-row>
  <!-- 表格主体 -->
  <el-row class="roleMBody">
    <el-col :span="23">
      <el-table
      :data="tableData"
      border
      stripe
      v-loading="loading">
        <el-table-column
          type="index"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="deptName"
          label="所属机构">
        </el-table-column>
        <el-table-column
          prop="date"
          label="修改日期">
        </el-table-column>
        <el-table-column
         fixed="right"
         label="操作">
          <template slot-scope="scope">
            <el-row>
              <el-col :span="8" class="pl-10"><el-button type="text"><span class="el-icon-edit-outline" title="查看详情" @click="viewDetails(scope.row)"></span></el-button></el-col>
              <el-col :span="8" class="pl-10"><el-button type="text"><span class="el-icon-edit" title="编辑" @click="edit(scope.row)"></span></el-button></el-col>
              <el-col :span="8" class="pl-10"><el-button type="text"><span class="el-icon-delete" title="删除" @click="deleteData(scope.row)"></span></el-button></el-col>
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
      layout="total, sizes, prev, pager, next"
      :total="totalCount">
    </el-pagination>
  </div>
  <!-- 弹出框 -->
  <!-- 新增弹出框 -->
  <el-dialog title="新增角色" :visible.sync="addDialogVisible">
    <el-form :model="form" :rules="rules" ref="addForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="form.roleName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属企业" :label-width="formLabelWidth" prop="deptName" id="deptName">
            <el-input v-model="form.deptName" @focus="showDeptTree"></el-input>
            <div class="deptTree" v-show="deptTreeVisible">
              <el-tree
              :data="data"
              :props="defaultProps1"
              @node-click="handleNodeClick1"
              default-expand-all
              ></el-tree>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-tree
        :data="data2"
        show-checkbox
        node-key="id"
        default-expand-all
        :props="defaultProps"
        style="max-height: 300px; overflow: auto; padding-left: 30px">
      </el-tree>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="addDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitAddForm('addForm')">确 定</el-button>
    </div>
  </el-dialog>
  <!-- 查看详情弹出框 -->
  <el-dialog title="查看详情" :visible.sync="viewDetailsDialogVisible">
    <el-form :model="viewDetailsForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.name" disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属企业" :label-width="formLabelWidth">
            <el-input v-model="viewDetailsForm.blong" disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-tree
        :data="data2"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="[5]"
        :props="defaultProps"
        style="max-height: 300px; overflow: auto; padding-left: 30px">
      </el-tree>
    </el-form>
  </el-dialog>
  <!-- 编辑信息弹出框 -->
  <el-dialog title="所属企业" :visible.sync="editDialogVisible">
    <el-form :model="editForm" :rules="rules" ref="editForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主账号" :label-width="formLabelWidth" prop="blong">
            <el-input v-model="editForm.blong"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-tree
        :data="data2"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="[5]"
        :props="defaultProps"
        style="max-height: 300px; overflow: auto; padding-left: 30px">
      </el-tree>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="editDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitEditForm('editForm')">确 定</el-button>
    </div>
  </el-dialog>
</div>
</template>
<style lang="scss" scoped>
.roleM{
  .roleMHeader {
    padding-left: 30px;
    padding-top: 15px;
    .el-input {
        margin: 0 20px 0 10px;
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
    .roleMButton {
      float: right;
    }
  }
  .roleMBody {
    margin: 20px;
    .pl-10 {
      padding-left: 10px
    }
  }
  .pagination {
    margin-left: 20px;
  }
  #deptName {
    position: relative;
    .deptTree {
      width: 100%;
      position: absolute;
      border: 1px solid #ccc;
      top: 36px;
      left: 0;
      z-index: 9;
    }
  }
}
</style>
<script>
import { getRoleList, getMenuTree } from '@/api/infomationM/role'
import { getDeptTree } from '@/api/infomationM/organizational'
export default {
  data() {
    return {
      roleInput: '',
      organizationInput: '',
      page: 1,
      limit: 10,
      data: [],
      totalCount: 10,
      addDialogVisible: false,
      viewDetailsDialogVisible: false,
      editDialogVisible: false,
      formLabelWidth: '120px',
      tableList: [],
      loading: true,
      form: {},
      viewDetailsForm: {},
      editForm: {},
      tableData: [],
      deptTreeVisible: false,
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '情输入所属企业', trigger: 'blur' }
        ]
      },
      defaultProps1: {
        children: 'children',
        label: 'text'
      },
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      console.log(val)
      this.limit = val
      this.getAllList()
    },
    handleCurrentChange(val) {
      console.log(val)
      this.page = val
      this.getAllList()
    },
    handleNodeClick() {

    },
    handleNodeClick1(data) {
      this.form.deptName = data.text
      this.form.deltid = data.id
      this.deptTreeVisible = false
      this.$refs.addForm.validateField('deptName')
    },
    showDeptTree() {
      this.deptTreeVisible = true
    },
    addData() {
      this.addDialogVisible = true
    },
    // 表格筛选业务处理
    searchData() {
      this.getAllList()
    },
    // 提交表单业务处理
    submitAddForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid && this.form.password === this.form.confirm) {
          // 提交表单前端验证通过之后的逻辑处理
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.addDialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '请完整填写表单!'
          })
          return false
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
      this.$confirm('确定要删除该企业吗?', '提示', {
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
    getAllList() {
      getRoleList({ roleName: this.roleInput, deptName: this.organizationInput, page: this.page, limit: this.limit }).then(res => {
        this.loading = false
        this.tableData = res.data.rows
        this.totalCount = res.data.totalCount
      })
    }
  },
  mounted() {
    this.loading = true
    this.getAllList()
    getDeptTree().then(res => {
      const data = JSON.parse('[' + JSON.stringify(res.data) + ']')
      this.data = data
    })
    getMenuTree().then(res => {
      console.log(res)
    })
  }
}
</script>
