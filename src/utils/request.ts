import { getSecretKeyHeaders } from './secret';
import { BASE_URL } from '../config';

export default function request(url: string, requestInit?: RequestInit) {
  return fetch(`${BASE_URL}${url}`, {
    ...requestInit,
    headers: {
      ...getSecretKeyHeaders(),
      'Content-Type': 'application/json',
      ...(requestInit.headers || {}),
    },
  }).then((res) => {
    if (res.status >= 400) {
      return res.text().then((e) => {
        return Promise.reject(`${res.status} ${e}`);
      });
    } else {
      return res;
    }
  });
}
