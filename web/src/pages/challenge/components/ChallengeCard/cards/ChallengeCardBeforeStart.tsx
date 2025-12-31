import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import ChallengeApplyModal from '../../ChallengeApplyModal/ChallengeApplyModal';
import CardContainer from '../CardContainer';
import CardFooter from '../CardFooter';
import CardHeader from '../CardHeader';
import { challengeQueries } from '@/apis/challenge/challenge.query';
import Button from '@/components/Button/Button';
import useModal from '@/components/Modal/useModal';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import { openExternalLink } from '@/utils/externalLink';
import type { ChallengeCardProps } from '../../ChallengeCard';

const ChallengeCardBeforeStart = (props: ChallengeCardProps) => {
  const { participantCount, startDate, title, id } = props;
  const { modalRef, openModal, closeModal, isOpen } = useModal();

  const { data: eligibility, isLoading } = useQuery({
    ...challengeQueries.eligibility(id),
    enabled: isOpen,
  });

  const handleCardClick = () => {
    trackEvent({
      category: 'Challenge',
      action: '카드 클릭',
      label: title,
    });

    openExternalLink(
      'https://maroon-geranium-880.notion.site/2d103dcf205680dfa045d47385af3df9?source=copy_link',
    );
  };

  const handleApplyClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    openModal();

    trackEvent({
      category: 'Challenge',
      action: '신청하기 버튼 클릭',
      label: title,
    });
  };

  const handleCancelClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // TODO: 신청 취소 API 호출
    console.log('챌린지 신청 취소:', id);

    trackEvent({
      category: 'Challenge',
      action: '신청취소 버튼 클릭',
      label: title,
    });
  };

  const handleApply = () => {
    // TODO: 신청 API 호출
    console.log('챌린지 신청:', id);

    trackEvent({
      category: 'Challenge',
      action: '챌린지 신청 완료',
      label: title,
    });
  };

  return (
    <>
      <CardContainer onClick={handleCardClick}>
        <CardHeader
          title={title}
          startDate={startDate}
          applicantCount={participantCount}
        />

        <CardFooter>
          {props.detail.isJoined ? (
            <ApplyButton variant="outlined" onClick={handleCancelClick}>
              신청취소
            </ApplyButton>
          ) : (
            <ApplyButton onClick={handleApplyClick}>신청하기</ApplyButton>
          )}
        </CardFooter>
      </CardContainer>

      <ChallengeApplyModal
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
        eligibility={eligibility || null}
        isLoading={isLoading}
        onApply={handleApply}
      />
    </>
  );
};

export default ChallengeCardBeforeStart;

const ApplyButton = styled(Button)`
  padding: 10px 16px;
  border-radius: 10px;

  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 600;
`;
