const { BrowserWindow } = require('electron')

class MainWindow extends BrowserWindow {
    constructor(file, isDev){
        super({
            title: 'APP NAME',
            width: isDev ? 800 : 355,
            height: 550,
            icon: `${__dirname}/assets/icons/icon.png`,
            resizable: isDev ? true : false,
            backgroundColor: 'white',
            show: false,
            opacity: 0.9,
            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false,
              enableRemoteModule: true
            },
          })

          this.loadFile(file)

          if (isDev) {
            this.webContents.openDevTools()
          }
    }
}

module.exports  = MainWindow