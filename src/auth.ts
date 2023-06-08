const LOCAL_AUTH_KEY = 'LOCAL_AUTH_KEY';

export function validateLocalAuthKey() {
  return (
    localStorage.getItem(LOCAL_AUTH_KEY) === import.meta.env.VITE_APP_AUTH_KEY
  );
}

export function validateAuthKey(code?: string) {
  if (validateLocalAuthKey()) return true;

  const state = import.meta.env.VITE_APP_AUTH_KEY === code;
  if (state) {
    localStorage.setItem(LOCAL_AUTH_KEY, code);
  }
  return state;
}
