import { Flex, Button } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import MailIcon from '#/assets/svg/mail.svg';
import PlusIcon from '#/assets/svg/plus.svg';

const RequestNewsletterButton = () => {
  const device = useDevice();
  const navigate = useNavigate();

  const requestAddNewsletter = () => {
    navigate({ to: '/newsletter-requests' });
  };

  return (
    <Container variant="transparent" onClick={requestAddNewsletter}>
      <Flex align="center">
        <PlusIcon
          width={device === 'mobile' ? 12 : 14}
          height={device === 'mobile' ? 12 : 14}
        />
        <MailIcon
          width={device === 'mobile' ? 20 : 24}
          height={device === 'mobile' ? 20 : 24}
        />
      </Flex>
      뉴스레터 등록 요청
    </Container>
  );
};

export default RequestNewsletterButton;

const Container = styled(Button)`
  padding: 8px 12px;

  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;
