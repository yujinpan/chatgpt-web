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
