const { contextBridge, fs } = require('electron');
const path = require('path');

contextBridge.exposeInMainWorld('myAPI', {
  fs: fs.promises,
  path
});
