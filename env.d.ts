/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_AUTH_KEY: string;
  readonly VITE_APP_ENCRYPT_KEY: string;
  readonly VITE_APP_SECRET_ID: string;
  readonly VITE_APP_SECRET_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  shiki: any;
  markdownit: any;
}

declare const __BUILD__: { name: string; version: string; dateTime: string };
