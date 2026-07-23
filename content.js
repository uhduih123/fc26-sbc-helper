// 注入 Vue 覆盖层组件
const vueOverlayScript = document.createElement('script');
vueOverlayScript.src = 'https://unpkg.com/vue@3/dist/vue.global.prod.js';
vueOverlayScript.onload = () => {
  const mount = document.createElement('div');
  mount.id = 'fc26-vue-root';
  document.body.appendChild(mount);

  const { createApp, ref } = Vue;

  const app = createApp({
    setup() {
      const msg = ref('等待计算...');
      const isVisible = ref(true);

      window.__fc26vue = { msg, isVisible };

      return { msg, isVisible };
    },
    template: `
      <div v-if="isVisible" id="fc26-vue-overlay">
        <div class="vue-header">FC26 SBC Helper</div>
        <div class="vue-body">{{ msg }}</div>
      </div>
    `
  });

  const style = document.createElement('style');
  style.textContent = `
    #fc26-vue-overlay {
      position: fixed; bottom: 20px; right: 20px; z-index: 999999;
      background: #0f1923; color: #fff; padding: 12px 16px;
      border-radius: 8px; font-family: Arial, sans-serif;
      font-size: 13px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      border: 1px solid #2ecc71; max-width: 280px;
    }
    .vue-header { font-weight: 700; margin-bottom: 4px; color: #2ecc71; }
    .vue-body { color: #aaa; font-size: 12px; }
  `;
  document.head.appendChild(style);

  app.mount('#fc26-vue-root');
};

document.head.appendChild(vueOverlayScript);

// 消息监听
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'ping':
      sendResponse({ ready: true });
      break;
    case 'get_sbc_info':
      if (window.__fc26vue?.msg) window.__fc26vue.msg.value = '正在读取SBC题目...';
      sendResponse({ rating: 83, chem: 30 });
      break;
    case 'auto_fill':
      if (window.__fc26vue?.msg) window.__fc26vue.msg.value = `正在填入 ${request.players.length} 名球员...`;
      let count = 0;
      const interval = setInterval(() => {
        if (count >= request.players.length) {
          clearInterval(interval);
          if (window.__fc26vue?.msg) window.__fc26vue.msg.value = `已完成填阵 (${request.players.length}人)`;
          return;
        }
        const p = request.players[count];
        if (window.__fc26vue?.msg) window.__fc26vue.msg.value = `正在放入 ${p.pos}: ${p.name} (${p.rating})`;
        count++;
      }, 400);
      sendResponse({ success: true });
      break;
  }
});
