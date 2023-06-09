import debounce from 'lodash/debounce';
import { nextTick, ref, watch } from 'vue';

import type ChatInput from './components/ChatInput.vue';
import type { ChatData } from './types';
import type { Ref } from 'vue';

import { chatCompletions } from './api';
import { GPT_MODELS } from './config';
import { validateAuthKey, validateLocalAuthKey } from './utils/auth';
import { appStore } from './utils/store';

export function useChat(chatInput: Ref<ChatInput>) {
  const name = generateName();
  const messages = ref<ChatData[]>([
    {
      message: validateAuthKey()
        ? generateStartMsg()
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
  const interceptorsResult = useMsgInterceptors(msg, [
    msgInterceptorValidate,
    msgInterceptorChangeModel,
  ]);
  if (interceptorsResult) return interceptorsResult;

  return chatCompletions({
    model: appStore.model,
    messages: [{ role: 'user', name, content: msg }],
  }).then(
    (res) => res.data.choices[0]?.message.content,
    (e) => `Error: ${e}`,
  );
}

interface MsgInterceptor {
  (msg: string): undefined | Promise<string>;
}

function useMsgInterceptors(msg: string, interceptors: MsgInterceptor[]) {
  return interceptors.length
    ? interceptors[0](msg) || useMsgInterceptors(msg, interceptors.slice(1))
    : undefined;
}

function msgInterceptorValidate(msg: string) {
  if (!validateLocalAuthKey()) {
    if (!validateAuthKey(msg)) {
      return Promise.reject('Authentication key invalid.');
    } else {
      return Promise.resolve(generateStartMsg());
    }
  }
}

function msgInterceptorChangeModel(msg: string) {
  const model = msg.trim().toLowerCase().replace(/^\//, '');
  if (GPT_MODELS.includes(model)) {
    appStore.model = model;
    return Promise.resolve(generateStartMsg());
  }
}

function generateStartMsg() {
  return `Welcome to use ${appStore.model}.`;
}

function generateName() {
  return `No_${Date.now() + (Math.random() * 1e6).toFixed(0)}`;
}

function scrollToBottom(bottomHeight: number) {
  document.scrollingElement.scrollTop =
    document.body.clientHeight -
    (document.documentElement.clientHeight - bottomHeight);
}
