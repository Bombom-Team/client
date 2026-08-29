import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { Node, mergeAttributes } from '@tiptap/core';
import HighlightExtension from '@tiptap/extension-highlight';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import UnderlineExtension from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKitExtension from '@tiptap/starter-kit';
import { useEffect, useRef, useState } from 'react';
import { NoticeSettingsPanel } from './components/NoticeSettingsPanel';
import { parseTiptapDoc, plainTextToTiptapHtml } from './noticeContent';
import { Sidebar } from '@/components/Sidebar';
// EditorToolbar는 blog/notice 공용 — 추후 src/components/editor로 이동 예정
import { EditorToolbar } from '@/pages/blog/components/EditorToolbar';
import type { NoticeCategoryType, NoticeVisibility } from '@/types/notice';

// 캡션 블럭 노드 (본문보다 작은 텍스트, 이미지 설명 등)
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

interface NoticeEditorProps {
  noticeId?: number;
  initialTitle?: string;
  initialContent?: string;
  initialCategory?: NoticeCategoryType;
  initialVisibility?: NoticeVisibility;
}

export const NoticeEditor = ({
  noticeId,
  initialTitle = '',
  initialContent = '',
  initialCategory = 'NOTICE',
  initialVisibility = 'PRIVATE',
}: NoticeEditorProps = {}) => {
  const navigate = useNavigate();
  const isEdit = noticeId != null;

  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<NoticeCategoryType>(initialCategory);
  const [visibility, setVisibility] =
    useState<NoticeVisibility>(initialVisibility);
  const [isDirty, setIsDirty] = useState(false);

  // 최신 isDirty를 읽어 beforeunload 리스너 재등록 방지
  const isDirtyRef = useRef(isDirty);
  const handleImageUploadRef = useRef<(file: File) => void>(() => {});

  const editor = useEditor({
    extensions: [
      StarterKitExtension,
      ImageExtension.configure({
        resize: {
          enabled: true,
          directions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
          minWidth: 80,
          minHeight: 80,
          alwaysPreserveAspectRatio: true,
        },
      }),
      LinkExtension.configure({ openOnClick: false }),
      UnderlineExtension,
      HighlightExtension.configure({ multicolor: true }),
      Caption,
    ],
    // JSON doc이면 그대로, 기존 평문이면 줄바꿈을 문단으로 변환해 주입
    content:
      parseTiptapDoc(initialContent) ?? plainTextToTiptapHtml(initialContent),
    onUpdate: () => setIsDirty(true),
    editorProps: {
      handlePaste: (view, event) => {
        // 클립보드에 이미지 파일이 있으면 삽입
        const files = event.clipboardData?.files;
        if (files && files.length > 0) {
          const imageFile = Array.from(files).find((f) =>
            f.type.startsWith('image/'),
          );
          if (imageFile) {
            event.preventDefault();
            handleImageUploadRef.current(imageFile);
            return true;
          }
        }

        // 선택 영역이 있을 때 URL 붙여넣기 → 하이퍼링크로 변환
        const text = event.clipboardData?.getData('text/plain')?.trim() ?? '';
        const isUrl = /^https?:\/\/\S+$/.test(text);
        const { selection } = view.state;

        if (isUrl && !selection.empty) {
          event.preventDefault();
          const linkMark = view.state.schema.marks.link;
          if (linkMark) {
            view.dispatch(
              view.state.tr.addMark(
                selection.from,
                selection.to,
                linkMark.create({ href: text }),
              ),
            );
          }
          return true;
        }
        return false;
      },
    },
  });

  // 본문 이미지 삽입 — API 미연동, 로컬 objectURL로 미리보기
  // TODO: 백엔드 연동 시 uploadImage 호출 후 imageUrl/imageId로 교체
  const handleImageUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    editor
      ?.chain()
      .focus()
      .insertContent({ type: 'image', attrs: { src: url, alt: file.name } })
      .run();
    setIsDirty(true);
  };

  // ref 동기화
  useEffect(() => {
    handleImageUploadRef.current = handleImageUpload;
  });

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // 미저장 데이터 보호
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const goBack = () => {
    if (isEdit) {
      navigate({
        to: '/notices/$noticeId',
        params: { noticeId: String(noticeId) },
      });
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: '/notices', search: { page: 0, size: 10 } } as any);
  };

  const handleBack = () => {
    if (isDirty && !confirm('작성 중인 내용이 사라집니다. 나가시겠습니까?')) {
      return;
    }
    goBack();
  };

  const isPublic = visibility === 'PUBLIC';

  // 저장 = PUT /notices/{id} (visibility 포함). 발행 개념은 visibility로 표현
  // TODO: 백엔드 연동 시 JSON.stringify(editor.getJSON())로 content 직렬화 후 저장
  const save = (nextVisibility: NoticeVisibility) => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    setVisibility(nextVisibility);
    setIsDirty(false);
    alert(
      `저장 API 미연동 (UI 미리보기)\n공개 상태: ${
        nextVisibility === 'PUBLIC' ? '공개' : '비공개'
      }`,
    );
  };

  // 임시저장/저장 — 현재 공개 상태 유지한 채 저장
  const handleSave = () => save(visibility);
  // 공개하기 — 비공개→공개 전환하며 저장
  const handlePublish = () => save('PUBLIC');
  // 비공개 전환 — 공개→비공개 되돌리며 저장
  const handleUnpublish = () => save('PRIVATE');

  return (
    <PageLayout>
      <Sidebar />
      <EditorMain>
        <TopBar>
          <BackButton onClick={handleBack} type="button">
            ← {isEdit ? '공지사항 상세' : '공지사항 목록'}
          </BackButton>
          <Actions>
            <StatusBadge $isPublic={isPublic}>
              {isPublic ? '공개' : '비공개'}
            </StatusBadge>
            <SaveButton onClick={handleSave} type="button">
              {isPublic ? '저장' : '임시저장'}
            </SaveButton>
            {isPublic ? (
              <SaveButton onClick={handleUnpublish} type="button">
                비공개 전환
              </SaveButton>
            ) : (
              <PublishButton onClick={handlePublish} type="button">
                공개하기
              </PublishButton>
            )}
          </Actions>
        </TopBar>

        <EditorLayout>
          <EditorArea>
            <TitleInput
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setIsDirty(true);
              }}
              placeholder="제목을 입력하세요"
            />
            <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
            <EditorWrapper>
              <EditorContent editor={editor} />
            </EditorWrapper>
          </EditorArea>

          <NoticeSettingsPanel
            category={category}
            onCategoryChange={setCategory}
          />
        </EditorLayout>
      </EditorMain>
    </PageLayout>
  );
};

