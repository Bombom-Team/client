import { theme } from '@bombom/shared/theme';
import { toast, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useAddBookmarkMutation } from '@/hooks/useAddBookmarkMutation';
import { useRemoveBookmarkMutation } from '@/hooks/useRemoveBookmarkMutation';
import type { MouseEvent } from 'react';
import BookmarkActiveIcon from '#/assets/svg/bookmark-active.svg';
import BookmarkInactiveIcon from '#/assets/svg/bookmark-inactive.svg';

const BOOKMARK_ERROR_MESSAGE =
  '북마크를 반영하지 못했어요. 다시 시도해 주세요.';

interface ArticleBookmarkButtonProps {
  articleId: number;
  isBookmarked: boolean;
}

const ArticleBookmarkButton = ({
  articleId,
  isBookmarked,
}: ArticleBookmarkButtonProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const iconSize = isMobile ? 20 : 24;
  const { mutate: addBookmark, isPending: isAdding } = useAddBookmarkMutation({
    articleId,
  });
  const { mutate: removeBookmark, isPending: isRemoving } =
    useRemoveBookmarkMutation({ articleId });
  const isPending = isAdding || isRemoving;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    // 카드 전체가 Link라 버튼 클릭이 상세 이동으로 이어지지 않게 막는다.
    event.preventDefault();
    event.stopPropagation();

    if (isPending) return;

    const mutate = isBookmarked ? removeBookmark : addBookmark;
    mutate(undefined, {
      onError: () => {
        toast.error(BOOKMARK_ERROR_MESSAGE);
      },
    });
  };

  return (
    <Container
      type="button"
      aria-label={isBookmarked ? '북마크 해제' : '북마크 추가'}
      aria-pressed={isBookmarked}
      aria-busy={isPending}
      isPending={isPending}
      onClick={handleClick}
    >
      {isBookmarked ? (
        <BookmarkActiveIcon width={iconSize} height={iconSize} />
      ) : (
        <BookmarkInactiveIcon
          width={iconSize}
          height={iconSize}
          color={theme.colors.stroke}
        />
      )}
    </Container>
  );
};

export default ArticleBookmarkButton;

const Container = styled.button<{ isPending: boolean }>`
  width: 32px;
  height: 32px;
  margin: -8px -4px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  cursor: ${({ isPending }) => (isPending ? 'progress' : 'pointer')};

  svg {
    opacity: ${({ isPending }) => (isPending ? 0.4 : 1)};
    transition: opacity 0.2s ease-in-out;
  }
`;
