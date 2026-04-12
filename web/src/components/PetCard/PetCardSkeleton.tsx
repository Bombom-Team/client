import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import {
  attendanceButtonStyles,
  Container,
  PetImageContainer,
  StatusIconWrapper,
  Title,
  TitleWrapper,
} from './PetCard';
import ProgressBarSkeleton from '../ProgressBar/ProgressBarSkeleton';
import Skeleton from '../Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import PetIcon from '#/assets/svg/pet.svg';

const PetCardSkeleton = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      {device === 'pc' && (
        <TitleWrapper>
          <StatusIconWrapper>
            <PetIcon width={16} height={16} color={theme.colors.white} />
          </StatusIconWrapper>
          <Title>봄이</Title>
        </TitleWrapper>
      )}
      <PetImageContainer>
        <Skeleton width="7.5rem" height="7.5rem" borderRadius="0.75rem" />
      </PetImageContainer>

      <Skeleton width="6.25rem" height="1rem" />

      <ProgressBarSkeleton hasCaption={true} />

      <AttendanceButtonWrapper device={device}>
        <Skeleton width="100%" height="2rem" />
      </AttendanceButtonWrapper>
    </Container>
  );
};

export default PetCardSkeleton;

const AttendanceButtonWrapper = styled.div<{ device: Device }>`
  width: 50%;

  ${({ device }) => attendanceButtonStyles[device]}
`;
