/// <reference types="jest" />
import { fetcher } from './fetcher';

describe('fetcher.get', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('headers 옵션을 전달하면 실제 요청 헤더에 병합된다.', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'Content-Type': 'application/json' }),
      json: async () => ({ result: 'ok' }),
    });
    global.fetch = mockFetch as unknown as typeof fetch;

    await fetcher.get({
      path: '/inquiries/categories',
      baseUrl: 'https://api.example.com',
      headers: { 'X-Guest-Id': 'guest-123' },
    });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [, config] = mockFetch.mock.calls[0];
    expect(config.headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-Guest-Id': 'guest-123',
    });
  });
});
