import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { BROWSE_NEWSLETTER_IDS } from '../constants/result';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';

interface BrowseNewslettersCardProps {
  newsletterCount: number;
  logoById: Map<number, string>;
  onClick: () => void;
}

const BrowseNewslettersCard = ({
  newsletterCount,
  logoById,
  onClick,
}: BrowseNewslettersCardProps) => {
  const restCount = Math.max(0, newsletterCount - BROWSE_NEWSLETTER_IDS.length);

  return (
    <Container to="/" onClick={onClick}>
      <LogoStack aria-hidden="true">
        {BROWSE_NEWSLETTER_IDS.map((id) => (
          <StackLogo key={id} src={logoById.get(id) ?? ''} alt="" />
        ))}
        <RestCount>+{restCount}</RestCount>
      </LogoStack>
      <Text>
        <Title>뉴스레터 더 둘러보기</Title>
        <Caption>봄봄에 {newsletterCount}개가 있어요</Caption>
      </Text>
      <ArrowIcon viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </ArrowIcon>
    </Container>
  );
};

export default BrowseNewslettersCard;

const Container = styled(Link)`
  margin-top: 0.6cqw;
  padding: 3cqw 3.4cqw;
  border: 1.5px solid ${LITERACY_COLORS.line};
  border-radius: 3.4cqw;

  display: grid;
  gap: 3cqw;
  align-items: center;

  background: ${LITERACY_COLORS.cream};
  color: ${LITERACY_COLORS.ink};

  grid-template-columns: auto minmax(0, 1fr) auto;
  text-decoration: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 2px;
  }
`;

const LogoStack = styled.span`
  display: flex;
  align-items: center;
`;

const StackLogo = styled(ImageWithFallback)`
  width: 8.4cqw;
  height: 8.4cqw;
  border: 0.6cqw solid ${LITERACY_COLORS.cream};
  border-radius: 50%;

  background: ${({ theme }) => theme.colors.white};

  object-fit: contain;

  & + & {
    margin-left: -2.6cqw;
  }
`;

const RestCount = styled.i`
  width: 8.4cqw;
  height: 8.4cqw;
  margin-left: -2.6cqw;
  border: 0.6cqw solid ${LITERACY_COLORS.cream};
  border-radius: 50%;

  display: grid;

  background: ${LITERACY_COLORS.ink};
  color: ${({ theme }) => theme.colors.white};
  font: 800 2.6cqw ${LITERACY_FONTS.body};
  font-style: normal;

  place-items: center;
`;

const Text = styled.span`
  display: grid;
`;

const Title = styled.b`
  overflow: hidden;

  font: 800 max(13px, 3.6cqw) / 1.3 ${LITERACY_FONTS.body};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const Caption = styled.small`
  margin-top: 0.4cqw;

  color: ${LITERACY_COLORS.sub};
  font: 600 max(11px, 2.9cqw) / 1.3 ${LITERACY_FONTS.body};
`;

const ArrowIcon = styled.svg`
  width: 4.6cqw;
  height: 4.6cqw;

  flex: none;
`;
