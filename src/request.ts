import axios from 'axios';

import { BASE_URL } from './config';
import { getHeaders } from '@/secret';

const request = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : BASE_URL,
  validateStatus: (status) => status <= 500,
});

request.interceptors.request.use((config) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  config.headers = getHeaders(
    config.url,
    config.method.toUpperCase(),
    config.data,
  );
  return config;
});

request.interceptors.response.use((res) => {
  if (res.status !== 200) {
    const errMsg = res.data?.error?.message;
    if (errMsg) {
      return Promise.reject(errMsg);
    }
  }
});

export default request;
