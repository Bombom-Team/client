import styled from '@emotion/styled';
import NewsletterSubscribeGuide from './NewsletterSubscribeGuide';

interface DetailTabProps {
  newsletterDescription: string;
  newsletterId: number;
  isSubscribed: boolean | undefined;
  isMobile: boolean;
}

const DetailTab = ({ newsletterDescription, isMobile }: DetailTabProps) => {
  return (
    <Container isMobile={isMobile}>
      <Description>{newsletterDescription}</Description>
      {!isMobile && <NewsletterSubscribeGuide />}
    </Container>
  );
};

export default DetailTab;

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};
  flex-direction: column;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
`;
