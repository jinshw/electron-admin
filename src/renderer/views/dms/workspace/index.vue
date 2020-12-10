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
         <el-form-item label="工作空间名称" prop="wname">
          <el-input ref="wname" v-model="workspace.wname" auto-complete="off" :disabled="true" :required="true"/>
        </el-form-item>
         <el-form-item label="版本号" prop="version">
          <el-input ref="version" v-model="workspace.version" auto-complete="off" :disabled="true" :required="true"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="commitEvent('addRef')" >立即提交</el-button>
          <el-button @click="addDialogVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table :data="workspaces" style="width:100%">
      <!-- <el-table-column prop="wid" label="主键" width="180" /> -->
      <el-table-column prop="wname" label="工作空间名称" />
      <el-table-column prop="version" label="版本号" width="100"/>
      <el-table-column prop="isPublish" label="发布状态" width="100" :formatter="formatterPublish"/>
      <el-table-column prop="filepath" label="文件路径" />
      <el-table-column prop="createtime" :formatter="dateFormat" label="创建时间" />
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <!-- <el-button type="text" size="small">查看</el-button> -->
          <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          <el-button v-if="scope.row.isPublish !== 1" type="text" size="small" @click="handlePublish(scope.$index, scope.row)">发布</el-button>
          <el-button v-if="scope.row.isPublish == 1" type="text" size="small" @click="handleDeleteServer(scope.$index, scope.row)">删除服务</el-button>
        </template>
      </el-table-column>
    </el-table>

  
  </div>
</template>

<script>
import { getList, addWorkapce,editWorkapce,deleteWorkapce } from '@/api/dms'
import moment from 'moment'

// 引入electron库时，必须用window.require,不然会被webpack识别成前端的require，
const { remote, ipcRenderer } = window.require('electron');
const { net } = require('electron').remote;
const path = require('path')
const Store = require('electron-store');

const store = new Store();

