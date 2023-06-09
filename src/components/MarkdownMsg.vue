<template>
  <div v-if="content" class="markdown-body" v-html="content"></div>
  <LoadingDot v-else />
</template>

<script setup lang="tsx">
import LoadingDot from './LoadingDot';
import { useMarkdown } from './use-markdown';

const props = defineProps<{
  msg: string;
}>();

const { content } = useMarkdown(props);
</script>

<style lang="scss">
@use '@/styles/common-variables' as *;

.markdown-body {
  background-color: $bg-color-overlay;
  border-radius: $border-radius;
  padding: $spacing-base;
}
</style>
