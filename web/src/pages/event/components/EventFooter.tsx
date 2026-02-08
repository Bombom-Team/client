import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useDevice, type Device } from '@/hooks/useDevice';
import InfoIcon from '#/assets/svg/info-circle.svg';

const NOTICE = [
  '본 이벤트는 기존 회원을 포함하여 봄봄에 회원가입한 고객을 대상으로 합니다.',
  '봄봄에서 지원하는 간편 로그인으로 가입한 모든 회원이 참여 가능합니다.',
  '응모 즉시 당첨 결과가 발표되며, 쿠폰이 발급됩니다.',
  '경품은 선착순으로 지급되며, 양일(13일, 18일) 동안 1인 1회만 수령 가능합니다.',
  '부정 참여 시 당첨이 취소될 수 있습니다.',
];

function EventFooter() {
  const device = useDevice();

  return (
    <Container>
      <FooterWrapper device={device}>
        <FooterHeader>
          <InfoIcon width={16} height={16} color={theme.colors.white} />
          <Title device={device}>꼭 확인하세요</Title>
        </FooterHeader>

        <NoticeList>
          {NOTICE.map((item, index) => {
            return (
              <NoticeListItem key={index} device={device}>
                {item}
              </NoticeListItem>
            );
          })}
        </NoticeList>
      </FooterWrapper>
    </Container>
  );
}

export default EventFooter;

const Container = styled.footer`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.icons};
`;

const FooterWrapper = styled.div<{ device: Device }>`
  width: 100%;
  max-width: 1280px;
  padding: ${({ device }) => (device === 'mobile' ? '24px 12px' : '48px 24px')};

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: flex-start;
`;

const FooterHeader = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Title = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.white};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
  font-weight: 700;
`;

const NoticeList = styled.ul`
  display: flex;
  gap: 12px;
  flex-direction: column;
  justify-content: center;
`;

const NoticeListItem = styled.li<{ device: Device }>`
  position: relative;
  padding-left: 18px;

  color: ${({ theme }) => theme.colors.white};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body3};
  line-height: 1.2;

  &::before {
    position: absolute;
    left: 6px;

    content: '•';
  }
`;
