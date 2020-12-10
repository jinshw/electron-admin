import {ipcMain} from 'electron'

//接收渲染进程广播数据

ipcMain.on('tomain',(event,data)=>{
    console.log("111")
    console.log(data)
})