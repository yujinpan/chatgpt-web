import debounce from 'lodash/debounce';
import { nextTick, onMounted, ref, watch } from 'vue';

import type ChatInput from './components/ChatInput.vue';
import type { ChatData } from './utils/chat-data';
import type { Ref } from 'vue';

import { chatCompletions } from './api';
import { validateLocalAuthKey } from './utils/auth';
import {
  ChatRole,
  createChatData,
  getChatAPIMessages,
} from './utils/chat-data';
import { COMMAND, getCommand, isCommand } from './utils/command';
import { scrollToBottom } from './utils/dom';
import {
  msgInterceptorCommand,
  msgInterceptorValidate,
  useMsgInterceptors,
} from './utils/interceptor';
import { localDataMessages } from './utils/local-data';
import { generateStartMsg } from './utils/messages';
import { appStore } from './utils/store';

export function useChat(chatInput: Ref<ChatInput>) {
  const messages = ref<ChatData[]>(initMessages());
  const loading = ref(false);

  const sendMsg = (msg: string) => {
    messages.value.push(createChatData(msg, getRole(msg)));

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
    msgInterceptorCommand,
    msgInterceptorValidate,
  ]);
  if (interceptorsResult) {
    return interceptorsResult.catch((e) => createChatData(`Error: ${e}`));
  }

  return chatCompletions({
    model: appStore.model,
    messages: getChatAPIMessages(chatData),
  }).then(
    (res) => {
      const { role, content } = res.data.choices[0].message;
      return createChatData(content, role);
    },
    (e) => createChatData(`Error: ${e}`),
  );
}

function initMessages(): ChatData[] {
  const localData = localDataMessages.get();
  return localData?.length ? localData : [createChatData(generateStartMsg())];
}

function getRole(msg: string) {
  return isCommand(msg)
    ? ChatRole.COMMAND
    : validateLocalAuthKey()
    ? ChatRole.USER
    : ChatRole.VISITOR;
}
