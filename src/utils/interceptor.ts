import type { ChatData } from './chat-data';

import { validateActivationCode } from './auth';
import { createChatData } from './chat-data';
import { COMMANDS, getCommand, getCommandArgs } from './command';

interface MsgInterceptor {
  (msg: string): void | undefined | Promise<ChatData | void | undefined>;
}

export async function useMsgInterceptors(
  msg: string,
  interceptors: MsgInterceptor[],
): Promise<ChatData> | undefined {
  return interceptors.length
    ? (await interceptors[0](msg)) ||
        useMsgInterceptors(msg, interceptors.slice(1))
    : undefined;
}

export const msgInterceptorValidate: MsgInterceptor = () => {
  return validateActivationCode().then(() => {
    return undefined;
  });
};
export const msgInterceptorCommand: MsgInterceptor = (msg: string) => {
  const command = getCommand(msg);
  if (command) {
    if (command in COMMANDS) {
      const result = COMMANDS[command](getCommandArgs(msg));
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
