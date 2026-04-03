import styled from '@emotion/styled';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { Node, mergeAttributes } from '@tiptap/core';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EditorSettingsPanel } from './components/EditorSettingsPanel';
import { EditorToolbar } from './components/EditorToolbar';
import {
  blogQueries,
  useSaveDraft,
  usePublishDraft,
  useUploadImage,
  useSetThumbnail,
  useUpdateVisibility,
} from '@/apis/blog/blog.query';
import { categoriesQueries } from '@/apis/categories/categories.query';
import { Sidebar } from '@/components/Sidebar';
import { Route } from '@/routes/_admin/blog/$postId';
import type { BlogVisibility } from '@/types/blog';

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

// 에디터 JSON에서 실제 포함된 image 노드의 imageId만 추출
const extractImageIds = (node: unknown): number[] => {
  if (!node || typeof node !== 'object') return [];
  const n = node as Record<string, unknown>;
  const ids: number[] = [];
  if (n.type === 'image' && typeof n.attrs === 'object') {
    const attrs = n.attrs as Record<string, unknown>;
    if (typeof attrs.imageId === 'number') ids.push(attrs.imageId);
  }
  if (Array.isArray(n.content)) {
    n.content.forEach((child) => ids.push(...extractImageIds(child)));
  }
  return ids;
};

