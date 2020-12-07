# electron-admin

``` bash
# install dependencies
npm install --registry https://registry.npm.taobao.org
cnpm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build
npm run build:win
```

详情请看文章：https://juejin.cn/post/6872677267932184584


-----
# 集成原有前端pms-web（element-ui-admin） 

## 一、集成步骤

> 1. 前端工程`pms-web`，把工程web工程中src目录拷贝覆盖 electron-vue 工程`src/renderer`(清空该目录)下。
>
> 2. 修改`src/renderer/utils/request.js`文件中的baseURL，方便调用后端接口
>
>    ```javascript
>    baseURL: 'http://localhost:8080/dms'
>    ```
>
>    
>
> 3. 替换`SidebarItem.vue`中的resolvePath方法，文件路径`src/renderer/layout/components/Sidebar/SidebarItem.vue` ，修改成`electron-vue`自带的方法
>
> ```javascript
> resolvePath(routePath) {
>     if (isExternal(routePath)) {
>         return routePath
>     }
>     if (isExternal(this.basePath)) {
>         return this.basePath
>     }
>     let ret
>     if (process.platform == 'win32') {    // 如果是Windows系统，则直接拼接
>         ret = (this.basePath + '/' + routePath).replace('//', '/')
>     } else {
>         ret = path.resolve(this.basePath, routePath)
>     }
>     return ret
> }
> ```
>
> 

## 二、遇到问题

1. 插件：原有web工程所有到的插件需要安装
2. **访问菜单出空白页面**，并且看页面源码，左侧菜单树中菜单显示`#/D:\dashboard`,显然有问题。

> 解决：覆盖重写`SidebarItem.vue`中的resolvePath方法，拷贝`electron-vue`自带的方法resolvePath，覆盖这个方法。

3. 在执行`npm run build`编译时，报错

```javascript
node_modules.Dependency.Dependencies: ReadMapCB: expect { or n, but found [, error found in #10 byte of ...|encies": [],
  "main|..., bigger context ...|/garycourt/JSV.git"
```

> 解决：在`node_modules`中找到JVM包的package.json文件，把dependencies": []，改成dependencies": {}
>
> ```json
> "dependencies": [],
> ```
>
> 

4. 在运行`npm run build`打包后，执行exe,不能登录，发现打包后走的是file://协议，不能存储cookie,导致不能给后端传递cookie，需要修改auth.js文件中的获取token和设置token方式。

> 解决：需要在auth.js添加`production`判断
>
> ```js
> const TokenKey = 'sessionId'
> var g_TokenValue = null
> 
> export function getToken() {
>   // return Cookies.get(TokenKey)
>   if (process.env.NODE_ENV == 'production') {
>     return g_TokenValue
>   } else {
>     return Cookies.get(TokenKey)
>   }
> }
> 
> export function setToken(token) {
>   // return Cookies.set(TokenKey, token)
>   if (process.env.NODE_ENV == 'production') {
>     g_TokenValue = token
>   } else {
>     Cookies.set(TokenKey, token)
>   }
> }
> 
> export function setCookies(key, val) {
>   // return Cookies.set(key, val)
>   if (process.env.NODE_ENV == 'production') {
>     g_TokenValue = val
>   } else {
>     Cookies.set(key, val)
>   }
> 
> }
> 
> export function getCookies(key) {
>   // return Cookies.get(key)
>   if (process.env.NODE_ENV == 'production') {
>     return g_TokenValue
>   } else {
>     return Cookies.get(key)
>   }
> }
> ```

5. 在vue文件中调用`remote.dialog`提示dialog没有定义

> 解决：在electron 10.0.0之后，remote模块默认关闭，必须手动设置webPreferences中的enableRemoteModule为true之后才能使用
>
> ```javascript
> mainWindow = new BrowserWindow({
>     webPreferences: {
>       nodeIntegration: true,
>       // 在electron 10.0.0之后，remote模块默认关闭
>       // 必须手动设置webPreferences中的enableRemoteModule为true之后才能使用
>       enableRemoteModule: true, // 这里是关键设置
>     }
>   })
> ```
>
> ----
>
> ```javascript
> // 引入electron库时，必须用window.require,不然会被webpack识别成前端的require，
> // 参考：https://www.cnblogs.com/wonyun/p/10991984.html
> const { remote, ipcRenderer} = window.require('electron');
> ```
>
> 