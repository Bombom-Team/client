import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import textLogo from '#/assets/avif/bombom-text-logo.avif';
import logo from '#/assets/avif/logo.avif';

const HeaderLogo = () => {
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
      </TitleBox>
    </Container>
  );
};

export default HeaderLogo;

const Container = styled(Link)`
  display: flex;
  gap: 1.125rem;
  align-items: center;
`;

const Logo = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
`;

const TextLogo = styled.img`
  width: 2.75rem;
`;

const TitleBox = styled.div`
  display: flex;
  gap: 0.25rem;
  flex-direction: column;
  justify-content: center;
`;
