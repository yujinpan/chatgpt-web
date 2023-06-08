import request from '@/request';

export function chatCompletions(role: string, content: string) {
  return request.post<{
    id: string;
    object: 'chat.completion';
    created: number;
    choices: {
      index: number;
      message: {
        role: number;
        content: string;
      };
      finish_reason: 'stop';
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }>(`/chatgpt`, {
    model: 'gpt-3.5-turbo',
    messages: [{ role, content }],
  });
}
