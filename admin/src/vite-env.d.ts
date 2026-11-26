/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_BLOG_BASE_URL: string;
  readonly VITE_NOTIFICATION_API_BASE_URL: string;
  readonly VITE_NOTIFICATION_ADMIN_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
