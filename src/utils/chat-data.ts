export enum ChatRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

export type ChatData = {
  role?: ChatRole;
  content: string;
  created: number;
};

export function createChatData(content: string, role?: ChatRole): ChatData {
  return {
    role,
    content,
    created: Date.now(),
  };
}
