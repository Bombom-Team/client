import styled from '@emotion/styled';
import { formatEventDateTime, extractKSTDate } from '../utils/date';
import Flex from '@/components/Flex';
import { useDevice } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { Device } from '@/hooks/useDevice';

const ROUND_START = {
  first: '2026-02-18T20:00:00+09:00',
  second: '2026-02-21T20:00:00+09:00',
} as const;

interface EventHeroProps {
  onShowNotice: () => void;
}

const EventHero = ({ onShowNotice }: EventHeroProps) => {
  const device = useDevice();

  const today = extractKSTDate(new Date());
  const firstRoundDeadline = extractKSTDate(new Date(ROUND_START.first));
  const secondRoundDeadline = extractKSTDate(new Date(ROUND_START.second));

  const isFirstRoundComplete = today > firstRoundDeadline;
  const isSecondRoundComplete = today > secondRoundDeadline;

  const handleApplyClick = () => {
    onShowNotice();

    trackEvent({
      category: 'Event',
      action: '선착순 경품 받기 버튼 클릭',
      label: formatEventDateTime(new Date()),
    });
  };

  return (
    <Container device={device}>
      <ContentWrapper device={device}>
        <DecorativeCircle
          style={{
            backgroundColor: '#f9a8d4',
            left: '20px',
            top: '80px',
            width: '80px',
            height: '80px',
            opacity: 0.6,
          }}
        />
        <DecorativeCircle
          style={{
            backgroundColor: '#93c5fd',
            right: '20px',
            bottom: '80px',
            width: '64px',
            height: '64px',
            opacity: 0.6,
          }}
        />
        <DecorativeCircle
          style={{
            backgroundColor: '#c084fc',
            right: '16px',
            top: '160px',
            width: '32px',
            height: '32px',
          }}
        />

        <Flex direction="column" align="center" justify="center">
          <HeroBadge device={device}>
            봄봄 회원가입 500명 돌파 기념 EVENT
          </HeroBadge>
          <HeroImage src="/assets/png/event-logo.png" alt="" device={device} />
        </Flex>

        <Title device={device}>
          봄봄 유저
          <br />
          선착순 70명에게 쏩니다!
        </Title>

        <InfoCard device={device}>
          <InfoCardBadge device={device}>선착순 100% 당첨</InfoCardBadge>
          <InfoRow>
            <InfoLabel device={device}>참여대상</InfoLabel>
            <InfoValue device={device}>봄봄 회원가입 유저</InfoValue>
          </InfoRow>
          <InfoRowDivider />
          <InfoRow>
            <InfoLabel device={device}>1회</InfoLabel>
            <InfoValue device={device} isCompleted={isFirstRoundComplete}>
              {`${formatEventDateTime(new Date(ROUND_START.first))} (35명)`}
            </InfoValue>
            {isFirstRoundComplete && (
              <CompletedStamp device={device}>마감</CompletedStamp>
            )}
          </InfoRow>
          <InfoRow>
            <InfoLabel device={device}>2회</InfoLabel>
            <InfoValue device={device} isCompleted={isSecondRoundComplete}>
              {`${formatEventDateTime(new Date(ROUND_START.second))} (35명)`}
            </InfoValue>
            {isSecondRoundComplete && (
              <CompletedStamp device={device}>마감</CompletedStamp>
            )}
          </InfoRow>
          <InfoRowDivider />
          <InfoRow>
            <InfoLabel device={device}>당첨자 발표</InfoLabel>
            <InfoValue device={device}>당첨 즉시 지급</InfoValue>
          </InfoRow>
        </InfoCard>

        <ApplyButton type="button" device={device} onClick={handleApplyClick}>
          선착순 경품 받기
        </ApplyButton>
      </ContentWrapper>
    </Container>
  );
};

export default EventHero;

const Container = styled.section<{ device: Device }>`
  z-index: ${({ theme }) => theme.zIndex.base};
  width: 100%;
  border-bottom: 4px solid ${({ theme }) => theme.colors.black};

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: #cf0;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.content};
  width: 100%;
  max-width: 1084px;
  padding: ${({ theme, device }) => {
    if (device === 'mobile') {
      return `calc(${theme.heights.headerMobile} + 12px) 24px 48px`;
    }
    return `calc(${theme.heights.headerPC} + 12px) 24px 44px`;
  }};

  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const DecorativeCircle = styled.span`
  position: absolute;
  z-index: ${({ theme }) => theme.zIndex.behind};
  border: 2px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 50%;
`;

const HeroBadge = styled.div<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '4px 12px' : '8px 14px')};
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 32px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.bodyLarge};
  font-weight: 700;
  text-align: center;

  transform: rotate(-2deg);
`;

const ApplyButton = styled.button<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '16px 32px' : '20px 44px')};
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: 24px;
  box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.black};

  background-color: #d81b60;
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading5 : theme.fonts.heading4};

  &:hover {
    box-shadow: 6px 6px 0 0 ${({ theme }) => theme.colors.black};
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.black};
    transform: translateY(0);
  }
`;

const InfoCard = styled.div<{ device: Device }>`
  position: relative;
  width: 100%;
  max-width: 360px;
  padding: ${({ device }) =>
    device === 'mobile' ? '32px 12px 12px' : '36px 28px 28px'};
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: 16px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '20px' : '24px')};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const InfoCardBadge = styled.div<{ device: Device }>`
  position: absolute;
  top: -16px;
  left: 50%;
  padding: ${({ device }) => (device === 'mobile' ? '4px 12px' : '4px 16px')};
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 32px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.black};

  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.heading6};
  font-weight: 700;
  text-align: center;
  white-space: nowrap;

  transform: translateX(-50%);
`;

const InfoRow = styled.div`
  position: relative;

  display: flex;
  gap: 4px;
  align-items: center;
  justify-content: space-between;
`;

const InfoRowDivider = styled.div`
  margin: -8px 0;
  border-bottom: ${({ theme }) => `2px dashed ${theme.colors.stroke}`};
`;

const InfoLabel = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.icons};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.heading6};
  text-align: center;
`;

const InfoValue = styled.p<{ device: Device; isCompleted?: boolean }>`
  position: relative;

  display: flex;
  gap: 8px;
  align-items: center;

  color: ${({ theme, isCompleted }) =>
    isCompleted ? theme.colors.textTertiary : theme.colors.black};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
  font-weight: 700;
  text-align: left;

  opacity: ${({ isCompleted }) => (isCompleted ? 0.4 : 1)};
  text-decoration: ${({ isCompleted }) =>
    isCompleted ? 'line-through' : 'none'};
`;

const HeroImage = styled.img<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '110%' : '72%')};
  height: auto;
`;

const Title = styled.div<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '8px 16px' : '10px 18px')};
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 8px;
  box-shadow: 2px 2px 0 0 ${({ theme }) => theme.colors.black};

  background-color: rgb(255 255 255 / 80%);
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.heading6};
  text-align: center;
`;

const CompletedStamp = styled.span<{ device: Device }>`
  position: absolute;
  right: 40px;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  padding: ${({ device }) => (device === 'mobile' ? '2px 8px' : '6px 12px')};
  border: 4px solid ${({ theme }) => theme.colors.red};
  border-radius: 4px;
  box-shadow: 2px 2px 1px 0 ${({ theme }) => theme.colors.icons};

  color: ${({ theme }) => theme.colors.red};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
  font-weight: 800;

  transform: rotate(-4deg);
`;
