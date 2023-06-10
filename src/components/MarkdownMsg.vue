<template>
  <div
    v-if="markdownHtml"
    class="markdown-body text-left"
    v-html="markdownHtml"
  ></div>
  <LoadingDot v-else />
</template>

<script setup lang="tsx">
import LoadingDot from './LoadingDot';
import { useMarkdown } from './use-markdown';

const props = defineProps<{
  content: string;
}>();

const { markdownHtml } = useMarkdown(props);
</script>

<style lang="scss">
@use '@/styles/common-variables' as *;

.markdown-body {
  background-color: $bg-color-overlay;
  border-radius: $border-radius;
  padding: $spacing-base * 1.5;
  max-width: 80%;
  display: inline-block;

  & > :first-child:not(pre, code, img, table) {
    margin-top: -$spacing-base * 0.5 !important;
  }
  & > :last-child:not(pre, code, img, table) {
    margin-bottom: -$spacing-base * 0.5 !important;
  }
}
</style>
