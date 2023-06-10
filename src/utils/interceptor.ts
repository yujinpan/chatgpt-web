import { validateAuthKey, validateLocalAuthKey } from './auth';
import { COMMANDS, getCommand } from './command';
import { generateStartMsg } from './messages';

interface MsgInterceptor {
  (msg: string): void | Promise<string>;
}

export function useMsgInterceptors(
  msg: string,
  interceptors: MsgInterceptor[],
): Promise<string> | undefined {
  return interceptors.length
    ? interceptors[0](msg) || useMsgInterceptors(msg, interceptors.slice(1))
    : undefined;
}

export const msgInterceptorValidate: MsgInterceptor = (msg: string) => {
  if (!validateLocalAuthKey()) {
    if (!validateAuthKey(msg)) {
      return Promise.reject('Authentication key invalid.');
    } else {
      return Promise.resolve(generateStartMsg());
    }
  }
};
export const msgInterceptorCommand: MsgInterceptor = (msg: string) => {
  const command = getCommand(msg);
  if (command) {
    if (command in COMMANDS) {
      return COMMANDS[command]();
    } else {
      return Promise.resolve(`Command \`${command}\` not found.`);
    }
  }
};
