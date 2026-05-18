import { useNavigate } from '@tanstack/react-router';
import { openSubscribeLink } from '../utils';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { sendMessageToRN } from '@/libs/webview/webview.utils';
import { isWebView } from '@/utils/device';
import { openExternalLink } from '@/utils/externalLink';
import type { GetNewsletterWithDetailResponse } from '@/apis/newsletters/newsletters.api';

export const useNewsletterHeroActions = (
  newsletter: GetNewsletterWithDetailResponse,
) => {
  const { userProfile, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const subscribeButtonText = !isLoggedIn
    ? '로그인 후 구독할 수 있어요'
    : newsletter.isSubscribed
      ? '구독 중'
      : '구독 하기';

  const isSubscribeDisabled = Boolean(isLoggedIn && newsletter.isSubscribed);

  const openMainSite = () => {
    openExternalLink(newsletter.mainPageUrl);
  };

  const handleSubscribeButtonClick = () => {
    trackEvent({
      category: 'Newsletter',
      action: '구독하기 버튼 클릭',
      label: newsletter.name,
    });

    if (!isLoggedIn) {
      trackEvent({
        category: 'Newsletter',
        action: '비로그인 구독버튼 클릭',
        label: newsletter.name,
      });

      if (isWebView()) {
        sendMessageToRN({
          type: 'SHOW_LOGIN_SCREEN',
        });
      } else {
        navigate({
          to: '/login',
          search: {
            redirect: `${window.location.pathname}${window.location.search}`,
          },
        });
      }
      return;
    }

    if (newsletter.source === 'MAEIL_MAIL') {
      navigate({ href: 'https://maeilmail.bombom.news' });
      return;
    }

    openSubscribeLink(newsletter.subscribeUrl, newsletter.name, userProfile);
  };

  const newsletterSummary = `${newsletter.name}, ${newsletter.category} 카테고리, ${newsletter.issueCycle} 발행. ${newsletter.description}`;

  return {
    subscribeButtonText,
    isSubscribeDisabled,
    openMainSite,
    handleSubscribeButtonClick,
    newsletterSummary,
  };
};
