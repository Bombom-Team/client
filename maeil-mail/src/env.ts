export const ENV = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  enableMsw: `${import.meta.env.VITE_ENABLE_MSW}`,
} as const;
