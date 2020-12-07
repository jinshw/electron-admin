<template>
  <div>
    <el-row class="d2-mb" :gutter="10">
      <el-col :span="6">
        <el-input v-model.trim="searchWorkSpace.wname" type="text" placeholder="工作空间名称" />
      </el-col>
      <el-col :span="6">
        <el-input v-model.trim="searchWorkSpace.dmsVersion.version" type="text" placeholder="版本号" />
      </el-col>
      <el-col :span="12">
        <el-button >查询</el-button>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>
    <el-dialog :title="dialogTitle" :visible.sync="addDialogVisible" :close-on-click-modal="false">
      <el-form ref="addRef" label-width="120px"  :rules="rules" :model="workspace">
        <el-form-item label="文件路径" prop="filepath">
          <el-input ref="filepath" v-model="workspace.filepath" :disabled="true" auto-complete="off" :required="true">
            <el-button size="small" slot="append" type="primary" @click="openDialog">选择文件</el-button>
          </el-input>
        </el-form-item>
         <el-form-item label="工作空间名称" prop="wname" :required="true">
          <el-input v-model="workspace.wname" auto-complete="off" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="commitEvent('addRef')" >立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="workspaces" style="width:100%">
      <el-table-column prop="wid" label="主键" width="180" />
      <el-table-column prop="wname" label="工作空间名称" />
      <el-table-column prop="dmsVersion.version" label="版本号" width="100"/>
      <el-table-column prop="isPublish" label="发布状态" width="100" :formatter="formatterPublish"/>
      <el-table-column prop="filepath" label="文件路径" />
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  
  </div>
</template>

<script>
import { deleteUser, editUser, resetPassword } from '@/api/user'
import { getList } from '@/api/role'

import $ from 'jquery'
var http = require('http');
var querystring = require('querystring');
var util = require('util');

// 引入electron库时，必须用window.require,不然会被webpack识别成前端的require，
// 参考：https://www.cnblogs.com/wonyun/p/10991984.html
const { remote, ipcRenderer} = window.require('electron');

// import qs from 'qs'
export default {
  name: 'Workspace',
  data() {
    return {
      dialogTitle: '新增',
      addDialogVisible: false,
      searchWorkSpace: {
         dmsVersion:{
            vid:"",
            version:""
          }
      },
      workspace: {
        wid:"",
        wname:"",
        filepath:"",
        isPublish:0,
        dmsVersion:{
          vid:"",
          version:""
        }
      },
      workspaces:[
        {
          wid:"1",
          wname:"111",
          filepath:"111",
          isPublish:1,
          dmsVersion:{
            vid:"1",
            version:"2017"
          }
        },
        {
          wid:"2",
          wname:"222",
          filepath:"222",
          isPublish:0,
          dmsVersion:{
            vid:"2",
            version:"2018"
          }
        },
      ],
      rules: {
        wname: [
          { required: true, message: '请输工作空间名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在3 到 30 个字符', trigger: ['blur', 'change'] }
        ],
        filepath: [
          { required: true, message: '请输选择文件', trigger: 'blur' },
        ]
      },
      roles: [],
      rolesSelect: [],
    }
  },
  mounted() {
  },
  methods: {
    async openDialog(){
        const result = await remote.dialog.showOpenDialog({
            properties: ['openFile'],
        });
        console.log("您选择文件result：",result)
        console.log("您选择文件是：",result.filePaths)
        this.workspace.filepath =  result.filePaths[0]
    },
    handleAdd() {
      this.dialogTitle = '新增'
      this.addDialogVisible = true
      this.workspace = { wname:"",filepath:"" }
    },
    handleEdit: function(index, row) {
      var that = this
      that.dialogTitle = '编辑'
      that.addDialogVisible = true
      that.workspace = row
    },
    handleDelete: function(index, row) {
      var that = this
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    commitEvent: function(ref) {

    },
    formatterPublish(row, column){
      // 获取单元格数据
      const val = row[column.property]
      var result = '未发布'
      switch (val) {
        case 0:
          result = '未发布'
          break
        case 1:
          result = '已发布'
          break
        default:
          result = '未发布'
          break
      }
      return result
    }


  }
}
</script>

<style lang="scss" scoped>
$dark_gray:#889aa4;
.show-pwd {
  position: absolute;
  right: 10px;
  top: 0px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
</style>

