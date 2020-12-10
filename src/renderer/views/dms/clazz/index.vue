<template>
  <div style="min-height:100%;">
    <el-container style="min-height:calc(100vh - 100px); border: 1px solid rgb(238, 241, 246)">
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <el-button type="primary" style="width:100%;" @click="addRoot">
          添加一级分类
        </el-button>
        <el-tree
          :data="data"
          node-key="id"
          ref="tree"
          :highlight-current="true"
          :props="defaultProps"
          @node-click="handleNodeClick"
          >
        </el-tree>

      </el-aside>
      <el-container>
        <el-main>
          <el-form  v-show="updateFormVisible=='update'" ref="updateRef" label-width="120px"  :rules="rules" :model="clazz">
            <el-form-item label="节点名称" prop="name" :required="true">
              <el-input v-model="clazz.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="图层路径" prop="mapAddress" >
              <el-input v-model="clazz.mapAddress" auto-complete="off" readonly="readonly" @click.native="clickWorkspacesDialog('update')"/>
            </el-form-item>
            <el-form-item label="类型" prop="type" :required="true">
              <el-input v-model="clazz.type" type="text" />
            </el-form-item>
            <el-form-item label="排序值" prop="mapAddress" >
              <el-input v-model="clazz.orders" type="number" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="commitEvent('updateRef')" >更新</el-button>
              <el-button type="primary" @click="addChd">添加子分类</el-button>
              <el-button type="primary" @click="deleteClazz">删除</el-button>
            </el-form-item>
          </el-form>
          <el-form v-show="updateFormVisible=='addChd'" ref="addChd" label-width="120px" :rules="rules" :model="chdClazz">
            <el-form-item label="上级节点" prop="pname">
              <el-input v-model="chdClazz.pname" :disabled="true" />
            </el-form-item>
            <el-form-item label="节点名称" prop="name">
              <el-input v-model="chdClazz.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="图层路径" prop="mapAddress" >
              <el-input v-model="chdClazz.mapAddress" auto-complete="off" @click.native="clickWorkspacesDialog('addChd')" />
            </el-form-item>
            <el-form-item label="类型" prop="type" :required="true">
              <el-input v-model="chdClazz.type" type="text" />
            </el-form-item>
            <el-form-item label="排序值" prop="mapAddress" >
              <el-input v-model="chdClazz.orders" type="number" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="commitEvent('addChd')" >新增</el-button>
              <el-button @click="updateFormVisible='update'" >返回</el-button>
            </el-form-item>
          </el-form>
          <el-form v-show="updateFormVisible=='addRoot'" ref="addRoot" label-width="120px"  :rules="rules" :model="clazz">
            <el-form-item label="上级节点" prop="pname">
              <el-input v-model="clazz.pname" auto-complete="off" :disabled="true" />
            </el-form-item>
            <el-form-item label="节点名称" prop="name" :required="true">
              <el-input v-model="clazz.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="图层路径" prop="mapAddress" >
              <el-input v-model="clazz.mapAddress" auto-complete="off" @click.native="clickWorkspacesDialog('addRoot')" />
            </el-form-item>
            <el-form-item label="类型" prop="type" :required="true">
              <el-input v-model="clazz.type" type="text" />
            </el-form-item>
            <el-form-item label="排序值" prop="mapAddress" >
              <el-input v-model="clazz.orders" type="number" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="commitEvent('addRoot')" >新增根节点</el-button>
              <!-- <el-button @click="updateFormVisible='update'" >返回</el-button> -->
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
    <el-dialog title="选择地图服务" :visible.sync="selectMapDialogVisible">
      <div style="min-height:100%;">
        <el-container style="height:calc(100vh - 100px);border: 1px solid #eee">
          <el-aside width="300px" style="background-color: rgb(238, 241, 246)">

            <el-menu
              default-active="1"
              class="el-menu-vertical-demo"
            >
              <template v-for="(menu,index) in workspaces">
                <el-menu-item :key="index" :index='menu.wid' @click="selectMenuItem(menu)">
                  {{menu.wname}}
                </el-menu-item>
              </template>
              
            </el-menu>


          </el-aside>
          <el-container>
            <el-header style="text-align: left; font-size: 12px;height:60px;line-height:60px;">
              <el-input v-model="selectedMapURL" type="text" auto-complete="off" >
                <!-- <el-button type="primary" size="small" slot="append" >确定</el-button> -->
              </el-input>

            </el-header>
            <el-main>
              <el-table :data="tableData" @row-click="clickRow">
                <el-table-column prop="name" label="图层名称" width="200px">
                </el-table-column>
                <el-table-column prop="path" label="路径" :formatter="formatterDecode">
                </el-table-column>
              </el-table>
            </el-main>
          </el-container>
        </el-container>
      
      </div>
    </el-dialog>
  
  </div>