// import qs from 'qs'
export default {
  name: 'Workspace',
  data() {
    return {
      loginCount:3,
      cookie:null,
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
          { required: true, message: '请选择文件', trigger: 'blur' },
        ],
        version: [
          { required: true, message: '请输入版本号', trigger: 'blur' },
        ]
      },
      roles: [],
      rolesSelect: [],
    }
  },
  mounted() {
    this.getList()
    this.loginIserver()
  },
  methods: {
    getList(){
      var that = this
      getList({}).then(response => {
        console.log("workspace...getList...",response)
        if(response.code === 20000){
          that.workspaces = response.list.list
        }
      })
    },
    async openDialog(){
      var that = this
      const result = await remote.dialog.showOpenDialog({
          properties: ['openFile'],
      });
      console.log("您选择文件result：",result)
      console.log("您选择文件是：",result.filePaths)
      this.workspace.filepath =  result.filePaths[0]
      this.workspace.wname = path.basename(this.workspace.filepath,path.extname(this.workspace.filepath))
      this.workspace.version = this.getVersion(this.workspace.wname);
      if(this.workspace.version == null || this.workspace.version == ''){
        this.$message({
          duration:10000,
          type: 'warning',
          message: '工作空间文件名称不符合规范，规范：项目名称-模块名称-版本号!'
        })
      }
    
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
      that.initRowToObj(row)
    },
    handleDelete: function(index, row) {
      var that = this
      that.initRowToObj(row)
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: '执行中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          deleteWorkapce(that.workspace).then(response => {
            console.log("deleteWorkapce...",response)
            loading.close();
            if(response.code === 20000){
              
              that.$message({
                type: 'success',
                message: '删除成功!'
              })
              that.getList()
            }else{
              that.$message({
                type: 'warning',
                message: '删除服务失败!'
              })
            }
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handlePublish(index, row){
      var that = this
      console.log("handlePublish.....",index, row)
      that.initRowToObj(row)
      // 登录获取cookie
      // that.loginIserver()

      that.publish({
        "servicesTypes":["RESTMAP", "RESTDATA"],
        "workspaceConnectionInfo": row.filepath,
        "isDataEditable":"true"
      })
    },
    handleDeleteServer(index, row){
      var that = this
      console.log("handleDeleteServer.....",index, row)
      that.initRowToObj(row)
      this.$confirm('此操作是删除发布的服务, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          that.deleteServer({
            "workspaceConnectionInfo": row.filepath,
          })
        })
        .catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

    },
   
    loginIserver(){
      var that = this
      var postData = JSON.stringify({
        "username":"supermap",
        "password": "supermap@123",
        "rememberme":"true"
      })
      const request = net.request({
        method: 'POST',
        url:"http://localhost:8090/iserver/services/security/login.json",
      })
      request.setHeader('Content-Type', 'application/json;charset=UTF-8');


      request.on('response', (response) => {
        console.log(`**statusCode:${response.statusCode}`);
        // console.log(`**header:${JSON.stringify(response.headers)}`);
        console.log("response.headers...",response.headers)
        that.cookie = response.headers["set-cookie"]
        response.on("data", (chunk)=>{
            console.log("接收到数据：", chunk.toString());
        })
        response.on('end', () => {
            console.log("数据接收完成");
        })
      });
      // 写入数据
      request.write(postData);
      //结束请求，不然没有响应数据
      request.end();
    },
    publish(data){
      var that = this
      var postData = JSON.stringify(data)
      
      const loading = this.$loading({
          lock: true,
          text: '执行中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });


      const request = net.request({
        method: 'POST',
        url:"http://localhost:8090/iserver/manager/workspaces.json",
      })
      request.setHeader('Content-Type', 'application/json;charset=UTF-8');
      request.setHeader('cookie', that.cookie);


      request.on('response', (response) => {
        console.log(`**statusCode:${response.statusCode}`);
        // console.log(`**header:${JSON.stringify(response.headers)}`);
        console.log("workspaces response.headers...",response.headers)
        response.on("data", (chunk)=>{
          loading.close();
          var responseData = JSON.parse(chunk.toString());
          console.log("接收到数据：", responseData);
          if(responseData.length > 0){
            that.$message({
              type: 'success',
              message: '发布成功!'
            })
            that.workspace.isPublish = 1
            that.edit()

          }else{
            that.$message({
              type: 'warning',
              message: '发布失败!'
            })
          }
        })
        response.on('end', () => {
            console.log("数据接收完成");
        })
      });
      // 写入数据
      request.write(postData);
      //结束请求，不然没有响应数据
      request.end();

    },
    deleteServer(data){
      var that = this
      var postData = JSON.stringify(data)
      const loading = this.$loading({
          lock: true,
          text: '执行中...',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      const request = net.request({
        method: 'PUT',
        url:"http://localhost:8090/iserver/manager/workspaces.json",
      })
      request.setHeader('Content-Type', 'application/json;charset=UTF-8');
      request.setHeader('cookie', that.cookie);


      request.on('response', (response) => {
        response.on("data", (chunk)=>{
          loading.close();
          var responseData = JSON.parse(chunk.toString());
          console.log("接收到数据：", responseData);
          if(responseData.succeed == true){
            that.$message({
              type: 'success',
              message: '删除服务成功!'
            })
            that.workspace.isPublish = 0
            that.edit()

          }else{
            that.$message({
              type: 'warning',
              message: '删除服务失败!'
            })
          }
        })
        response.on('end', () => {
            console.log("数据接收完成");
        })
      });
      // 写入数据
      request.write(postData);
      //结束请求，不然没有响应数据
      request.end();
    },
    commitEvent: function(ref) {
      var that = this
      if(this.dialogTitle == '新增'){
        that.add();
      }else{
        that.edit();
      }
    },
    add(){
      var that = this
      addWorkapce(that.workspace).then(response => {
        if(response.code === 20000){
          that.getList();
          that.addDialogVisible = false
          that.$message({
            type: 'success',
            message: '添加成功!'
          })
        }else{
          that.$message({
            type: 'warning',
            message: '添加失败!'
          })
        }
      })
    },
    edit(){
      var that = this
      editWorkapce(that.workspace).then(response => {
        if(response.code === 20000){
          that.getList();
          that.addDialogVisible = false
          // that.$message({
          //   type: 'success',
          //   message: '修改成功!'
          // })
        }else{
          that.$message({
            type: 'warning',
            message: '修改失败!'
          })
        }
      })
    },
    initRowToObj: function(row) {
      var that = this
      this.workspace = JSON.parse(JSON.stringify(row))
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
    },
    dateFormat: function(row, column) {
      var date = row[column.property]
      if (date === undefined) {
        return ''
      }
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    },
     sleep(delay) {
      // 毫秒
      var start = new Date().getTime()
      while (new Date().getTime() - start < delay) {
        continue
      }
    },
    getVersion(filename){
      var version = ""
      var arr = filename.split("-")
      if(arr.length >= 3){
        version = arr[2]
      }
      return version;
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

