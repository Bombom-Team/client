import { describe, it, expect, afterEach, jest } from '@jest/globals';
import { fetcher } from './fetcher';

describe('fetcher.get', () => {
  const originalFetch = (globalThis as any).fetch;

  afterEach(() => {
    (globalThis as any).fetch = originalFetch;
  });

  it('headers 옵션을 전달하면 실제 요청 헤더에 병합된다.', async () => {
    const mockFetch = (jest.fn() as any).mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({ result: 'ok' }),
    });
    (globalThis as any).fetch = mockFetch;

    await fetcher.get({
      path: '/inquiries/categories',
      baseUrl: 'https://api.example.com',
      headers: { 'X-Guest-Id': 'guest-123' },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, config] = mockFetch.mock.calls[0] as any[];
    expect((config as any).headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Guest-Id': 'guest-123',
    });
  });
});

describe('fetcher.patch', () => {
  const originalFetch = (globalThis as any).fetch;

  afterEach(() => {
    (globalThis as any).fetch = originalFetch;
  });

  it('headers 옵션을 전달하면 실제 요청 헤더에 병합된다.', async () => {
    const mockFetch = (jest.fn() as any).mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({ result: 'ok' }),
    });
    (globalThis as any).fetch = mockFetch;

    await fetcher.patch({
      path: '/inquiries/123',
      baseUrl: 'https://api.example.com',
      body: { content: 'updated' },
      headers: { 'X-Guest-Id': 'guest-123' },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, config] = mockFetch.mock.calls[0] as any[];
    expect((config as any).headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Guest-Id': 'guest-123',
    });
  });
});

describe('fetcher.delete', () => {
  const originalFetch = (globalThis as any).fetch;

  afterEach(() => {
    (globalThis as any).fetch = originalFetch;
  });

  it('headers 옵션을 전달하면 실제 요청 헤더에 병합된다.', async () => {
    const mockFetch = (jest.fn() as any).mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({ result: 'ok' }),
    });
    (globalThis as any).fetch = mockFetch;

    await fetcher.delete({
      path: '/inquiries/123',
      baseUrl: 'https://api.example.com',
      headers: { 'X-Guest-Id': 'guest-123' },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, config] = mockFetch.mock.calls[0] as any[];
    expect((config as any).headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Guest-Id': 'guest-123',
    });
  });
});
