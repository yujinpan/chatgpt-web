import { defineAsyncComponent } from 'vue';

export const ChatApp = defineAsyncComponent(() => import('@/App.vue'));
