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
          <el-button type="primary">同步图层数据</el-button>
        </el-header>
        <el-main>
          <el-table :data="tableData">
            <el-table-column prop="name" label="图层名称" width="200px">
            </el-table-column>
            <el-table-column prop="path" label="路径" :formatter="formatterDecode">
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  
  </div>
</template>

<script>
import { getList } from '@/api/dms'

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
      tableData:[
        {name:"111",path:"222"}
      ]
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
    getServiceAddress(data){
      var serviceAddress = "";
      var setting = store.get("setting");
      console.log(setting)
      serviceAddress = setting.iserverURL + "/iserver/services/map-"
      serviceAddress = serviceAddress + data.wname + "/rest/maps.rjson"
      console.log("serviceAddress...",serviceAddress)
      return serviceAddress
    }

  }
}
</script>

<style lang="scss" scoped>
</style>

