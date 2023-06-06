<template>
  <textarea
    v-model="input"
    class="chat-input"
    placeholder="typing..."
    autofocus
    @keydown.enter.prevent="enter"
  />
</template>

<script setup lang="tsx">
import { ref } from 'vue';

const props = defineProps<{ disabled: boolean }>();

const emit = defineEmits<{
  (event: 'submit', msg: string): void;
}>();

const input = ref('');
const enter = (e: KeyboardEvent) => {
  if (props.disabled) return;

  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
    input.value += '\n';
  } else {
    emit('submit', input.value);
    input.value = '';
  }
};
</script>

<style lang="scss">
@use '@/styles/common-variables' as *;

.chat-input {
  position: fixed;
  bottom: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-color: $bg-color;
  border: 0;
  border-top: 1px solid $border-color;
  padding: $spacing-medium;
  resize: none;
  display: block;
  border-radius: 0;
  outline: 0;

  &:focus {
    border-top: 1px solid $color-primary;
  }
}
</style>
