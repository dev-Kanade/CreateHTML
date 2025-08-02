const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });
  checkDependencies();
});

function checkDependencies() {
  // Node.jsとElectronのバージョンをチェック
  // 不足している場合はchild_processを使用してnpm installを実行
  // プログレスバーを新しいウィンドウで表示
  createHTMLDirectory();
  mainWindow.loadFile('start.html');
}

function createHTMLDirectory() {
  const htmlDir = path.join(__dirname, 'html');
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir);
  }
}
