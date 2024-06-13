import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

export const BASE_URL =
  'https://service-nl49jn5a-1301154847.sg.apigw.tencentcs.com';

export enum GPT_MODEL {
  GPT4 = 'gpt-4',
  GPT3_5 = 'gpt-3.5-turbo',
  GEMINI1_5 = 'gemini-1.5-flash',
}

export const GPT_MODELS = [
  GPT_MODEL.GEMINI1_5,
  GPT_MODEL.GPT3_5,
  GPT_MODEL.GPT4,
];

export const BUILD = __BUILD__;

export const GPT_MSG_MAX_LEN = 2048;

export const SCENE_TEMP = (
  scene: string,
) => `I want you to play the role in ${scene}.
You must use the role in the answer, and each message must be prefixed with the role name, for example: "your name: message". 
You have to combine the responses of different roles in the context and answer with the appropriate role. 
Don't write any explanation, just reply with the role’s way of thinking and speaking, this point is very important. 
And i need you to think about the problem from the perspective of multiple roles and then decide whether to answer the question, you can reply use multiple roles in one message. 
And each character's reply message should be less than 120 characters, and each message use 2 line breaks to split, and try not to repeat the content between with each message.
The reply language and role name must be the same as this message: "${scene}".
And i need you treat me as a passerby.
Sometime you can use emojis to express the role’s emotions and moods.
Don't reply to this message, just jump into the role play.
For example:
  i: scene WayneCorp DC
  you: (Answer using characters with classic dialogue from WayneCorp DC)`;

export const GEMINI_SAFETY_SETTINGS_NONE = [
  HarmCategory.HARM_CATEGORY_HATE_SPEECH,
  HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
  HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
  HarmCategory.HARM_CATEGORY_HARASSMENT,
].map((key) => ({
  category: HarmCategory[key],
  threshold: HarmBlockThreshold.BLOCK_NONE,
}));
