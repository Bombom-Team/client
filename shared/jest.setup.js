// Mock environment variables before any module imports
global.process.env.BASE_URL = 'https://api.example.com';
global.process.env.EVENT_BASE_URL = 'https://event.api.example.com';
global.process.env.NOTIFICATION_BASE_URL = 'https://notification.api.example.com';
global.process.env.BLOG_BASE_URL = 'https://blog.api.example.com';

// Mock the ENV module
jest.mock('./src/core/env', () => ({
  ENV: {
    baseUrl: 'https://api.example.com',
    eventBaseUrl: 'https://event.api.example.com',
    notificationBaseUrl: 'https://notification.api.example.com',
    blogBaseUrl: 'https://blog.api.example.com',
  },
}));
