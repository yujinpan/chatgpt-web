import { localDataMessages } from './local-data';
import { generateHelpMsg, generateStartMsg } from './messages';
import { appStore } from './store';
import { GPT_MODEL } from '../config';

export enum COMMAND {
  GPT4 = '/gpt-4',
  GPT3_5 = '/gpt-3.5-turbo',
  CLEAR = '/clear',
  HELP = '/help',
}

export const COMMANDS: Record<COMMAND, () => void | Promise<string>> = {
  [COMMAND.GPT4]: () => handleChangeModel(GPT_MODEL.GPT4),
  [COMMAND.GPT3_5]: () => handleChangeModel(GPT_MODEL.GPT3_5),
  [COMMAND.CLEAR]: () => {
    localDataMessages.clear();
    return Promise.resolve(generateStartMsg());
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
  const msgTrim = msg.trim();
  return /^\/[\w-.]*$/.test(msgTrim) ? (msgTrim as COMMAND) : undefined;
}