const PageLayout = styled.div`
  overflow: hidden;
  height: 100vh;

  display: flex;
  flex-direction: row;
`;

const EditorMain = styled.div`
  overflow: hidden;
  margin-left: 256px;

  display: flex;
  flex: 1;
  flex-direction: column;
`;

const TopBar = styled.header`
  padding: 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;

  background: white;
`;

const BackButton = styled.button`
  border: none;

  background: none;
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.gray900};
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const StatusBadge = styled.span<{ $isPublic: boolean }>`
  margin-right: 4px;
  padding: 4px 10px;
  border-radius: 999px;

  background: ${({ theme, $isPublic }) =>
    $isPublic ? theme.colors.primary : theme.colors.gray100};
  color: ${({ theme, $isPublic }) => ($isPublic ? 'white' : theme.colors.gray600)};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.gray200};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PublishButton = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const EditorLayout = styled.div`
  overflow: hidden;

  display: flex;
  flex: 1;
`;

const EditorArea = styled.div`
  overflow: hidden;

  display: flex;
  flex: 1;
  flex-direction: column;
`;

const TitleInput = styled.input`
  padding: 20px 24px 16px;
  outline: none;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray400};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: -2px;
  }
`;

const EditorWrapper = styled.div`
  padding: 20px 24px;

  flex: 1;

  overflow-y: auto;

  /* stylelint-disable-next-line selector-class-pattern */
  .ProseMirror {
    min-height: 300px;
    outline: none;

    color: ${({ theme }) => theme.colors.gray900};
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

    [data-resize-handle] {
      width: 10px;
      height: 10px;
      border: 2px solid ${({ theme }) => theme.colors.primary};
      border-radius: 50%;

      background: white;

      opacity: 0;
      transition: opacity 0.15s;
    }

    [data-resize-wrapper]:hover [data-resize-handle],
    [data-resize-wrapper]:has(img[data-resize-state]) [data-resize-handle] {
      opacity: 1;
    }

    [data-resize-handle='bottom-right'],
    [data-resize-handle='top-left'] {
      cursor: nwse-resize;
    }

    [data-resize-handle='bottom-left'],
    [data-resize-handle='top-right'] {
      cursor: nesw-resize;
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

    /* stylelint-disable-next-line selector-class-pattern */
    &.ProseMirror-focused {
      outline: none;
    }
  }
`;
