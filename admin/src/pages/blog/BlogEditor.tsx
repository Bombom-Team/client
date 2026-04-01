import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
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

  const { data: draft } = useSuspenseQuery(blogQueries.draft(postIdNum));
  const { data: categories } = useSuspenseQuery(categoriesQueries.list());

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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const saveDraftMutation = useSaveDraft();
  const publishDraftMutation = usePublishDraft();
  const uploadImageMutation = useUploadImage();
  const setThumbnailMutation = useSetThumbnail();
  const updateVisibilityMutation = useUpdateVisibility();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Underline,
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
  });

  // 미저장 데이터 보호
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const handleSave = async (): Promise<boolean> => {
    if (!editor) return false;
    setSaveError(null);
    const content = JSON.stringify(editor.getJSON());
    const referencedImageIds = extractImageIds(editor.getJSON());
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
      return true;
    } catch {
      setSaveError('임시저장에 실패했습니다. 다시 시도해주세요.');
      return false;
    }
  };

  const handlePublish = async () => {
    setPublishError(null);
    const saved = await handleSave();
    if (!saved) return;
    try {
      await publishDraftMutation.mutateAsync(postIdNum);
      navigate({ to: '/blog' });
    } catch {
      setPublishError('발행에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleImageUpload = async (file: File) => {
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
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  const handleThumbnailUpload = async (file: File) => {
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
    } catch {
      alert('썸네일 업로드에 실패했습니다.');
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
    } catch {
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
            {saveError && <ErrorText>{saveError}</ErrorText>}
            {publishError && <ErrorText>{publishError}</ErrorText>}
            <SaveButton
              onClick={handleSave}
              disabled={saveDraftMutation.isPending}
              type="button"
            >
              {saveDraftMutation.isPending ? '저장 중...' : '임시저장'}
            </SaveButton>
            <PublishButton
              onClick={handlePublish}
              disabled={
                publishDraftMutation.isPending || saveDraftMutation.isPending
              }
              type="button"
            >
              {publishDraftMutation.isPending ? '발행 중...' : '발행하기'}
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

const ErrorText = styled.span`
  color: red;
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
`;

const EditorWrapper = styled.div`
  padding: 20px 24px;

  flex: 1;

  overflow-y: auto;

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

    &.ProseMirror-focused {
      outline: none;
    }
  }
`;
