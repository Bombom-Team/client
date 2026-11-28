import styled from '@emotion/styled';
import { formatCount, formatRate } from '../utils/formatStats';
import type { GetNotificationStatsResponse } from '@/apis/notificationStats/notificationStats.api';

const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0);

interface NotificationSummaryProps {
  stats: GetNotificationStatsResponse;
}

const NotificationSummary = ({ stats }: NotificationSummaryProps) => {
  const memberCategories = stats.categories.filter(
    ({ deliveryMode, statusCounts }) =>
      deliveryMode === 'MEMBER' && statusCounts !== null,
  );
  const sent = sum(
    memberCategories.map(({ statusCounts }) => statusCounts?.SENT ?? 0),
  );
  const opened = sum(memberCategories.map(({ openedOfSent }) => openedOfSent));
  const openRate = sent > 0 ? opened / sent : null;
  const eventOpened = sum(
    stats.categories
      .filter(({ deliveryMode }) => deliveryMode === 'TOPIC')
      .map(({ openedOfSent }) => openedOfSent),
  );

  return (
    <Container aria-label="기간 요약">
      <HeadingWrapper>
        <Title>회원별 알림 성과</Title>
        <ScopeText>이벤트 제외</ScopeText>
      </HeadingWrapper>
      <Metrics>
        <HeroTile>
          <dt>열림률</dt>
          <HeroValue>
            {openRate === null ? '계산 불가' : formatRate(openRate)}
          </HeroValue>
        </HeroTile>
        <Tile>
          <dt>기간 내 발송</dt>
          <Value>
            {formatCount(sent)}
            <Unit>건</Unit>
          </Value>
        </Tile>
        <Tile>
          <dt>열린 알림</dt>
          <Value>
            {formatCount(opened)}
            <Unit>건</Unit>
          </Value>
        </Tile>
      </Metrics>
      <OtherMetrics>
        <span>
          이벤트 열림 <strong>{formatCount(eventOpened)}건</strong>
        </span>
      </OtherMetrics>
    </Container>
  );
};

export default NotificationSummary;

const Container = styled.section`
  overflow: hidden;
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r4);

  background-color: var(--seed-color-bg-layer-default);
`;
const HeadingWrapper = styled.div`
  padding: var(--seed-dimension-x5) var(--seed-dimension-x6) 0;

  display: flex;
  gap: var(--seed-dimension-x2) var(--seed-dimension-x4);
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
`;
const Title = styled.h2`
  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t7);
`;
const ScopeText = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
`;
const Metrics = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
`;
const Tile = styled.div`
  padding: var(--seed-dimension-x5) var(--seed-dimension-x6);

  display: grid;
  gap: var(--seed-dimension-x2);
  align-content: start;

  dt {
    color: var(--seed-color-fg-neutral-muted);
    font-weight: var(--seed-font-weight-medium);
  }
`;
const HeroTile = styled(Tile)`
  color: var(--seed-color-palette-carrot-800);
`;
const Value = styled.dd`
  display: flex;
  gap: var(--seed-dimension-x2);
  align-items: baseline;

  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t12);
  line-height: var(--seed-line-height-t13);

  font-variant-numeric: tabular-nums;
`;
const HeroValue = styled(Value)`
  font-size: var(--seed-font-size-t13);
`;
const Unit = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-weight: var(--seed-font-weight-medium);
  font-size: var(--seed-font-size-t5);
`;
const OtherMetrics = styled.div`
  padding: var(--seed-dimension-x3) var(--seed-dimension-x6);
  border-top: 1px solid var(--seed-color-stroke-neutral-weak);

  display: flex;
  gap: var(--seed-dimension-x3) var(--seed-dimension-x6);
  flex-wrap: wrap;

  background-color: var(--seed-color-bg-layer-fill);
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);

  strong {
    margin-left: var(--seed-dimension-x2);

    color: var(--seed-color-fg-neutral);
    font-weight: var(--seed-font-weight-medium);
  }
`;
