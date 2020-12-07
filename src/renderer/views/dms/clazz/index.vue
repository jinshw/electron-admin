<template>
  <div style="min-height:100%;">
    <el-container style="min-height:calc(100vh - 100px); border: 1px solid rgb(238, 241, 246)">
      <el-aside width="300px" style="background-color: rgb(238, 241, 246)">
        <el-button type="primary" style="width:100%;" @click="addRoot">
          添加分类
        </el-button>
        <el-tree
          :data="data"
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"

          >
        </el-tree>

      </el-aside>
      <el-container>
        <el-main>
          <el-form  v-if="updateFormVisible=='update'" ref="updateRef" label-width="120px"  :rules="rules" :model="clazz">
            <el-form-item label="节点名称" prop="name" :required="true">
              <el-input v-model="clazz.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="图层路径" prop="layer.layerName" >
              <el-input v-model="clazz.layer.layerName" auto-complete="off" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="commitEvent('updateRef')" >更新</el-button>
              <el-button type="primary" @click="updateFormVisible='addChd'">添加子分类</el-button>
              <!-- <el-button>取消</el-button> -->
            </el-form-item>
          </el-form>
          <el-form v-if="updateFormVisible=='addChd'" ref="addRef" label-width="120px"  :rules="rules" :model="clazz">
            <el-form-item label="上级节点" prop="name" :required="true">
              <el-input v-model="clazz.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="节点名称" prop="name" :required="true">
              <el-input v-model="clazz.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="图层路径" prop="layer.layerName" >
              <el-input v-model="clazz.layer.layerName" auto-complete="off" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="commitEvent('addRef')" >新增</el-button>
              <el-button @click="updateFormVisible='update'" >返回</el-button>
            </el-form-item>
          </el-form>
          <el-form v-if="updateFormVisible=='addRoot'" ref="addRef" label-width="120px"  :rules="rules" :model="clazz">
            <el-form-item label="上级节点" prop="name" :required="true">
              <el-input v-model="clazz.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="节点名称" prop="name" :required="true">
              <el-input v-model="clazz.name" auto-complete="off" />
            </el-form-item>
            <el-form-item label="图层路径" prop="layer.layerName" >
              <el-input v-model="clazz.layer.layerName" auto-complete="off" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="commitEvent('addRef')" >新增根节点</el-button>
              <!-- <el-button @click="updateFormVisible='update'" >返回</el-button> -->
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  
  </div>
</template>

<script>

export default {
  name: 'Clazz',
  data() {
    return {
      tableData:[],
      updateFormVisible: 'update',// addChd：新增子节点，update:更新节点，addRoot:新增根节点
      clazz:{
        name:"",
        layer:{
          layerName: "高速"
        }
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
          { min: 3, max: 50, message: '长度在3 到 30 个字符', trigger: ['blur', 'change'] }
        ]
      },
      roles: [],
    }
  },
  mounted() {
  },
  methods: {
    getCheckedNodes() {
        console.log(this.$refs.tree.getCheckedNodes());
      },
      getCheckedKeys() {
        console.log(this.$refs.tree.getCheckedKeys());
      },
      setCheckedNodes() {
        this.$refs.tree.setCheckedNodes([{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 9,
          label: '三级 1-1-1'
        }]);
      },
      setCheckedKeys() {
        this.$refs.tree.setCheckedKeys([3]);
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([]);
      },
      addRoot(){
        console.log("add root ...")
        this.updateFormVisible = 'addRoot'
      }



      /* append(data) {
        const newChild = { id: Math.random()*100, label: 'testtest', children: [] };
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },
      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
            <span>
              <el-button size="mini" type="text" style="padding-left:20px;" on-click={ () => this.append(data) }>添加子分类</el-button>
 
            </span>
          </span>);
      }
 */
      // rightClick(row, event) {
      //   this.menuVisible = false; // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      //   this.menuVisible = true; // 显示模态窗口，跳出自定义菜单栏
      //   var menu = document.querySelector('#menu');
      //   this.styleMenu(menu);
      // },
      // styleMenu(menu) {
      //   if (event.clientX > 1800) {
      //     menu.style.left = event.clientX - 100 + 'px';
      //   } else {
      //     menu.style.left = event.clientX + 1 + 'px';
      //   }
      //   document.addEventListener('click', this.foo); // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
      //   if (event.clientY > 700) {
      //     menu.style.top = event.clientY - 30 + 'px';
      //   } else {
      //     menu.style.top = event.clientY - 10 + 'px';
      //   }
      // },
      // foo() {
      //   // 取消鼠标监听事件 菜单栏
      //   this.menuVisible = false;
      //   document.removeEventListener('click', this.foo); // 要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
      // },

  }
}
</script>

<style lang="scss" scoped>
   .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }


  // .menu__item {
  //   display: block;
  //   line-height: 20px;
  //   text-align: center;
  //   margin:10px;
  //   cursor: default;
  // }
  // .menu__item:hover{
  //   color: #FF0000;
  // }

  // .menu {
  //   height: auto;
  //   width: auto;
  //   position: absolute;
  //   font-size: 14px;
  //   text-align: left;
  //   border-radius: 10px;
  //   border: 1px solid #c1c1c1;
  //   background-color: #ffffff;
  // }

  // li:hover {
  //   background-color: #E0E0E2;
  //   color: white;
  // }
</style>

