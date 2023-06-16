import type { GPT_MODEL } from '../config';
import type { InjectionKey } from 'vue';

import { GPT_MODELS } from '../config';

class AppStore {
  private _model = GPT_MODELS[0];
  get model() {
    return this._model;
  }
  set model(model: GPT_MODEL) {
    this._model = model;
  }
}

export const appStore = new AppStore();

export const UPDATE_SCROLL_INJECT_KEY = Symbol() as InjectionKey<() => void>;
