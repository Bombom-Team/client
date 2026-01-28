import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import AlreadyAppliedModal from './modals/AlreadyAppliedModal';
import AlreadyStartedModal from './modals/AlreadyStartedModal';
import ApplyConfirmModal from './modals/ApplyConfirmModal';
import ErrorModal from './modals/ErrorModal';
import LoginRequiredModal from './modals/LoginRequiredModal';
import SubscribeRequiredModal from './modals/SubscribeRequiredModal';
import { challengeQueries } from '@/apis/challenge/challenge.query';
import Button from '@/components/Button/Button';
import type { Challenge } from '@/apis/challenge/challenge.api';

interface ChallengeApplyModalProps {
  challengeId: number;
  closeModal: () => void;
  onApply: () => void;
  newsletters: Challenge['newsletters'];
}

const ChallengeApplyModal = ({
  challengeId,
  closeModal,
  onApply,
  newsletters,
}: ChallengeApplyModalProps) => {
  const { data: eligibility } = useSuspenseQuery(
    challengeQueries.eligibility(challengeId),
  );

  if (eligibility.canApply) {
    return <ApplyConfirmModal closeModal={closeModal} onApply={onApply} />;
  }

  const hasLoginIssue = eligibility.reason === 'NOT_LOGGED_IN';
  if (hasLoginIssue) {
    return <LoginRequiredModal closeModal={closeModal} />;
  }

  const hasAlreadyStarted = eligibility.reason === 'ALREADY_STARTED';
  if (hasAlreadyStarted) {
    return <AlreadyStartedModal closeModal={closeModal} />;
  }

  const hasAlreadyApplied = eligibility.reason === 'ALREADY_APPLIED';
  if (hasAlreadyApplied) {
    return <AlreadyAppliedModal closeModal={closeModal} />;
  }

  const hasSubscribeIssue = eligibility.reason === 'NOT_SUBSCRIBED';
  if (hasSubscribeIssue) {
    return (
      <SubscribeRequiredModal
        closeModal={closeModal}
        newsletters={newsletters}
      />
    );
  }

  return <ErrorModal closeModal={closeModal} />;
};

export default ChallengeApplyModal;

export const Container = styled.div<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '320px' : '440px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
`;

export const ModalTitle = styled.h2<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.heading5 : theme.fonts.heading4};
`;

export const ModalDescription = styled.p<{ isMobile: boolean }>`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;

export const ModalButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

export const ModalButton = styled(Button)<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '120px' : '160px')};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body3 : theme.fonts.body2};
`;
