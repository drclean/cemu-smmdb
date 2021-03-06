import electron from 'electron';
import log from 'electron-log';

import path from 'path';
import fs   from 'fs';

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

(async () => {
    let mainWindow = null;
    let appSavePath = path.resolve(`${app.getPath('appData')}/cemu-smmdb`);
    let appSaveData = {};
    if (!fs.existsSync(appSavePath)) {
        fs.mkdirSync(appSavePath);
    }
    if (fs.existsSync(path.join(appSavePath, 'save.json'))) {
        appSaveData = JSON.parse(fs.readFileSync(path.join(appSavePath, 'save.json')));
    } else {
        fs.writeFileSync(path.join(appSavePath, 'save.json'), "{}");
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

        mainWindow.loadURL(`file://${__dirname}/index.html`);

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
