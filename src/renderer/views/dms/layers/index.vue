<template>
  <div style="min-height:100%;">
    <el-container style="height:calc(100vh - 100px); max-height:calc(100vh);border: 1px solid #eee">
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">

        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
        >
          <!-- <el-menu-item index="1" title="选项1选项1选项1选项1选项1选项1选项1选项111111" @click="selectMenuItem('1')">选项1选项1选项1选项1选项1选项1选项1选项111111</el-menu-item>
          <el-menu-item index="2" @click="selectMenuItem('2')">选项2</el-menu-item> -->
          <template v-for="(menu,index) in workspaces">
            <el-menu-item :key="index" :index='menu.wid' @click="selectMenuItem(menu)">
              {{menu.wname}}
            </el-menu-item>
          </template>
          
        </el-menu>


      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px;height:60px;line-height:60px;">
          <el-button type="primary" @click="getDmsMaplayers">同步图层数据</el-button>
        </el-header>
        <el-main>
          <el-table :data="dmsMaplayers">
            <el-table-column prop="layerName" label="图层名称" width="200px">
            </el-table-column>
            <el-table-column prop="layerPath" label="路径">
            </el-table-column>
            <el-table-column prop="isSyn" label="是否同步" :formatter="formatterSyn">
            </el-table-column>
            <el-table-column prop="indexed" label="是否创建索引" :formatter="formatterIndexed">
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                <!-- <el-button v-if="scope.row.isPublish !== 1" type="text" size="small" @click="handlePublish(scope.$index, scope.row)">发布</el-button>
                <el-button v-if="scope.row.isPublish == 1" type="text" size="small" @click="handleDeleteServer(scope.$index, scope.row)">删除服务</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  
  </div>
</template>

<script>
import { getList,synExeMaplayer,getMaplayerList,deleteMaplayer } from '@/api/dms'

// 引入electron库时，必须用window.require,不然会被webpack识别成前端的require，
const { remote, ipcRenderer } = window.require('electron');
const { net } = require('electron').remote;
const path = require('path');
const Store = require('electron-store');
const store = new Store();

export default {
  name: 'Layers',
  data() {
    return {
      workspaces:[],
      selectedWorkspace:{},
      tableData:[
        {name:"111",path:"222"}
      ],
      dmsMaplayers: [],
      dmsMaplayersParameter: [],
      selectedMaplayer: null
    }
  },
  mounted() {
    this.getList()
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
    selectMenuItem(menu){
      console.log("selectMenuItem...",menu)
      // var url = "http://localhost:8090/iserver/services/map-zhdt/rest/maps.rjson"
      this.selectedWorkspace = menu
      var url = this.getServiceAddress(menu)
      this.queryMapList(url)
      this.getMaplayerList()
    },
    queryMapList(url){
      var that = this
      const request = net.request({
        method: 'GET',
        url: url,
      })

      request.on('response', (response) => {
        console.log(`**statusCode:${response.statusCode}`);
        // console.log(`**header:${JSON.stringify(response.headers)}`);
        response.on("data", (chunk)=>{
          var responseData = JSON.parse(chunk.toString());
          console.log("queryMapList接收到数据：", responseData);
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
      console.log(val);
      return decodeURIComponent(val)
    },
    formatterSyn(row, column){
      var result = ""
      var val = row[column.property]
      switch (val) {
        case 1:
          result = "同步"
          break;
        case 2:
          result = "未同步"
          break;
        default:
          result = ""
          break;
      }
      return result
    },
    formatterIndexed(row, column){
      var result = ""
      var val = row[column.property]
      switch (val) {
        case 1:
          result = "已经创建"
          break;
        case 2:
          result = "未创建"
          break;
        default:
          result = ""
          break;
      }
      return result
    },
    getServiceAddress(data){
      var serviceAddress = "";
      var setting = store.get("setting");
      console.log(setting)
      serviceAddress = setting.iserverURL + "/iserver/services/map-"
      serviceAddress = serviceAddress + data.wname + "/rest/maps.rjson"
      console.log("serviceAddress...",serviceAddress)
      return serviceAddress
    },
    getDmsMaplayers(){
      var that = this;

      this.$confirm('数据库中图层与iserver服务同步, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dmsMaplayersParameter = []
        for(var index in this.tableData){
          var obj = this.tableData[index]
          var selectedMapURL = decodeURIComponent(obj.path)
          var setting = store.get('setting')
          var iserverURL = setting.iserverURL
          selectedMapURL = selectedMapURL.replace(iserverURL,"")
          this.dmsMaplayersParameter.push({ layerName:obj.name, layerPath: selectedMapURL, wid: this.selectedWorkspace.wid})
        }
        synExeMaplayer(this.dmsMaplayersParameter).then(response => {
          console.log("synexe...",response)
          if(response.code == 20000){
            that.$message({
              type: 'success',
              message: '同步成功!'
            })
          }
          that.getMaplayerList()
        })


      })
      .catch(() => {
        that.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    getMaplayerList(){
      var that = this
      getMaplayerList({wid: this.selectedWorkspace.wid}).then(response => {
        that.dmsMaplayers = response.list
      })
    },

    handleDelete: function(index, row) {
      var that = this
      this.selectedMaplayer = JSON.parse(JSON.stringify(row))
      if(this.selectedMaplayer.indexed === 1){
        this.$message({
          type: 'warning',
          message: '已经创建索引，需要先删除索引!'
        })
        return
      }

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

          deleteMaplayer(that.selectedMaplayer).then(response => {
            loading.close();
            if(response.code === 20000){
              
              that.$message({
                type: 'success',
                message: '删除成功!'
              })
              that.getMaplayerList()
            }else{
              that.$message({
                type: 'warning',
                message: '删除失败!'
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


  }
}
</script>

<style lang="scss" scoped>
</style>

