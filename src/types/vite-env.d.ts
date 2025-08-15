/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
