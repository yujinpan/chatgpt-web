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
  $inputHeight: 90px;
  $maxWidth: 870px;

  background-color: $bg-color;
  position: relative;
  max-width: $maxWidth;
  min-height: calc(100vh);
  margin: 0 auto;

  .chat-messages {
    padding-bottom: $inputHeight + $spacing-medium * 2;
  }

  .chat-input {
    height: $inputHeight;
    position: fixed;
    bottom: 0;
    max-width: $maxWidth;
    margin: 0 auto;
  }
}
</style>
