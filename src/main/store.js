const Store = require('electron-store');
const store = new Store();

var setting = store.get('setting')
console.log("setting...111...",setting)
// 初始化
if(setting == undefined || setting == null){
    store.set({
        setting: {
            version: "0.0.1",
            apiURL: "http://172.22.112.122:8080/dms",
            iserverURL: "http://localhost:8090",
            iserverUserName: "supermap",
            iserverPassword: "supermap@123"
        }
    })
}
console.log("setting...222...",store.get('setting'))
