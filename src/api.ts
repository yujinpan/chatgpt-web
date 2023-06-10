import type { ChatRole } from './utils/chat-data';

import request from './utils/request';

export type ChatAPIMessage = {
  role: ChatRole.USER | ChatRole.SYSTEM | ChatRole.ASSISTANT;
  content: string;
};

export function chatCompletions(data: {
  model: string;
  messages: ChatAPIMessage[];
}) {
  return request.post<{
    id: string;
    object: 'chat.completion';
    created: number;
    choices: {
      index: number;
      message: ChatAPIMessage;
      finish_reason: 'stop';
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }>(`/chatgpt`, data);
}
