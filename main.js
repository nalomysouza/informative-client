const {app, BrowserWindow, ipcMain, ipcRenderer, Tray} = require('electron');
const path = require('path');
const assetsDirectory = path.join(__dirname, 'assets');

let tray = undefined;

/* referência global para manter a instância da janela até que sejam fechadas pelo usuário então 
ele irá ser fechado quando o JavaScript fizer Garbage collection */
let window = undefined;

/* 
var first_instance_on_reload = function () {
	if (window) {
		window.show();
	}
}
if (app.makeSingleInstance(first_instance_on_reload)) {
	app.quit();
}
*/

app.on('ready', () => {
    createTray();
    createWindow();
});

/** Sair da aplicação quando todas as janelas forem fechadas */
app.on('window-all-closed', () => {
    disconnect();
    app.quit();
})

app.on('activate', function () {
	if (window === null) {
		createWindow();
	}
});

/** creando o tray */
const createTray = () => {
    tray = new Tray(path.join(assetsDirectory, 'icon.png'))
    tray.setToolTip('Informativo');

    tray.on('right-click', (event) => {
        window.isVisible() ? window.hide() : window.show();
    });

    tray.on('double-click', (event) => {
        window.isVisible() ? window.hide() : window.show();
    });

    tray.on('click', (event) => {
        window.isVisible() ? window.hide() : window.show();
    });
}

const getWindowPosition = () => {
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();
    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));
    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);
    return {x: x, y: y}
}

const createWindow = () => {
    // Cria a janela do browser.
    window = new BrowserWindow({
        width: 800,
        height: 620,
        'min-width': 800, 
        'min-height': 620,
        title: "Informativo", 
        icon:'./icon.png',
        show: false,
        skipTaskbar:true,
        // frame: false,
    //   fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            // Prevents renderer process code from not running when window is hidden
            backgroundThrottling: false
        }
    });
    window.loadURL(`file://${path.join(__dirname, 'index.html')}`);

    /**Ação ao apertar o botão minimizar */
    window.on('minimize', function(event) {
		event.preventDefault();
		window.hide();
    });

    /**Ação ao apertar o botão fechar */
    window.on('close', function(event) {
		// if (!app.isQuiting) {
		// 	event.preventDefault();
		// 	window.hide();
        // }
        app.quit();
    });

    /** Minimizar o aplicativo quando sair do foco da tela **/
    // window.on('blur', () => {
    //   if (!window.webContents.isDevToolsOpened()) {
    //     window.hide();
    //   }
    // });

    /** abre o DevTools. (console, inspecionar elemento, etc)**/
    window.webContents.openDevTools();

    
}

// window.once('ready-to-show', () => {
// });

/**
 * Se o app estive "aberto", será minimizado. Caso contrário será "aberto"
 */
const toggleWindow = () => {
    if (window.isVisible()) {
      window.hide();
    } else {
      showWindow();
    }
}
  
const showWindow = () => {
    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);
    window.show();
    window.focus();
}
  
ipcMain.on('show-window', () => {
    showWindow();
});
/** Enviando mensagem para a página web */
ipcMain.on('asynchronous-message', (event, arg) => {
    event.sender.send('asynchronous-reply', 'start');
});