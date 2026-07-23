const POSITIONS = ['GK', 'CB', 'CB', 'LB', 'CM', 'CM', 'CDM', 'RW', 'LW', 'ST', 'ST'];

const MOCK_RESULT = {
  rating: 83,
  chem: 30,
  limit: '英超 ≥ 3 · 金卡',
  totalRating: 84,
  totalChem: 32,
  totalCost: 12500,
  players: [
    { name: 'Alisson', pos: 'GK', rating: 89, chem: 3, price: 4500, club: 'Liverpool', nation: 'Brazil' },
    { name: 'Van Dijk', pos: 'CB', rating: 88, chem: 3, price: 3200, club: 'Liverpool', nation: 'Netherlands' },
    { name: 'Konaté', pos: 'CB', rating: 82, chem: 3, price: 800, club: 'Liverpool', nation: 'France' },
    { name: 'Robertson', pos: 'LB', rating: 85, chem: 3, price: 1200, club: 'Liverpool', nation: 'Scotland' },
    { name: 'Szoboszlai', pos: 'CM', rating: 82, chem: 3, price: 900, club: 'Liverpool', nation: 'Hungary' },
    { name: 'Mac Allister', pos: 'CM', rating: 84, chem: 3, price: 1100, club: 'Liverpool', nation: 'Argentina' },
    { name: 'Endo', pos: 'CDM', rating: 81, chem: 2, price: 600, club: 'Liverpool', nation: 'Japan' },
    { name: 'Salah', pos: 'RW', rating: 91, chem: 3, price: 2800, club: 'Liverpool', nation: 'Egypt' },
    { name: 'Díaz', pos: 'LW', rating: 84, chem: 3, price: 1300, club: 'Liverpool', nation: 'Colombia' },
    { name: 'Núñez', pos: 'ST', rating: 83, chem: 2, price: 950, club: 'Liverpool', nation: 'Uruguay' },
    { name: 'Jota', pos: 'ST', rating: 85, chem: 3, price: 1600, club: 'Liverpool', nation: 'Portugal' }
  ]
};

function renderPlayers(players) {
  return players.map(p => `
    <div class="player-card">
      <div class="player-pos">${p.pos}</div>
      <div class="player-info">
        <div class="player-name">${p.name}</div>
        <div class="player-meta">${p.club} · ${p.nation}</div>
      </div>
      <div class="player-stat">
        <div class="stat-rating">${p.rating}</div>
        <div class="stat-chem">化${p.chem}</div>
        <div class="stat-price">${p.price.toLocaleString()}</div>
      </div>
    </div>
  `).join('');
}

function showResult(data) {
  document.getElementById('reqRating').textContent = data.rating;
  document.getElementById('reqChem').textContent = data.chem;
  document.getElementById('reqLimit').textContent = data.limit;
  document.getElementById('resultArea').innerHTML = '';
  document.getElementById('playersList').innerHTML = renderPlayers(data.players);
  document.getElementById('totalRating').textContent = data.totalRating;
  document.getElementById('totalChem').textContent = `${data.totalChem}`;
  document.getElementById('totalCost').textContent = `${data.totalCost.toLocaleString()} 金币`;
  document.getElementById('fillBtn').disabled = false;
  document.getElementById('pageStatus').textContent = '✅ SBC 页面已识别';
}

document.getElementById('calcBtn').addEventListener('click', () => {
  document.getElementById('calcBtn').textContent = '计算中...';
  document.getElementById('calcBtn').disabled = true;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'get_sbc_info' }, (response) => {
      setTimeout(() => {
        showResult(MOCK_RESULT);
        document.getElementById('calcBtn').textContent = '重新计算';
        document.getElementById('calcBtn').disabled = false;
      }, 800);
    });
  });
});

document.getElementById('fillBtn').addEventListener('click', () => {
  document.getElementById('fillBtn').textContent = '填阵中...';
  document.getElementById('fillBtn').disabled = true;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'auto_fill', players: MOCK_RESULT.players }, () => {
      document.getElementById('fillBtn').textContent = '✅ 已填阵';
    });
  });
});

// 页面打开时自动检测
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'ping' }, (response) => {
    if (response && response.ready) {
      document.getElementById('pageStatus').textContent = '✅ 插件已就绪';
    } else {
      document.getElementById('pageStatus').textContent = '🟡 请打开 EA SBC 页面';
    }
  });
});
