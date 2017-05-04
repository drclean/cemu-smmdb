import electron from 'electron';
import log from 'electron-log';

import path from 'path';
import fs   from 'fs';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

(async () => {
    let mainWindow = null;
    let localSave = path.resolve(`${app.getPath('appData')}/cemu-smmdb`);
    let appSavePath = path.join(`${localSave}/save.txt`);
    let appSaveData = {}, cemuSavePath;
    if (!!localSave) {
        if (fs.existsSync(appSavePath)) {
            try {
                appSaveData = JSON.parse(fs.readFileSync(appSavePath));
            } catch (err) {
                // ignore ?
            }
        } else {
            fs.writeFile(appSavePath, "");
        }
    }
    global.save = {
        appSaveData: appSaveData,
        appSavePath: appSavePath
    };

    function createWindow () {
        mainWindow = new BrowserWindow({
            width: 1300,
            height: 800,
            icon: path.join(__dirname, 'assets/images/icon.png')
        });

        mainWindow.loadURL(`file://${__dirname}/gui/index.html`);

        if (process.env.NODE_ENV === 'development') {
            mainWindow.webContents.openDevTools();
        }

        mainWindow.on('closed', () => {
            mainWindow = null
        })
    }

    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
        app.quit()
    });

    app.on('activate', () => {
        createWindow()
    });

    app.on('uncaughtException', (err) => {
        fs.writeFileSync('./error_log.txt', err)
    });

})();
