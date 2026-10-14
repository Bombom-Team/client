import { normalizeNotFoundPath } from './normalizeNotFoundPath';

describe('normalizeNotFoundPath', () => {
  it('숫자 세그먼트를 :id로 치환한다.', () => {
    expect(normalizeNotFoundPath('/newsletters/123')).toBe('/newsletters/:id');
  });

  it('UUID 세그먼트를 :uuid로 치환한다.', () => {
    expect(
      normalizeNotFoundPath('/challenge/3fa85f64-5717-4562-b3fc-2c963f66afa6'),
    ).toBe('/challenge/:uuid');
  });

  it('여러 동적 세그먼트를 모두 치환한다.', () => {
    expect(normalizeNotFoundPath('/newsletters/42/comments/7')).toBe(
      '/newsletters/:id/comments/:id',
    );
  });

  it('정적 경로는 그대로 둔다.', () => {
    expect(normalizeNotFoundPath('/newsletterss')).toBe('/newsletterss');
  });

  it('루트 경로는 /로 유지한다.', () => {
    expect(normalizeNotFoundPath('/')).toBe('/');
  });
});
