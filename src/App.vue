<template>
  <div class="app">
    <ChatMessages ref="contentElem" :data="messages" :loading="loading" />
    <ChatInput ref="chatInput" @submit="sendMsg" :disabled="loading" />
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue';

import ChatInput from './components/ChatInput.vue';
import ChatMessages from './components/ChatMessages.vue';
import { useChat } from './use-chat';

const chatInput = ref<ChatInput>();

const { messages, sendMsg, loading } = useChat(chatInput);
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
