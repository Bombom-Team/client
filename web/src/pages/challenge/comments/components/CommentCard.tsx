import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { convertRelativeTime } from '../utils/date';
import Badge from '@/components/Badge/Badge';
import { useDevice, type Device } from '@/hooks/useDevice';
import MailIcon from '#/assets/svg/mail.svg';

export interface CommentCardProps {
  nickname: string;
  newsletterName: string;
  articleTitle: string;
  createdAt: string;
  comment: string;
}

const CommentCard = ({
  nickname,
  newsletterName,
  articleTitle,
  createdAt,
  comment,
}: CommentCardProps) => {
  const device = useDevice();
  const relativeTime = convertRelativeTime(createdAt);

  return (
    <Container device={device}>
      <MetaWrapper>
        <MetaInfo device={device}>
          {nickname} · {relativeTime}
        </MetaInfo>
        <NewsletterBadge device={device} text={newsletterName} />
      </MetaWrapper>
      <TitleWrapper>
        <MailIcon width={16} height={16} color={theme.colors.textSecondary} />
        <ArticleTitle device={device}>{articleTitle}</ArticleTitle>
      </TitleWrapper>
      <Comment device={device}>{comment}</Comment>
    </Container>
  );
};

export default CommentCard;

const Container = styled.article<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '16px' : '20px')};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgb(0 0 0 / 4%);

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '6px' : '8px')};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const MetaWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NewsletterBadge = styled(Badge)<{ device: Device }>`
  padding: 2px 6px;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};
`;

const MetaInfo = styled.span<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const ArticleTitle = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};
`;

const Comment = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};
`;
