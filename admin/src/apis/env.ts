export const ENV = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  blogBaseUrl: import.meta.env.VITE_API_BLOG_BASE_URL,
  notificationBaseUrl: import.meta.env.VITE_NOTIFICATION_API_BASE_URL,
  notificationAdminApiKey: import.meta.env.VITE_NOTIFICATION_ADMIN_API_KEY,
} as const;
