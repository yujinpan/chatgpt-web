<template>
  <div class="web-kit">
    <button class="web-kit__button" @click="toggle">Chat</button>
    <div v-if="chatVisible" class="chat-container">
      <div class="flex-center text-secondary full" v-if="loading">
        Loading...
      </div>
      <div class="full" style="overflow: auto">
        <ChatApp />
      </div>
      <p v-if="loadError">{{ loadError }}</p>
    </div>
  </div>
</template>

<script lang="tsx" setup>
import { defineAsyncComponent, ref, watch } from 'vue';

import { loadModules } from './modules';

const ChatApp = defineAsyncComponent(() => import('@/App.vue'));

const chatVisible = ref(false);

const loading = ref(false);
const loaded = ref(false);
const loadError = ref('');
watch(
  () => chatVisible.value,
  (val) => {
    if (!loaded.value && val) {
      loadModules().catch((err) => {
        loadError.value = 'WebKit Load Error: ' + String(err);
      });
    }
  },
);

const toggle = async () => {
  chatVisible.value = !chatVisible.value;

  if (loading.value) return;

  if (!loaded.value) {
    loading.value = true;
    await loadModules()
      .then(() => {
        loaded.value = true;
      })
      .catch((err) => {
        loadError.value = 'WebKit Load Error: ' + String(err);
      })
      .finally(() => {
        loading.value = false;
      });
  }
};
</script>

<style lang="scss" scoped>
@use '@/styles/common-variables' as *;

.web-kit {
  position: fixed;
  z-index: 3000;
  bottom: $spacing-medium;
  right: $spacing-medium;

  &__button {
    width: 5em;
    height: 3em;
    border: 1px solid $border-color;
    box-shadow: 0 0 6px 1px var(--cw-shadow-color);
    background-color: $bg-color-overlay;
    &:active {
      border-color: $bg-color-overlay;
    }
  }

  .chat-container {
    position: absolute;
    max-width: calc(100vw);
    width: 400px;
    height: 500px;
    bottom: 100%;
    right: 0;
    margin-bottom: $spacing-base;
    background-color: $bg-color-overlay;
    overflow: hidden;
    border-radius: $border-radius;
    box-shadow: 0 0 6px 1px var(--cw-shadow-color);

    :deep(.chat-input) {
      position: absolute;
    }
  }
}
</style>
