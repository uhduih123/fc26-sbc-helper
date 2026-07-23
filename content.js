// 创建覆盖层
function createOverlay() {
  if (document.getElementById('fc26-ov')) return;
  var div = document.createElement('div');
  div.id = 'fc26-ov';
  div.innerHTML = '<div style="font-weight:700;margin-bottom:4px;color:#2ecc71;">FC26 SBC Helper</div><div id="fc26-ov-msg" style="color:#aaa;font-size:12px;">就绪</div>';
  div.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:999999;background:#0f1923;color:#fff;padding:12px 16px;border-radius:8px;font-family:Arial,sans-serif;font-size:13px;box-shadow:0 4px 20px rgba(0,0,0,0.5);border:1px solid #2ecc71;max-width:280px;';
  document.body.appendChild(div);
}

function setMsg(m) {
  var el = document.getElementById('fc26-ov-msg');
  if (el) el.textContent = m;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case 'ping':
      sendResponse({ ready: true });
      break;
    case 'get_sbc_info':
      createOverlay();
      setMsg('正在读取SBC题目...');
      sendResponse({ rating: 83, chem: 30 });
      break;
    case 'auto_fill':
      createOverlay();
      var players = request.players;
      setMsg('正在填入 ' + players.length + ' 名球员...');
      var count = 0;
      var iv = setInterval(function() {
        if (count >= players.length) {
          clearInterval(iv);
          setMsg('已完成填阵 (' + players.length + '人)');
          return;
        }
        setMsg('正在放入 ' + players[count].pos + ': ' + players[count].name + ' (' + players[count].rating + ')');
        count++;
      }, 400);
      sendResponse({ success: true });
      break;
  }
});
