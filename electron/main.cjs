const { app, BrowserWindow, nativeTheme } = require('electron')
const fs = require('fs')
const path = require('path')

const WINDOW_STATE_FILE = 'window-state.json'

function getWindowStatePath() {
  return path.join(app.getPath('userData'), WINDOW_STATE_FILE)
}

function loadWindowState() {
  const defaultState = {
    width: 420,
    height: 700,
    x: undefined,
    y: undefined,
  }

  try {
    const raw = fs.readFileSync(getWindowStatePath(), 'utf8')
    const parsed = JSON.parse(raw)
    return { ...defaultState, ...parsed }
  } catch {
    return defaultState
  }
}

function saveWindowState(win) {
  if (!win || win.isDestroyed()) {
    return
  }

  const bounds = win.getBounds()
  fs.writeFileSync(getWindowStatePath(), JSON.stringify(bounds, null, 2), 'utf8')
}

function createMainWindow() {
  const state = loadWindowState()
  const win = new BrowserWindow({
    width: state.width,
    height: state.height,
    x: state.x,
    y: state.y,
    minWidth: 360,
    minHeight: 520,
    alwaysOnTop: true,
    autoHideMenuBar: true,
    title: 'Todo Widget',
    backgroundColor: '#f2f2f7',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  })

  win.setAlwaysOnTop(true, 'screen-saver')
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  const devServerUrl = process.env.VITE_DEV_SERVER_URL
  if (devServerUrl) {
    win.loadURL(devServerUrl)
  } else {
    win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  win.on('close', () => {
    saveWindowState(win)
  })

  return win
}

app.whenReady().then(() => {
  nativeTheme.themeSource = 'light'
  app.setLoginItemSettings({
    openAtLogin: true,
  })

  createMainWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
