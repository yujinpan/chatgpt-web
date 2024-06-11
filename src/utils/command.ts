import { localDataMessages } from './local-data';
import { generateHelpMsg, generateStartMsg } from './messages';
import { appStore } from './store';
import { BUILD, GPT_MODEL } from '../config';

export enum COMMAND {
  GEMINI1_5 = '/gemini1_5',
  GPT4 = '/gpt-4',
  GPT3_5 = '/gpt-3.5-turbo',
  SCENE = '/scene',
  CLEAR = '/clear',
  ISSUE = '/issue',
  VERSION = '/version',
  HELP = '/help',
}

export const COMMANDS: Record<
  COMMAND,
  (args?: string) => void | Promise<string>
> = {
  [COMMAND.GEMINI1_5]: () => handleChangeModel(GPT_MODEL.GEMINI1_5),
  [COMMAND.GPT4]: () => handleChangeModel(GPT_MODEL.GPT4),
  [COMMAND.GPT3_5]: () => handleChangeModel(GPT_MODEL.GPT3_5),
  [COMMAND.SCENE]: (args) => handleChangeScene(args),
  [COMMAND.VERSION]: () => {
    return Promise.resolve(`
### Version

- name: \`${BUILD.name}\`
- version: \`${BUILD.version}\`
- dateTime: \`${BUILD.dateTime}\`
- model: \`${appStore.model}\`
    `);
  },
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

function handleChangeScene(msg: string) {
  if (msg) {
    appStore.sceneComingIn(msg);
  } else if (!msg) {
    if (!appStore.scene.name) {
      return Promise.resolve(`Command Error: Scene name can not be empty.`);
    } else {
      appStore.sceneComingOut();
    }
  }
}

const COMMAND_REG = /^\/\S+/;

export function getCommand(msg: string): COMMAND {
  msg = msg.trim();
  return msg.match(COMMAND_REG)?.[0] as COMMAND;
}

export function getCommandArgs(msg: string): string {
  return msg.replace(getCommand(msg), '').trim();
}

export function isCommand(msg: string): msg is COMMAND {
  return COMMAND_REG.test(msg.trim());
}
