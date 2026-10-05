/** @jest-environment node */
import { fetcher } from '@bombom/shared/apis';

jest.mock('@bombom/shared/env', () => ({
  ENV: { baseUrl: 'https://api.example.com' },
}));

describe('fetcher', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it.each([
    ['GET', fetcher.get<unknown>],
    ['POST', fetcher.post<never, unknown>],
    ['PATCH', fetcher.patch<never, unknown>],
    ['PUT', fetcher.put<never, unknown>],
    ['DELETE', fetcher.delete<never, unknown>],
  ] as const)(
    '%s 요청에 비회원 식별 헤더를 전달한다',
    async (method, request) => {
      const mockFetch = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue(new Response(null, { status: 204 }));

      await request({
        path: '/inquiries/rooms',
        headers: { 'X-Guest-Id': 'guest-123' },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        new URL('https://api.example.com/inquiries/rooms'),
        expect.objectContaining({
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-Guest-Id': 'guest-123',
          },
        }),
      );
    },
  );

  it('FormData를 그대로 전달하고 multipart Content-Type은 자동 생성되도록 둔다', async () => {
    const mockFetch = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 204 }));
    const body = new FormData();
    body.append(
      'images',
      new Blob(['image'], { type: 'image/png' }),
      'test.png',
    );

    await fetcher.post({
      path: '/inquiries/images',
      body,
      headers: { 'X-Guest-Id': 'guest-123' },
    });

    const request = mockFetch.mock.calls[0]?.[1];
    expect(request?.body).toBe(body);
    expect(request?.headers).toEqual({ 'X-Guest-Id': 'guest-123' });
  });
});
