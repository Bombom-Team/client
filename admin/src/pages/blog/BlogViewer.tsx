import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Node, mergeAttributes } from '@tiptap/core';
import HighlightExtension from '@tiptap/extension-highlight';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKitExtension from '@tiptap/starter-kit';
import { blogQueries } from '@/apis/blog/blog.query';
import { Layout } from '@/components/Layout';
import { Route } from '@/routes/_admin/blog/$postId';

const Caption = Node.create({
  name: 'caption',
  group: 'block',
  content: 'inline*',
  parseHTML() {
    return [{ tag: 'p[data-caption]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['p', mergeAttributes(HTMLAttributes, { 'data-caption': '' }), 0];
  },
});

const parseViewerContent = (content?: string) => {
  if (!content) return '';
  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
};

const formatPublishedAt = (publishedAt?: string) => {
  if (!publishedAt) return null;
  return new Date(publishedAt).toLocaleDateString('ko-KR');
};

const BlogViewer = () => {
  const { postId } = Route.useParams();
  const { tab } = Route.useSearch();
  const postIdNum = Number(postId);
  const navigate = useNavigate();
  const { data: post } = useSuspenseQuery(blogQueries.post(postIdNum));
  const publishedAt = formatPublishedAt(post.publishedAt);
  const hasContent = Boolean(post.content?.trim());

  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKitExtension,
      ImageExtension,
      LinkExtension.configure({ openOnClick: true }),
      UnderlineExtension,
      HighlightExtension.configure({ multicolor: true }),
      Caption,
    ],
    content: parseViewerContent(post.content),
  });

  return (
    <Layout
      title="블로그"
      rightAction={
        <BackButton
          onClick={() => navigate({ to: '/blog', search: { tab } })}
          type="button"
        >
          목록으로
        </BackButton>
      }
    >
      <Container>
        <HeaderBox>
          <HeaderTopRow>
            <ReadOnlyBadge>읽기 전용</ReadOnlyBadge>
            {publishedAt && <MetaText>발행 {publishedAt}</MetaText>}
          </HeaderTopRow>
          <Title>{post.title || '(제목 없음)'}</Title>
          {post.description && <Description>{post.description}</Description>}
          {(post.categoryName || post.hashtags?.length) && (
            <MetaRow>
              {post.categoryName && (
                <CategoryBadge>{post.categoryName}</CategoryBadge>
              )}
              {post.hashtags?.map((hashTag) => (
                <HashTag key={hashTag}>#{hashTag}</HashTag>
              ))}
            </MetaRow>
          )}
        </HeaderBox>

        {post.thumbnailImageUrl && (
          <ThumbnailBox>
            <ThumbnailImage
              src={post.thumbnailImageUrl}
              alt={post.title || '썸네일'}
            />
          </ThumbnailBox>
        )}

        <ContentBox>
          {hasContent ? (
            <EditorContent editor={editor} />
          ) : (
            <EmptyState>본문이 없습니다.</EmptyState>
          )}
        </ContentBox>
      </Container>
    </Layout>
  );
};

export default BlogViewer;

const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const HeaderBox = styled.section`
  margin-bottom: 24px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: white;
`;

const HeaderTopRow = styled.div`
  margin-bottom: 16px;

  display: flex;
  gap: 12px;
  align-items: center;
`;

const ReadOnlyBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const MetaText = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Title = styled.h1`
  margin-bottom: 12px;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  line-height: 1.4;
`;

const Description = styled.p`
  margin-bottom: 16px;

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.6;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
`;

const CategoryBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const HashTag = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ThumbnailBox = styled.div`
  overflow: hidden;
  margin-bottom: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: ${({ theme }) => theme.colors.gray100};

  aspect-ratio: 16 / 9;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;

  object-fit: cover;
`;

const ContentBox = styled.section`
  padding: 32px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: white;

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror {
    outline: none;

    color: ${({ theme }) => theme.colors.gray900};
    font-size: ${({ theme }) => theme.fontSize.base};
    line-height: 1.7;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror p {
    margin-bottom: 12px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror h1 {
    margin: 20px 0 8px;

    font-weight: bold;
    font-size: 28px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror h2 {
    margin: 18px 0 8px;

    font-weight: bold;
    font-size: 24px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror h3 {
    margin: 16px 0 8px;

    font-weight: bold;
    font-size: 20px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror ul,
  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror ol {
    margin-bottom: 12px;
    padding-left: 24px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror blockquote {
    padding-left: 16px;
    border-left: 3px solid ${({ theme }) => theme.colors.gray300};

    color: ${({ theme }) => theme.colors.gray600};
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror img {
    max-width: 100%;
    margin: 8px 0;
    border-radius: 8px;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: underline;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror p[data-caption] {
    margin-bottom: 8px;

    color: ${({ theme }) => theme.colors.gray400};
    font-size: 13px;
    line-height: 1.5;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror code {
    padding: 1px 5px;
    border-radius: 4px;

    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray700};
    font-family: 'Courier New', Consolas, monospace;
    font-size: 0.875em;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror pre {
    margin-bottom: 12px;
    padding: 16px;
    border-radius: 8px;

    background: #1e1e2e;

    overflow-x: auto;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror pre code {
    padding: 0;
    border-radius: 0;

    background: none;
    color: #cdd6f4;
    font-size: 14px;
    line-height: 1.6;
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror hr {
    margin: 24px 0;
    border: none;
    border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  }

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror s {
    color: ${({ theme }) => theme.colors.gray400};
  }
`;

const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: white;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;
