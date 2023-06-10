import { createApp } from 'vue';

import App from './App.vue';
import './styles/index.scss';
import { updateVersion } from './utils/version';

updateVersion();

createApp(App).mount('#app');