</template>

<script>
import {getList, addClazz, updateClazz, deleteClazz, getTree } from '@/api/dms'

// 引入electron库时，必须用window.require,不然会被webpack识别成前端的require，
const { remote, ipcRenderer } = window.require('electron');
const { net } = require('electron').remote;
const path = require('path');
const Store = require('electron-store');
const store = new Store();

export default {
  name: 'Clazz',
  data() {
    return {
      selectMapDialogVisible: false,
      workspaces: [],
      selectedMapURL: "",
      selectedMapType: "",
      tableData:[],
      updateFormVisible: 'update',// addChd：新增子节点，update:更新节点，addRoot:新增根节点
      clazz:{
        name:"",
        mapAddress:""
      },
      chdClazz: {

      },
      data: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      rules: {
        name: [
          { required: true, message: '请输节点名称', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在2 到 50 个字符', trigger: ['blur', 'change'] }
        ],
        type: [
          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在2 到 50 个字符', trigger: ['blur', 'change'] }
        ]
      },
      roles: [],
    }
  },
  mounted() {
    this.getTree()
  },
  methods: {
    getList(){
      var that = this
      getList({}).then(response => {
        if(response.code === 20000){
          that.workspaces = response.list.list
        }
      })
    },
    clickWorkspacesDialog(type){
      var that = this
      this.selectMapDialogVisible = true
      this.getList()
      this.selectedMapType = type
    },
    selectMenuItem(menu){
      console.log("selectMenuItem...",menu)
      var url = this.getServiceAddress(menu)
      this.queryMapList(url)
    },
    queryMapList(url){
      var that = this
      const request = net.request({
        method: 'GET',
        url: url,
      })

      request.on('response', (response) => {
        // console.log(`**statusCode:${response.statusCode}`);
        // console.log(`**header:${JSON.stringify(response.headers)}`);
        response.on("data", (chunk)=>{
          var responseData = JSON.parse(chunk.toString());
          if(responseData.length > 0){
            that.tableData = responseData
          }else{
            that.$message({
              type: 'warning',
              message: '获取失败!'
            })
          }
        })
        response.on('end', () => {
            console.log("数据接收完成");
        })
      });
      //结束请求，不然没有响应数据
      request.end();


    },
    formatterDecode(row, column){
      var val = row[column.property]
      return decodeURIComponent(val)
    },
    getServiceAddress(data){
      var serviceAddress = "";
      var setting = store.get("setting");
      serviceAddress = setting.iserverURL + "/iserver/services/map-"
      serviceAddress = serviceAddress + data.wname + "/rest/maps.rjson"
      return serviceAddress
    },

    clickRow(row, column, event){
      this.selectedMapURL = decodeURIComponent(row.path)
      var setting = store.get('setting')
      var iserverURL = setting.iserverURL
      this.selectedMapURL = this.selectedMapURL.replace(iserverURL,"")
      // this.selectedMapURL = this.getServiceName(this.selectedMapURL)
      // if(this.selectedMapURL == ""){
      //   this.$message({
      //     type: "warning",
      //     message: "解析的服务名称格式不正确"
      //   })
      //   return
      // }

      if(this.selectedMapType == "addRoot" || this.selectedMapType == "update"){
        this.clazz.mapAddress = this.selectedMapURL 
      }else if(this.selectedMapType == "addChd"){
        this.chdClazz.mapAddress = this.selectedMapURL 
      }
      this.selectMapDialogVisible = false
    },
    getServiceName(url){
      var result = "";
      var setting = store.get('setting')
      var iserverURL = setting.iserverURL
      this.selectedMapURL = this.selectedMapURL.replace(iserverURL,"")

      var arr = this.selectedMapURL.split("/")
      if(arr.length > 4){
        var mapServiceName = arr[3]
        result = mapServiceName.substr(4,mapServiceName.length);
      }
      console.log("result....",result,arr)
      return result;
    },

    getTree(){
      var that = this
      getTree({cid:"0"}).then(response =>{
        if(response.code == 20000){
          console.log("tree...",response.list)
          that.data = response.list
        }else{
          that.$message({
            type: 'warning',
            message: '添加失败!'
          })
        }
      })
    },
    handleNodeClick(data,node){
      console.log(data,node)
      this.clazz = JSON.parse(JSON.stringify(data))
      this.updateFormVisible='update'
    },

    addRoot(){
      console.log("add root ...")
      this.updateFormVisible = 'addRoot'
      this.clazz.pid = 0;
      this.clazz.pname = "根节点"
    },
    addChd(){
      this.chdClazz = JSON.parse(JSON.stringify(this.clazz))
      console.log("this.chdClazz...",this.chdClazz)
      this.chdClazz.pid = this.clazz.cid
      this.chdClazz.pname = this.clazz.name
      this.chdClazz.name = ""
      if(this.clazz.pid == "" || this.clazz.pid == null){
        this.$message({
          type: "warning",
          message: "请先选择一个节点"
        })
        return
      }
      this.updateFormVisible='addChd'


    },
    commitEvent(val){
      var that = this
      switch (val) {
        case 'addRoot':
          this.clazz.pid = 0;
          this.clazz.pname = "根节点"
          this.addClazz()
          break;
        case 'addChd':
          this.clazz = this.chdClazz
          if(this.clazz.pid == "" || this.clazz.pid == null){
            this.$message({
              type: "warning",
              message: "请先选择一个节点"
            })
            return
          }
          this.addClazz()
          break;
        case 'updateRef':
          if(this.clazz.cid == "" || this.clazz.cid == null){
            this.$message({
              type: "warning",
              message: "请先选择一个节点"
            })
            return
          }

          this.$confirm('是否要更新?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            that.updateClazz()
          })
          .catch(() => {
            that.$message({
              type: 'info',
              message: '已取消'
            })
          })
          break;
        default:
          break;
      }
    },
    addClazz(){
      var that = this;
      addClazz(this.clazz).then(response => {
        if(response.code === 20000){
          that.$message({
            type: 'success',
            message: '添加成功!'
          })
          that.getTree()
          that.updateFormVisible = 'update'
          that.clazz = {name:"请输入新值",pname:"请输入新值"}
        }else{
          that.$message({
            type: 'warning',
            message: '添加失败!'
          })
        }
      })
    },
    updateClazz(){
      var that = this;
      updateClazz(this.clazz).then(response => {
        if(response.code === 20000){
          that.$message({
            type: 'success',
            message: '修改成功!'
          })
          that.getTree()
        }else{
          that.$message({
            type: 'warning',
            message: '修改失败!'
          })
        }
      })
    },
    deleteClazz(){
      var that = this;
      if(this.clazz.cid == ""|| this.clazz.cid == null){
        that.$message({
          type: 'warning',
          message: "请先选择一个节点"
        })
        return;
      }

      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteClazz(this.clazz).then(response => {
          if(response.status === 200){
            that.$message({
              type: 'success',
              message: '删除成功!'
            })
            that.getTree()
            that.clazz = { cid:"", name:"请输入新值",pname:"请输入新值"}
          }else if(response.status === 201){
            that.$message({
              type: 'warning',
              message: '删除失败!'
            })
          }else if(response.status === 202){
            that.$message({
              type: 'warning',
              message: response.msg
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
    }

  }
}
</script>

<style lang="scss">
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: #cee5fd!important;
  }
</style>

