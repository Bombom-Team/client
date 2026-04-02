import styled from '@emotion/styled';
import { useRef, useState, useEffect } from 'react';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiList,
  FiLink,
  FiImage,
  FiChevronDown,
  FiCheck,
  FiCode,
  FiMinus,
} from 'react-icons/fi';
import { MdFormatListNumbered, MdFormatQuote } from 'react-icons/md';
import type { Editor } from '@tiptap/react';

interface EditorToolbarProps {
  editor: Editor | null;
  onImageUpload: (file: File) => void;
}

type TextStyleOption = {
  label: string;
  size: number;
  apply: (editor: Editor) => void;
  isActive: (editor: Editor) => boolean;
};

const TEXT_STYLES: TextStyleOption[] = [
  {
    label: '캡션',
    size: 13,
    apply: (editor) => editor.chain().focus().setNode('caption').run(),
    isActive: (editor) => editor.isActive('caption'),
  },
  {
    label: '본문',
    size: 16,
    apply: (editor) => editor.chain().focus().setParagraph().run(),
    isActive: (editor) => editor.isActive('paragraph'),
  },
  {
    label: '소제목',
    size: 20,
    apply: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    label: '부제목',
    size: 24,
    apply: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    label: '제목',
    size: 28,
    apply: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
];

// allowlist 방식 URL 검증 — 위험 프로토콜(javascript:, vbscript: 등) 차단
const isSafeUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const EditorToolbar = ({
  editor,
  onImageUpload,
}: EditorToolbarProps) => {
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const styleDropdownRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        styleDropdownRef.current &&
        !styleDropdownRef.current.contains(e.target as Node)
      ) {
        setIsStyleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) return null;

  const currentStyle =
    TEXT_STYLES.find((s) => s.isActive(editor)) ?? TEXT_STYLES[1]; // 기본 '본문'

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleLinkClick = () => {
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const url = window.prompt('링크 URL을 입력하세요:');
    if (!url) return;
    const href = url.startsWith('http') ? url : `https://${url}`;
    if (!isSafeUrl(href)) return;
    editor.chain().focus().extendMarkRange('link').setLink({ href }).run();
  };

  return (
    <Toolbar>
      {/* 텍스트 스타일 드롭다운 */}
      <StyleDropdownWrapper ref={styleDropdownRef}>
        <StyleTrigger
          type="button"
          onClick={() => setIsStyleOpen((prev) => !prev)}
          $isOpen={isStyleOpen}
        >
          <span>{currentStyle.label}</span>
          <FiChevronDown />
        </StyleTrigger>

        {isStyleOpen && (
          <StyleDropdown>
            {TEXT_STYLES.map((style) => {
              const active = style.isActive(editor);
              return (
                <StyleOption
                  key={style.label}
                  type="button"
                  $isActive={active}
                  onClick={() => {
                    style.apply(editor);
                    setIsStyleOpen(false);
                  }}
                >
                  <StyleOptionLabel $isActive={active} size={style.size}>
                    {style.label}
                  </StyleOptionLabel>
                  <StyleOptionSize $isActive={active}>
                    {style.size}px
                  </StyleOptionSize>
                  {active && <FiCheck />}
                </StyleOption>
              );
            })}
          </StyleDropdown>
        )}
      </StyleDropdownWrapper>

      <Divider />

      <ToolButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        $isActive={editor.isActive('bold')}
        type="button"
        title="굵게 (Ctrl+B)"
      >
        <FiBold />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        $isActive={editor.isActive('italic')}
        type="button"
        title="기울임 (Ctrl+I)"
      >
        <FiItalic />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        $isActive={editor.isActive('underline')}
        type="button"
        title="밑줄 (Ctrl+U)"
      >
        <FiUnderline />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        $isActive={editor.isActive('strike')}
        type="button"
        title="취소선"
      >
        <StrikeLabel>S</StrikeLabel>
      </ToolButton>

      <Divider />

      <ToolButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        $isActive={editor.isActive('code')}
        type="button"
        title="인라인 코드"
      >
        <FiCode />
      </ToolButton>
      <CodeBlockButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        $isActive={editor.isActive('codeBlock')}
        type="button"
        title="코드 블럭"
      >
        <FiCode />
        <span>블럭</span>
      </CodeBlockButton>

      <Divider />

      <ToolButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        $isActive={editor.isActive('bulletList')}
        type="button"
        title="불릿 리스트"
      >
        <FiList />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        $isActive={editor.isActive('orderedList')}
        type="button"
        title="번호 리스트"
      >
        <MdFormatListNumbered />
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        $isActive={editor.isActive('blockquote')}
        type="button"
        title="인용"
      >
        <MdFormatQuote />
      </ToolButton>

      <Divider />

      <ToolButton
        onClick={() => {
          const { $from } = editor.state.selection;
          if ($from.parent.content.size > 0) {
            editor.chain().focus($from.end()).setHorizontalRule().run();
          } else {
            editor.chain().focus().setHorizontalRule().run();
          }
        }}
        $isActive={false}
        type="button"
        title="구분선 (텍스트가 있으면 다음 줄에 삽입)"
      >
        <FiMinus />
      </ToolButton>

      <Divider />

      <ToolButton
        onClick={handleLinkClick}
        $isActive={editor.isActive('link')}
        type="button"
        title={
          editor.isActive('link')
            ? '링크 제거'
            : '링크 추가 (선택 후 URL 붙여넣기 가능)'
        }
      >
        <FiLink />
      </ToolButton>
      <ToolButton
        onClick={handleImageClick}
        $isActive={false}
        type="button"
        title="이미지 업로드"
      >
        <FiImage />
      </ToolButton>

      {/* hidden file input — ref 방식으로 관리 */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onImageUpload(file);
          e.target.value = '';
        }}
      />
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

const StyleDropdownWrapper = styled.div`
  position: relative;
`;

const StyleTrigger = styled.button<{ $isOpen: boolean }>`
  height: 32px;
  min-width: 80px;
  padding: 0 10px;
  border: 1px solid
    ${({ theme, $isOpen }) =>
      $isOpen ? theme.colors.primary : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  display: flex;
  gap: 4px;
  align-items: center;

  background: white;
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: 13px;

  cursor: pointer;
  transition:
    color 0.15s,
    background-color 0.15s,
    border-color 0.15s;

  svg {
    color: ${({ theme }) => theme.colors.gray400};
    font-size: 12px;

    transform: ${({ $isOpen }) =>
      $isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
    transition: transform 0.15s;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StyleDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  min-width: 160px;
  padding: 4px 0;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow:
    0 4px 12px rgb(0 0 0 / 8%),
    0 1px 4px rgb(0 0 0 / 4%);

  background: white;
`;

const StyleOption = styled.button<{ $isActive: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: none;

  display: flex;
  gap: 8px;
  align-items: center;

  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.gray50 : 'transparent'};

  cursor: pointer;
  transition: background-color 0.1s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }

  svg {
    margin-left: auto;

    color: ${({ theme }) => theme.colors.primary};
    font-size: 13px;
  }
`;

const StyleOptionLabel = styled.span<{ $isActive: boolean; size: number }>`
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.gray800};
  font-weight: ${({ theme, $isActive }) =>
    $isActive ? theme.fontWeight.semibold : theme.fontWeight.normal};
  font-size: ${({ size }) => Math.min(size, 15)}px;
`;

const StyleOptionSize = styled.span<{ $isActive: boolean }>`
  margin-right: 4px;
  margin-left: auto;

  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary : theme.colors.gray400};
  font-size: 11px;
`;

const ToolButton = styled.button<{ $isActive: boolean }>`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  display: flex;
  align-items: center;
  justify-content: center;

  background: white;
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: 13px;

  cursor: pointer;
  transition:
    color 0.15s,
    background-color 0.15s,
    border-color 0.15s;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.primary};

    border-color: ${({ theme }) => theme.colors.primary};
  }

  svg {
    font-size: 14px;
  }
`;

const CodeBlockButton = styled(ToolButton)`
  width: auto;
  padding: 0 8px;

  gap: 3px;

  font-size: 11px;

  span {
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    font-size: 11px;
  }
`;

const StrikeLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: 13px;

  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  margin: 0 4px;

  background: ${({ theme }) => theme.colors.gray200};
`;
