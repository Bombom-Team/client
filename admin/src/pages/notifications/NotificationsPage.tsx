import styled from '@emotion/styled';
import '@seed-design/css/base.css';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import CategoryEventTable from './components/CategoryEventTable';
import NotificationSummary from './components/NotificationSummary';
import OpenRateChart from './components/OpenRateChart';
import ShareBar from './components/ShareBar';
import { notificationStatsQueries } from '@/apis/notificationStats/notificationStats.query';

const PERIOD_DAYS = [7, 30] as const;
const DAY_MS = 86_400_000;
const SEOUL_DATE_FORMAT = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
});

// 서울 날짜 기준으로 오늘을 포함한 최근 N일 범위를 만든다.
const getSeoulDateRange = (days: number) => {
  const now = Date.now();
  return {
    from: SEOUL_DATE_FORMAT.format(now - (days - 1) * DAY_MS),
    to: SEOUL_DATE_FORMAT.format(now),
  };
};

const NotificationsPage = () => {
  const [days, setDays] = useState<(typeof PERIOD_DAYS)[number]>(7);
  const { data, isError, isFetching, isPaused, refetch } = useQuery(
    notificationStatsQueries.stats(getSeoulDateRange(days)),
  );
  const handleRefresh = () => {
    void refetch();
  };

  return (
    <Container data-seed-color-mode="light-only">
      <HeadingWrapper>
        <div>
          <PageTitle>알림 현황</PageTitle>
          <DescriptionBox>
            어떤 알림이 열리는지, 알림을 받을 수 있는 기기는 얼마나 되는지
            확인하세요.
          </DescriptionBox>
        </div>
        <ControlWrapper>
          <PeriodWrapper role="group" aria-label="집계 기간">
            {PERIOD_DAYS.map((period) => (
              <PeriodButton
                key={period}
                type="button"
                aria-pressed={days === period}
                onClick={() => setDays(period)}
              >
                {period}일
              </PeriodButton>
            ))}
          </PeriodWrapper>
          <RefreshButton
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <FiRefreshCw aria-hidden="true" />
            {isFetching ? '갱신 중' : '새로고침'}
          </RefreshButton>
        </ControlWrapper>
      </HeadingWrapper>

      <MetaWrapper>
        {data && (
          <span>
            {data.from} ~ {data.to} · 서버 집계{' '}
            <time dateTime={data.aggregatedAt}>
              {new Date(data.aggregatedAt).toLocaleString('ko-KR', {
                timeZone: 'Asia/Seoul',
              })}
            </time>
          </span>
        )}
      </MetaWrapper>

      {isPaused && (
        <NoticeBox role="status">네트워크 연결을 기다리고 있어요.</NoticeBox>
      )}
      {isError && (
        <NoticeBox role="alert">
          <div>
            <strong>알림 현황을 불러오지 못했어요.</strong>
            <p>
              {data
                ? '이전 조회 결과를 표시하고 있어요.'
                : '알림 서버 주소와 어드민 키 설정, 연결 상태를 확인한 뒤 다시 시도해 주세요.'}
            </p>
          </div>
          <RefreshButton
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            다시 시도
          </RefreshButton>
        </NoticeBox>
      )}
      {!data && !isError && !isPaused && (
        <LoadingBox role="status" aria-live="polite">
          알림 현황을 불러오는 중이에요.
        </LoadingBox>
      )}

      {data && (
        <>
          <NotificationSummary stats={data} />
          <OpenRateChart categories={data.categories} />

          <section aria-labelledby="reach-heading">
            <SectionTitle id="reach-heading">도달 모수와 기기</SectionTitle>
            <ReachWrapper>
              <ReachSummary>
                <div>
                  <dt>토큰 보유 회원</dt>
                  <dd>
                    {data.reach.membersWithToken.toLocaleString('ko-KR')}명
                  </dd>
                </div>
                <div>
                  <dt>토큰 보유 기기</dt>
                  <dd>
                    {data.reach.devicesWithToken.toLocaleString('ko-KR')}대
                  </dd>
                </div>
              </ReachSummary>
              <ShareBar
                title="기기 OS 알림 권한"
                unit="대"
                segments={[
                  {
                    label: '허용',
                    count: data.reach.devicesOsPermissionGranted,
                    color: 'var(--seed-color-palette-carrot-700)',
                  },
                  {
                    label: '거부',
                    count: data.reach.devicesOsPermissionDenied,
                    color: 'var(--seed-color-palette-gray-800)',
                  },
                  {
                    label: '미보고(구버전 앱)',
                    count: data.reach.devicesOsPermissionUnknown,
                    color: 'var(--seed-color-palette-gray-400)',
                  },
                ]}
              />
              <ShareBar
                title="열림 OS"
                unit="건"
                segments={data.opensByPlatform.map(({ platform, count }) => ({
                  label: platform === 'IOS' ? 'iOS' : 'Android',
                  count,
                  color:
                    platform === 'IOS'
                      ? 'var(--seed-color-palette-blue-700)'
                      : 'var(--seed-color-palette-green-700)',
                }))}
              />
            </ReachWrapper>
          </section>

          <CategoryEventTable categories={data.categories} />

          <DefinitionBox>
            <summary>집계 기준과 수집하지 않는 것</summary>
            <ul>
              <li>
                발송은 FCM이 알림을 접수한 시각, 열림은 사용자가 알림을 연
                시각으로 기간에 넣어요. 기간 이전에 보낸 알림의 열림도 포함될 수
                있어요.
              </li>
              <li>
                열림률은 같은 알림을 여러 번 열어도 한 번으로 센 고유 열림 ÷
                발송이에요. 이벤트는 토픽으로 한 번에 보내 받은 사람을 알 수
                없어서, 조회 시점의 수신 동의 회원 수로 나눈 근사치예요.
              </li>
              <li>
                회원의 모든 기기가 OS 알림을 꺼도 발송으로 기록돼요. 그래서
                열림률이 실제보다 낮게 보일 수 있어요. 아티클 도착·문의 답변
                도착은 수신 거부 시 기록이 남지 않아 스킵을 집계하지 않아요.
              </li>
              <li>
                미연결 열림은 발송 식별자를 보내지 않는 구버전 앱에서 연
                알림이에요. 열림률에는 넣지 않아요.
              </li>
              <li>
                기기에 실제로 도착했는지, 화면에 노출됐는지는 수집하지 않아요.
                챌린지 알림은 앱이 이동할 화면이 없어 열림이 기록되지 않아요.
              </li>
            </ul>
          </DefinitionBox>
        </>
      )}
    </Container>
  );
};

