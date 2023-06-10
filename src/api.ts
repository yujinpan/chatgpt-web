import type { ChatData } from './utils/chat-data';

import request from './utils/request';

export function chatCompletions(data: { model: string; messages: ChatData[] }) {
  return request.post<{
    id: string;
    object: 'chat.completion';
    created: number;
    choices: {
      index: number;
      message: ChatData;
      finish_reason: 'stop';
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }>(`/chatgpt`, data);
}
