/** @jest-environment node */
import { uploadInquiryImages } from './inquiry.api';

jest.mock('@bombom/shared/env', () => ({
  ENV: { baseUrl: 'https://api.example.com' },
}));

jest.mock('@/utils/guestId', () => ({
  getOrCreateGuestId: () => 'guest-123',
}));

describe('uploadInquiryImages', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('문의방 ID 없이 이미지만 전송한다', async () => {
    const mockFetch = jest
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        new Response(JSON.stringify({ imageUrls: [] }), { status: 200 }),
      );

    await uploadInquiryImages([
      new File(['image'], 'test.png', { type: 'image/png' }),
    ]);

    const body = mockFetch.mock.calls[0]?.[1]?.body as FormData;
    expect(body.has('roomId')).toBe(false);
    expect(body.getAll('images')).toHaveLength(1);
  });
});
