// 注入 vue-inject.js 到页面主世界
var s = document.createElement('script');
s.src = chrome.runtime.getURL('vue-inject.js');
document.head.appendChild(s);

// 消息监听：popup → content script → postMessage 到页面
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case 'ping':
      sendResponse({ ready: true });
      break;
    case 'get_sbc_info':
      sendResponse({ rating: 83, chem: 30 });
      break;
    case 'auto_fill':
      window.postMessage({ source: 'fc26-ext', action: 'fill', players: request.players }, '*');
      sendResponse({ success: true });
      break;
  }
});
