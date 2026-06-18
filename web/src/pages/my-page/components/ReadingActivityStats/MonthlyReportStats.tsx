import { monthlyReportQueries } from '@bombom/shared/apis/monthlyreport';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import Text from '@/components/Text';
import KidStarIcon from '#/assets/svg/kid-star.svg';
import MenuBookIcon from '#/assets/svg/menu-book.svg';

interface Props {
  year: number;
  month: number;
  isMobile?: boolean;
}

const COLORS = {
  cardBorder: '#E9E2DD',
  iconBg: '#FFF8F4',
  brand: '#FE5E04',
  label: '#222222',
  value: '#111111',
  pillBorder: '#D7DDE4',
  pillText: '#58708A',
  newsletterText: '#444444',
} as const;

const CHANGE_ARROW: Record<'UP' | 'DOWN' | 'SAME', string> = {
  UP: '↑',
  DOWN: '↓',
  SAME: '',
};

const MonthlyReportStats = ({ year, month, isMobile = false }: Props) => {
  const { data } = useQuery(
    monthlyReportQueries.getReadingDashboard({ year, month, limit: 3 }),
  );

  const changeRate = data?.readArticleChangeRate ?? null;
  const changeDirection = data?.readArticleChangeDirection ?? null;
  const newsletters = data?.frequentReadNewsletters ?? [];

  return (
    <Row isMobile={isMobile}>
      <SummaryCard>
        <Stat>
          <StatRow>
            <IconBox>
              <StatIcon as={MenuBookIcon} aria-hidden="true" />
            </IconBox>
            <StatTextGroup>
              <StatLabel font="t4Bold">읽은 아티클</StatLabel>
              <StatValue font="t11Bold">
                {data?.readArticleCount ?? 0}
                <StatUnit font="t4Bold">개</StatUnit>
              </StatValue>
              {changeRate !== null && changeDirection !== null && (
                <ChangePill font="t2Bold">
                  {CHANGE_ARROW[changeDirection]}{' '}
                  {Math.round(Math.abs(changeRate))}% 지난 달 대비
                </ChangePill>
              )}
            </StatTextGroup>
          </StatRow>
        </Stat>

        <Divider />

        <Stat>
          <StatRow>
            <IconBox>
              <StatIcon as={KidStarIcon} aria-hidden="true" />
            </IconBox>
            <StatTextGroup>
              <StatLabel font="t4Bold">북마크 개수</StatLabel>
              <StatValue font="t11Bold">
                {data?.bookmarkCount ?? 0}
                <StatUnit font="t4Bold">개</StatUnit>
              </StatValue>
            </StatTextGroup>
          </StatRow>
        </Stat>
      </SummaryCard>

      <NewslettersCard>
        <NewslettersTitle>내가 자주 읽는 뉴스레터 TOP 3</NewslettersTitle>
        <NewsletterList>
          {newsletters.map((newsletter) => (
            <NewsletterRow key={newsletter.newsletterId}>
              <RankBadge font="t2Bold" color="white">
                {newsletter.rank}
              </RankBadge>
              <NewsletterName font="t4Regular">
                {newsletter.name}
              </NewsletterName>
              <NewsletterCount font="t4Regular">
                {newsletter.readCount}개
              </NewsletterCount>
            </NewsletterRow>
          ))}
        </NewsletterList>
      </NewslettersCard>
    </Row>
  );
};

export default MonthlyReportStats;

const Row = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: 16px;
  flex-direction: ${({ isMobile }) => (isMobile ? 'column' : 'row')};
  align-items: stretch;
`;

const SummaryCard = styled.article`
  min-width: 0;
  padding: 16px 20px;
  border: 1px solid ${COLORS.cardBorder};
  border-radius: 20px;

  display: flex;
  gap: 20px;
  flex: 1.7;
  align-items: stretch;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const Stat = styled.div`
  min-width: 0;

  display: flex;
  gap: 12px;
  flex: 1;
  flex-direction: column;
`;

const StatRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${COLORS.iconBg};
`;

const StatIcon = styled.svg`
  width: 24px;
  height: 24px;

  display: block;

  color: ${COLORS.brand};
`;

const StatTextGroup = styled.div`
  min-width: 0;

  display: flex;
  gap: 4px;
  flex-direction: column;
`;

const StatLabel = styled(Text)`
  && {
    color: ${COLORS.label};
  }
`;

const StatValue = styled(Text)`
  && {
    color: ${COLORS.value};
  }
`;

const StatUnit = styled(Text)`
  && {
    color: ${COLORS.value};
  }
`;

const ChangePill = styled(Text)`
  align-self: flex-start;
  padding: 6px 12px;
  border: 1px solid ${COLORS.pillBorder};
  border-radius: 12px;

  && {
    color: ${COLORS.pillText};
  }
`;

const Divider = styled.div`
  width: 1px;

  flex-shrink: 0;

  background-color: ${COLORS.cardBorder};
`;

const NewslettersCard = styled.article`
  min-width: 0;
  padding: 16px 20px;
  border: 1px solid ${COLORS.cardBorder};
  border-radius: 20px;

  display: flex;
  gap: 12px;
  flex: 1;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const NewslettersTitle = styled.h3`
  margin: 0;

  color: ${COLORS.label};
  font: ${({ theme }) => theme.fonts.t4Bold};
`;

const NewsletterList = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

const NewsletterRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const RankBadge = styled(Text)`
  width: 18px;
  height: 18px;
  border-radius: 50%;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${COLORS.brand};
`;

const NewsletterName = styled(Text)`
  min-width: 0;

  overflow: hidden;

  text-overflow: ellipsis;
  white-space: nowrap;

  && {
    color: ${COLORS.newsletterText};
  }
`;

const NewsletterCount = styled(Text)`
  margin-left: auto;

  flex-shrink: 0;

  && {
    color: ${COLORS.newsletterText};
  }
`;
