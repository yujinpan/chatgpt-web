<template>
  <ul class="chat-messages list-unstyled flex-column">
    <li
      v-for="(msg, index) in data"
      :key="index"
      :class="{ 'is-right': msg.role === 'user' }"
    >
      <MarkdownMsg :content="msg.content" />
    </li>
    <li v-if="loading">
      <LoadingDot />
    </li>
  </ul>
</template>

<script setup lang="tsx">
import type { ChatData } from '../types';

import LoadingDot from './LoadingDot';
import MarkdownMsg from './MarkdownMsg.vue';

defineProps<{
  data: ChatData[];
  loading: boolean;
}>();
</script>

<style lang="scss">
@use '@/styles/common-variables' as *;

.chat-messages.list-unstyled {
  padding: $spacing-medium;
  > li {
    display: inline-block;
    max-width: 80%;
    word-wrap: break-word;
    + li {
      margin-top: $spacing-base;
    }

    align-self: flex-start;
    &.is-right {
      align-self: flex-end;
    }
  }
}
</style>
