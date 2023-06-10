import type { ChatData } from './chat-data';

import { validateAuthKey, validateLocalAuthKey } from './auth';
import { createChatData } from './chat-data';
import { COMMANDS, getCommand } from './command';
import { generateStartMsg } from './messages';

interface MsgInterceptor {
  (msg: string): void | Promise<ChatData>;
}

export function useMsgInterceptors(
  msg: string,
  interceptors: MsgInterceptor[],
): Promise<ChatData> | undefined {
  return interceptors.length
    ? interceptors[0](msg) || useMsgInterceptors(msg, interceptors.slice(1))
    : undefined;
}

export const msgInterceptorValidate: MsgInterceptor = (msg: string) => {
  if (!validateLocalAuthKey()) {
    if (!validateAuthKey(msg)) {
      return Promise.resolve(createChatData('Activation code invalid.'));
    } else {
      return Promise.resolve(createChatData(generateStartMsg()));
    }
  }
};
export const msgInterceptorCommand: MsgInterceptor = (msg: string) => {
  const command = getCommand(msg);
  if (command) {
    if (command in COMMANDS) {
      const result = COMMANDS[command]();
      if (result) {
        return result.then(createChatData, createChatData);
      }
    } else {
      return Promise.resolve(
        createChatData(`Command \`${command}\` not found.`),
      );
    }
  }
};
