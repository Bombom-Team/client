import type { ArticleDetail } from '../../pages/detail/types/articleDetail';

export const PREVIOUS_ARTICLES = [
  {
    articleId: 5445,
    title: '왜 모두가 똑같은 삶을 살고 있을까 🙃',
    contentsSummary: '노마드코더 고정 폭 뉴스레터 fixture입니다.',
    expectedReadTime: 6,
  },
  {
    articleId: 123,
    title: '아티클 제목',
    contentsSummary: '아티클 요약 내용입니다...',
    expectedReadTime: 5,
  },
  {
    articleId: 124,
    title: '다른 아티클 제목',
    contentsSummary: '다른 아티클 요약입니다...',
    expectedReadTime: 3,
  },
];

export const PREVIOUS_ARTICLE_DETAILS: Record<
  number,
  Partial<ArticleDetail>
> = {
  5445: {
    title: '왜 모두가 똑같은 삶을 살고 있을까 🙃',
    contents: `
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        width="600"
        style="width:600px;background:#303030;border-collapse:collapse;"
      >
        <tbody>
          <tr>
            <td>
              <img
                alt="노마드코더 뉴스레터"
                class="mcnRetinaImage"
                src="https://mcusercontent.com/a99b43453db5050f1f26b2744/images/bf089a72-399c-750b-d2ed-f3eb6e80d07f.png"
                style="max-width:1640px;padding-bottom:0;display:inline;height:auto;"
                width="600"
              />
            </td>
          </tr>
          <tr>
            <td style="padding:32px;background:#f2f2f2;">
              <h1 style="margin:0;color:#ff9502;">노마드 뉴스</h1>
              <p style="font-size:18px;line-height:1.8;">
                고정 폭 테이블과 이미지를 포함한 노마드코더 뉴스레터 MSW fixture입니다.
              </p>
              <img
                alt="노마드코더 콘텐츠 이미지"
                src="https://mcusercontent.com/a99b43453db5050f1f26b2744/images/4b846a8e-3925-c7ec-94a8-017dee89fc05.png"
                style="max-width:791px;height:auto;"
                width="564"
              />
            </td>
          </tr>
        </tbody>
      </table>
    `,
    arrivedDateTime: '2026-08-07T00:00:00',
    expectedReadTime: 6,
    newsletter: {
      name: '노마드코더',
      email: 'newsletter@nomadcoders.co',
      imageUrl: 'https://nomadcoders.co/favicon.ico',
      category: 'IT/테크',
    },
  },
  123: {
    title: '아티클 제목',
    contents: '아티클의 전체 내용입니다...',
    arrivedDateTime: '2024-01-15T10:30:00',
    expectedReadTime: 5,
    newsletter: {
      name: '뉴스레터 이름',
      email: 'newsletter@example.com',
      imageUrl: 'https://example.com/image.jpg',
      category: '카테고리 이름',
    },
  },
  124: {
    title: '다른 아티클 제목',
    contents: '다른 아티클의 전체 내용입니다...',
    arrivedDateTime: '2024-01-20T08:00:00',
    expectedReadTime: 3,
    newsletter: {
      name: '뉴스레터 이름',
      email: 'newsletter@example.com',
      imageUrl: 'https://example.com/image.jpg',
      category: '카테고리 이름',
    },
  },
};
