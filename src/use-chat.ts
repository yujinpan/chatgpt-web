import debounce from 'lodash/debounce';
import { nextTick, ref, watch } from 'vue';

import type ChatInput from './components/ChatInput.vue';
import type { ChatData } from './types';
import type { Ref } from 'vue';

import { chatCompletions } from './api';
import { validateAuthKey, validateLocalAuthKey } from './auth';
import { appStore } from './store';

export function useChat(chatInput: Ref<ChatInput>) {
  const name = generateName();
  const messages = ref<ChatData[]>([
    {
      message: validateAuthKey()
        ? `Welcome to use ${appStore.model}.`
        : 'Please enter your authentication key.',
    },
  ]);
  const loading = ref(false);

  const sendMsg = (msg: string) => {
    messages.value.push({
      message: msg,
      isUser: true,
    });

    loading.value = true;
    return requestMsg(name, msg)
      .then(
        (message) => messages.value.push({ message }),
        (error) => messages.value.push({ message: error }),
      )
      .finally(() => (loading.value = false));
  };

  const updateScroll = debounce(async () => {
    await nextTick(() => {
      scrollToBottom(chatInput.value.$el.clientHeight);
    });
  }, 100);
  watch([() => messages.value, () => loading.value], updateScroll);

  return {
    messages,
    loading,
    sendMsg,
  };
}

function requestMsg(name: string, msg: string): Promise<string> {
  if (!validateLocalAuthKey()) {
    if (!validateAuthKey(msg)) {
      return Promise.reject('Authentication key invalid.');
    } else {
      return Promise.resolve(`Welcome to use ${appStore.model}.`);
    }
  }

  return chatCompletions({
    model: appStore.model,
    messages: [{ role: 'user', name, content: msg }],
  }).then(
    (res) => res.data.choices[0]?.message.content,
    (e) => `Error: ${e}`,
  );
}

function generateName() {
  return `No_${Date.now() + (Math.random() * 1e6).toFixed(0)}`;
}

function scrollToBottom(bottomHeight: number) {
  document.scrollingElement.scrollTop =
    document.body.clientHeight -
    (document.documentElement.clientHeight - bottomHeight);
}
