import request from '@/request';

export function chatCompletions(role: string, content: string) {
  return request.post(`/chatgpt`, {
    model: 'gpt-3.5-turbo',
    messages: [{ role, content }],
  });
}
