<template>
  <div class="app">
    <ChatMessages ref="contentElem" :data="messages" :loading="loading" />
    <div class="app__spacer"></div>

    <ChatInput
      @submit="sendMsg"
      :disabled="loading"
      :max-len="GPT_MSG_MAX_LEN"
    />
  </div>
</template>

<script lang="tsx" setup>
import ChatInput from './components/ChatInput.vue';
import ChatMessages from './components/ChatMessages.vue';
import { GPT_MSG_MAX_LEN } from './config';
import { useChat } from './use-chat';

const { messages, sendMsg, loading } = useChat();
</script>

<style lang="scss" scoped>
@use '@/styles/common-variables' as *;

.app {
  $inputHeight: 90px;
  $maxWidth: 870px;

  background-color: $bg-color;
  max-width: $maxWidth;
  margin: 0 auto;

  &__spacer {
    margin-top: $inputHeight;
  }

  .chat-input {
    height: $inputHeight;
    position: fixed;
    bottom: 0;
    max-width: $maxWidth;
    margin: 0 auto;
  }

  @media (max-width: 543px) {
    $inputHeight: 52px;

    .chat-messages {
      padding-bottom: $inputHeight + $spacing-medium * 2;
    }

    .chat-input {
      height: $inputHeight;
    }
  }
}
</style>
