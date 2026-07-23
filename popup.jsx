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

function PlayerCard({ p }) {
  return (
    <div className="player-card">
      <div className="player-pos">{p.pos}</div>
      <div className="player-info">
        <div className="player-name">{p.name}</div>
        <div className="player-meta">{p.club} · {p.nation}</div>
      </div>
      <div className="player-stat">
        <div className="stat-rating">{p.rating}</div>
        <div className="stat-chem">化{p.chem}</div>
        <div className="stat-price">{p.price.toLocaleString()}</div>
      </div>
    </div>
  );
}

function App() {
  const [data, setData] = React.useState(null);
  const [status, setStatus] = React.useState('检测页面中...');
  const [loading, setLoading] = React.useState(false);
  const [filling, setFilling] = React.useState(false);

  React.useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'ping' }, (res) => {
        setStatus(res?.ready ? '插件已就绪' : '请打开 EA SBC 页面');
      });
    });
  }, []);

  function handleCalc() {
    setLoading(true);
    setStatus('计算中...');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'get_sbc_info' }, () => {
        setTimeout(() => {
          setData(MOCK);
          setStatus('SBC 页面已识别');
          setLoading(false);
        }, 800);
      });
    });
  }

  function handleFill() {
    setFilling(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'auto_fill', players: MOCK.players });
    });
  }

  return (
    <div className="app">
      <div className="header">
        <h1>FC26 SBC Helper</h1>
        <span className="badge">v1.0</span>
      </div>

      <div className="status-bar">
        <span id="pageStatus">{status}</span>
      </div>

      <div className="section">
        <div className="section-title">SBC 要求</div>
        <div className="req-grid">
          <div className="req-item">
            <span className="req-label">最低评分</span>
            <span className="req-value">{data?.rating ?? '--'}</span>
          </div>
          <div className="req-item">
            <span className="req-label">最低化学</span>
            <span className="req-value">{data?.chem ?? '--'}</span>
          </div>
          <div className="req-item">
            <span className="req-label">球员限制</span>
            <span className="req-value">{data?.limit ?? '--'}</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">推荐方案</div>
        {data ? null : <div className="placeholder">点击下方按钮计算结果</div>}
      </div>

      {data && (
        <>
          <div className="players-list">
            {data.players.map((p, i) => <PlayerCard key={i} p={p} />)}
          </div>

          <div className="summary">
            <div className="summary-row">
              <span>总评分</span>
              <span className="green">{data.totalRating}</span>
            </div>
            <div className="summary-row">
              <span>总化学</span>
              <span className="green">{data.totalChem}</span>
            </div>
            <div className="summary-row">
              <span>总花费</span>
              <span className="gold">{data.totalCost.toLocaleString()} 金币</span>
            </div>
          </div>
        </>
      )}

      <div className="actions">
        <button className="btn btn-primary" onClick={handleCalc} disabled={loading}>
          {loading ? '计算中...' : data ? '重新计算' : '计算最优解'}
        </button>
        <button className="btn btn-success" onClick={handleFill} disabled={!data || filling}>
          {filling ? '填阵中...' : '一键填阵'}
        </button>
      </div>

      <div className="footer">
        <span>数据由算法引擎提供</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
