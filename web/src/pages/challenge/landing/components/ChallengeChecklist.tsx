import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import { useDevice, type Device } from '@/hooks/useDevice';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';
import CheckIcon from '#/assets/svg/check-circle.svg';

const ChallengeChecklist = () => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  return (
    <Container ref={visibleRef} isVisible={isVisible} device={device}>
      <Title>
        챌린지 참여 전 체크리스트
        <CheckIcon
          width={device === 'mobile' ? 20 : 32}
          height={device === 'mobile' ? 20 : 32}
          fill={theme.colors.primary}
        />
      </Title>
      <ContentWrapper device={device}>
        <ChecklistCard device={device}>
          <Flex align="center" gap={device === 'mobile' ? 8 : 12}>
            <ItemNumber device={device}>1</ItemNumber>
            <ItemTitle device={device}>
              봄봄에 회원 가입을 완료해주세요
            </ItemTitle>
          </Flex>
          <ItemContent>
            <ItemDescription device={device}>
              가입하고 신청하기 버튼만 누르면 완료!{'\n'}
              공식스토어에서 봄봄 앱을 설치하면 더 편하게 참여할 수 있어요.
            </ItemDescription>
            <ItemNote>* Google Play, App Store 지원</ItemNote>
          </ItemContent>
        </ChecklistCard>
        <ChecklistCard device={device}>
          <Flex align="center" gap={device === 'mobile' ? 8 : 12}>
            <ItemNumber device={device}>2</ItemNumber>
            <ItemTitle device={device}>
              매일 발행되는 뉴스레터를 구독해주세요
            </ItemTitle>
          </Flex>
          <ItemContent>
            <ItemDescription device={device}>
              원활한 챌린지 진행을 위해 매일 발행되는 뉴스레터를 한 가지 이상
              구독해주세요!{'\n'}
              단, 특정일에만 발행되는 뉴스레터를 읽어도 참여로 인정돼요.
            </ItemDescription>
            <ItemNote>
              * 예시: 매일/화요일마다 발행되는 뉴스레터 2개를 구독 중 → 화요일
              뉴스레터를 읽고 챌린지 참여 가능
            </ItemNote>
          </ItemContent>
        </ChecklistCard>
      </ContentWrapper>
    </Container>
  );
};

export default ChallengeChecklist;

const Container = styled.section<{ device: Device; isVisible: boolean }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'pc' ? 'min(80%, 1024px)' : '100%')};
  padding-top: 24px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in-up 1s ease forwards' : 'none'};

  opacity: 0;

  transform: translate3d(0, 40px, 0);

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '0 8px' : '0 60px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  display: flex;
  gap: 8px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t13Bold};
`;

const ChecklistCard = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '12px 8px' : '24px')};
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgb(0 0 0 / 8%);

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '24px')};
  flex-direction: column;

  background: rgb(255 255 255 / 40%);

  backdrop-filter: blur(20px);
`;

const ItemNumber = styled.span<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '28px' : '32px')};
  height: ${({ device }) => (device === 'mobile' ? '28px' : '32px')};
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const ItemContent = styled.div`
  padding: 0 8px;

  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const ItemTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t7Bold : theme.fonts.t10Bold};
`;

const ItemDescription = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t6Regular : theme.fonts.t7Regular};
`;

const ItemNote = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
