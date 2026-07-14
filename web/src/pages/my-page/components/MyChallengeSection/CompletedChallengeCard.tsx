import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import CertificateModal from './CertificateModal';
import { MEDAL_COLORS } from '../../constants/challenge';
import Button from '@/components/Button/Button';
import useModal from '@/components/Modal/useModal';
import type { MyCompletedChallenge } from '@/apis/members/members.api';
import type { MouseEvent } from 'react';
import MedalBronzeIcon from '#/assets/svg/medal-bronze.svg';
import MedalGoldIcon from '#/assets/svg/medal-gold.svg';
import MedalSilverIcon from '#/assets/svg/medal-silver.svg';

const MEDAL_ICON = {
  GOLD: MedalGoldIcon,
  SILVER: MedalSilverIcon,
  BRONZE: MedalBronzeIcon,
};

const GRADE_COLOR = {
  GOLD: MEDAL_COLORS.gold,
  SILVER: MEDAL_COLORS.silver,
  BRONZE: MEDAL_COLORS.bronze,
};

interface CompletedChallengeCardProps {
  challenge: MyCompletedChallenge;
}

const CompletedChallengeCard = ({ challenge }: CompletedChallengeCardProps) => {
  const { challengeId, title, startDate, endDate, attendanceRate, grade } =
    challenge;
  const { modalRef, isOpen, openModal, closeModal } = useModal();
  const navigate = useNavigate();

  const isFail = grade === 'FAIL';
  const medalGrade = grade != null && !isFail ? grade : null;
  const MedalIcon = medalGrade ? MEDAL_ICON[medalGrade] : null;
  const gradeColor = medalGrade ? GRADE_COLOR[medalGrade] : null;

  const handleCardClick = () => {
    if (isFail || !challengeId) return;

    navigate({
      to: '/challenge/$challengeId/dashboard',
      params: { challengeId: String(challengeId) },
    });
  };

  const handleCertButtonClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    openModal();
  };

  return (
    <>
      <Container disabled={isFail} onClick={handleCardClick}>
        <MedalCircle gradeColor={gradeColor}>
          {MedalIcon ? (
            <MedalIcon width={36} height={36} />
          ) : (
            <MedalPlaceholder>-</MedalPlaceholder>
          )}
        </MedalCircle>

        <Content>
          <Info>
            <Title>{title}</Title>
            <DateText>
              {startDate} ~ {endDate}
            </DateText>
            <BottomRow>
              <AttendanceText>
                출석률 <AttendanceValue>{attendanceRate}%</AttendanceValue>
                {grade === 'FAIL' && <FailBadge>(탈락)</FailBadge>}
              </AttendanceText>
              {grade !== 'FAIL' && (
                <CertButton
                  variant="transparent"
                  onClick={handleCertButtonClick}
                  disabled={isFail}
                >
                  수료증 확인
                </CertButton>
              )}
            </BottomRow>
          </Info>
        </Content>
      </Container>

      {grade !== 'FAIL' && challengeId !== undefined && (
        <CertificateModal
          challengeId={challengeId}
          modalRef={modalRef}
          isOpen={isOpen}
          closeModal={closeModal}
        />
      )}
    </>
  );
};

export default CompletedChallengeCard;

const Container = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  gap: 12px;
  align-items: center;

  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabledBackground : theme.colors.white};

  box-sizing: border-box;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const Content = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
`;

const MedalCircle = styled.div<{ gradeColor: string | null }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, gradeColor }) =>
    gradeColor ? `${gradeColor}20` : theme.colors.stroke};
`;

const MedalPlaceholder = styled.div`
  width: 52px;
  height: 52px;
  border: 2px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const Info = styled.div`
  width: 100%;
  min-width: 0;

  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: flex-start;
`;

const Title = styled.h3`
  overflow: hidden;
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Bold};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const DateText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const AttendanceText = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const AttendanceValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t3Bold};
`;

const FailBadge = styled.span`
  margin-left: 4px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const BottomRow = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CertButton = styled(Button)`
  padding: 0;
  color: ${({ theme }) => theme.colors.primaryBomBom};

  &:hover {
    background-color: transparent;
    text-decoration: underline;
  }
`;
