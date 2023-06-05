import axios from 'axios';

import { BASE_URL } from './config';
import { getHeaders } from '@/secret';

const request = axios.create({
  baseURL: import.meta.env.DEV ? '/api' : BASE_URL,
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

export default request;
