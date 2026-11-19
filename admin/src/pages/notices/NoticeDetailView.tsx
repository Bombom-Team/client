import styled from '@emotion/styled';
import { Node, mergeAttributes } from '@tiptap/core';
import HighlightExtension from '@tiptap/extension-highlight';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKitExtension from '@tiptap/starter-kit';
import { parseTiptapDoc } from './noticeContent';
import { NOTICE_CATEGORY_LABELS, type Notice } from '@/types/notice';

// 캡션 블럭 노드 — 에디터와 동일하게 등록해야 렌더 스타일이 맞음
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

interface NoticeDetailViewProps {
  notice: Notice;
  children?: React.ReactNode;
}

export function NoticeDetailView({ notice, children }: NoticeDetailViewProps) {
  const hasContent = Boolean(notice.content?.trim());
  const richDoc = parseTiptapDoc(notice.content);

  const editor = useEditor(
    {
      editable: false,
      extensions: [
        StarterKitExtension,
        ImageExtension,
        LinkExtension.configure({ openOnClick: true }),
        UnderlineExtension,
        HighlightExtension.configure({ multicolor: true }),
        Caption,
      ],
      content: richDoc ?? '',
    },
    [notice.content],
  );

  return (
    <Container>
      <HeaderContainer>
        <CategoryBadge category={notice.noticeCategory}>
          {NOTICE_CATEGORY_LABELS[notice.noticeCategory] ??
            notice.noticeCategory}
        </CategoryBadge>
        <Title>{notice.title}</Title>
        <DateText>{notice.createdAt}</DateText>
      </HeaderContainer>

      <Content>
        {!hasContent ? (
          <EmptyState>내용이 없습니다.</EmptyState>
        ) : richDoc ? (
          <EditorContent editor={editor} />
        ) : (
          // 기존 평문 공지 — 줄바꿈 보존(pre-wrap)
          <PlainText>{notice.content}</PlainText>
        )}
      </Content>

      {children}
    </Container>
  );
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Content = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror {
    outline: none;

    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.fontSize.base};
    line-height: 1.7;

    p {
      margin-bottom: 12px;
    }

    h1 {
      margin: 20px 0 8px;

      font-weight: bold;
      font-size: 28px;
    }

    h2 {
      margin: 18px 0 8px;

      font-weight: bold;
      font-size: 24px;
    }

    h3 {
      margin: 16px 0 8px;

      font-weight: bold;
      font-size: 20px;
    }

    ul,
    ol {
      margin-bottom: 12px;
      padding-left: 24px;
    }

    blockquote {
      padding-left: 16px;
      border-left: 3px solid ${({ theme }) => theme.colors.gray300};

      color: ${({ theme }) => theme.colors.gray600};
    }

    img {
      max-width: 100%;
      margin: 8px 0;
      border-radius: 8px;
    }

    a {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: underline;
    }

    p[data-caption] {
      margin-bottom: 8px;

      color: ${({ theme }) => theme.colors.gray400};
      font-size: 13px;
      line-height: 1.5;
    }

    code {
      padding: 1px 5px;
      border-radius: 4px;

      background: ${({ theme }) => theme.colors.gray100};
      color: ${({ theme }) => theme.colors.gray700};
      font-family: 'Courier New', Consolas, monospace;
      font-size: 0.875em;
    }

    pre {
      margin-bottom: 12px;
      padding: 16px;
      border-radius: 8px;

      background: #1e1e2e;

      overflow-x: auto;

      code {
        padding: 0;
        border-radius: 0;

        background: none;
        color: #cdd6f4;
        font-size: 14px;
        line-height: 1.6;
      }
    }

    hr {
      margin: 24px 0;
      border: none;
      border-top: 1px solid ${({ theme }) => theme.colors.gray200};
    }

    s {
      color: ${({ theme }) => theme.colors.gray400};
    }
  }
`;

const PlainText = styled.div`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;

  flex: 1;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  line-height: 1.3;

  word-break: break-all;
`;

const HeaderContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const CategoryBadge = styled.span<{ category: string }>`
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 4px;

  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const DateText = styled.span`
  margin-top: 10px;
  margin-left: auto;

  flex-shrink: 0;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  white-space: nowrap;
`;
