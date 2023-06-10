<template>
  <ul class="chat-messages list-unstyled">
    <li
      v-for="msg in visibleData"
      :key="msg.id"
      :class="{ 'text-right': msg.role === 'user' }"
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
  const data = props.data.map((item, index, array) => ({
    ...item,
    id: item.created || id++,
    created: formatDate(item.created),
    showTime: array[index - 1]
      ? item.created - array[index - 1]?.created > 10 * 60 * 1000
      : false,
  }));

  const firstUser = data.find((item) => item.role === ChatRole.USER);
  if (firstUser) {
    firstUser.showTime = true;
  }

  return data;
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
