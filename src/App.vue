<template>
  <div class="app">
    <div
      class="content"
      :style="{ paddingBottom: contentPaddingBottom + 'px' }"
    >
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
    <div ref="inputElem" class="input">
      <ElInput
        ref="elInput"
        v-model="input"
        class="full"
        type="textarea"
        placeholder="typing..."
        resize="none"
        autofocus
        :autosize="{ minRows: 3, maxRows: 6 }"
        @keydown.enter.prevent="enter"
      />
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { ElInput } from 'element-plus';
import throttle from 'lodash/throttle';
import { onMounted, ref, watch } from 'vue';

// import { chatCompletions } from './api';

const input = ref('');
const elInput = ref<typeof ElInput>();
const messages = ref<string[]>([]);
const submit = () => {
  messages.value.push(input.value);
  elInput.value.clear();
  elInput.value.resizeTextarea();
};
const enter = (e: KeyboardEvent) => {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
    input.value += '\n';
  } else {
    submit();
  }
};

const inputElem = ref<HTMLElement>();
const contentPaddingBottom = ref(0);
const updateContentPaddingBottom = throttle(() => {
  const newVal = inputElem.value.clientHeight + 16;
  if (contentPaddingBottom.value === newVal) return;

  contentPaddingBottom.value = newVal;
}, 300);
watch(() => input.value, updateContentPaddingBottom);

onMounted(() => {
  setTimeout(() => {
    updateContentPaddingBottom();
  });
});
</script>

<style lang="scss" scoped>
@use '@/styles/common-variables' as *;

.app {
  .content {
    padding: $spacing-medium;
    > ul {
      > li {
        background-color: rgba(255, 255, 255, 0.08);
        border-radius: var(--el-border-radius-base);
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
    background-color: var(--el-bg-color-overlay);
    border-top: 1px solid var(--el-border-color);

    .el-textarea {
      :deep(.el-textarea__inner) {
        padding: $spacing-medium;
        box-shadow: none;
        border-radius: 0;
      }
    }
  }
}
</style>
