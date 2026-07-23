// 注入 Vue 库到页面主世界
var vueLib = document.createElement('script');
vueLib.src = chrome.runtime.getURL('vue.global.prod.js');
document.head.appendChild(vueLib);

// Vue 加载完成后注入覆盖层
vueLib.onload = function() {
  var overlay = document.createElement('script');
  overlay.src = chrome.runtime.getURL('vue-overlay.js');
  document.head.appendChild(overlay);
};

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
