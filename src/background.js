'use strict'

import { app, protocol, BrowserWindow, Menu, shell, globalShortcut, Tray } from 'electron'
import {
  createProtocol,
  installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib'
const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

// Standard scheme must be registered before the app is ready
protocol.registerStandardSchemes(['app'], { secure: true })
function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
      width: 1000,
      height: 800,
      show: false,
  })

    var menu = Menu.buildFromTemplate([
        {
            label: 'Crypto Portfolio App',
            submenu: [
                {
                    label: 'Visit Website',
                    click() {
                        shell.openExternal('http://thisnismytestingdomain.com.s3-website-eu-west-1.amazonaws.com')
                    },
                    accelerator: 'CmdOrCtrl+Shift+C'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    selector: 'cut:'
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    selector: 'copy:'
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    selector: 'paste:'
                },
                {
                    type:'separator'
                },
                {
                    label:'Exit',
                    click() {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: 'Coin Market Cap',
            submenu: [
                {
                    label: 'Visit Website',
                    click() {
                        shell.openExternal('http://coinmarketcap.com')
                    }
                }
            ]
        }
    ])

    Menu.setApplicationMenu(menu);

    if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
      if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
      createProtocol('app')
      // Load the index.html when not in development
      win.loadURL('app://./index.html')
    }

    win.on('ready-to-show', () => {
        win.show();
        win.focus();
    });

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


// let tray = null

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools()
  }

    // app.setName("Crypto Portfolio App");

    // tray = new Tray('icon.png')
    // const contextMenu = Menu.buildFromTemplate([
    //     { label: 'Item1', type: 'radio' },
    //     { label: 'Item2', type: 'radio' },
    //     { label: 'Item3', type: 'radio', checked: true },
    //     { label: 'Item4', type: 'radio' }
    // ])
    //
    // tray.setTitle('Hello!!!')
    // tray.setToolTip('This is my application.')
    // tray.setContextMenu(contextMenu)

    globalShortcut.register('CmdOrCtrl+Shift+C', () => {
        shell.openExternal('http://thisnismytestingdomain.com.s3-website-eu-west-1.amazonaws.com')
    })

  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
