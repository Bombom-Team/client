import { EditorView } from '@codemirror/view';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import CodeMirror from '@uiw/react-codemirror';
import { useMemo, useState } from 'react';
import { WipRegisterForm } from './WipRegisterForm';
import { flywayQueries } from '@/apis/flyway/flyway.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import type {
  ConflictSeverity,
  FlywayLeapfrog,
  MigrationItem,
  MigrationStatus,
} from '@/apis/flyway/flyway.api';

const STATUS_META: Record<
  MigrationStatus,
  { label: string; dot: string; order: number }
> = {
  LOCAL_WIP: { label: '로컬 작업중', dot: '🟣', order: 0 },
  PR_REVIEW: { label: 'PR 리뷰중', dot: '🟠', order: 1 },
  MERGE_PENDING: { label: 'dev 반영', dot: '🔵', order: 2 },
  DB_APPLIED: { label: 'prod 반영', dot: '🟢', order: 3 },
};

const STATUS_ORDER: MigrationStatus[] = [
  'LOCAL_WIP',
  'PR_REVIEW',
  'MERGE_PENDING',
  'DB_APPLIED',
];

const compareVersionDesc = (left: string, right: string) => {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  const size = Math.max(leftParts.length, rightParts.length);
  for (let index = 0; index < size; index += 1) {
    const diff = (rightParts[index] ?? 0) - (leftParts[index] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
};

const parseVersion = (version: string) =>
  version
    .replace(/^V/, '')
    .split('.')
    .map((token) => Number(token) || 0);

export const FlywayViewer = () => {
  const { data, isLoading, isError } = useQuery(flywayQueries.overview());
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MigrationStatus>(
    'ALL',
  );
  const [selectedFileName, setSelectedFileName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const migrations = useMemo(() => data?.migrations ?? [], [data]);
  const selected = migrations.find(
    (item) => item.fileName === selectedFileName,
  );
  const conflictVersions = new Set(
    (data?.conflicts ?? []).map((conflict) => conflict.version),
  );

  // version → 가장 심각한 severity (COLUMN > TABLE)
  const leapfrogSeverityMap = useMemo(() => {
    const map = new Map<string, ConflictSeverity>();
    for (const warning of data?.leapfrogWarnings ?? []) {
      const current = map.get(warning.mineVersion);
      if (!current || warning.severity === 'COLUMN') {
        map.set(warning.mineVersion, warning.severity);
      }
    }
    return map;
  }, [data]);

  const selectedLeapfrogs = useMemo(
    () =>
      (data?.leapfrogWarnings ?? []).filter(
        (w) => w.mineVersion === selected?.version,
      ),
    [data, selected],
  );

  const filtered = useMemo(
    () => filterMigrations(migrations, keyword, statusFilter),
    [migrations, keyword, statusFilter],
  );

  const existingTables = useMemo(() => collectTables(migrations), [migrations]);

  if (isLoading) {
    return (
      <Layout title="Flyway 형상">
        <StateText>로딩 중...</StateText>
      </Layout>
    );
  }

  if (isError || !data) {
    return (
      <Layout title="Flyway 형상">
        <StateText>형상 정보를 불러오지 못했습니다.</StateText>
      </Layout>
    );
  }

  return (
    <Layout title="Flyway 형상">
      <Header>
        <Chip>
          적용기준 <strong>{data.deployBranch}</strong> · 통합{' '}
          <strong>{data.integrationBranch}</strong>
        </Chip>
        <Spacer />
        <Button type="button" onClick={() => setShowForm((prev) => !prev)}>
          🏷 작업중 등록
        </Button>
      </Header>

      {showForm ? (
        <WipRegisterForm
          existingTables={existingTables}
          defaultVersion={data.nextSafeMinor}
          onClose={() => setShowForm(false)}
        />
      ) : null}

      <Pipeline>
        {STATUS_ORDER.map((status) => (
          <Stage key={status}>
            <StageTop>
              {STATUS_META[status].dot} {STATUS_META[status].label}
            </StageTop>
            <StageCount>{countByStatus(migrations, status)}</StageCount>
          </Stage>
        ))}
      </Pipeline>

      {data.conflicts.length > 0 ? (
        <Banner $variant="error">
          ⛔ 버전 번호 충돌{' '}
          {data.conflicts
            .map(
              (conflict) =>
                `${conflict.version} (${conflict.sources.join(', ')}) → ${conflict.suggestedVersion} 권장`,
            )
            .join(' · ')}
        </Banner>
      ) : null}

      {data.leapfrogWarnings.length > 0 ? (
        <Banner $variant="warning">
          🔀 순서 역전{' '}
          {data.leapfrogWarnings
            .map(
              (warning) =>
                `${warning.mineVersion} ↔ ${warning.aheadVersion} (${warning.sharedTables.join(', ')}, ${warning.severity === 'COLUMN' ? '컬럼' : '테이블'})`,
            )
            .join(' · ')}
        </Banner>
      ) : null}

      <Toolbar>
        <SearchInput
          value={keyword}
          placeholder="버전 / 설명 / 테이블 / PR·이슈 검색…"
          onChange={(event) => setKeyword(event.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as 'ALL' | MigrationStatus)
          }
        >
          <option value="ALL">상태: 전체</option>
          {STATUS_ORDER.map((status) => (
            <option key={status} value={status}>
              {STATUS_META[status].label}
            </option>
          ))}
        </Select>
        <NextSafe>
          다음 안전 <code>{data.nextSafeMinor}</code> /{' '}
          <code>{data.nextSafeMajor}</code>
        </NextSafe>
      </Toolbar>

      <Panes>
        <List>
          {filtered.map((item) => {
            const leapfrogSeverity =
              leapfrogSeverityMap.get(item.version) ?? null;
            return (
              <RowButton
                key={item.fileName}
                type="button"
                $active={item.fileName === selectedFileName}
                $conflict={conflictVersions.has(item.version)}
                $leapfrogSeverity={leapfrogSeverity}
                onClick={() => setSelectedFileName(item.fileName)}
              >
                <Version>{item.version}</Version>
                <Desc>{item.description}</Desc>
                {leapfrogSeverity ? (
                  <LeapfrogBadge $severity={leapfrogSeverity}>
                    {leapfrogSeverity === 'COLUMN'
                      ? '⚠ 컬럼 역전'
                      : '🔀 순서 역전'}
                  </LeapfrogBadge>
                ) : null}
                {item.tables.slice(0, 1).map((table) => (
                  <Tag key={table}>
                    {item.createsNewTable ? '🆕' : '🗂'} {table}
                  </Tag>
                ))}
                {item.sourceLabel ? <Source>{item.sourceLabel}</Source> : null}
                <StatusBadge $status={item.status}>
                  {STATUS_META[item.status].label}
                </StatusBadge>
              </RowButton>
            );
          })}
          {filtered.length === 0 ? (
            <Empty>조건에 맞는 마이그레이션이 없습니다.</Empty>
          ) : null}
        </List>

        <Detail>
          {selected ? (
            <DetailContent item={selected} leapfrogs={selectedLeapfrogs} />
          ) : (
            <Empty>왼쪽에서 마이그레이션을 선택하세요.</Empty>
          )}
        </Detail>
      </Panes>
    </Layout>
  );
};

interface DetailContentProps {
  item: MigrationItem;
  leapfrogs: FlywayLeapfrog[];
}

const DetailContent = ({ item, leapfrogs }: DetailContentProps) => {
  const hasFile =
    item.status === 'DB_APPLIED' || item.status === 'MERGE_PENDING';
  const { data, isLoading, isError } = useQuery({
    ...flywayQueries.script(hasFile ? item.fileName : ''),
  });

  return (
    <>
      <DetailBar>
        <FileName>{item.fileName}</FileName>
        <Spacer />
        {item.sourceUrl ? (
          <a href={item.sourceUrl} target="_blank" rel="noreferrer">
            ↗ 열기
          </a>
        ) : null}
      </DetailBar>
      <DetailMeta>
        {STATUS_META[item.status].dot} {STATUS_META[item.status].label}
        {item.author ? ` · 담당 ${item.author}` : ''}
        {item.tables.length > 0 ? ` · ${item.tables.join(', ')}` : ''}
      </DetailMeta>

      {leapfrogs.map((leapfrog) => (
        <LeapfrogWarning
          key={leapfrog.aheadVersion}
          $severity={leapfrog.severity}
        >
          <LeapfrogWarningTitle>
            {leapfrog.severity === 'COLUMN'
              ? '⚠ 순서 역전 — 같은 컬럼 접근 (강한 경고)'
              : '🔀 순서 역전 — 같은 테이블 접근'}
          </LeapfrogWarningTitle>
          <LeapfrogWarningBody>
            이 버전(<strong>{leapfrog.mineVersion}</strong>)보다 높은{' '}
            <strong>{leapfrog.aheadVersion}</strong>이 이미 반영되어 있습니다.
            {leapfrog.severity === 'COLUMN'
              ? ' out-of-order로 끼워 넣으면 같은 컬럼이 덮어씌워질 수 있습니다.'
              : ' out-of-order로 끼워 넣어도 컬럼 충돌은 없지만, 같은 테이블을 다룹니다.'}
          </LeapfrogWarningBody>
          <LeapfrogWarningDetail>
            공유 {leapfrog.severity === 'COLUMN' ? '컬럼' : '테이블'}:{' '}
            {leapfrog.sharedTables.map((name) => (
              <LeapfrogTag key={name} $severity={leapfrog.severity}>
                {name}
              </LeapfrogTag>
            ))}
          </LeapfrogWarningDetail>
        </LeapfrogWarning>
      ))}

      {hasFile ? (
        <ScriptArea>
          {isLoading ? <StateText>스크립트 로딩 중...</StateText> : null}
          {isError ? (
            <StateText>스크립트를 불러오지 못했습니다.</StateText>
          ) : null}
          {data ? (
            <CodeMirror
              value={data.content}
              editable={false}
              readOnly
              basicSetup={{ highlightActiveLine: false, foldGutter: false }}
              extensions={[EditorView.lineWrapping]}
            />
          ) : null}
        </ScriptArea>
      ) : (
        <PendingNote>
          아직 dev/prod에 없는 작업중 항목입니다. 상세 SQL은{' '}
          {item.sourceUrl ? 'PR/이슈' : '소스'}에서 확인하세요.
        </PendingNote>
      )}
    </>
  );
};

const filterMigrations = (
  migrations: MigrationItem[],
  keyword: string,
  statusFilter: 'ALL' | MigrationStatus,
) => {
  const normalized = keyword.trim().toLowerCase();
  return migrations
    .filter((item) => statusFilter === 'ALL' || item.status === statusFilter)
    .filter((item) => matchesKeyword(item, normalized))
    .sort((left, right) => compareVersionDesc(left.version, right.version));
};

const matchesKeyword = (item: MigrationItem, normalized: string) => {
  if (normalized.length === 0) {
    return true;
  }
  const haystack = [
    item.version,
    item.description,
    item.sourceLabel,
    item.author,
    ...item.tables,
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(normalized);
};

const countByStatus = (migrations: MigrationItem[], status: MigrationStatus) =>
  migrations.filter((item) => item.status === status).length;

const collectTables = (migrations: MigrationItem[]) => {
  const tables = new Set<string>();
  migrations.forEach((item) =>
    item.tables.forEach((table) => tables.add(table)),
  );
  return [...tables].sort();
};

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const Chip = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Spacer = styled.div`
  flex: 1;
`;

const Pipeline = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Stage = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.white};
`;

const StageTop = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const StageCount = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Banner = styled.div<{ $variant: 'error' | 'warning' }>`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  background-color: ${({ $variant }) =>
    $variant === 'error' ? '#FDEAEA' : '#FFF4E5'};
  color: ${({ theme, $variant }) =>
    $variant === 'error' ? theme.colors.error : '#B45309'};
`;

const Toolbar = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const NextSafe = styled.span`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};

  code {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
  }
`;

const Panes = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  height: 540px;
`;

const List = styled.div`
  width: 46%;
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.white};
`;

const leapfrogBorderColor = (severity: ConflictSeverity | null) => {
  if (severity === 'COLUMN') return '#EF4444';
  if (severity === 'TABLE') return '#F59E0B';
  return 'transparent';
};

const leapfrogBackground = (
  severity: ConflictSeverity | null,
  active: boolean,
) => {
  if (severity === 'COLUMN') return '#FFF5F5';
  if (severity === 'TABLE') return active ? '#FFFBEB' : '#FFFEF5';
  return null;
};

const RowButton = styled.button<{
  $active: boolean;
  $conflict: boolean;
  $leapfrogSeverity: ConflictSeverity | null;
}>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;

  cursor: pointer;
  text-align: left;
  background-color: ${({ theme, $active, $conflict, $leapfrogSeverity }) => {
    if ($conflict) return '#FDEAEA';
    const leap = leapfrogBackground($leapfrogSeverity, $active);
    if (leap) return leap;
    return $active ? theme.colors.gray50 : theme.colors.white;
  }};
  box-shadow: ${({ theme, $active, $conflict, $leapfrogSeverity }) =>
    $conflict
      ? `inset 3px 0 0 ${theme.colors.error}`
      : $leapfrogSeverity
        ? `inset 3px 0 0 ${leapfrogBorderColor($leapfrogSeverity)}`
        : $active
          ? `inset 3px 0 0 ${theme.colors.primary}`
          : 'none'};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const Version = styled.span`
  min-width: 64px;
  font-family: monospace;
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Desc = styled.span`
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const LeapfrogBadge = styled.span<{ $severity: ConflictSeverity }>`
  flex-shrink: 0;
  padding: 1px ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  white-space: nowrap;
  color: ${({ $severity }) => ($severity === 'COLUMN' ? '#B91C1C' : '#92400E')};
  background-color: ${({ $severity }) =>
    $severity === 'COLUMN' ? '#FEE2E2' : '#FEF3C7'};
`;

const Tag = styled.span`
  padding: 0 ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const Source = styled.span`
  font-family: monospace;
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray500};
`;

const StatusBadge = styled.span<{ $status: MigrationStatus }>`
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  white-space: nowrap;
  color: ${({ theme, $status }) => statusColor(theme, $status)};
  background-color: ${({ $status }) => statusBackground($status)};
`;

const statusColor = (
  theme: { colors: Record<string, string> },
  status: MigrationStatus,
) => {
  if (status === 'DB_APPLIED') return theme.colors.success;
  if (status === 'PR_REVIEW') return '#B45309';
  if (status === 'MERGE_PENDING') return theme.colors.primary;
  return theme.colors.secondary;
};

const statusBackground = (status: MigrationStatus) => {
  if (status === 'DB_APPLIED') return '#E7F7EF';
  if (status === 'PR_REVIEW') return '#FFF4E5';
  if (status === 'MERGE_PENDING') return '#E8F1FF';
  return '#F0EDFF';
};

const Detail = styled.div`
  flex: 1;
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.white};
`;

const DetailBar = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FileName = styled.span`
  font-family: monospace;
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const DetailMeta = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const LeapfrogWarning = styled.div<{ $severity: ConflictSeverity }>`
  margin: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md}
    0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid
    ${({ $severity }) => ($severity === 'COLUMN' ? '#FCA5A5' : '#FCD34D')};
  background-color: ${({ $severity }) =>
    $severity === 'COLUMN' ? '#FFF5F5' : '#FFFBEB'};
`;

const LeapfrogWarningTitle = styled.div`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const LeapfrogWarningBody = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  line-height: 1.5;
`;

const LeapfrogWarningDetail = styled.div`
  font-size: ${({ theme }) => theme.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray600};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const LeapfrogTag = styled.code<{ $severity: ConflictSeverity }>`
  padding: 1px 5px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ $severity }) =>
    $severity === 'COLUMN' ? '#FEE2E2' : '#FEF3C7'};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const ScriptArea = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

const PendingNote = styled.p`
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const StateText = styled.p`
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.gray500};
`;

const Empty = styled.p`
  padding: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.gray400};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;
