import { createApp } from 'vue';

import { setupClipboard } from '@/plugins/clipboard';
import App from './App.vue';

import { setupQuasar } from './plugins/quasar';
import { setupPinia } from './plugins/pinia';
import { setupRouter } from './plugins/router';

const app = createApp(App);

// 初始化插件
setupPinia(app);
setupQuasar(app);
setupRouter(app);
setupClipboard(app);

app.mount('#app');
