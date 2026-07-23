var vueLoader = document.createElement('script');
vueLoader.src = 'https://unpkg.com/vue@3/dist/vue.global.prod.js';
vueLoader.onload = function() {
  var mount = document.createElement('div');
  mount.id = 'fc26-vue-root';
  document.body.appendChild(mount);

  var style = document.createElement('style');
  style.textContent = '#fc26-vue-overlay{position:fixed;bottom:20px;right:20px;z-index:999999;background:#0f1923;color:#fff;padding:12px 16px;border-radius:8px;font-family:Arial,sans-serif;font-size:13px;box-shadow:0 4px 20px rgba(0,0,0,0.5);border:1px solid #2ecc71;max-width:280px;}.vue-header{font-weight:700;margin-bottom:4px;color:#2ecc71;}.vue-body{color:#aaa;font-size:12px;}';
  document.head.appendChild(style);

  var app = Vue.createApp({
    setup: function() {
      var msg = Vue.ref('等待计算...');
      var isVisible = Vue.ref(true);

      window.addEventListener('message', function(e) {
        if (e.data.source !== 'fc26-extension') return;
        if (e.data.action === 'setMsg') {
          msg.value = e.data.value;
        } else if (e.data.action === 'startFill') {
          msg.value = '正在填入 ' + e.data.players.length + ' 名球员...';
          var count = 0;
          var interval = setInterval(function() {
            if (count >= e.data.players.length) {
              clearInterval(interval);
              msg.value = '已完成填阵 (' + e.data.players.length + '人)';
              return;
            }
            var p = e.data.players[count];
            msg.value = '正在放入 ' + p.pos + ': ' + p.name + ' (' + p.rating + ')';
            count++;
          }, 400);
        }
      });

      return { msg: msg, isVisible: isVisible };
    },
    template: '<div v-if="isVisible" id="fc26-vue-overlay"><div class="vue-header">FC26 SBC Helper</div><div class="vue-body">{{ msg }}</div></div>'
  });

  app.mount('#fc26-vue-root');
};
document.head.appendChild(vueLoader);
