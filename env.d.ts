/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_KEY: string;
  readonly VITE_APP_SECRET: string;
  readonly VITE_APP_AUTH_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
