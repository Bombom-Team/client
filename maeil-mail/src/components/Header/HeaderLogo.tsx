import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import MaeilMailLogo from '@/assets/svg/maeilmail-logo.svg';
import { useDevice } from '@bombom/shared/ui-web';

const HeaderLogo = () => {
  const device = useDevice();

  return (
    <Container
      to="/"
      onClick={() =>
        trackEvent({
          category: 'Navigation',
          action: 'Click MaeilMail Logo (Mobile)',
          label: 'Go to MaeilMail Home',
        })
      }
    >
      <MaeilMailLogo height={device === 'mobile' ? 24 : 36} />
    </Container>
  );
};

export default HeaderLogo;

const Container = styled(Link)`
  display: flex;
  gap: 18px;
  align-items: center;
`;
