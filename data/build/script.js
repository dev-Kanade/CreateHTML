const fs = require('fs').promises;
const path = require('path');

function getParameter() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('patch');
}

async function loadFile() {
  const patch = getParameter();
  const buildArea = document.getElementById('buildArea');

  if (patch) {
    try {
      const filePath = path.join(__dirname, '../../filedata', patch); // ルートからの相対パス
      const content = await fs.readFile(filePath, 'utf-8');
      buildArea.innerHTML = content;
    } catch (error) {
      buildArea.innerHTML = '<p>ファイルの読み込みに失敗しました。</p>';
      console.error(error);
    }
  } else {
    buildArea.innerHTML = '<p>パラメータがありません。新しいファイルを生成してください。</p>';
  }
}

function navigate(page) {
  if (page === 'add') {
    window.location.href = '../add.html'; // ルートからの相対パス
  } else {
    window.location.href = `../${page}.html`; // ルートからの相対パス
  }
}

function showTab(tabName) {
  const buildArea = document.getElementById('buildArea');
  buildArea.innerHTML = ''; // 既存の内容をクリア

  switch (tabName) {
    case 'text':
      buildArea.innerHTML = `
        <h1>見出し</h1>
        <p>テキスト</p>
      `;
      break;
    case 'media':
      buildArea.innerHTML = `
        <button onclick="addImage()">画像を追加</button>
      `;
      break;
    case 'sns':
      buildArea.innerHTML = `
        <p>この機能は現在サポートされていません。<br>実装までお待ちください。</p>
      `;
      break;
  }
}

function addImage() {
  const buildArea = document.getElementById('buildArea');
  const img = document.createElement('img');
  img.src = 'https://via.placeholder.com/150'; // 仮の画像URL
  img.alt = 'プレースホルダー画像';
  img.style.margin = '10px';
  buildArea.appendChild(img);
}

async function generateHTML() {
  const buildArea = document.getElementById('buildArea');
  const htmlContent = buildArea.innerHTML;

  if (!htmlContent.trim()) {
    alert('生成する内容がありません。');
    return;
  }

  // CSSを<style>タグとして追加
  const css = `
    <style>
      body { font-family: Arial, sans-serif; }
      h1 { color: #333; }
      p { color: #666; }
      img { max-width: 100%; }
    </style>
  `;
  const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Generated HTML</title>
      ${css}
    </head>
    <body>
      ${htmlContent}
    </body>
    </html>
  `;

  // パラメータがない場合、ランダム3桁の数字でファイル名を生成
  const patch = getParameter();
  let fileName;
  if (!patch) {
    const randomNum = Math.floor(Math.random() * 900) + 100; // 100-999
    fileName = `${randomNum}.html`;
  } else {
    fileName = patch;
  }

  try {
    const filePath = path.join(__dirname, '../../filedata', fileName); // ルートからの相対パス
    await fs.writeFile(filePath, fullHtml);
    alert(`ファイルが ${fileName} として生成されました。`);
  } catch (error) {
    alert('ファイルの生成に失敗しました。');
    console.error(error);
  }
}

// ページ読み込み時に処理を実行
window.onload = loadFile;