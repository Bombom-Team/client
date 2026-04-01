import styled from '@emotion/styled';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiLink,
  FiImage,
} from 'react-icons/fi';
import { MdFormatListNumbered, MdFormatQuote } from 'react-icons/md';
import type { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload: (file: File) => void;
}

export const EditorToolbar = ({
  editor,
  onImageUpload,
}: EditorToolbarProps) => {
  if (!editor) return null;

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) onImageUpload(file);
    };
    input.click();
  };

  const handleLinkClick = () => {
    const url = window.prompt('URL을 입력하세요:');
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setMark('link', { href: url })
        .run();
    }
  };

  return (
    <Toolbar>
      <ToolButton
        onClick={() => editor.chain().focus().toggleMark('bold').run()}
        isActive={editor.isActive('bold')}
        type="button"
        title="굵게"
      >
        <FiBold />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleMark('italic').run()}
        isActive={editor.isActive('italic')}
        type="button"
        title="기울임"
      >
        <FiItalic />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleMark('underline').run()}
        isActive={editor.isActive('underline')}
        type="button"
        title="밑줄"
      >
        <FiUnderline />
      </ToolButton>

      <Divider />

      {([1, 2, 3] as const).map((level) => (
        <ToolButton
          key={level}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleNode('heading', 'paragraph', { level })
              .run()
          }
          isActive={editor.isActive('heading', { level })}
          type="button"
          title={`제목 ${level}`}
        >
          H{level}
        </ToolButton>
      ))}

      <Divider />

      <ToolButton
        onClick={() =>
          editor.chain().focus().toggleNode('bulletList', 'paragraph').run()
        }
        isActive={editor.isActive('bulletList')}
        type="button"
        title="불릿 리스트"
      >
        <FiList />
      </ToolButton>
      <ToolButton
        onClick={() =>
          editor.chain().focus().toggleNode('orderedList', 'paragraph').run()
        }
        isActive={editor.isActive('orderedList')}
        type="button"
        title="번호 리스트"
      >
        <MdFormatListNumbered />
      </ToolButton>
      <ToolButton
        onClick={() =>
          editor.chain().focus().toggleNode('blockquote', 'paragraph').run()
        }
        isActive={editor.isActive('blockquote')}
        type="button"
        title="인용"
      >
        <MdFormatQuote />
      </ToolButton>

      <Divider />

      <ToolButton
        onClick={handleLinkClick}
        isActive={editor.isActive('link')}
        type="button"
        title="링크"
      >
        <FiLink />
      </ToolButton>
      <ToolButton
        onClick={handleImageClick}
        isActive={false}
        type="button"
        title="이미지 업로드"
      >
        <FiImage />
      </ToolButton>
    </Toolbar>
  );
};

const Toolbar = styled.div`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-bottom: none;
  border-radius: ${({ theme }) => theme.borderRadius.md}
    ${({ theme }) => theme.borderRadius.md} 0 0;

  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  align-items: center;

  background: ${({ theme }) => theme.colors.gray50};
`;

const ToolButton = styled.button<{ isActive: boolean }>`
  width: 32px;
  height: 32px;
  border: 1px solid
    ${({ theme, isActive }) =>
      isActive ? theme.colors.primary : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary + '15' : 'white'};
  color: ${({ theme, isActive }) =>
    isActive ? theme.colors.primary : theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: 13px;

  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.primary};

    border-color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    font-size: 14px;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  margin: 0 4px;

  background: ${({ theme }) => theme.colors.gray200};
`;
