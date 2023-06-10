import type { ChatData } from './chat-data';

export class LocalData<T = any> {
  constructor(readonly name: string) {}

  get(): T {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`get local data => ${this.name}`);
    }

    return readLocalData(this.name);
  }

  set(data: T) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log(`set local data => ${this.name}`, data);
    }

    return setLocalData(this.name, data);
  }

  clear() {
    localStorage.removeItem(this.name);
  }
}

export const localDataMessages = new LocalData<ChatData[]>('messages');

export const localDataVersion = new LocalData<string>('version');

export function readLocalData(key: string) {
  const data = localStorage.getItem(key);
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
}

export function setLocalData(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}