export default NotificationsPage;

const Container = styled.div`
  max-width: 1240px;
  margin-inline: auto;

  display: grid;
  gap: var(--seed-dimension-x6);

  color: var(--seed-color-fg-neutral);
  font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  font-size: var(--seed-font-size-t4);
  line-height: var(--seed-line-height-t5);

  word-break: keep-all;

  button:focus-visible,
  summary:focus-visible {
    outline: 3px solid var(--seed-color-palette-carrot-700);
    outline-offset: 3px;
  }
`;
const HeadingWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x4);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;
const PageTitle = styled.h1`
  margin-bottom: var(--seed-dimension-x2);

  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t12);
  line-height: var(--seed-line-height-t12);
`;
const DescriptionBox = styled.p`
  color: var(--seed-color-fg-neutral-muted);
`;
const ControlWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x3);
  flex-wrap: wrap;
  align-items: center;
`;
const PeriodWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x1);
`;
const PeriodButton = styled.button`
  min-width: 56px;
  min-height: 44px;
  padding: var(--seed-dimension-x2) var(--seed-dimension-x3);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r2);

  background-color: var(--seed-color-bg-layer-default);
  color: var(--seed-color-fg-neutral-muted);

  &[aria-pressed='true'] {
    background-color: var(--seed-color-bg-brand-weak);
    color: var(--seed-color-palette-carrot-800);
    font-weight: var(--seed-font-weight-bold);
  }
`;
const RefreshButton = styled.button`
  min-height: 44px;
  padding: var(--seed-dimension-x3) var(--seed-dimension-x4);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r2);

  display: inline-flex;
  gap: var(--seed-dimension-x2);
  align-items: center;
  justify-content: center;

  background-color: var(--seed-color-bg-layer-default);
  color: var(--seed-color-fg-neutral);
  font-weight: var(--seed-font-weight-medium);

  &:disabled {
    cursor: wait;
    opacity: 0.5;
  }

  &:hover:not(:disabled) {
    background-color: var(--seed-color-bg-brand-weak);
  }
`;
const MetaWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x4);
  flex-wrap: wrap;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t3);

  font-variant-numeric: tabular-nums;
`;
const SectionTitle = styled.h2`
  margin-bottom: var(--seed-dimension-x4);

  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t7);
  line-height: var(--seed-line-height-t7);
`;
const ReachWrapper = styled.div`
  border: 1px solid var(--seed-color-palette-gray-300);
  border-radius: var(--seed-radius-r4);

  display: grid;
  gap: 1px;

  background-color: var(--seed-color-palette-gray-300);

  grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
`;
const ReachSummary = styled.dl`
  padding: var(--seed-dimension-x6);

  display: grid;
  gap: var(--seed-dimension-x4);
  align-content: start;

  background-color: var(--seed-color-bg-layer-default);

  dt {
    color: var(--seed-color-fg-neutral-muted);
    font-weight: var(--seed-font-weight-medium);
  }

  dd {
    font-weight: var(--seed-font-weight-bold);
    font-size: var(--seed-font-size-t10);
    line-height: var(--seed-line-height-t10);

    font-variant-numeric: tabular-nums;
  }
`;
const NoticeBox = styled.div`
  padding: var(--seed-dimension-x4);
  border: 1px solid var(--seed-color-stroke-neutral-weak);
  border-radius: var(--seed-radius-r3);

  display: flex;
  gap: var(--seed-dimension-x4);
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  background-color: var(--seed-color-bg-layer-default);
`;
const LoadingBox = styled.div`
  min-height: 240px;
  padding: var(--seed-dimension-x8);
  border-radius: var(--seed-radius-r4);

  display: grid;

  background-color: var(--seed-color-bg-layer-default);
  color: var(--seed-color-fg-neutral-muted);

  place-items: center;
`;
const DefinitionBox = styled.details`
  padding: var(--seed-dimension-x4);
  border-radius: var(--seed-radius-r3);

  background-color: var(--seed-color-bg-layer-fill);
  color: var(--seed-color-fg-neutral-muted);

  summary {
    font-weight: var(--seed-font-weight-medium);
    cursor: pointer;
  }

  ul {
    margin-top: var(--seed-dimension-x3);
    padding-left: var(--seed-dimension-x5);
  }

  li + li {
    margin-top: var(--seed-dimension-x2);
  }
`;
