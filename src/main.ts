import { createApp } from 'vue';

import App from './App.vue';
import './styles/index.scss';

createApp(App).mount('#app');

// just make a webkit package
window['ChatGPIWebKit'] = () => import('../web-kit/main');
