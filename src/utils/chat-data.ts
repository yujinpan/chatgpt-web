import type { ChatAPIMessage } from '../api';

export enum ChatRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  VISITOR = 'visitor',
  PROMPT = 'prompt',
  COMMAND = 'command',
  MODEL = 'model',
}

export type ChatData = {
  role?: ChatRole;
  content: string;
  created: number;
  typing?: boolean;
};

export function createChatData(content: string, role?: ChatRole): ChatData {
  return {
    role,
    content,
    created: Date.now(),
    typing: false,
  };
}

export function isChatAPIRole(role: ChatRole) {
  return [
    ChatRole.USER,
    ChatRole.SYSTEM,
    ChatRole.ASSISTANT,
    ChatRole.MODEL,
    ChatRole.PROMPT,
  ].includes(role);
}

export function getChatAPIMessages(data: ChatData[]): ChatAPIMessage[] {
  return (
    data.filter((item) => isChatAPIRole(item.role)) as ChatAPIMessage[]
  ).map((item) => ({
    role: item.role === ChatRole.PROMPT ? ChatRole.USER : item.role,
    content: item.content,
  }));
}
