import { createApp } from 'vue';

import { ChatApp } from '@/App-dynamic';

import './styles/index.scss';

createApp(ChatApp).mount('#chatgpt-web');

// just make a webkit package
window['ChatGPIWebKit'] = () => import('../web-kit/main');
