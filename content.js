// 注入 Vue 覆盖层（会在页面主世界运行）
var vueScript = document.createElement('script');
vueScript.src = chrome.runtime.getURL('vue-overlay.js');
document.head.appendChild(vueScript);

// 消息监听：popup → content script → postMessage 到页面
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.action) {
    case 'ping':
      sendResponse({ ready: true });
      break;
    case 'get_sbc_info':
      window.postMessage({ source: 'fc26-extension', action: 'setMsg', value: '正在读取SBC题目...' }, '*');
      sendResponse({ rating: 83, chem: 30 });
      break;
    case 'auto_fill':
      window.postMessage({ source: 'fc26-extension', action: 'startFill', players: request.players }, '*');
      sendResponse({ success: true });
      break;
  }
});
