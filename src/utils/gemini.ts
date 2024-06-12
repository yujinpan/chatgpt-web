import type { Content } from '@google/generative-ai';

import type { ChatData } from '@/utils/chat-data';

export function chatDataToHistory(chatData: Partial<ChatData>[]): Content[] {
  return chatData.map((item) => ({
    role: item.role,
    parts: [{ text: item.content }],
  }));
}
