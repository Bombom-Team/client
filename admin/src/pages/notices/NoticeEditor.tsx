import styled from '@emotion/styled';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import {
  extractImageIds,
  parseTiptapDoc,
  plainTextToTiptapHtml,
} from './noticeContent';
import {
  createNotice,
  updateNotice,
  uploadNoticeImage,
} from '@/apis/notices/notices.api';
import { noticesQueries } from '@/apis/notices/notices.query';
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
  const queryClient = useQueryClient();
  const isEdit = noticeId != null;

  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<NoticeCategoryType>(initialCategory);
  const [visibility, setVisibility] =
    useState<NoticeVisibility>(initialVisibility);
  const [isDirty, setIsDirty] = useState(false);

  // 최신 isDirty를 읽어 beforeunload 리스너 재등록 방지
  const isDirtyRef = useRef(isDirty);
  const handleImageUploadRef = useRef<(file: File) => void>(() => {});

  // 신규 작성은 먼저 비공개 초안을 만들어 id를 확보해야 이미지 업로드·저장이 가능.
  const noticeIdRef = useRef<number | undefined>(noticeId);
  const draftPromiseRef = useRef<Promise<number> | null>(null);

  const ensureNoticeId = (): Promise<number> => {
    if (noticeIdRef.current != null) {
      return Promise.resolve(noticeIdRef.current);
    }
    if (!draftPromiseRef.current) {
      draftPromiseRef.current = createNotice().then(({ noticeId: newId }) => {
        noticeIdRef.current = newId;
        return newId;
      });
    }
    return draftPromiseRef.current;
  };

  const saveMutation = useMutation({
    mutationFn: updateNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: noticesQueries.all });
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) =>
      uploadNoticeImage(id, file),
  });

  const editor = useEditor({
    extensions: [
      StarterKitExtension,
      ImageExtension.extend({
        // 업로드한 이미지의 서버 id를 노드에 보관 → 저장 시 referencedImageIds로 수집
        addAttributes() {
          return {
            ...this.parent?.(),
            imageId: { default: null },
          };
        },
      }).configure({
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
            void handleImageUploadRef.current(imageFile);
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

  // 본문 이미지 업로드 — 초안 id 확보 후 서버 업로드, 반환된 imageUrl/imageId를 노드에 삽입
  const handleImageUpload = async (file: File) => {
    try {
      const id = await ensureNoticeId();
      const { imageId, imageUrl } = await uploadMutation.mutateAsync({
        id,
        file,
      });
      editor
        ?.chain()
        .focus()
        .insertContent({
          type: 'image',
          attrs: { src: imageUrl, alt: file.name, imageId },
        })
        .run();
      setIsDirty(true);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
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

  // 저장 — content(JSON)·카테고리·본문 이미지 참조를 PATCH로 반영.
  // nextVisibility가 있을 때만 공개 상태를 바꾸고, 없으면(임시저장/저장) 서버 상태 유지
  const persist = async (
    nextVisibility?: NoticeVisibility,
  ): Promise<boolean> => {
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return false;
    }
    try {
      const id = await ensureNoticeId();
      const json = editor?.getJSON();
      await saveMutation.mutateAsync({
        noticeId: id,
        payload: {
          title,
          content: JSON.stringify(json ?? {}),
          noticeCategory: category,
          visibility: nextVisibility,
          referencedImageIds: extractImageIds(json),
        },
      });
      if (nextVisibility) setVisibility(nextVisibility);
      setIsDirty(false);
      return true;
    } catch (error) {
      console.error('공지 저장 실패:', error);
      alert('저장에 실패했습니다. 다시 시도해주세요.');
      return false;
    }
  };

  const isSaving = saveMutation.isPending;

  // 임시저장/저장 — 공개 상태는 그대로 두고 내용만 저장
  const handleSave = async () => {
    if (await persist()) goBack();
  };
  // 공개하기 — 비공개→공개 전환하며 저장
  const handlePublish = async () => {
    if (await persist('PUBLIC')) goBack();
  };
  // 비공개 전환 — 공개→비공개 되돌리며 저장
  const handleUnpublish = async () => {
    if (await persist('PRIVATE')) goBack();
  };

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
            <SaveButton onClick={handleSave} type="button" disabled={isSaving}>
              {isPublic ? '저장' : '임시저장'}
            </SaveButton>
            {isPublic ? (
              <SaveButton
                onClick={handleUnpublish}
                type="button"
                disabled={isSaving}
              >
                비공개 전환
              </SaveButton>
            ) : (
              <PublishButton
                onClick={handlePublish}
                type="button"
                disabled={isSaving}
              >
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
