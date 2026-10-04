import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import useModal from '@/components/Modal/useModal';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import LoginSheet from '@/pages/newsletter-request/components/LoginSheet';
import NewsletterRequestItem from '@/pages/newsletter-request/components/NewsletterRequestItem';
import useToggleNewsletterRequestSupportMutation from '@/pages/newsletter-request/hooks/useToggleNewsletterRequestSupportMutation';
import type { NewsletterRequest } from '@/types/newsletterRequest';
import ClockIcon from '#/assets/svg/clock.svg';

type BoardTab = 'all' | 'mine';

const BOARD_PATH = '/newsletter-requests';
const FUNNEL_PATH = '/newsletter-requests/new';

export const Route = createFileRoute('/_bombom/_main/newsletter-requests')({
  validateSearch: (search: Record<string, unknown>): { tab?: BoardTab } => ({
    tab: search.tab === 'mine' ? 'mine' : undefined,
  }),
  head: () => ({
    meta: [{ title: '봄봄 | 뉴스레터 신청' }],
  }),
  component: NewsletterRequestBoardPage,
});

function NewsletterRequestBoardPage() {
  const navigate = useNavigate();
  const { tab = 'all' } = Route.useSearch();
  const { isLoggedIn } = useAuth();
  const device = useDevice();
  const isPC = device === 'pc';
  const [loginRedirectPath, setLoginRedirectPath] = useState(FUNNEL_PATH);
  const { modalRef, isOpen, openModal, closeModal } = useModal();

  const { data: requests = [], isLoading } = useQuery(
    queries.newsletterRequests(),
  );
  const { data: myRequests = [] } = useQuery({
    ...queries.myNewsletterRequests(),
    enabled: isLoggedIn && tab === 'mine',
  });
  const { mutate: toggleSupport, isPending: isSupportPending } =
    useToggleNewsletterRequestSupportMutation();

  const visibleRequests = tab === 'mine' ? myRequests : requests;

  const handleTabChange = (nextTab: BoardTab) => {
    navigate({
      to: BOARD_PATH,
      search: nextTab === 'mine' ? { tab: 'mine' } : {},
      replace: true,
    });
  };

  const handleStartClick = () => {
    if (!isLoggedIn) {
      setLoginRedirectPath(FUNNEL_PATH);
      openModal();
      return;
    }
    navigate({ to: FUNNEL_PATH });
  };

  const handleSupportToggle = (request: NewsletterRequest) => {
    if (!isLoggedIn) {
      setLoginRedirectPath(BOARD_PATH);
      openModal();
      return;
    }
    toggleSupport({
      newsletterRequestId: request.id,
      supported: request.supported,
    });
  };

  return (
    <Container>
      <HeadWrapper>
        <Eyebrow>뉴스레터 신청</Eyebrow>
        <Title>함께 받고 싶은 뉴스레터</Title>
      </HeadWrapper>

      <TabWrapper role="tablist" aria-label="목록 보기">
        <TabButton
          role="tab"
          type="button"
          aria-selected={tab === 'all'}
          isSelected={tab === 'all'}
          onClick={() => handleTabChange('all')}
        >
          신청 현황
        </TabButton>
        <TabButton
          role="tab"
          type="button"
          aria-selected={tab === 'mine'}
          isSelected={tab === 'mine'}
          onClick={() => handleTabChange('mine')}
        >
          내 신청
        </TabButton>
      </TabWrapper>

      {tab === 'mine' && !isLoggedIn ? (
        <EmptyBox>로그인하면 내 신청을 볼 수 있어요</EmptyBox>
      ) : (
        <RequestList>
          {visibleRequests.map((request) => (
            <NewsletterRequestItem
              key={request.id}
              request={request}
              onSupportToggle={handleSupportToggle}
              isSupportPending={isSupportPending}
            />
          ))}
        </RequestList>
      )}
      {!isLoading && visibleRequests.length === 0 && (
        <EmptyBox>
          {tab === 'mine'
            ? '아직 신청한 뉴스레터가 없어요'
            : '아직 신청된 뉴스레터가 없어요. 첫 신청을 남겨 보세요'}
        </EmptyBox>
      )}

      <CtaWrapper isPC={isPC}>
        <TimePromise>
          <ClockIcon width={14} height={14} />
          <span>
            <TimeHighlight>1분</TimeHighlight>이면 신청이 끝나요
          </span>
        </TimePromise>
        <StartButton onClick={handleStartClick}>
          새 뉴스레터 신청하기
        </StartButton>
      </CtaWrapper>

      <LoginSheet
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        title={
          loginRedirectPath === FUNNEL_PATH
            ? '신청하려면 로그인해 주세요'
            : '공감하려면 로그인해 주세요'
        }
        redirectPath={loginRedirectPath}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;

  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const HeadWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Eyebrow = styled.span`
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t4Bold};
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
`;

const TabWrapper = styled.div`
  padding: 4px;
  border-radius: 14px;

  display: grid;
  gap: 4px;

  background-color: ${({ theme }) => theme.colors.disabledBackground};

  grid-template-columns: 1fr 1fr;
`;

const TabButton = styled.button<{ isSelected: boolean }>`
  padding: 12px;
  border-radius: 12px;
  box-shadow: ${({ isSelected }) =>
    isSelected ? '0 1px 3px rgb(0 0 0 / 8%)' : 'none'};

  background-color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.white : 'transparent'};
  color: ${({ theme, isSelected }) =>
    isSelected ? theme.colors.textPrimary : theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;

const RequestList = styled.ul`
  display: flex;
  flex-direction: column;
`;

const EmptyBox = styled.p`
  padding: 40px 0;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;

const CtaWrapper = styled.div<{ isPC: boolean }>`
  position: sticky;
  bottom: ${({ theme, isPC }) =>
    isPC ? '0' : `calc(${theme.heights.bottomNav} + ${theme.safeArea.bottom})`};
  padding: 12px 0 16px;

  display: flex;
  gap: 8px;
  flex-direction: column;

  background: linear-gradient(
    to bottom,
    rgb(255 255 255 / 0%),
    ${({ theme }) => theme.colors.white} 24%
  );
`;

const TimePromise = styled.p`
  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const TimeHighlight = styled.b`
  color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const StartButton = styled(Button)`
  width: 100%;
  height: 52px;

  font: ${({ theme }) => theme.fonts.t6Bold};
`;
