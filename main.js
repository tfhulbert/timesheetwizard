const {
  app,
  ipcMain,
  BrowserWindow
} = require('electron')

const util = require('util')
const fs = require('fs')

const stat = util.promisify(fs.stat)

const path = require('path') // create variable for file path

let mainWindow

// once app has loaded
app.on('ready', () => {
  const htmlPath = path.join('src', 'index.html') // this forms the appropriate path regardless of OS

  mainWindow = new BrowserWindow() // create a browser window

  mainWindow.loadFile(htmlPath)
})

app.allowRendererProcessReuse = true

// listen for files event by browser process
ipcMain.on('files', async ({
  name,
  pathName
}) => {
  try {
    // async get the data for all the files
    const data = await Promise.all(
      filesArr.map(async ({
        name,
        pathName
      }) => ({
        ...await stat(pathName),
        name,
        pathName
      }))
    )

    mainWindow.webContents.send('metadata', data)
  } catch (error) {
    mainWindow.webContents.send('metadata:error', error)
  }
})