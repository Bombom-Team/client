import { Flex, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import RequestNewsletterButton from './RequestNewsletterButton';
import type { Device } from '@bombom/shared/ui-web';
import EmptySearchIcon from '#/assets/svg/empty-search.svg';

const EmptyNewsletter = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <EmptySearchIconWrapper>
        <EmptySearchIcon
          width={device === 'mobile' ? 80 : 120}
          height={device === 'mobile' ? 80 : 120}
        />
      </EmptySearchIconWrapper>

      <Flex direction="column" align="center" gap={8}>
        <EmptyTitle>검색 결과가 없어요</EmptyTitle>
        <Description>다른 검색어나 카테고리를 시도해보세요.</Description>
      </Flex>

      <RequestNewsletterButton />
    </Container>
  );
};

export default EmptyNewsletter;

const Container = styled.div<{ device: Device }>`
  width: 100%;
  height: 100%;
  padding: 60px 24px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? 12 : 20)}px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptySearchIconWrapper = styled.div`
  padding: 0 20px;
`;

const EmptyTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
  text-align: center;

`;

const Description = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  text-align: center;

  word-break: keep-all;
`;
