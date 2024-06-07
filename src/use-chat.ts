import { GoogleGenerativeAI } from '@google/generative-ai';
import throttle from 'lodash/throttle';
import { nextTick, onMounted, provide, reactive, ref, watch } from 'vue';

import type ChatInput from './components/ChatInput.vue';
import type { ChatData } from './utils/chat-data';
import type { Ref } from 'vue';

import { chatCompletions } from './api';
import { GPT_MSG_MAX_LEN } from './config';
import {
  ChatRole,
  createChatData,
  getChatAPIMessages,
} from './utils/chat-data';
import { readStreamJSONContent, streamToObservable } from './utils/chat-stream';
import { COMMAND, getCommand, isCommand } from './utils/command';
import { scrollToBottom } from './utils/dom';
import {
  msgInterceptorCommand,
  msgInterceptorValidate,
  useMsgInterceptors,
} from './utils/interceptor';
import { localDataMessages } from './utils/local-data';
import { generateStartMsg } from './utils/messages';
import { appStore, UPDATE_SCROLL_INJECT_KEY } from './utils/store';
import { getSecretKey } from '@/utils/secret';

export function useChat(chatInput: Ref<typeof ChatInput>) {
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

  const updateScroll = throttle(async (immediate: boolean) => {
    await nextTick(() => {
      scrollToBottom(chatInput.value.$el.clientHeight, immediate);
    });
  }, 100);

  provide(UPDATE_SCROLL_INJECT_KEY, updateScroll);

  watch(
    () => messages.value,
    () => {
      localDataMessages.set(
        messages.value.map((item) => ({
          ...item,
          typing: undefined,
        })),
      );
      updateScroll();
    },
    {
      deep: true,
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

async function requestChat(chatData: ChatData[]): Promise<ChatData> {
  if (appStore.model.toLowerCase().includes('gemini')) {
    return requestChatGemini(chatData);
  } else {
    return requestChatCPT(chatData);
  }
}

async function requestChatCPT(chatData: ChatData[]): Promise<ChatData> {
  const lastMsg = chatData[chatData.length - 1]?.content.slice(
    0,
    GPT_MSG_MAX_LEN,
  );
  const interceptorsResult = await useMsgInterceptors(lastMsg, [
    msgInterceptorCommand,
    msgInterceptorValidate,
  ]).catch((e) => {
    return createChatData(`Error: ${e}`);
  });
  if (interceptorsResult) {
    return interceptorsResult;
  }

  return chatCompletions({
    model: appStore.model,
    messages: getChatAPIMessages(chatData),
    stream: true,
  }).then(
    (res) => {
      const ob = streamToObservable(res.body);
      const chatData = reactive({
        ...createChatData('', ChatRole.ASSISTANT),
        typing: true,
      });
      ob.subscribe({
        next: (val) => (chatData.content += readStreamJSONContent(val)),
        complete: () => {
          chatData.typing = false;
        },
        error: (err) => {
          chatData.content += String(err);
        },
      });
      return chatData;
    },
    (e) => createChatData(`Error: ${e}`),
  );
}

let genAI;
async function requestChatGemini(chatData: ChatData[]): Promise<ChatData> {
  const lastMsg = chatData[chatData.length - 1].content;

  const interceptorsResult = await useMsgInterceptors(lastMsg, [
    msgInterceptorCommand,
    // msgInterceptorValidate,
  ]).catch((e) => {
    return createChatData(`Error: ${e}`);
  });
  if (interceptorsResult) {
    return interceptorsResult;
  }

  const chatAPIMessages = getChatAPIMessages(chatData);

  genAI = genAI || new GoogleGenerativeAI(getSecretKey());
  const model = genAI.getGenerativeModel({ model: appStore.model });
  const history = chatAPIMessages.slice(0, -1);
  const chat = model.startChat({
    history: history.map((item) => ({
      role: item.role,
      parts: [{ text: item.content }],
    })),
  });

  const result = await chat
    .sendMessageStream(lastMsg)
    .catch((e) => createChatData(`Error: ${e}`));

  const chatDataRes = reactive({
    ...createChatData('', ChatRole.MODEL),
    typing: true,
  });

  const process = async () => {
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      chatDataRes.content += chunkText;
    }
  };
  process()
    .catch((err) => {
      chatDataRes.content += String(err);
    })
    .finally(() => {
      chatDataRes.typing = false;
    });

  return chatDataRes;
}

function initMessages(): ChatData[] {
  const localData = localDataMessages.get();
  return localData?.length ? localData : [createChatData(generateStartMsg())];
}

function getRole(msg: string) {
  return isCommand(msg) ? ChatRole.COMMAND : ChatRole.USER;
}
