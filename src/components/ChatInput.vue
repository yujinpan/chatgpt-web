<template>
  <textarea
    ref="inputElm"
    v-model="input"
    class="chat-input"
    placeholder="typing..."
    autofocus
    maxlength="400"
    @keydown.enter.prevent="enter"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    enterkeyhint="done"
  />
</template>

<script setup lang="tsx">
import { useInput } from './use-input';

const props = defineProps<{ disabled: boolean }>();

const emit = defineEmits<{
  (event: 'submit', msg: string): void;
}>();

const { input, inputElm, enter, handleCompositionEnd, handleCompositionStart } =
  useInput(props, {
    submit: (text) => emit('submit', text),
  });
</script>

<style lang="scss">
@use '@/styles/common-variables' as *;

.chat-input {
  width: 100%;
  height: 100%;
  background-color: $bg-color-base;
  border: 0;
  border-top: 1px solid $border-color;
  border-radius: $border-radius $border-radius 0 0;
  padding: $spacing-medium;
  resize: none;
  display: block;
  outline: 0;
  font-size: 15px;

  &:focus {
    background-color: $bg-color-overlay;
  }
}
</style>
