<template>
  <div style="min-height:100%;">
    <el-container style="height:calc(100vh - 100px); max-height:calc(100vh);border: 1px solid #eee">
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">

        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
        >
          <el-menu-item index="1" title="选项1选项1选项1选项1选项1选项1选项1选项111111" @click="selectMenuItem('1')">选项1选项1选项1选项1选项1选项1选项1选项111111</el-menu-item>
          <el-menu-item index="2" @click="selectMenuItem('2')">选项2</el-menu-item>
          <el-menu-item index="3" @click="selectMenuItem('3')">选项3</el-menu-item>
        </el-menu>


      </el-aside>
      <el-container>
        <el-header style="text-align: right; font-size: 12px;height:60px;line-height:60px;">
          <el-button type="primary">同步图层数据</el-button>
        </el-header>
        <el-main>
          <el-table :data="tableData">
            <el-table-column prop="layerName" label="图层名称">
            </el-table-column>
            <el-table-column prop="layerPath" label="路径">
            </el-table-column>
          </el-table>
        </el-main>
      </el-container>
    </el-container>
  
  </div>
</template>

<script>

export default {
  name: 'Layers',
  data() {
    return {
      tableData:[
        { layerId:"1", layerName:"xjjt_2016", layerPath:"gs" }
      ]
    }
  },
  mounted() {
  },
  methods: {
    selectMenuItem(index){
      console.log(index)
    }

  }
}
</script>

<style lang="scss" scoped>
</style>

