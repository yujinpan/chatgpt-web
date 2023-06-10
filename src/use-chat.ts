import debounce from 'lodash/debounce';
import { nextTick, onMounted, ref, watch } from 'vue';

import type ChatInput from './components/ChatInput.vue';
import type { ChatData } from './types';
import type { Ref } from 'vue';

import { chatCompletions } from './api';
import { validateAuthKey } from './utils/auth';
import { COMMAND, getCommand } from './utils/command';
import { scrollToBottom } from './utils/dom';
import {
  msgInterceptorCommand,
  msgInterceptorValidate,
  useMsgInterceptors,
} from './utils/interceptor';
import { localDataMessages } from './utils/local-data';
import { generateStartMsg, generateValidateMsg } from './utils/messages';
import { appStore } from './utils/store';

export function useChat(chatInput: Ref<ChatInput>) {
  const messages = ref<ChatData[]>(initMessages());
  const loading = ref(false);

  const sendMsg = (msg: string) => {
    messages.value.push({
      content: msg,
      role: 'user',
    });

    loading.value = true;
    return requestChat(messages.value)
      .then((data) => {
        if (getCommand(msg) === COMMAND.CLEAR) {
          messages.value = [];
        }

        messages.value.push(data);
      })
      .finally(() => (loading.value = false));
  };

  const updateScroll = debounce(async (immediate: boolean) => {
    await nextTick(() => {
      scrollToBottom(chatInput.value.$el.clientHeight, immediate);
    });
  }, 100);

  watch(
    () => messages.value.length,
    () => {
      localDataMessages.set(messages.value);
      updateScroll();
    },
  );

  onMounted(() => {
    updateScroll(true);
  });

  return {
    messages,
    loading,
    sendMsg,
  };
}

function requestChat(chatData: ChatData[]): Promise<ChatData> {
  const lastMsg = chatData[chatData.length - 1]?.content.slice(0, 400);
  const interceptorsResult = useMsgInterceptors(lastMsg, [
    msgInterceptorValidate,
    msgInterceptorCommand,
  ]);
  if (interceptorsResult) {
    return interceptorsResult.then(
      (e) => ({ content: e }),
      (e) => ({ content: e }),
    );
  }

  return chatCompletions({
    model: appStore.model,
    messages: chatData.filter((item) => !!item.role),
  }).then(
    (res) => res.data.choices[0]?.message,
    (e) => ({ content: `Error: ${e}` }),
  );
}

function initMessages(): ChatData[] {
  const localData = localDataMessages.get();
  return localData?.length
    ? localData
    : [
        {
          content: validateAuthKey()
            ? generateStartMsg()
            : generateValidateMsg(),
        },
      ];
}
