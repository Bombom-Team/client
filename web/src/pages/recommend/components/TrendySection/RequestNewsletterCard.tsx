import { Flex } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { NEWSLETTER_REQUEST_FORM_URL } from '../../constants/newsletter';
import { useDevice } from '@/hooks/useDevice';
import { openExternalLink } from '@/utils/externalLink';
import MailIcon from '#/assets/svg/mail.svg';
import PlusIcon from '#/assets/svg/plus.svg';

const RequestNewsletterCard = () => {
  const device = useDevice();

  const requestAddNewsletter = () => {
    openExternalLink(NEWSLETTER_REQUEST_FORM_URL);
  };

  return (
    <Container
      type="button"
      onClick={requestAddNewsletter}
      aria-label="찾는 뉴스레터가 없다면 등록 요청하기"
    >
      <IconSlot align="center" justify="center">
        <PlusIcon
          width={device === 'mobile' ? 12 : 14}
          height={device === 'mobile' ? 12 : 14}
        />
        <MailIcon
          width={device === 'mobile' ? 20 : 24}
          height={device === 'mobile' ? 20 : 24}
        />
      </IconSlot>
      <InfoBox>
        <Title>뉴스레터 등록 요청</Title>
        <Description>
          찾는 뉴스레터가 없다면 등록을 요청할 수 있어요.
        </Description>
      </InfoBox>
    </Container>
  );
};

export default RequestNewsletterCard;

const Container = styled.button`
  width: 100%;
  height: 80px;
  padding: 12px;
  border: 1.5px dashed ${({ theme }) => theme.colors.primaryLight};
  border-radius: 16px;

  display: flex;
  gap: 12px;
  align-items: center;

  background: ${({ theme }) => theme.colors.white};
  text-align: left;

  box-sizing: border-box;

  cursor: pointer;

  transition:
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;

  &:hover {
    box-shadow: 0 8px 25px -8px rgb(254 94 4 / 20%);

    background: ${({ theme }) => theme.colors.primaryInfo};

    border-color: ${({ theme }) => theme.colors.primaryBomBom};
  }
`;

const IconSlot = styled(Flex)`
  width: 64px;
  height: 64px;
  border-radius: 16px;

  flex-shrink: 0;

  background: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const InfoBox = styled.div`
  min-height: 64px;

  display: flex;
  gap: 4px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.span`
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t6Bold};
  line-height: 1;
`;

const Description = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
