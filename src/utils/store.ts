import type { GPT_MODEL } from '../config';
import type { InjectionKey } from 'vue';

import { GPT_MODELS } from '../config';
import { localDataApp } from '@/utils/local-data';

export type AppScene = {
  name: string;
  status: 'coming-in' | 'in' | 'coming-out' | 'out';
};

class AppStore {
  private _model = localDataApp.get()?.model || GPT_MODELS[0];
  get model() {
    return this._model;
  }
  set model(model: GPT_MODEL) {
    this._model = model;
    localDataApp.set({
      model: this.model,
      scene: this.scene,
    });
  }

  private _scene: AppScene = localDataApp.get()?.scene || {
    name: '',
    status: 'out',
  };
  get scene() {
    return this._scene;
  }
  private set scene(scene: AppScene) {
    this._scene = scene;
    localDataApp.set({
      model: this.model,
      scene: this.scene,
    });
  }
  sceneComingIn(msg: string) {
    this.scene = {
      name: msg,
      status: 'coming-in',
    };
  }
  sceneComingOut() {
    this.scene.status = 'coming-out';
  }
  sceneIn() {
    this.scene.status = 'in';
  }
  sceneOut() {
    this.scene.status = 'out';
  }
}

export const appStore = new AppStore();

export const UPDATE_SCROLL_INJECT_KEY = Symbol() as InjectionKey<() => void>;
