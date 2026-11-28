import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import BrowseNewslettersCard from './BrowseNewslettersCard';
import NewsletterRecommendations from './NewsletterRecommendations';
import NicknameForm from './NicknameForm';
import PageToast from './PageToast';
import RankingCarousel from './RankingCarousel';
import {
  FALLBACK_NEWSLETTER_COUNT,
  FLUENT_ATTRIBUTION,
  MIN_RANKED_ELAPSED_SECONDS,
} from '../constants/result';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { usePageToast } from '../hooks/usePageToast';
import { useShareChallenge } from '../hooks/useShareChallenge';
import { markLastResultNicknameRegistered } from '../utils/lastResult';
import { trackLiteracyEvent } from '../utils/trackLiteracyEvent';
import { queries } from '@/apis/queries';
import type {
  LiteracyQuizPlatform,
  PostLiteracyQuizSubmissionResponse,
} from '@/apis/literacyQuiz/literacyQuiz.api';

interface FinalSlideProps {
  result: PostLiteracyQuizSubmissionResponse;
  attemptCode: string;
  visitorId: string;
  platform: LiteracyQuizPlatform;
  isNicknameRegistered: boolean;
  onReview: () => void;
}

// 마지막 장: 랭킹 · 닉네임 등록 · 점수별 뉴스레터 · 더 둘러보기 · 도전장/해설 버튼
const FinalSlide = ({
  result,
  attemptCode,
  visitorId,
  platform,
  isNicknameRegistered,
  onReview,
}: FinalSlideProps) => {
  const { toastMessage, toastId, showToast } = usePageToast();
  const [hasRegistered, setHasRegistered] = useState(isNicknameRegistered);
  const { data: ranking } = useQuery(
    queries.literacyQuizRanking({ attemptCode }),
  );
  const { data: newsletterList } = useQuery(queries.newsletters());

  const logoById = useMemo(
    () =>
      new Map(
        (newsletterList?.newsletters ?? []).map((newsletter) => [
          newsletter.newsletterId,
          newsletter.imageUrl ?? '',
        ]),
      ),
    [newsletterList],
  );
  const newsletterCount =
    newsletterList?.newsletters.length || FALLBACK_NEWSLETTER_COUNT;
  const registeredNickname = ranking?.me?.nickname;

  const handleCopied = useCallback(() => {
    showToast('링크가 클립보드에 복사되었어요');
    trackLiteracyEvent('literacy_quiz_challenge_share', {
      attemptCode,
      platform,
      params: { correct_count: result.correctCount },
    });
  }, [attemptCode, platform, result.correctCount, showToast]);

  const handleCopyFailed = useCallback(() => {
    showToast('복사하지 못했어요. 링크를 직접 복사해 주세요');
  }, [showToast]);

  const shareChallenge = useShareChallenge({
    attemptCode,
    onCopied: handleCopied,
    onFailed: handleCopyFailed,
  });

  const handleRegistered = (rank: number) => {
    setHasRegistered(true);
    markLastResultNicknameRegistered(attemptCode);
    showToast('랭킹에 등록했어요');
    trackLiteracyEvent('literacy_quiz_nickname_register', {
      attemptCode,
      platform,
      params: { rank },
    });
  };

  const handleNewsletterClick = (
    newsletterId: number,
    position: number,
    target: 'card' | 'subscribe',
  ) => {
    trackLiteracyEvent('literacy_quiz_newsletter_click', {
      attemptCode,
      platform,
      params: { newsletter_id: newsletterId, position, target },
    });
  };

  const handleBrowseClick = () => {
    trackLiteracyEvent('literacy_quiz_browse_click', { attemptCode, platform });
  };

  return (
    <Container>
      <Content>
        <RankingCarousel ranking={ranking} />
        {result.ranked && registeredNickname && ranking?.me && (
          <Registered>
            {registeredNickname}님은 {ranking.participantCount}명 중{' '}
            <RegisteredRank>{ranking.me.rank}위</RegisteredRank>예요!
          </Registered>
        )}
        {result.ranked && !registeredNickname && !hasRegistered && (
          <NicknameForm
            attemptCode={attemptCode}
            visitorId={visitorId}
            onRegistered={handleRegistered}
          />
        )}
        {!result.ranked && (
          <Note>
            {result.elapsedSeconds < MIN_RANKED_ELAPSED_SECONDS
              ? '너무 빨리 제출한 기록은 랭킹에 들어가지 않아요'
              : '다시 푼 기록은 랭킹에 들어가지 않아요'}
          </Note>
        )}
        <NewsletterRecommendations
          correctCount={result.correctCount}
          logoById={logoById}
          onNewsletterClick={handleNewsletterClick}
        />
        <BrowseNewslettersCard
          newsletterCount={newsletterCount}
          logoById={logoById}
          onClick={handleBrowseClick}
        />
        <Note>결과 화면 캐릭터: {FLUENT_ATTRIBUTION}</Note>
      </Content>
      <CtaBar>
        <CtaButton type="button" variant="main" onClick={shareChallenge}>
          도전장 보내기
        </CtaButton>
        <CtaButton type="button" variant="sub" onClick={onReview}>
          문제와 해설 보기
        </CtaButton>
      </CtaBar>
      {toastMessage && <PageToast key={toastId} message={toastMessage} />}
    </Container>
  );
};

export default FinalSlide;

const Container = styled.div`
  position: absolute;

  background: ${({ theme }) => theme.colors.white};
  color: ${LITERACY_COLORS.ink};

  inset: 0;
`;

const Content = styled.div`
  position: absolute;
  padding: 0 5.5cqw 5cqw;

  display: flex;
  gap: 2.4cqw;
  flex-direction: column;

  text-align: left;

  inset: calc(31cqw + ${({ theme }) => theme.safeArea.top}) 0 22cqw 0;

  overflow-y: auto;

  overscroll-behavior: contain;

  & > * {
    flex-shrink: 0;
  }
`;

const Registered = styled.p`
  margin: 0;
  font: 700 3.6cqw ${LITERACY_FONTS.body};
`;

const RegisteredRank = styled.b`
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: 400 5cqw ${LITERACY_FONTS.display};
`;

const Note = styled.p`
  margin: 0;

  color: ${LITERACY_COLORS.muted};
  font: 700 2.7cqw ${LITERACY_FONTS.body};
  text-align: center;
`;

const CtaBar = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  padding: 3cqw 5cqw calc(5cqw + ${({ theme }) => theme.safeArea.bottom});

  display: grid;
  gap: 2.4cqw;

  background: linear-gradient(
    180deg,
    rgb(255 255 255 / 0%),
    ${({ theme }) => theme.colors.white} 35%
  );

  grid-template-columns: 1fr 1fr;
`;

const CtaButton = styled.button<{ variant: 'main' | 'sub' }>`
  padding: 3.8cqw 2cqw;
  border: 0;
  border-radius: 3.4cqw;

  background: ${({ variant, theme }) =>
    variant === 'main' ? theme.colors.primaryBomBom : LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 800 max(13px, 3.7cqw) ${LITERACY_FONTS.body};

  cursor: pointer;
`;
