<template>
    <div style="max-width:calc(80vw)">
        <el-form label-width="120px" size="mini">
            <el-form-item label="后端服务地址" prop="apiURL">
                <el-input type="text" v-model="setting.apiURL" auto-complete="off" />
            </el-form-item>
            <el-form-item label="iserver服务地址" prop="iserverURL">
                <el-input type="text" v-model="setting.iserverURL" auto-complete="off" />
            </el-form-item>
            <el-form-item label="iserver用户名" prop="iserverUserName">
                <el-input type="text" v-model="setting.iserverUserName" auto-complete="off" />
            </el-form-item>
            <el-form-item label="iserver密码" prop="iserverPassword">
                <el-input type="text" v-model="setting.iserverPassword" auto-complete="off" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save" >立即提交</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>

const Store = require('electron-store');
const store = new Store();
export default {
    name: "Setting",
    data(){
        return {
            setting:{}
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        init(){
            this.setting = store.get('setting')
        },
        save(){
            var that = this
            console.log("setting save ....")

            this.$confirm('确认修改系统环境变量?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                    store.set({
                        setting: that.setting
                    })
                    that.$message({
                        type: 'success',
                        message: '修改成功!'
                    })
                
            }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消'
                })
            })

        },
        reset(){
            this.init()
        }
    }
}
</script>