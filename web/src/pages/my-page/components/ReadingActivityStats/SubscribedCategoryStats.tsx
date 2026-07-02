import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { queries } from '@/apis/queries';
import type {
  CategoryStatsResponse,
  GetCategoryStatsParams,
} from '@/apis/members/members.api';

interface Props {
  isMobile: boolean;
  params: GetCategoryStatsParams;
}

const CATEGORY_COLORS = [
  '#FE5E04',
  '#2878F0',
  '#7C2CF4',
  '#36A65C',
  '#FFA400',
  '#E94F8A',
  '#00A6A6',
  '#8A6D3B',
];

const SubscribedCategoryStats = ({ isMobile, params }: Props) => {
  const { data: stats, isLoading } = useQuery(queries.categoryStats(params));

  const categories = buildCategorySegments(stats?.categories ?? []);

  return (
    <Container isMobile={isMobile}>
      <Header>
        <Title>이번 달에 읽은 뉴스레터 카테고리</Title>
      </Header>
      {isLoading ? (
        <Message>카테고리 통계를 불러오는 중이에요.</Message>
      ) : categories.length === 0 ? (
        <Message>해당 기간에 읽은 카테고리가 없어요.</Message>
      ) : (
        <ContentWrapper isMobile={isMobile}>
          <DonutChart
            segments={categories.map(({ segment }) => segment).join(', ')}
          />
          <LegendList isMobile={isMobile}>
            {categories.map((category) => (
              <LegendItem key={category.id} isMobile={isMobile}>
                <CategoryWrapper>
                  <ColorDot color={category.color} />
                  <CategoryName>{category.name}</CategoryName>
                </CategoryWrapper>
                <CategoryValue isMobile={isMobile}>
                  <CategoryCount>{category.count}개</CategoryCount>
                  <CategoryPercent>{category.percent}%</CategoryPercent>
                </CategoryValue>
              </LegendItem>
            ))}
          </LegendList>
        </ContentWrapper>
      )}
    </Container>
  );
};

export default SubscribedCategoryStats;

const buildCategorySegments = (
  categories: CategoryStatsResponse['categories'],
) => {
  let accumulatedRate = 0;

  return [...categories]
    .sort((first, second) => second.count - first.count)
    .map((category, index) => {
      const start = accumulatedRate;
      accumulatedRate += category.percent;
      const color =
        CATEGORY_COLORS[index % CATEGORY_COLORS.length] ?? '#FE5E04';

      return {
        ...category,
        color,
        segment: `${color} ${start}% ${accumulatedRate}%`,
      };
    });
};

const Container = styled.article<{ isMobile: boolean }>`
  min-width: 0;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 16px;

  display: flex;
  gap: 24px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;

  grid-column: ${({ isMobile }) => (isMobile ? '1 / -1' : 'auto')};
`;

const Header = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const Message = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const ContentWrapper = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 16px;
  align-items: ${({ isMobile }) => (isMobile ? 'flex-start' : 'center')};
`;

const DonutChart = styled.div<{ segments: string }>`
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;

  flex-shrink: 0;

  background: conic-gradient(${({ segments }) => segments});

  &::after {
    position: absolute;
    width: 64px;
    height: 64px;
    border-radius: 50%;

    background-color: ${({ theme }) => theme.colors.white};

    content: '';
    inset: 28px;
  }
`;

const LegendList = styled.ul<{ isMobile: boolean }>`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const LegendItem = styled.li<{ isMobile: boolean }>`
  min-width: 0;

  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;

const CategoryWrapper = styled.div`
  min-width: 0;

  display: flex;
  gap: 8px;
  align-items: center;
`;

const ColorDot = styled.span<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  flex-shrink: 0;

  background-color: ${({ color }) => color};
`;

const CategoryName = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t4Regular};
  white-space: nowrap;
`;

const CategoryValue = styled.span<{ isMobile: boolean }>`
  width: auto;

  display: flex;
  gap: 8px;
  flex-shrink: 0;
  align-items: baseline;
  justify-content: ${({ isMobile }) =>
    isMobile ? 'space-between' : 'flex-start'};

  font: ${({ theme }) => theme.fonts.t4Regular};
`;

const CategoryCount = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CategoryPercent = styled.strong`
  min-width: 36px;

  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ theme }) => theme.fonts.t5Bold};
  text-align: right;
`;
