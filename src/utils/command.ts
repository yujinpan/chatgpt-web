import { localDataMessages } from './local-data';
import { generateHelpMsg, generateStartMsg } from './messages';
import { appStore } from './store';
import { GPT_MODEL } from '../config';

export enum COMMAND {
  GPT4 = '/gpt-4',
  GPT3_5 = '/gpt-3.5-turbo',
  CLEAR = '/clear',
  ISSUE = '/issue',
  HELP = '/help',
}

export const COMMANDS: Record<COMMAND, () => void | Promise<string>> = {
  [COMMAND.GPT4]: () => handleChangeModel(GPT_MODEL.GPT4),
  [COMMAND.GPT3_5]: () => handleChangeModel(GPT_MODEL.GPT3_5),
  [COMMAND.CLEAR]: () => {
    localDataMessages.clear();
    return Promise.resolve(generateStartMsg());
  },
  [COMMAND.ISSUE]: () => {
    return Promise.resolve(
      `
Thank you for your feedback:

https://github.com/yujinpan/chatgpt-web/issues
    `.trim(),
    );
  },
  [COMMAND.HELP]: () => {
    return Promise.resolve(generateHelpMsg());
  },
};

function handleChangeModel(model: GPT_MODEL) {
  appStore.model = model;
  return Promise.resolve(`Welcome to use ${appStore.model}`);
}

export function getCommand(msg: string): COMMAND {
  msg = msg.trim();
  return isCommand(msg) ? msg : undefined;
}

export function isCommand(msg: string): msg is COMMAND {
  return /^\/[\w-.]*$/.test(msg.trim());
}
