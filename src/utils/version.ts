import { localDataVersion } from './local-data';
import { BUILD } from '../config';

export function updateVersion() {
  const currentVersion = BUILD.version;
  const oldVersion = localDataVersion.get();

  if (currentVersion !== oldVersion) {
    localStorage.clear();
    localDataVersion.set(currentVersion);
  }
}
