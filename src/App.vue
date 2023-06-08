<template>
  <div class="app">
    <ChatMessages ref="contentElem" :data="messages" :loading="loading" />
    <ChatInput ref="chatInput" @submit="submit" :disabled="loading" />
  </div>
</template>

<script lang="tsx" setup>
import debounce from 'lodash/debounce';
import { nextTick, ref, watch } from 'vue';

import { chatCompletions } from './api';
import ChatInput from './components/ChatInput.vue';
import ChatMessages from './components/ChatMessages.vue';

const contentElem = ref<HTMLElement>();
const chatInput = ref<ChatInput>();

const messages = ref([
  {
    role: 'bot',
    message: 'Hey.',
  },
]);
const loading = ref(false);

const updateScroll = debounce(async () => {
  await nextTick(() => {
    document.scrollingElement.scrollTop =
      document.body.clientHeight -
      (document.documentElement.clientHeight -
        chatInput.value.$el.clientHeight);
  });
}, 100);

watch([() => messages.value, () => loading.value], updateScroll);

const submit = async (msg: string) => {
  const data = {
    role: 'user',
    message: msg,
  };

  messages.value.push(data);

  loading.value = true;
  await chatCompletions(data.role, data.message)
    .then(
      (result) => {
        messages.value.push({ role: 'bot', message: '' });
      },
      (e) => {
        messages.value.push({ role: 'bot', message: `Error: ${e}` });
      },
    )
    .finally(() => (loading.value = false));
};
</script>

<style lang="scss" scoped>
@use '@/styles/common-variables' as *;

.app {
  $inputHeight: 120px;

  .chat-messages {
    padding-bottom: $inputHeight + $spacing-medium;
  }

  .chat-input {
    height: $inputHeight;
  }
}
</style>
