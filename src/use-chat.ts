import debounce from 'lodash/debounce';
import { nextTick, ref, watch } from 'vue';

import type ChatInput from './components/ChatInput.vue';
import type { ChatData } from './types';
import type { Ref } from 'vue';

import { chatCompletions } from './api';
import { GPT_MODELS } from './config';
import { validateAuthKey, validateLocalAuthKey } from './utils/auth';
import { localDataMessages } from './utils/local-data';
import { appStore } from './utils/store';

export function useChat(chatInput: Ref<ChatInput>) {
  const localData = localDataMessages.get();
  const messages = ref<ChatData[]>(
    localData?.length
      ? localData
      : [
          {
            content: validateAuthKey()
              ? generateStartMsg()
              : 'Please enter your authentication key.',
          },
        ],
  );
  const loading = ref(false);

  watch(
    () => messages.value.length,
    () => localDataMessages.set(messages.value),
  );

  const sendMsg = (msg: string) => {
    messages.value.push({
      content: msg,
      role: 'user',
    });

    loading.value = true;
    return requestChat(messages.value)
      .then((data) => messages.value.push(data))
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

function requestChat(chatData: ChatData[]): Promise<ChatData> {
  const lastMsg = chatData[chatData.length - 1]?.content;
  const interceptorsResult = useMsgInterceptors(lastMsg, [
    msgInterceptorValidate,
    msgInterceptorChangeModel,
  ]);
  if (interceptorsResult) return interceptorsResult;

  return chatCompletions({
    model: appStore.model,
    messages: chatData.filter((item) => !!item.role),
  }).then(
    (res) => res.data.choices[0]?.message,
    (e) => ({ content: `Error: ${e}` }),
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

function scrollToBottom(bottomHeight: number) {
  document.scrollingElement.scrollTop =
    document.body.clientHeight -
    (document.documentElement.clientHeight - bottomHeight);
}
