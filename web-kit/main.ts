import { createApp } from 'vue';

import App from './App.vue';
import './style.scss';

function initApp() {
  const div = document.createElement('div');
  document.body.appendChild(div);

  createApp(App).mount(div);
}

initApp();
