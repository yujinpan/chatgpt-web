import type { ChatRole } from './utils/chat-data';

import request from './utils/request';

export type ChatAPIMessage = {
  role: ChatRole.USER | ChatRole.SYSTEM | ChatRole.ASSISTANT;
  content: string;
};

export function chatCompletions(data: {
  model: string;
  messages: ChatAPIMessage[];
  stream?: boolean;
}) {
  return request('/chat', {
    method: 'post',
    body: JSON.stringify(data),
  });
}
