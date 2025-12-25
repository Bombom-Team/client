import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import type { Device } from '@/hooks/useDevice';
import textLogo from '#/assets/avif/bombom-text-logo.avif';
import logo from '#/assets/avif/logo.avif';

interface HeaderLogoProps {
  device: Device;
}

const HeaderLogo = ({ device }: HeaderLogoProps) => {
  return (
    <Container
      to="/today"
      onClick={() =>
        trackEvent({
          category: 'Navigation',
          action: 'Click Logo (Mobile)',
          label: 'Go to Home',
        })
      }
    >
      <Logo src={logo} alt="logo" />
      <TitleBox>
        <TextLogo src={textLogo} alt="text logo" />
        {device === 'pc' && (
          <SubTitle>당신의 하루에 찾아오는 작은 설렘</SubTitle>
        )}
      </TitleBox>
    </Container>
  );
};

export default HeaderLogo;

const Container = styled(Link)`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const Logo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 16px;
`;

const TextLogo = styled.img`
  width: 42px;
`;

const TitleBox = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  justify-content: center;
`;

const SubTitle = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
