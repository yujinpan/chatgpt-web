<template>
  <div class="markdown-body text-left" v-html="markdownHtml"></div>
</template>

<script setup lang="tsx">
import { useMarkdown } from './use-markdown';

const props = defineProps<{
  content: string;
  typing?: boolean;
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

  .highlight pre,
  pre,
  table tr {
    background-color: $bg-color;
  }

  h1,
  h2,
  hr,
  table tr,
  table td,
  table th {
    border-color: $border-color;
  }

  & > :first-child:not(pre, code, img, table) {
    margin-top: -$spacing-base * 0.5 !important;
  }
  & > :last-child:not(pre, code, img, table) {
    margin-bottom: -$spacing-base * 0.5 !important;
  }

  .typing {
    font-weight: bold;
    animation: typing 0.35s infinite alternate;
  }
  @keyframes typing {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
