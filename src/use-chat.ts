import debounce from 'lodash/debounce';
import { nextTick, ref, watch } from 'vue';

import type ChatInput from './components/ChatInput.vue';
import type { ChatData } from './types';
import type { Ref } from 'vue';

import { chatCompletions } from './api';
import { validateAuthKey } from './auth';

export function useChat(chatInput: Ref<ChatInput>) {
  const role = generateRole();
  const messages = ref<ChatData[]>([
    {
      role,
      message: validateAuthKey()
        ? 'Hey.'
        : 'Please enter your authentication key.',
    },
  ]);
  const loading = ref(false);

  const sendMsg = (msg: string) => {
    messages.value.push({
      role,
      message: msg,
      isUser: true,
    });

    loading.value = true;
    return chatCompletions(role, msg)
      .then(
        (result) =>
          messages.value.push({
            role,
            message: result.data.choices[0]?.message.content,
          }),
        (e) => messages.value.push({ role, message: `Error: ${e}` }),
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

function generateRole() {
  return `No#${Date.now() + (Math.random() * 1e6).toFixed(0)}`;
}

function scrollToBottom(bottomHeight: number) {
  document.scrollingElement.scrollTop =
    document.body.clientHeight -
    (document.documentElement.clientHeight - bottomHeight);
}
