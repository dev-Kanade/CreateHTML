// ① バージョン確認
async function checkVersion() {
  const localVersion = require('./package.json').version; // ローカルversion
  try {
    const response = await fetch('https://raw.githubusercontent.com/ユーザー名/リポジトリ名/main/package.json');
    const githubData = await response.json();
    const githubVersion = githubData.version;
    if (localVersion !== githubVersion) {
      document.getElementById('versionNotice').innerText = `バージョンが異なります（ローカル: ${localVersion}, GitHub: ${githubVersion}）。更新を推奨します。`;
    }
  } catch (error) {
    console.error('バージョン確認に失敗:', error);
  }
}
checkVersion();

// ② HTMLファイル生成ボタンのイベント
document.getElementById('buildButton').addEventListener('click', () => {
  window.location.href = 'build.html';
});

// ③ ファイル一覧の表示
const { fs, path } = require('fs').promises; // Electronのfsモジュール
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
    // htmlディレクトリがない場合、作成を試みる
    const htmlDir = path.join(__dirname, 'html');
    await fs.mkdir(htmlDir, { recursive: true });
  }
})();
