import { type Content, GoogleGenerativeAI } from '@google/generative-ai';

import { GEMINI_SAFETY_SETTINGS_NONE, GPT_MODEL } from '@/config';
import { getSecretKey } from '@/utils/secret';

export async function chatFunction<T = string>(
  msg: string,
  history?: Content[],
): Promise<T> {
  const genAI = new GoogleGenerativeAI(getSecretKey());
  const model = genAI.getGenerativeModel({
    model: GPT_MODEL.GEMINI1_5,
    safetySettings: GEMINI_SAFETY_SETTINGS_NONE,
  });
  const chat = model.startChat({
    history,
  });
  const result = await chat.sendMessage(msg);

  return result.response.text().trim() as any;
}
