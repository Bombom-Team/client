import styled from '@emotion/styled';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text/Text';
import { useDevice } from '@/hooks/useDevice';
import InfoIcon from '#/assets/svg/info-circle.svg';

const ReviewNotice = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      <Flex gap={6} align="center">
        <InfoIcon width={18} height={18} />
        <Title>챌린지 리뷰 안내</Title>
      </Flex>
      <Description>
        이번 챌린지에서 경험한 좋았던 점, 아쉬웠던 점을 자유롭게 남겨주세요.
        여러분의 솔직한 리뷰는 서비스 개선에 큰 도움이 됩니다.
      </Description>
      <NoticeBox>
        <Text color="textSecondary" font="t5Regular" as="p">
          · 챌린지 마지막 날에는{' '}
          <Highlight>코멘트 대신에 리뷰를 작성해도 참여로 인정돼요.</Highlight>{' '}
          한 줄 코멘트도 자유롭게 남길 수 있어요.
        </Text>
        <Text color="textSecondary" font="t5Regular" as="p">
          · 비밀글로 설정하면 다른 참여자에게는 공개되지 않아요.
        </Text>
        <Text color="textSecondary" font="t5Regular" as="p">
          · 작성하신 리뷰는 봄봄 서비스 개선 및 챌린지 홍보 목적으로 활용될 수
          있어요.
        </Text>
        <Text color="textSecondary" font="t5Regular" as="p">
          · 홍보에 사용되는 경우, 리뷰 내용만 노출되며 개인을 특정할 수 있는
          정보는 포함되지 않아요.
        </Text>
      </NoticeBox>
    </Container>
  );
};

export default ReviewNotice;

const Container = styled.section<{ isMobile: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 16px;

  display: flex;
  gap: 10px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  line-height: 1.6;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font-weight: 600;
`;

const NoticeBox = styled.div`
  padding: 12px;
  border-radius: 8px;

  display: flex;
  gap: 8px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.backgroundHover};
`;
