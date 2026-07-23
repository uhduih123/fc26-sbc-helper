function addFillOverlay() {
  if (document.getElementById('fc26-overlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'fc26-overlay';
  overlay.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; z-index: 999999;
    background: #0f1923; color: #fff; padding: 12px 16px;
    border-radius: 8px; font-family: Arial, sans-serif;
    font-size: 13px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    border: 1px solid #2ecc71; max-width: 280px;
  `;
  overlay.innerHTML = `
    <div style="font-weight:700;margin-bottom:4px;color:#2ecc71;">FC26 SBC Helper</div>
    <div id="fc26-msg" style="color:#aaa;font-size:12px;">就绪</div>
  `;
  document.body.appendChild(overlay);
}

function setMessage(msg, isSuccess = false) {
  const el = document.getElementById('fc26-msg');
  if (el) el.textContent = msg;
}

function simulateAutoFill(players) {
  setMessage(`正在填入 ${players.length} 名球员...`);
  let count = 0;
  const interval = setInterval(() => {
    if (count >= players.length) {
      clearInterval(interval);
      setMessage(`✅ 已完成填阵 (${players.length}人)`, true);
      return;
    }
    const p = players[count];
    setMessage(`正在放入 ${p.pos}: ${p.name} (${p.rating})`);
    count++;
  }, 400);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'ping':
      sendResponse({ ready: true });
      break;
    case 'get_sbc_info':
      addFillOverlay();
      setMessage('正在读取SBC题目...');
      sendResponse({ rating: 83, chem: 30 });
      break;
    case 'auto_fill':
      addFillOverlay();
      simulateAutoFill(request.players);
      sendResponse({ success: true });
      break;
  }
});

addFillOverlay();
setMessage('等待计算...');
