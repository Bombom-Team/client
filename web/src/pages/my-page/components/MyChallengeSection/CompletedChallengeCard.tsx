import styled from '@emotion/styled';
import CertificateModal from './CertificateModal';
import { MEDAL_COLORS } from '../../constants/challenge';
import Button from '@/components/Button/Button';
import useModal from '@/components/Modal/useModal';
import type { MyCompletedChallenge } from '@/apis/members/members.api';
import MedalBronzeIcon from '#/assets/svg/medal-bronze.svg';
import MedalGoldIcon from '#/assets/svg/medal-gold.svg';
import MedalSilverIcon from '#/assets/svg/medal-silver.svg';

type Grade = MyCompletedChallenge['grade'];

const MEDAL_ICON: Partial<
  Record<Grade, React.ComponentType<React.SVGProps<SVGSVGElement>>>
> = {
  GOLD: MedalGoldIcon,
  SILVER: MedalSilverIcon,
  BRONZE: MedalBronzeIcon,
};

const GRADE_COLOR: Partial<Record<Grade, string>> = {
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

  const MedalIcon = MEDAL_ICON[grade];
  const gradeColor = GRADE_COLOR[grade];

  return (
    <>
      <Container>
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
              </AttendanceText>
              <CertButton variant="transparent" onClick={openModal}>
                수료증 확인
              </CertButton>
            </BottomRow>
          </Info>
        </Content>
      </Container>

      <CertificateModal
        challengeId={challengeId}
        modalRef={modalRef}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </>
  );
};

export default CompletedChallengeCard;

const Container = styled.div`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  gap: 12px;
  align-items: center;

  box-sizing: border-box;
`;

const Content = styled.div`
  min-width: 0;
  flex: 1;
`;

const MedalCircle = styled.div<{ gradeColor?: string }>`
  width: 52px;
  height: 52px;
  border-radius: 50%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme, gradeColor }) =>
    gradeColor ? `${gradeColor}20` : theme.colors.dividers};
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
  min-width: 0;

  display: flex;
  gap: 4px;
  flex-direction: column;
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

const BottomRow = styled.div`
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
