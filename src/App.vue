<template>
  <div class="app">
    <div class="content">
      <ul v-if="messages.length" class="list-unstyled flex-column">
        <li
          v-for="(msg, index) in messages"
          :key="index"
          :class="{ 'is-right': msg.isRight }"
        >
          {{ msg }}
        </li>
      </ul>
      <p v-else class="text-secondary text-center">Talk about your problem.</p>
    </div>
    <textarea
      ref="textarea"
      v-model="input"
      class="input"
      placeholder="typing..."
      autofocus
      @keydown.enter.prevent="enter"
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue';

const input = ref('');
const messages = ref<string[]>([]);
const submit = () => {
  messages.value.push(input.value);
  input.value = '';
};
const enter = (e: KeyboardEvent) => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
    input.value += '\n';
  } else {
    submit();
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/common-variables' as *;

.app {
  $inputHeight: 120px;
  .content {
    padding: $spacing-medium $spacing-medium $inputHeight + $spacing-medium
      $spacing-medium;
    > ul {
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
  }
  .input {
    position: fixed;
    bottom: 0;
    z-index: 1;
    width: 100%;
    height: $inputHeight;
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
}
</style>
