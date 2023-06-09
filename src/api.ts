import request from './utils/request';

export function chatCompletions(data) {
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
  }>(`/chatgpt`, data);
}
