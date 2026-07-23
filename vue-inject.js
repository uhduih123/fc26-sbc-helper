// 运行在页面主世界 — 加载 Vue 并创建覆盖层
var vueScript = document.createElement('script');
vueScript.src = 'https://unpkg.com/vue@3/dist/vue.global.js';
vueScript.onload = function() {
  var root = document.createElement('div');
  root.id = 'fc26-vue-root';
  document.body.appendChild(root);

  var style = document.createElement('style');
  style.textContent = '#fc26-ov{position:fixed;bottom:20px;right:20px;z-index:999999;background:#0f1923;color:#fff;padding:12px 16px;border-radius:8px;font-family:Arial,sans-serif;font-size:13px;box-shadow:0 4px 20px rgba(0,0,0,0.5);border:1px solid #2ecc71;max-width:280px;}.fc26-ov-h{font-weight:700;margin-bottom:4px;color:#2ecc71;}.fc26-ov-b{color:#aaa;font-size:12px;}';
  document.head.appendChild(style);

  Vue.createApp({
    data: function() {
      return { msg: '等待计算...', show: true };
    },
    template: '<div id="fc26-ov" v-if="show"><div class="fc26-ov-h">FC26 SBC Helper</div><div class="fc26-ov-b">{{ msg }}</div></div>',
    mounted: function() {
      var self = this;
      window.addEventListener('message', function(e) {
        if (e.data.source !== 'fc26-ext') return;
        if (e.data.action === 'fill') {
          self.msg = '正在填入 ' + e.data.players.length + ' 名球员...';
          var count = 0;
          var interval = setInterval(function() {
            if (count >= e.data.players.length) {
              clearInterval(interval);
              self.msg = '已完成填阵 (' + e.data.players.length + '人)';
              return;
            }
            var p = e.data.players[count];
            self.msg = '正在放入 ' + p.pos + ': ' + p.name + ' (' + p.rating + ')';
            count++;
          }, 400);
        }
      });
    }
  }).mount('#fc26-vue-root');
};
document.head.appendChild(vueScript);

// 通知 content script Vue 已就绪
window.__fc26VueReady = true;
