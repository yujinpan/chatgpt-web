import { GoogleGenerativeAI } from '@google/generative-ai';
import throttle from 'lodash/throttle';
import { onMounted, provide, reactive, ref, watch } from 'vue';

import type { ChatData } from './utils/chat-data';

import { chatCompletions } from './api';
import {
  GEMINI_SAFETY_SETTINGS_NONE,
  GPT_MSG_MAX_LEN,
  SCENE_TEMP,
} from './config';
import {
  ChatRole,
  createChatData,
  getChatAPIMessages,
} from './utils/chat-data';
import { readStreamJSONContent, streamToObservable } from './utils/chat-stream';
import {
  COMMAND,
  getCommand,
  getCommandUseChat,
  isCommand,
} from './utils/command';
import {
  msgInterceptorCommand,
  msgInterceptorValidate,
  useMsgInterceptors,
} from './utils/interceptor';
import { localDataMessages } from './utils/local-data';
import { generateStartMsg } from './utils/messages';
import { appStore, UPDATE_SCROLL_INJECT_KEY } from './utils/store';
import { chatDataToHistory } from '@/utils/gemini';
import { getSecretKey } from '@/utils/secret';

export function useChat() {
  const messages = ref<ChatData[]>([]);
  const loading = ref(false);

  initMessages().then((res) => (messages.value = res));

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

  const updateScroll = throttle(() => {
    const spacer = document.querySelector('.app__spacer');
    spacer?.scrollIntoView({ behavior: 'smooth' });
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
    updateScroll();
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

  const chatCommandResult = await useChatCommand(chatData);
  if (chatCommandResult) {
    return chatCommandResult;
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
let commandTime: number;
async function requestChatGemini(chatData: ChatData[]): Promise<ChatData> {
  const lastChatData = chatData[chatData.length - 1];
  const lastMsg = lastChatData.content;

  const interceptorsResult = await useMsgInterceptors(lastMsg, [
    msgInterceptorCommand,
    // msgInterceptorValidate,
  ]).catch((e) => {
    return createChatData(`Error: ${e}`);
  });
  if (interceptorsResult) {
    return interceptorsResult;
  }

  const chatCommandResult = await useChatCommand(chatData);
  if (chatCommandResult) {
    return chatCommandResult;
  }

  // will change chatData
  interceptorPrompt(chatData);

  // re-get last msg
  const chatAPIMessages = getChatAPIMessages(chatData);
  const lastAPIMsg = chatAPIMessages[chatAPIMessages.length - 1].content;

  genAI = genAI || new GoogleGenerativeAI(getSecretKey());
  const model = genAI.getGenerativeModel({
    model: appStore.model,
    safetySettings: GEMINI_SAFETY_SETTINGS_NONE,
  });
  const chat = model.startChat({
    history: chatDataToHistory(chatAPIMessages.slice(0, -1)),
  });

  let error: ChatData;

  const result = await chat
    .sendMessageStream(lastAPIMsg)
    .catch((e) => (error = createChatData(e)));

  if (error) {
    return error;
  }

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

async function initMessages(): Promise<ChatData[]> {
  const localData = localDataMessages.get();
  return localData?.length
    ? localData
    : [createChatData(await generateStartMsg())];
}

function getRole(msg: string) {
  return isCommand(msg) ? ChatRole.COMMAND : ChatRole.USER;
}

function interceptorPrompt(chatData: ChatData[]) {
  switch (appStore.scene.status) {
    case 'coming-in':
      appStore.sceneIn();
      chatData.push(
        createChatData(
          SCENE_TEMP(appStore.scene.name) + 'Now, i am here.',
          ChatRole.PROMPT,
        ),
      );
      break;
    case 'coming-out':
      appStore.sceneOut();
      chatData.push(createChatData('I am leaving.', ChatRole.PROMPT));
      break;
    case 'in':
      break;
    case 'out':
      for (let i = chatData.length - 1; i >= 0; i--) {
        if (chatData[i].role === ChatRole.PROMPT) {
          chatData.splice(i, 1);
        }
      }
      break;
  }
}

async function useChatCommand(chatData: ChatData[]) {
  const last = chatData[chatData.length - 1];

  if (isCommand(last.content)) return;

  const commandOrMsg = await getCommandUseChat(
    last.content,
    commandTime
      ? chatDataToHistory(
          getChatAPIMessages(
            chatData.slice(0, -1).filter((item) => item.created >= commandTime),
          ),
        )
      : undefined,
  ).catch((e) => String(e));
  if (commandOrMsg !== '-1') {
    if (isCommand(commandOrMsg)) {
      commandTime = null;
      if (commandOrMsg === COMMAND.CLEAR) {
        chatData.length = 0;
      }
      const interceptorsResult = await useMsgInterceptors(commandOrMsg, [
        msgInterceptorCommand,
      ]).catch((e) => {
        return createChatData(`Error: ${e}`);
      });
      if (interceptorsResult) {
        return interceptorsResult;
      }
    } else {
      commandTime = commandTime || last.created;
      return createChatData(commandOrMsg, ChatRole.MODEL);
    }
  } else {
    commandTime = null;
  }
}
