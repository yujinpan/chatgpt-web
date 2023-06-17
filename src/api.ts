import type { ChatRole } from './utils/chat-data';

import request from './utils/request';
import { getSecretKeyHeaders } from './utils/secret';

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

export function validateCode(code: string) {
  return request('/activationCode', {
    headers: {
      ...getSecretKeyHeaders(),
      'Content-Type': 'application/json',
    },
    method: 'post',
    body: JSON.stringify({
      code,
    }),
  });
}
