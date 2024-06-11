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
      <MarkdownMsg :content="msg.content" :typing="msg.typing" />
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

const visibleData = computed(() => {
  const showTimeLimit = 10 * 60 * 1000;
  let previousTime;
  return props.data
    .filter((item) => item.role !== ChatRole.PROMPT)
    .map((item, index) => {
      let showTime: boolean;
      if (index === 0) {
        showTime = Date.now() - item.created > showTimeLimit;
        previousTime = item.created;
      } else {
        showTime = item.created - previousTime > showTimeLimit;
        if (showTime) {
          previousTime = item.created;
        }
      }

      return {
        ...item,
        id: item.created,
        isRight: [ChatRole.USER, ChatRole.VISITOR, ChatRole.COMMAND].includes(
          item.role,
        ),
        created: formatDate(item.created),
        showTime,
      };
    });
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
