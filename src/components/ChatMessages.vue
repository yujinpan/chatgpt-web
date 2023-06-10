<template>
  <ul class="chat-messages list-unstyled">
    <li
      v-for="msg in visibleData"
      :key="msg.id"
      :class="{
        'text-right': msg.isRight,
      }"
    >
      <p class="chat-time" v-if="msg.showTime">
        {{ msg.created }}
      </p>
      <MarkdownMsg :content="msg.content" />
    </li>
    <li v-if="loading">
      <LoadingDot />
    </li>
  </ul>
</template>

<script setup lang="tsx">
import { computed } from 'vue';

import type { ChatData } from '../utils/chat-data';

import LoadingDot from './LoadingDot';
import MarkdownMsg from './MarkdownMsg.vue';
import { ChatRole } from '../utils/chat-data';
import { formatDate } from '../utils/format';

const props = defineProps<{
  data: ChatData[];
  loading: boolean;
}>();

let id = 0;
const visibleData = computed(() => {
  const showTimeLimit = 10 * 60 * 1000;
  return props.data.map((item, index, array) => ({
    ...item,
    id: (item.created || 0) + id++,
    isRight: [ChatRole.USER, ChatRole.VISITOR, ChatRole.COMMAND].includes(
      item.role,
    ),
    created: formatDate(item.created),
    showTime: array[index - 1]
      ? item.created - array[index - 1].created > showTimeLimit
      : false,
  }));
});
</script>

<style lang="scss">
@use '@/styles/common-variables' as *;

.chat-messages.list-unstyled {
  padding: $spacing-medium;
  > li {
    + li {
      margin-top: $spacing-medium;
    }
  }

  .chat-time {
    margin-bottom: $spacing-medium;
    text-align: center;
    color: $font-color-secondary;
    font-size: 0.85em;
  }
}
</style>
