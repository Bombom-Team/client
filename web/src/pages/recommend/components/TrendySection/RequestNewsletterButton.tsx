import { Flex, Button } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import { openExternalLink } from '@/utils/externalLink';
import MailIcon from '#/assets/svg/mail.svg';
import PlusIcon from '#/assets/svg/plus.svg';

const NEWSLETTER_REQUEST_FORM_URL = 'https://forms.gle/YsQoZSugSFhLvW5YA';

const RequestNewsletterButton = () => {
  const device = useDevice();

  const requestAddNewsletter = () => {
    openExternalLink(NEWSLETTER_REQUEST_FORM_URL);
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
