chrome.runtime.onInstalled.addListener(() => {
  console.log('FC26 SBC Helper 已安装');
});

chrome.action.onClicked.addListener((tab) => {
  console.log('插件图标被点击');
});
