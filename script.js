async function checkVersion() {
  const localVersion = require('./package.json').version; 
  try {
    const response = await fetch('https://raw.githubusercontent.com/dev_Kanade/CreateHTML/main/package.json');
    const githubData = await response.json();
    const githubVersion = githubData.version;
    if (localVersion !== githubVersion) {
      document.getElementById('versionNotice').innerText = `更新が可能です。（現在: ${localVersion}, 最新: ${githubVersion}）。更新を推奨します。`;
    }
  } catch (error) {
    console.error('バージョン確認に失敗:', error);
  }
}
checkVersion();


document.getElementById('buildButton').addEventListener('click', () => {
  window.location.href = 'build.html';
});


const { fs, path } = require('fs').promises; 
(async () => {
  try {
    const htmlDir = path.join(__dirname, 'html');
    const files = await fs.readdir(htmlDir);
    const fileList = document.getElementById('fileList');
    files.forEach(file => {
      const card = document.createElement('div');
      card.className = 'file-card';
      card.textContent = file;
      card.onclick = () => window.location.href = `build.html?html=${encodeURIComponent(file)}`;
      fileList.appendChild(card);
    });
  } catch (error) {
    console.error('ファイル読み込みエラー:', error);
    const htmlDir = path.join(__dirname, 'html');
    await fs.mkdir(htmlDir, { recursive: true });
  }
})();
