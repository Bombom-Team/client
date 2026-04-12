import styled from '@emotion/styled';
import Button from '@/components/Button/Button';
import Text from '@/components/Text';
import { useDevice, type Device } from '@/hooks/useDevice';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { MouseEvent } from 'react';

interface ChallengeApplySectionProps {
  challengeName: string;
  onApply: (e: MouseEvent) => void;
}

const ChallengeApplySection = ({
  challengeName,
  onApply,
}: ChallengeApplySectionProps) => {
  const device = useDevice();

  const handleApplyClick = (e: MouseEvent) => {
    e.stopPropagation();
    onApply(e);

    trackEvent({
      category: 'Challenge',
      action: '신청하기 버튼 클릭',
      label: challengeName,
    });
  };

  return (
    <Container device={device}>
      <Title device={device}>지금 바로 시작하세요</Title>
      <ApplicantButton device={device} onClick={handleApplyClick}>
        챌린지 참여하기
      </ApplicantButton>
      <Text color="textTertiary" font="caption">
        © 2026 Bombom. All rights reserved.
      </Text>
    </Container>
  );
};

export default ChallengeApplySection;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) =>
    device === 'mobile' ? '3rem 0.75rem' : '7.5rem 3.75rem'};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '1.5rem' : '2rem')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.navy};
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.white};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading1};
  text-align: center;
`;

const ApplicantButton = styled(Button)<{ device: Device }>`
  padding: ${({ device }) =>
    device === 'mobile' ? '1rem 1.5rem' : '1.25rem 2.25rem'};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};

  &:hover {
    opacity: 0.8;
  }
`;
