/* electron 功能 */
const { ipcRenderer, remote } = require('electron')
const fs = require('fs');

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
var menu = new Menu();
// menu.append(new MenuItem({ label: 'MenuItem1', click: function () { console.log('item 1 clicked'); } }));
// menu.append(new MenuItem({ type: 'separator' }));
// menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }));
// window.addEventListener('contextmenu', function (e) {
//     e.preventDefault();
//     menu.popup(remote.getCurrentWindow());
// }, false);
var template = [
    {
        label: 'Edit',
        submenu: [
            {
                label: 'Undo',
                accelerator: 'CmdOrCtrl+Z',
                role: 'undo'
            },
            {
                label: 'Redo',
                accelerator: 'Shift+CmdOrCtrl+Z',
                role: 'redo'
            },
            {
                type: 'separator'
            },
            {
                label: 'Cut',
                accelerator: 'CmdOrCtrl+X',
                role: 'cut'
            },
            {
                label: 'Copy',
                accelerator: 'CmdOrCtrl+C',
                role: 'copy'
            },
            {
                label: 'Paste',
                accelerator: 'CmdOrCtrl+V',
                role: 'paste'
            },
            {
                label: 'Select All',
                accelerator: 'CmdOrCtrl+A',
                role: 'selectall'
            },
        ]
    },
    {
        label: '视图',
        submenu: [
            {
                label: '重新加载',
                accelerator: 'CmdOrCtrl+R',
                click: function (item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            {
                label: '全屏切换',
                accelerator: (function () {
                    if (process.platform == 'darwin')
                        return 'Ctrl+Command+F';
                    else
                        return 'F11';
                })(),
                click: function (item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            },
            {
                label: '开发者工具',
                accelerator: (function () {
                    if (process.platform == 'darwin')
                        return 'Alt+Command+I';
                    else
                        return 'F12';
                })(),
                click: function (item, focusedWindow) {
                    if (focusedWindow)
                        focusedWindow.toggleDevTools();
                }
            },
        ]
    },
    {
        label: '窗口',
        role: 'window',
        submenu: [
            {
                label: '最小化',
                accelerator: 'CmdOrCtrl+M',
                role: 'minimize'
            },
            {
                label: '关闭',
                accelerator: 'CmdOrCtrl+W',
                role: 'close'
            },
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: '了解更多',
                click: function () { require('electron').shell.openExternal('http://www.chtgeo.cn/') }
            },
        ]
    },
];

if (process.platform == 'darwin') {
    var name = require('electron').remote.app.getName();
    template.unshift({
        label: name,
        submenu: [
            {
                label: 'About ' + name,
                role: 'about'
            },
            {
                type: 'separator'
            },
            {
                label: 'Services',
                role: 'services',
                submenu: []
            },
            {
                type: 'separator'
            },
            {
                label: 'Hide ' + name,
                accelerator: 'Command+H',
                role: 'hide'
            },
            {
                label: 'Hide Others',
                accelerator: 'Command+Alt+H',
                role: 'hideothers'
            },
            {
                label: 'Show All',
                role: 'unhide'
            },
            {
                type: 'separator'
            },
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function () { app.quit(); }
            },
        ]
    });
    // Window menu.
    template[3].submenu.push(
        {
            type: 'separator'
        },
        {
            label: 'Bring All to Front',
            role: 'front'
        }
    );
}

var menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

//监听与主进程的通信
ipcRenderer.on('action', (event, arg) => {
  switch (arg) {
      case '新建文件': //新建文件
          break;
      case '打开文件': //打开文件
          break;
      case '保存': //保存文件
          break;
      case '退出':
          ipcRenderer.sendSync('reqaction', 'exit');
          break;
  }
});
