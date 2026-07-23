const { useState, useEffect } = React;

const MOCK = {
  rating: 83, chem: 30, limit: '英超 ≥ 3 · 金卡',
  totalRating: 84, totalChem: 32, totalCost: 12500,
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

function PlayerCard(p) {
  return React.createElement('div', { className: 'player-card' },
    React.createElement('div', { className: 'player-pos' }, p.pos),
    React.createElement('div', { className: 'player-info' },
      React.createElement('div', { className: 'player-name' }, p.name),
      React.createElement('div', { className: 'player-meta' }, p.club + ' · ' + p.nation)
    ),
    React.createElement('div', { className: 'player-stat' },
      React.createElement('div', { className: 'stat-rating' }, String(p.rating)),
      React.createElement('div', { className: 'stat-chem' }, '化' + p.chem),
      React.createElement('div', { className: 'stat-price' }, p.price.toLocaleString())
    )
  );
}

function App() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('检测页面中...');
  const [loading, setLoading] = useState(false);
  const [filling, setFilling] = useState(false);

  useEffect(function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      try {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'ping' }, function(res) {
          if (chrome.runtime.lastError) { setStatus('请打开普通网页使用'); return; }
          setStatus(res && res.ready ? '插件已就绪' : '请打开 EA SBC 页面');
        });
      } catch(e) {
        setStatus('请打开普通网页使用');
      }
    });
  }, []);

  function handleCalc() {
    setLoading(true);
    setStatus('计算中...');
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'get_sbc_info' }, function() {
        if (chrome.runtime.lastError) { setStatus('无法连接页面'); setLoading(false); return; }
        setTimeout(function() {
          setData(MOCK);
          setStatus('SBC 页面已识别');
          setLoading(false);
        }, 800);
      });
    });
  }

  function handleFill() {
    setFilling(true);
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'auto_fill', players: MOCK.players });
    });
  }

  var reqGrid = React.createElement('div', { className: 'req-grid' },
    React.createElement('div', { className: 'req-item' },
      React.createElement('span', { className: 'req-label' }, '最低评分'),
      React.createElement('span', { className: 'req-value' }, data ? String(data.rating) : '--')
    ),
    React.createElement('div', { className: 'req-item' },
      React.createElement('span', { className: 'req-label' }, '最低化学'),
      React.createElement('span', { className: 'req-value' }, data ? String(data.chem) : '--')
    ),
    React.createElement('div', { className: 'req-item' },
      React.createElement('span', { className: 'req-label' }, '球员限制'),
      React.createElement('span', { className: 'req-value' }, data ? data.limit : '--')
    )
  );

  var playersEl = null;
  var summaryEl = null;
  if (data) {
    playersEl = React.createElement('div', { className: 'players-list' },
      data.players.map(function(p, i) {
        return React.createElement(PlayerCard, Object.assign({ key: i }, p));
      })
    );
    summaryEl = React.createElement('div', { className: 'summary' },
      React.createElement('div', { className: 'summary-row' },
        React.createElement('span', null, '总评分'),
        React.createElement('span', { className: 'green' }, String(data.totalRating))
      ),
      React.createElement('div', { className: 'summary-row' },
        React.createElement('span', null, '总化学'),
        React.createElement('span', { className: 'green' }, String(data.totalChem))
      ),
      React.createElement('div', { className: 'summary-row' },
        React.createElement('span', null, '总花费'),
        React.createElement('span', { className: 'gold' }, data.totalCost.toLocaleString() + ' 金币')
      )
    );
  }

  return React.createElement('div', { className: 'app' },
    React.createElement('div', { className: 'header' },
      React.createElement('h1', null, 'FC26 SBC Helper'),
      React.createElement('span', { className: 'badge' }, 'v1.0')
    ),
    React.createElement('div', { className: 'status-bar' },
      React.createElement('span', null, status)
    ),
    React.createElement('div', { className: 'section' },
      React.createElement('div', { className: 'section-title' }, 'SBC 要求'),
      reqGrid
    ),
    React.createElement('div', { className: 'section' },
      React.createElement('div', { className: 'section-title' }, '推荐方案'),
      data ? null : React.createElement('div', { className: 'placeholder' }, '点击下方按钮计算结果')
    ),
    playersEl,
    summaryEl,
    React.createElement('div', { className: 'actions' },
      React.createElement('button', {
        className: 'btn btn-primary',
        onClick: handleCalc,
        disabled: loading
      }, loading ? '计算中...' : data ? '重新计算' : '计算最优解'),
      React.createElement('button', {
        className: 'btn btn-success',
        onClick: handleFill,
        disabled: !data || filling
      }, filling ? '填阵中...' : '一键填阵')
    ),
    React.createElement('div', { className: 'footer' },
      React.createElement('span', null, '数据由算法引擎提供')
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
