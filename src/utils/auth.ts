import { getAuthKey } from './secret';

const LOCAL_AUTH_KEY = 'LOCAL_AUTH_KEY';

export function validateLocalAuthKey() {
  return localStorage.getItem(LOCAL_AUTH_KEY) === getAuthKey();
}

export function validateAuthKey(code?: string) {
  if (validateLocalAuthKey()) return true;

  const state = getAuthKey() === code;
  if (state) {
    localStorage.setItem(LOCAL_AUTH_KEY, code);
  }
  return state;
}
