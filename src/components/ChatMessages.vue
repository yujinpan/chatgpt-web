<template>
  <ul class="chat-messages list-unstyled flex-column">
    <li
      v-for="(msg, index) in data"
      :key="index"
      :class="{ 'is-right': msg.role === 'user' }"
    >
      {{ msg.message }}
    </li>
    <li v-if="loading">
      <LoadingDot />
    </li>
  </ul>
</template>

<script setup lang="tsx">
import LoadingDot from './LoadingDot';

defineProps<{
  data: { role: string; message: string }[];
  loading: boolean;
}>();
</script>

<style lang="scss">
@use '@/styles/common-variables' as *;

.chat-messages.list-unstyled {
  padding: $spacing-medium;
  > li {
    background-color: $bg-color-overlay;
    border-radius: $border-radius;
    padding: $spacing-base;
    display: inline-block;
    max-width: 60%;
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
