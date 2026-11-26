import styled from '@emotion/styled';
import {
  CATEGORY_LABELS,
  OPEN_NOT_RECORDED_CATEGORIES,
} from '../constants/notificationCategory';
import { formatCount, formatRate } from '../utils/formatStats';
import type { GetNotificationStatsResponse } from '@/apis/notificationStats/notificationStats.api';

const sum = (values: number[]) =>
  values.reduce((total, value) => total + value, 0);

interface NotificationSummaryProps {
  stats: GetNotificationStatsResponse;
}

// 기간 전체를 한눈에 보는 숫자 4개. 열림률을 대표 지표로 가장 크게 둔다.
const NotificationSummary = ({ stats }: NotificationSummaryProps) => {
  const { categories, reach } = stats;
  const memberCategories = categories.filter(
    ({ deliveryMode, statusCounts }) =>
      deliveryMode === 'MEMBER' && statusCounts !== null,
  );
  // 열림이 기록되지 않는 카테고리를 분모에 넣으면 열림률이 낮아 보이므로 제외한다.
  const rateCategories = memberCategories.filter(
    ({ category }) => !OPEN_NOT_RECORDED_CATEGORIES.includes(category),
  );
  const rateSent = sum(
    rateCategories.map(({ statusCounts }) => statusCounts?.SENT ?? 0),
  );
  const rateOpened = sum(rateCategories.map(({ opens }) => opens.uniqueLinked));
  const openRate = rateSent > 0 ? rateOpened / rateSent : null;
  const totalSent = sum(
    memberCategories.map(({ statusCounts }) => statusCounts?.SENT ?? 0),
  );
  const totalUniqueOpens = sum(
    categories.map(({ opens }) => opens.uniqueLinked),
  );
  const totalUnlinkedOpens = sum(categories.map(({ opens }) => opens.unlinked));
  const reachableShare =
    reach.devicesWithToken > 0
      ? reach.devicesOsPermissionGranted / reach.devicesWithToken
      : null;

  return (
    <Container aria-label="기간 요약">
      <HeroTile>
        <dt>열림률</dt>
        <HeroValue>
          {openRate === null ? '계산 불가' : formatRate(openRate)}
        </HeroValue>
        <TileDescription>
          {rateCategories
            .map(({ category }) => CATEGORY_LABELS[category])
            .join('·')}{' '}
          고유 열림 {formatCount(rateOpened)} ÷ 발송 {formatCount(rateSent)}
        </TileDescription>
      </HeroTile>
      <Tile>
        <dt>발송</dt>
        <TileValue>
          {formatCount(totalSent)}
          <Unit>건</Unit>
        </TileValue>
        <TileDescription>
          회원별로 보낸 알림 합계 · 이벤트 토픽 제외
        </TileDescription>
      </Tile>
      <Tile>
        <dt>고유 열림</dt>
        <TileValue>
          {formatCount(totalUniqueOpens)}
          <Unit>건</Unit>
        </TileValue>
        <TileDescription>
          이벤트 포함 · 구버전 앱 미연결 {formatCount(totalUnlinkedOpens)}건
          별도
        </TileDescription>
      </Tile>
      <Tile>
        <dt>알림 받을 수 있는 기기</dt>
        <TileValue>
          {formatCount(reach.devicesOsPermissionGranted)}
          <Unit>대</Unit>
        </TileValue>
        <TileDescription>
          OS 알림 허용
          {reachableShare !== null &&
            ` · 토큰 보유 기기의 ${formatRate(reachableShare)}`}
        </TileDescription>
      </Tile>
    </Container>
  );
};

export default NotificationSummary;

const Container = styled.dl`
  display: grid;
  gap: var(--seed-dimension-x3);

  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
`;
const Tile = styled.div`
  min-width: 0;
  padding: var(--seed-dimension-x5);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r4);

  display: flex;
  gap: var(--seed-dimension-x2);
  flex-direction: column;

  background-color: var(--seed-color-bg-layer-default);

  dt {
    color: var(--seed-color-fg-neutral-muted);
    font-weight: var(--seed-font-weight-medium);
  }
`;
const HeroTile = styled(Tile)`
  background-color: var(--seed-color-bg-brand-weak);
  border-color: transparent;
`;
const HeroValue = styled.dd`
  color: var(--seed-color-palette-carrot-800);
  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t13);
  line-height: var(--seed-line-height-t13);
`;
const TileValue = styled.dd`
  display: flex;
  gap: var(--seed-dimension-x1);
  align-items: baseline;

  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t10);
  line-height: var(--seed-line-height-t10);
`;
const Unit = styled.span`
  color: var(--seed-color-fg-neutral-muted);
  font-weight: var(--seed-font-weight-medium);
  font-size: var(--seed-font-size-t4);
`;
const TileDescription = styled.dd`
  margin-top: auto;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t3);
  line-height: var(--seed-line-height-t3);
`;
