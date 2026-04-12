import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';

import ArrowIcon from '@/components/icons/ArrowIcon';
import CompassIcon from '#/assets/svg/compass.svg';
import PostboxIcon from '#/assets/svg/postbox.svg';

interface EmptyLetterCardProps {
  title: string;
}

function EmptyLetterCard({ title }: EmptyLetterCardProps) {
  return (
    <Container>
      <PostboxIconWrapper>
        <PostboxIcon width={160} height={160} />
      </PostboxIconWrapper>

      <EmptyTitle>{title}</EmptyTitle>

      <DescriptionWrapper>
        <Lead>뉴스레터를 구독하고 봄봄에서 편리하게 관리해보세요.</Lead>
        <Support>
          구독한 뉴스레터들이 여기에 깔끔하게 정리되어 나타납니다.
        </Support>
      </DescriptionWrapper>

      <LinkButton to="/">
        <CompassIcon width={16} height={16} />
        추천 뉴스레터 보기
        <StyledArrowIcon direction="right" />
      </LinkButton>
    </Container>
  );
}

export default EmptyLetterCard;

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 1.375rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const PostboxIconWrapper = styled.div`
  padding: 2.875rem;
`;

const EmptyTitle = styled.h2`
  background: linear-gradient(90deg, #181818 0%, #f96 100%);
  background-clip: text;
  font: ${({ theme }) => theme.fonts.heading2};
  text-align: center;

  -webkit-text-fill-color: transparent;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
`;

const Lead = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
  text-align: center;
`;

const Support = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
  text-align: center;
`;

const LinkButton = styled(Link)`
  padding: 0.625rem 0.75rem;
  border-radius: 0.75rem;

  display: flex;
  gap: 0.25rem;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.body1};

  transition: all 0.2s ease;

  &:hover {
    filter: brightness(0.9);
  }
`;

const StyledArrowIcon = styled(ArrowIcon)`
  width: 1.125rem;
  height: 1.125rem;
`;
