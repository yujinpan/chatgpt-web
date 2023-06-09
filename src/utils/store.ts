import { GPT_MODELS } from '../config';

class AppStore {
  private _model = GPT_MODELS[0];
  get model() {
    return this._model;
  }
  set model(model: string) {
    this._model = model;
  }
}

export const appStore = new AppStore();