export const BlogEditor = () => {
  const { postId } = Route.useParams();
  const postIdNum = Number(postId);
  const navigate = useNavigate();

  const [{ data: draft }, { data: categories }] = useSuspenseQueries({
    queries: [blogQueries.draft(postIdNum), categoriesQueries.list()],
  });

  const [title, setTitle] = useState(draft.title ?? '');
  const [categoryId, setCategoryId] = useState<number | null>(
    draft.category?.id ?? null,
  );
  const [hashTags, setHashTags] = useState<string[]>(draft.hashTags ?? []);
  const [visibility, setVisibility] = useState<BlogVisibility>(
    draft.visibility ?? 'PRIVATE',
  );
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(
    draft.thumbnailImageUrl ?? null,
  );
  const [thumbnailImageId, setThumbnailImageId] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [thumbnailUploadError, setThumbnailUploadError] = useState<
    string | null
  >(null);

  const saveDraftMutation = useSaveDraft();
  const publishDraftMutation = usePublishDraft();
  const uploadImageMutation = useUploadImage();
  const setThumbnailMutation = useSetThumbnail();
  const updateVisibilityMutation = useUpdateVisibility();

  // refs — 컴포넌트 상단에 모아서 선언 (stale closure 방지)
  const isDirtyRef = useRef(isDirty);
  const isPendingRef = useRef(saveDraftMutation.isPending);
  const handleSaveRef = useRef<() => Promise<boolean>>(async () => false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Underline,
      Highlight.configure({ multicolor: true }),
      Caption,
    ],
    content: (() => {
      if (!draft.content) return '';
      try {
        return JSON.parse(draft.content);
      } catch {
        return draft.content;
      }
    })(),
    onUpdate: () => setIsDirty(true),
    editorProps: {
      // 선택 영역이 있을 때 URL 붙여넣기 → 하이퍼링크로 변환
      handlePaste: (view, event) => {
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

  // 미저장 데이터 보호 — isDirtyRef로 최신값을 읽어 listener 재등록 방지
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const handleSave = useCallback(async (): Promise<boolean> => {
    if (!editor) return false;
    setSaveError(null);
    const json = editor.getJSON();
    const content = JSON.stringify(json);
    const referencedImageIds = extractImageIds(json);
    try {
      await saveDraftMutation.mutateAsync({
        postId: postIdNum,
        data: {
          title,
          content,
          thumbnailImageId,
          categoryId,
          hashTags,
          referencedImageIds,
        },
      });
      setIsDirty(false);
      setLastSavedAt(new Date());
      return true;
    } catch (err) {
      console.error('임시저장 실패:', err);
      setSaveError('임시저장에 실패했습니다. 다시 시도해주세요.');
      return false;
    }
  }, [
    editor,
    saveDraftMutation.mutateAsync,
    postIdNum,
    title,
    thumbnailImageId,
    categoryId,
    hashTags,
  ]);

  // ref 동기화
  useEffect(() => {
    handleSaveRef.current = handleSave;
  });

  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  useEffect(() => {
    isPendingRef.current = saveDraftMutation.isPending;
  }, [saveDraftMutation.isPending]);

  // 10초마다 자동저장 (변경 사항이 있을 때만) — ref로 deps 제거해 interval 재생성 방지
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirtyRef.current && !isPendingRef.current) {
        void handleSaveRef.current();
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, []);

  const handlePublish = async () => {
    setPublishError(null);
    const saved = await handleSave();
    if (!saved) return;
    try {
      await publishDraftMutation.mutateAsync(postIdNum);
      navigate({ to: '/blog' });
    } catch (err) {
      console.error('발행 실패:', err);
      setPublishError('발행에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleImageUpload = async (file: File) => {
    setImageUploadError(null);
    try {
      const result = await uploadImageMutation.mutateAsync({
        postId: postIdNum,
        file,
      });
      editor
        ?.chain()
        .focus()
        .setImage({
          src: result.imageUrl,
          alt: file.name,
        })
        .run();
      setIsDirty(true);
    } catch (err) {
      console.error('이미지 업로드 실패:', err);
      setImageUploadError('이미지 업로드에 실패했습니다.');
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    setThumbnailUploadError(null);
    try {
      const result = await uploadImageMutation.mutateAsync({
        postId: postIdNum,
        file,
      });
      await setThumbnailMutation.mutateAsync({
        postId: postIdNum,
        data: { imageId: result.imageId },
      });
      setThumbnailUrl(result.imageUrl);
      setThumbnailImageId(result.imageId);
    } catch (err) {
      console.error('썸네일 업로드 실패:', err);
      setThumbnailUploadError('썸네일 업로드에 실패했습니다.');
    }
  };

  const handleVisibilityChange = async (newVisibility: BlogVisibility) => {
    const previousVisibility = visibility;
    setVisibility(newVisibility);
    try {
      await updateVisibilityMutation.mutateAsync({
        postId: postIdNum,
        visibility: newVisibility,
      });
    } catch (err) {
      console.error('공개 범위 변경 실패:', err);
      setVisibility(previousVisibility);
    }
  };

  return (
    <PageLayout>
      <Sidebar />
      <EditorMain>
        <TopBar>
          <BackButton onClick={() => navigate({ to: '/blog' })} type="button">
            ← 블로그 목록
          </BackButton>
          <Actions>
            {lastSavedAt && !saveError && (
              <SavedAt>
                {lastSavedAt.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}{' '}
                자동저장됨
              </SavedAt>
            )}
            {saveError && <ErrorText>{saveError}</ErrorText>}
            {publishError && <ErrorText>{publishError}</ErrorText>}
            {imageUploadError && <ErrorText>{imageUploadError}</ErrorText>}
            {thumbnailUploadError && (
              <ErrorText>{thumbnailUploadError}</ErrorText>
            )}
            <SaveButton
              onClick={handleSave}
              disabled={saveDraftMutation.isPending}
              type="button"
            >
              {saveDraftMutation.isPending ? '저장 중…' : '임시저장'}
            </SaveButton>
            <PublishButton
              onClick={handlePublish}
              disabled={
                publishDraftMutation.isPending || saveDraftMutation.isPending
              }
              type="button"
            >
              {publishDraftMutation.isPending ? '발행 중…' : '발행하기'}
            </PublishButton>
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

          <EditorSettingsPanel
            thumbnailUrl={thumbnailUrl}
            categories={categories}
            categoryId={categoryId}
            hashTags={hashTags}
            visibility={visibility}
            onThumbnailUpload={handleThumbnailUpload}
            onCategoryChange={setCategoryId}
            onHashTagsChange={setHashTags}
            onVisibilityChange={handleVisibilityChange}
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

const SavedAt = styled.span`
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error ?? '#dc2626'};
  font-size: ${({ theme }) => theme.fontSize.sm};
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
