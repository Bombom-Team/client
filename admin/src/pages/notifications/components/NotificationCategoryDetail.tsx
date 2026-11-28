import styled from '@emotion/styled';
import { SKIP_NOT_RECORDED_CATEGORIES } from '../constants/notificationCategory';
import { formatCount, formatDuration } from '../utils/formatStats';
import type { NotificationCategoryStats } from '@/apis/notificationStats/notificationStats.api';

interface NotificationCategoryDetailProps {
  stats: NotificationCategoryStats;
}

const NotificationCategoryDetail = ({
  stats,
}: NotificationCategoryDetailProps) => {
  const isTopic = stats.deliveryMode === 'TOPIC';
  const isSkipRecorded = !SKIP_NOT_RECORDED_CATEGORIES.includes(stats.category);

  return (
    <Container>
      <Metrics>
        <div>
          <dt>현재 수신 동의 회원</dt>
          <dd>
            {stats.consentingMembers === null
              ? '미집계'
              : `${formatCount(stats.consentingMembers)}명`}
          </dd>
        </div>
        {isTopic && (
          <div>
            <dt>발송 시점 수신 동의 (합)</dt>
            <dd>
              {stats.estimatedRecipients === null
                ? '미집계'
                : `${formatCount(stats.estimatedRecipients)}명`}
            </dd>
          </div>
        )}
        {!isTopic && (
          <>
            <div>
              <dt>발송 스킵</dt>
              <dd>
                {!isSkipRecorded
                  ? '미집계'
                  : stats.statusCounts === null
                    ? '—'
                    : `${formatCount(stats.statusCounts.SKIPPED)}건`}
              </dd>
            </div>
            <div>
              <dt>기기 전송 성공</dt>
              <dd>
                {stats.deviceSends === null
                  ? '—'
                  : `${formatCount(stats.deviceSends.success)}건`}
              </dd>
            </div>
            <div>
              <dt>기기 전송 실패</dt>
              <dd>
                {stats.deviceSends === null
                  ? '—'
                  : `${formatCount(stats.deviceSends.failure)}건`}
              </dd>
            </div>
          </>
        )}
        <div>
          <dt>기간 내 고유 열림</dt>
          <dd>{formatCount(stats.opens.uniqueLinked)}건</dd>
        </div>
        <div>
          <dt>연결된 열림 횟수</dt>
          <dd>{formatCount(stats.opens.linked)}회</dd>
        </div>
        <div>
          <dt>미연결 열림</dt>
          <dd>{formatCount(stats.opens.unlinked)}건</dd>
        </div>
        <div>
          <dt>열림까지 (중앙값)</dt>
          <dd>
            {stats.medianSecondsToOpen === null
              ? '—'
              : formatDuration(stats.medianSecondsToOpen)}
          </dd>
        </div>
      </Metrics>
      {isTopic && (
        <Note>토픽 발송은 회원별 발송·기기 전송 결과를 집계하지 않아요.</Note>
      )}
      {!isTopic && !isSkipRecorded && (
        <Note>수신 거부 기록이 없어 스킵은 집계하지 않아요.</Note>
      )}
      {stats.failureReasons.length > 0 && (
        <FailureWrapper>
          <strong>발송 실패 사유</strong>
          <FailureList>
            {stats.failureReasons.map(({ reason, count }) => (
              <li key={reason}>
                {reason} · {formatCount(count)}건
              </li>
            ))}
          </FailureList>
        </FailureWrapper>
      )}
    </Container>
  );
};

export default NotificationCategoryDetail;

const Container = styled.div`
  padding: var(--seed-dimension-x5);

  display: grid;
  gap: var(--seed-dimension-x4);

  background-color: var(--seed-color-bg-layer-fill);
  text-align: left;
  white-space: normal;
`;
const Metrics = styled.dl`
  display: grid;
  gap: var(--seed-dimension-x5);

  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));

  dt {
    margin-bottom: var(--seed-dimension-x1);

    color: var(--seed-color-fg-neutral-muted);
    font-size: var(--seed-font-size-t4);
  }

  dd {
    font-weight: var(--seed-font-weight-medium);
  }
`;
const Note = styled.p`
  color: var(--seed-color-fg-neutral-muted);
  font-size: var(--seed-font-size-t4);
`;
const FailureWrapper = styled.div`
  padding-top: var(--seed-dimension-x4);
  border-top: 1px solid var(--seed-color-stroke-neutral-weak);

  display: flex;
  gap: var(--seed-dimension-x3) var(--seed-dimension-x5);
  flex-wrap: wrap;
  align-items: baseline;

  font-size: var(--seed-font-size-t4);
`;
const FailureList = styled.ul`
  display: flex;
  gap: var(--seed-dimension-x3) var(--seed-dimension-x5);
  flex-wrap: wrap;

  list-style: none;
`;
