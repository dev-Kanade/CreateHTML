const fs = require('fs').promises;
const path = require('path');

async function loadAndProcessFiles() {
  const fileDataPath = path.join(__dirname, 'filedata.json');
  let data = [];

  try {
    const files = await fs.readdir(path.join(__dirname, 'filedata'));
    for (const file of files) {
      if (file.endsWith('.html')) {
        const content = await fs.readFile(path.join(__dirname, 'filedata', file), 'utf-8');
        const titleMatch = content.match(/<title>(.*?)<\/title>/i);
        const name = titleMatch ? titleMatch[1] : file;
        data.push({ patch: file, name });
      }
    }
    await fs.writeFile(fileDataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error(error);
    await fs.writeFile(fileDataPath, '[]');
  }

  renderCards(data);
}

function renderCards(data) {
  const container = document.getElementById('cardContainer');
  container.innerHTML = '';
  if (data.length === 0) {
    container.innerHTML = '<h2>ファイルがないようです</h2>';
    return;
  }
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${item.name}</h3><p>ファイル名: ${item.patch}</p>`;
    card.onclick = () => navigate('detail', { patch: item.patch });
    container.appendChild(card);
  });
}

function navigate(page, params = {}) {
  if (page === 'add') {
    window.location.href = 'add.html';
  } else if (page === 'detail' && params.patch) {
    window.location.href = `detail.html?patch=${encodeURIComponent(params.patch)}`;
  } else {
    window.location.href = `${page}.html`;
  }
}

window.onload = loadAndProcessFiles;