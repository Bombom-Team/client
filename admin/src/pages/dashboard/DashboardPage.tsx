import styled from '@emotion/styled';
import '@seed-design/css/base.css';
import { useQuery } from '@tanstack/react-query';
import { FiRefreshCw } from 'react-icons/fi';
import Metric from './components/Metric';
import SignupTrend from './components/SignupTrend';
import { dashboardQueries } from '@/apis/dashboard/dashboard.query';

const DashboardPage = () => {
  const { data, isError, isFetching, isPaused, dataUpdatedAt, refetch } =
    useQuery(dashboardQueries.stats());
  const handleRefresh = () => {
    void refetch();
  };
  const dailyAverage =
    data?.weeklyJoinedMembers === undefined
      ? undefined
      : data.weeklyJoinedMembers / 7;

  return (
    <Container data-seed-color-mode="light-only">
      <HeadingWrapper>
        <div>
          <PageTitle>회원 현황</PageTitle>
          <DescriptionBox>가입과 활동 현황을 한눈에 확인하세요.</DescriptionBox>
        </div>
        <RefreshWrapper>
          {data?.aggregatedAt && (
            <DescriptionBox>
              서버 집계{' '}
              <time dateTime={data.aggregatedAt}>
                {new Date(data.aggregatedAt).toLocaleString('ko-KR', {
                  timeZone: 'Asia/Seoul',
                })}
              </time>
              {' · 최대 5분 캐시'}
            </DescriptionBox>
          )}
          {dataUpdatedAt > 0 && (
            <DescriptionBox>
              마지막 조회{' '}
              <time dateTime={new Date(dataUpdatedAt).toISOString()}>
                {new Date(dataUpdatedAt).toLocaleString('ko-KR')}
              </time>
            </DescriptionBox>
          )}
          <RefreshButton
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
          >
            <FiRefreshCw aria-hidden="true" />
            {isFetching ? '갱신 중' : '새로고침'}
          </RefreshButton>
        </RefreshWrapper>
      </HeadingWrapper>

      {isPaused && (
        <NoticeBox role="status">네트워크 연결을 기다리고 있어요.</NoticeBox>
      )}
      {isError && (
        <NoticeBox role="alert">
          <div>
            <strong>회원 현황을 불러오지 못했어요.</strong>
            <p>
              {data
                ? '이전 조회 결과를 표시하고 있어요.'
                : '연결 상태를 확인한 뒤 다시 시도해 주세요.'}
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
          회원 현황을 불러오는 중이에요.
        </LoadingBox>
      )}

      {data && (
        <>
          <section aria-labelledby="signup-heading">
            <SectionTitle id="signup-heading">가입 현황</SectionTitle>
            <MetricsWrapper>
              <Metric
                label="이번 달 가입"
                value={data.monthlyJoinedMembers}
                description="이번 달 1일부터"
                emphasis
              />
              <Metric
                label="오늘 가입"
                value={data.dailyJoinedMembers}
                description="오늘 0시부터"
              />
              <Metric
                label="최근 7일 가입"
                value={data.weeklyJoinedMembers}
                description="오늘 포함 7일"
              />
              <Metric
                label="하루 평균 가입"
                value={dailyAverage}
                description="최근 7일 가입 ÷ 7일"
                fractionDigits={1}
              />
            </MetricsWrapper>
          </section>

          <SignupTrend data={data.dailyJoinedTrend} />

          <section aria-labelledby="members-heading">
            <SectionTitle id="members-heading">회원 상세 현황</SectionTitle>
            <MetricsWrapper>
              <Metric
                label="전체 회원"
                value={data.totalMembers}
                description="현재 등록된 회원"
              />
              <Metric
                label="올해 가입"
                value={data.yearlyJoinedMembers}
                description="올해 1월 1일부터"
              />
              <Metric
                label="이번 달 탈퇴"
                value={data.withdrawnMembersThisMonth}
                description="이번 달 1일부터 · 테스트 계정 포함"
              />
              <Metric
                label="오늘 활동 회원"
                value={data.todayActiveMembers}
                description="유효 세션 기준 · 테스트 계정 포함"
              />
            </MetricsWrapper>
          </section>

          <DefinitionBox>
            <summary>집계 기준과 제공 범위</summary>
            <ul>
              <li>
                최근 7일은 이번 주가 아니라 오늘을 포함한 7일이에요. 오늘 수치는
                하루가 끝나기 전까지 바뀔 수 있어요.
              </li>
              <li>
                가입 수는 현재 회원 데이터 기준이에요. 탈퇴한 회원까지 보존한
                전체 가입 이력과 다를 수 있어요.
              </li>
              <li>
                오늘 활동 회원은 중복을 제외한 유효 세션 기준으로, 로그아웃·세션
                만료로 줄어들 수 있어요. 과거 일별 활동 수는 제공하지 않아요.
              </li>
              <li>
                {data.dailyJoinedTrend
                  ? '전체 회원·가입 집계는 테스트 계정(role_id=4)을 제외해요. 탈퇴·오늘 활동 집계는 아직 테스트 계정을 제외하지 않아요.'
                  : '서버 업데이트 전 응답이에요. 테스트 계정 제외 여부를 확인할 수 없어요.'}
              </li>
            </ul>
          </DefinitionBox>
          <FooterBox>
            <span>
              공지사항{' '}
              {data.totalNotices?.toLocaleString('ko-KR') ?? '집계 없음'}
              {data.totalNotices === undefined ? '' : '개'}
            </span>
            <span>주기적 자동 조회 없이, 필요할 때 새로고침하세요.</span>
          </FooterBox>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;

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
const DescriptionBox = styled.p`color: var(--seed-color-fg-neutral-muted);`;
const RefreshWrapper = styled.div`
  display: flex;
  gap: var(--seed-dimension-x3);
  flex-wrap: wrap;
  align-items: center;

  font-size: var(--seed-font-size-t3);
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
const SectionTitle = styled.h2`
  margin-bottom: var(--seed-dimension-x4);

  font-weight: var(--seed-font-weight-bold);
  font-size: var(--seed-font-size-t7);
  line-height: var(--seed-line-height-t7);
`;
const MetricsWrapper = styled.dl`
  border: 1px solid var(--seed-color-palette-gray-300);
  border-radius: var(--seed-radius-r4);

  display: grid;
  gap: 1px;

  background-color: var(--seed-color-palette-gray-300);

  grid-template-columns: repeat(auto-fit, minmax(min(100%, 180px), 1fr));
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
  li + li { margin-top: var(--seed-dimension-x2); }
`;
const FooterBox = styled.div`
  display: flex;
  gap: var(--seed-dimension-x3);
  flex-wrap: wrap;
  justify-content: space-between;

  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t3);
`;
