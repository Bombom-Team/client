import { theme } from '@bombom/shared/theme';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import FloatingActionPanel from '@/components/FloatingActionPanel/FloatingActionPanel';
import ChevronIcon from '@/components/icons/ChevronIcon';
import BookmarkActiveIcon from '#/assets/svg/bookmark-active.svg';
import BookmarkInactiveIcon from '#/assets/svg/bookmark-inactive.svg';

const ARTICLE_MAX_WIDTH = 700;

interface ArticleActionButtonsProps {
  isRead: boolean;
  bookmarked: boolean;
  onBookmarkClick: () => void;
}

const ArticleActionButtons = ({
  isRead,
  bookmarked,
  onBookmarkClick,
}: ArticleActionButtonsProps) => {
  return (
    <FloatingActionPanel
      top="80vh"
      left={`calc(50% - (${ARTICLE_MAX_WIDTH / 2}px + 90px))`}
      actions={[
        ...(isRead
          ? [
              {
                icon: (
                  <DotLottieReact
                    src="/assets/lottie/success-check.lottie"
                    style={{ width: '32px', height: '32px' }}
                    loop={false}
                    autoplay
                  />
                ),
              },
            ]
          : []),
        {
          icon: bookmarked ? (
            <BookmarkActiveIcon width={28} height={28} />
          ) : (
            <BookmarkInactiveIcon
              width={28}
              height={28}
              color={theme.colors.primary}
            />
          ),
          onClick: onBookmarkClick,
          ariaLabel: '북마크',
        },
        {
          icon: (
            <ChevronIcon
              direction="up"
              width={28}
              height={28}
              color={theme.colors.icons}
            />
          ),
          onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
          ariaLabel: '맨 위로',
        },
      ]}
    />
  );
};

export default ArticleActionButtons;
