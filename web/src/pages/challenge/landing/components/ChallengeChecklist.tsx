import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { useDevice, type Device } from '@/hooks/useDevice';
import CheckIcon from '#/assets/svg/check-circle.svg';

const ChallengeChecklist = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <Title device={device}>
        챌린지 참여 전 체크리스트
        <CheckIcon
          width={device === 'mobile' ? 28 : 32}
          height={device === 'mobile' ? 28 : 32}
          fill={theme.colors.primary}
        />
      </Title>
      <ContentWrapper device={device}>
        <ChecklistCard device={device}>
          <ItemNumber device={device}>1</ItemNumber>
          <ItemContent>
            <ItemTitle device={device}>
              봄봄에 회원 가입을 완료해주세요
            </ItemTitle>
            <ItemDescription device={device}>
              가입하고 신청하기 버튼만 누르면 완료!{'\n'}
              공식스토어에서 봄봄 앱을 설치하면 더 편하게 참여할 수 있어요.
            </ItemDescription>
            <ItemNote device={device}>* Google Play, App Store 지원</ItemNote>
          </ItemContent>
        </ChecklistCard>
        <ChecklistCard device={device}>
          <ItemNumber device={device}>2</ItemNumber>
          <ItemContent>
            <ItemTitle device={device}>
              매일 발행되는 뉴스레터를 구독해주세요
            </ItemTitle>
            <ItemDescription device={device}>
              원활한 챌린지 진행을 위해 매일 발행되는 뉴스레터를 한 가지 이상
              구독해주세요!{'\n'}
              단, 특정일에만 발행되는 뉴스레터를 읽어도 참여로 인정돼요.
            </ItemDescription>
            <ItemNote device={device}>
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

const Container = styled.section<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'pc' ? '1084px' : '100%')};
  padding: ${({ device }) =>
    device === 'mobile' ? '64px 0 54px' : '96px 0 60px'};

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '0 8px' : '0 60px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2<{ device: Device }>`
  display: flex;
  gap: 8px;
  align-items: center;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading2};
`;

const ChecklistCard = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '12px 8px' : '24px')};
  border: 2px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: 20px;
  box-shadow: 0 4px 8px rgb(0 0 0 / 8%);

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '24px')};

  background-color: ${({ theme }) => theme.colors.white};
`;

const ItemNumber = styled.div<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '28px' : '32px')};
  height: ${({ device }) => (device === 'mobile' ? '28px' : '32px')};
  margin-top: 2px;
  border-radius: 50%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const ItemContent = styled.div`
  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const ItemTitle = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
`;

const ItemDescription = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
`;

const ItemNote = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body2};
`;
