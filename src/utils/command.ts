import type { Content } from '@google/generative-ai';

import { localDataApp, localDataMessages } from './local-data';
import { generateStartMsg } from './messages';
import { appStore } from './store';
import { BUILD, GPT_MODEL } from '../config';
import { chatFunction } from '@/utils/chat';
import { ChatRole } from '@/utils/chat-data';

export enum COMMAND {
  GEMINI1_5 = '/gemini1_5',
  GPT4 = '/gpt-4',
  GPT3_5 = '/gpt-3.5-turbo',
  SCENE = '/scene',
  CLEAR = '/clear',
  ISSUE = '/issue',
  VERSION = '/version',
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
    localDataApp.clear();
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
};

export const COMMANDS_DESC: {
  command: COMMAND;
  desc: string;
  confirm?: boolean;
  needParameter?: boolean;
}[] = [
  { command: COMMAND.GEMINI1_5, desc: 'change chat model to Gemini-1.5' },
  { command: COMMAND.GPT4, desc: 'change chat model to GPT-4' },
  { command: COMMAND.GPT3_5, desc: 'change chat model to GPT-3.5' },
  {
    command: COMMAND.SCENE,
    desc: 'change chat scene to anywhere, for example: WayneCorp DC',
    needParameter: true,
  },
  { command: COMMAND.VERSION, desc: 'show version information of application' },
  { command: COMMAND.CLEAR, desc: 'clear chat history', confirm: true },
  { command: COMMAND.ISSUE, desc: 'report an issue about the application' },
];

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

export function getCommandUseChat(msg: string, history: Content[] = []) {
  const prompt = `Commands: ${JSON.stringify(COMMANDS_DESC)}

If i want to get help for command and have to contains "command" and "help" keywords, 
you can briefly introduce what functions and contains a Welcome header for use the app,
and the introduction must use semantic text and not contain any command code.

If the session not related to any command, return -1, skip other conditions.
If i has not intention to use any command, return -1, skip other conditions.
If i has intention to use any command, return command without quote if it is completely, otherwise you must briefly describe the incorrect reason.
If the command requires parameters, you need to verify the parameters and give appropriate prompts.
If the command requires confirmation, you need to write confirm content to the user.

For example: 
  i: change model
  you: what model do you want? (show suggest)
  i: change model gpt
  you: /gpt-4`;

  return chatFunction<COMMAND | string | '-1'>(msg, [
    { role: ChatRole.USER, parts: [{ text: prompt }] },
    ...history,
  ]);
}
