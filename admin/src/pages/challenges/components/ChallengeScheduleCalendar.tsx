import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import { useCreateChallengeDailyGuideMutation } from '@/pages/challenges/hooks/useCreateChallengeDailyGuideMutation';
import type {
  ChallengeDailyGuide,
  ChallengeSchedule,
  ChallengeScheduleDayOfWeek,
} from '@/types/challenge';

type Props = {
  challengeId: number;
  enabled?: boolean;
};

type ChallengeScheduleMonth = {
  key: string;
  title: string;
  cells: Array<ChallengeSchedule | null>;
};

type GuideTypeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'error';

const DAY_OF_WEEK_LABELS = ['월', '화', '수', '목', '금', '토', '일'];
const GUIDE_TYPE_TONES: GuideTypeTone[] = [
  'primary',
  'success',
  'warning',
  'error',
];

const DAY_OF_WEEK_INDEX: Record<ChallengeScheduleDayOfWeek, number> = {
  MONDAY: 0,
  TUESDAY: 1,
  WEDNESDAY: 2,
  THURSDAY: 3,
  FRIDAY: 4,
  SATURDAY: 5,
  SUNDAY: 6,
};

const buildChallengeScheduleMonths = (
  schedules: ChallengeSchedule[],
): ChallengeScheduleMonth[] => {
  const monthMap = new Map<string, ChallengeSchedule[]>();

  schedules.forEach((schedule) => {
    const monthKey = schedule.date.slice(0, 7);
    const currentMonthSchedules = monthMap.get(monthKey) ?? [];
    currentMonthSchedules.push(schedule);
    monthMap.set(monthKey, currentMonthSchedules);
  });

  return Array.from(monthMap.entries()).map(([monthKey, monthSchedules]) => {
    const firstDate = monthSchedules[0];
    const firstDateOffset = DAY_OF_WEEK_INDEX[firstDate.dayOfWeek];
    const cells: Array<ChallengeSchedule | null> = [
      ...Array.from({ length: firstDateOffset }, () => null),
      ...monthSchedules,
    ];

    const remainder = cells.length % DAY_OF_WEEK_LABELS.length;
    const trailingEmptyCount =
      remainder === 0 ? 0 : DAY_OF_WEEK_LABELS.length - remainder;

    return {
      key: monthKey,
      title: `${Number(monthKey.slice(0, 4))}년 ${Number(
        monthKey.slice(5, 7),
      )}월`,
      cells: [
        ...cells,
        ...Array.from({ length: trailingEmptyCount }, () => null),
      ],
    };
  });
};

const getGuideTypeTone = (dailyGuideType?: string): GuideTypeTone => {
  if (!dailyGuideType) {
    return 'neutral';
  }

  if (dailyGuideType === 'READ') {
    return 'neutral';
  }

  if (dailyGuideType === 'COMMENT') {
    return 'success';
  }

  const hash = dailyGuideType
    .split('')
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return GUIDE_TYPE_TONES[hash % GUIDE_TYPE_TONES.length];
};

const formatDayIndexLabel = (dayIndex: number) => {
  return dayIndex === 0 ? '주말(0일차)' : `${dayIndex}일차`;
};

const ChallengeDailyGuideModal = ({
  challengeId,
  selectedSchedule,
  onClose,
}: {
  challengeId: number;
  selectedSchedule: ChallengeSchedule;
  onClose: () => void;
}) => {
  const { data, error, isError, isLoading } = useQuery(
    challengesQueries.dailyGuide(challengeId, selectedSchedule.dayIndex),
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {selectedSchedule.date} ·{' '}
            {formatDayIndexLabel(selectedSchedule.dayIndex)}
          </ModalTitle>
          <CloseButton type="button" onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        {isLoading && (
          <ModalStateText>가이드 정보를 불러오는 중...</ModalStateText>
        )}

        {isError && (
          <ModalErrorText>
            {'message' in (error as object) && typeof error.message === 'string'
              ? error.message
              : '가이드 정보를 불러오지 못했습니다.'}
          </ModalErrorText>
        )}

        {data === null && <ModalStateText>미등록</ModalStateText>}
        {data === null && (
          <ChallengeDailyGuideCreateForm
            challengeId={challengeId}
            selectedSchedule={selectedSchedule}
          />
        )}

        {data && (
          <ChallengeDailyGuideContent
            guide={data}
            scheduleImageUrl={selectedSchedule.imageUrl}
          />
        )}
      </ModalCard>
    </ModalOverlay>
  );
};

const GUIDE_TYPE_OPTIONS = [
  { label: 'READ', value: 'READ' },
  { label: 'COMMENT', value: 'COMMENT' },
  { label: 'SHARING', value: 'SHARING' },
  { label: 'REMIND', value: 'REMIND' },
] as const;

const isNoticeRequiredGuideType = (guideType: string) => {
  return guideType === 'COMMENT' || guideType === 'REMIND';
};

const ChallengeDailyGuideCreateForm = ({
  challengeId,
  selectedSchedule,
}: {
  challengeId: number;
  selectedSchedule: ChallengeSchedule;
}) => {
  const [guideType, setGuideType] = useState<
    'READ' | 'COMMENT' | 'SHARING' | 'REMIND'
  >('READ');
  const [notice, setNotice] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const { mutate: createDailyGuide, isPending } =
    useCreateChallengeDailyGuideMutation({
      challengeId,
      dayIndex: selectedSchedule.dayIndex,
    });

  const handleCreate = () => {
    if (!selectedImageUrl) {
      alert('생성할 이미지를 선택해주세요.');
      return;
    }

    if (isNoticeRequiredGuideType(guideType) && !notice.trim()) {
      alert('COMMENT, REMIND 타입은 공지 문구를 입력해주세요.');
      return;
    }

    createDailyGuide({
      challengeId,
      payload: {
        dayIndex: selectedSchedule.dayIndex,
        type: guideType,
        imageUrl: selectedImageUrl,
        notice: isNoticeRequiredGuideType(guideType)
          ? notice.trim()
          : undefined,
      },
    });
  };

  return (
    <CreateFormWrapper>
      <CreateFormTitle>데일리 가이드 생성</CreateFormTitle>

      <FormGroup>
        <FormLabel htmlFor="daily-guide-type">타입</FormLabel>
        <FormSelect
          id="daily-guide-type"
          value={guideType}
          onChange={(event) =>
            setGuideType(
              event.target.value as 'READ' | 'COMMENT' | 'SHARING' | 'REMIND',
            )
          }
        >
          {GUIDE_TYPE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
      </FormGroup>

      <FormGroup>
        <FormLabel>이미지 선택</FormLabel>
        {selectedImageUrl ? (
          <CreatePreviewWrapper>
            <CreatePreviewImage
              src={selectedImageUrl}
              alt={`${formatDayIndexLabel(selectedSchedule.dayIndex)} 선택 이미지`}
            />
            <PreviewCaption>{selectedImageUrl}</PreviewCaption>
          </CreatePreviewWrapper>
        ) : (
          <ModalStateText>선택된 이미지가 없습니다.</ModalStateText>
        )}
        <SecondaryButton
          type="button"
          onClick={() => setIsImageSelectorOpen(true)}
        >
          이미지 선택
        </SecondaryButton>
      </FormGroup>

      {isNoticeRequiredGuideType(guideType) && (
        <FormGroup>
          <FormLabel htmlFor="daily-guide-notice">
            공지 문구
            {guideType === 'COMMENT' ? ' (필수)' : ' (선택)'}
          </FormLabel>
          <FormHelpText>
            {guideType === 'COMMENT'
              ? 'COMMENT 타입은 공지 문구 입력이 필수입니다.'
              : 'REMIND 타입은 공지 문구를 입력하지 않아도 됩니다.'}
          </FormHelpText>
          <FormTextarea
            id="daily-guide-notice"
            value={notice}
            onChange={(event) => setNotice(event.target.value)}
            placeholder="공지 문구를 입력하세요"
          />
        </FormGroup>
      )}

      <CreateButton
        type="button"
        onClick={handleCreate}
        disabled={isPending || !selectedImageUrl}
      >
        {isPending ? '생성 중...' : '데일리 가이드 생성'}
      </CreateButton>

      {isImageSelectorOpen && (
        <ChallengeDailyGuideImageSelectorModal
          challengeId={challengeId}
          dayIndex={selectedSchedule.dayIndex}
          selectedImageUrl={selectedImageUrl}
          onClose={() => setIsImageSelectorOpen(false)}
          onSelect={(imageUrl) => {
            setSelectedImageUrl(imageUrl);
            setIsImageSelectorOpen(false);
          }}
        />
      )}
    </CreateFormWrapper>
  );
};

const ChallengeDailyGuideImageSelectorModal = ({
  challengeId,
  dayIndex,
  selectedImageUrl,
  onClose,
  onSelect,
}: {
  challengeId: number;
  dayIndex: number;
  selectedImageUrl: string;
  onClose: () => void;
  onSelect: (imageUrl: string) => void;
}) => {
  const { data, isLoading, isError } = useQuery({
    ...challengesQueries.dailyGuideImages(challengeId),
    enabled: true,
  });

  return (
    <SelectorOverlay onClick={onClose}>
      <SelectorCard onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{formatDayIndexLabel(dayIndex)} 이미지 선택</ModalTitle>
          <CloseButton type="button" onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        {isLoading && (
          <ModalStateText>이미지 목록을 불러오는 중...</ModalStateText>
        )}

        {isError && (
          <ModalErrorText>이미지 목록을 불러오지 못했습니다.</ModalErrorText>
        )}

        {data && data.length > 0 && (
          <ImageOptionsGrid>
            {data.map((imageUrl) => {
              const isSelected = selectedImageUrl === imageUrl;

              return (
                <ImageOptionButton
                  key={imageUrl}
                  type="button"
                  isSelected={isSelected}
                  onClick={() => onSelect(imageUrl)}
                >
                  <CreatePreviewImage
                    src={imageUrl}
                    alt={`${formatDayIndexLabel(dayIndex)} 선택 이미지`}
                  />
                  <PreviewCaption>{imageUrl}</PreviewCaption>
                </ImageOptionButton>
              );
            })}
          </ImageOptionsGrid>
        )}

        {data && data.length === 0 && (
          <ModalStateText>선택 가능한 이미지가 없습니다.</ModalStateText>
        )}
      </SelectorCard>
    </SelectorOverlay>
  );
};

const ChallengeDailyGuideContent = ({
  guide,
  scheduleImageUrl,
}: {
  guide: ChallengeDailyGuide;
  scheduleImageUrl?: string;
}) => {
  const previewImageUrl = scheduleImageUrl || guide.imageUrl;

  return (
    <ModalContentWrapper>
      <InfoGrid>
        <InfoRow>
          <InfoLabel>가이드 ID</InfoLabel>
          <InfoValue>{guide.id}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>챌린지 ID</InfoLabel>
          <InfoValue>{guide.challengeId}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>일차</InfoLabel>
          <InfoValue>{formatDayIndexLabel(guide.dayIndex)}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>타입</InfoLabel>
          <InfoValue>{guide.type}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>댓글 허용</InfoLabel>
          <InfoValue>{guide.commentEnabled ? '허용' : '비허용'}</InfoValue>
        </InfoRow>
      </InfoGrid>

      {isNoticeRequiredGuideType(guide.type) && (
        <SectionWrapper>
          <SectionTitle>공지 문구</SectionTitle>
          <NoticeBox>{guide.notice || '-'}</NoticeBox>
        </SectionWrapper>
      )}

      <SectionWrapper>
        <SectionTitle>이미지</SectionTitle>
        {previewImageUrl ? (
          <ImagePreview
            src={previewImageUrl}
            alt={`${formatDayIndexLabel(guide.dayIndex)} 가이드`}
          />
        ) : (
          <ModalStateText>등록된 이미지가 없습니다.</ModalStateText>
        )}
      </SectionWrapper>
    </ModalContentWrapper>
  );
};

const ChallengeScheduleCalendar = ({ challengeId, enabled = true }: Props) => {
  const [selectedSchedule, setSelectedSchedule] =
    useState<ChallengeSchedule | null>(null);
  const { data, isLoading, isError } = useQuery({
    ...challengesQueries.schedule(challengeId),
    enabled,
  });

  if (isLoading) {
    return <StateText>챌린지 일정을 불러오는 중...</StateText>;
  }

  if (isError) {
    return (
      <ErrorText>
        챌린지 일정을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
      </ErrorText>
    );
  }

  if (!data || data.length === 0) {
    return <StateText>등록된 일정이 없습니다.</StateText>;
  }

  const months = buildChallengeScheduleMonths(data);

  return (
    <Container>
      {months.map((month) => (
        <MonthWrapper key={month.key}>
          <MonthTitle>{month.title}</MonthTitle>
          <WeekHeaderWrapper>
            {DAY_OF_WEEK_LABELS.map((label) => (
              <WeekHeaderBox key={label}>{label}</WeekHeaderBox>
            ))}
          </WeekHeaderWrapper>
          <CalendarGrid>
            {month.cells.map((schedule, index) => {
              if (!schedule) {
                return <EmptyDayBox key={`${month.key}-empty-${index}`} />;
              }

              return (
                <DayButton
                  key={schedule.date}
                  type="button"
                  onClick={() => setSelectedSchedule(schedule)}
                >
                  <DayMetaWrapper>
                    <DateText>{Number(schedule.date.slice(8, 10))}</DateText>
                    <DayIndexBadge isOffDay={schedule.dayIndex === 0}>
                      {formatDayIndexLabel(schedule.dayIndex)}
                    </DayIndexBadge>
                    {schedule.dailyGuideType && (
                      <GuideTypeBadge
                        tone={getGuideTypeTone(schedule.dailyGuideType)}
                      >
                        {schedule.dailyGuideType}
                      </GuideTypeBadge>
                    )}
                  </DayMetaWrapper>
                  {schedule.imageUrl && (
                    <DayImagePreview
                      src={schedule.imageUrl}
                      alt={`${formatDayIndexLabel(schedule.dayIndex)} 썸네일`}
                    />
                  )}
                </DayButton>
              );
            })}
          </CalendarGrid>
        </MonthWrapper>
      ))}
      {selectedSchedule && (
        <ChallengeDailyGuideModal
          challengeId={challengeId}
          selectedSchedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
        />
      )}
    </Container>
  );
};

export default ChallengeScheduleCalendar;

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
`;

const MonthWrapper = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const MonthTitle = styled.h4`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const WeekHeaderWrapper = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};

  grid-template-columns: repeat(7, minmax(0, 1fr));
`;

const WeekHeaderBox = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  background-color: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.xs};
  text-align: center;
`;

const CalendarGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xs};

  grid-template-columns: repeat(7, minmax(0, 1fr));
`;

const DayButton = styled.button`
  min-height: 144px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
  align-items: flex-start;

  background-color: ${({ theme }) => theme.colors.white};
  text-align: left;

  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.sm};

    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const DayMetaWrapper = styled.div`
  min-width: 0;

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  align-items: center;
`;

const EmptyDayBox = styled.div`
  min-height: 144px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.gray50};
`;

const DateText = styled.div`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const DayImagePreview = styled.img`
  width: 120px;
  height: 88px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  flex-shrink: 0;
  align-self: center;

  background-color: ${({ theme }) => theme.colors.gray100};

  object-fit: contain;
`;

const DayIndexBadge = styled.div<{ isOffDay: boolean }>`
  width: fit-content;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: 999px;

  background-color: ${({ isOffDay, theme }) =>
    isOffDay ? theme.colors.gray200 : theme.colors.primary};
  color: ${({ isOffDay, theme }) =>
    isOffDay ? theme.colors.gray700 : theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const GuideTypeBadge = styled.div<{ tone: GuideTypeTone }>`
  width: fit-content;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: 999px;

  background-color: ${({ theme, tone }) => {
    if (tone === 'primary') return `${theme.colors.primary}1A`;
    if (tone === 'success') return `${theme.colors.success}1A`;
    if (tone === 'warning') return `${theme.colors.warning}1A`;
    if (tone === 'error') return `${theme.colors.error}1A`;
    return theme.colors.gray100;
  }};
  color: ${({ theme, tone }) => {
    if (tone === 'primary') return theme.colors.primary;
    if (tone === 'success') return theme.colors.success;
    if (tone === 'warning') return theme.colors.warning;
    if (tone === 'error') return theme.colors.error;
    return theme.colors.gray700;
  }};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const StateText = styled.div`
  padding: ${({ theme }) => theme.spacing.md} 0;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ErrorText = styled(StateText)`
  color: ${({ theme }) => theme.colors.error};
`;

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(15 23 42 / 48%);

  inset: 0;
`;

const ModalCard = styled.div`
  width: min(880px, calc(100vw - 32px));
  max-height: calc(100vh - 48px);
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h4`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: inline-flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.lg};

  cursor: pointer;
`;

const ModalContentWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const InfoRow = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};

  grid-template-columns: 120px minmax(0, 1fr);
`;

const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const InfoValue = styled.div`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  overflow-wrap: anywhere;
`;

const SectionWrapper = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const SectionTitle = styled.h5`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const NoticeBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const ImagePreview = styled.img`
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  object-fit: cover;
`;

const ModalStateText = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ModalErrorText = styled(ModalStateText)`
  color: ${({ theme }) => theme.colors.error};
`;

const CreateFormWrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.gray50};
`;

const CreateFormTitle = styled.h5`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const FormGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const FormLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const FormHelpText = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const FormSelect = styled.select`
  min-height: 42px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const FormTextarea = styled.textarea`
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};

  resize: vertical;
`;

const ImageOptionsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};

  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
`;

const ImageOptionButton = styled.button<{ isSelected: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid
    ${({ isSelected, theme }) =>
      isSelected ? theme.colors.primary : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;

  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.colors.gray50 : theme.colors.white};
  text-align: left;

  cursor: pointer;
`;

const CreatePreviewWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const CreatePreviewImage = styled.img`
  width: 100%;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};

  object-fit: contain;
`;

const PreviewCaption = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};

  overflow-wrap: anywhere;
`;

const SecondaryButton = styled.button`
  min-height: 42px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
`;

const CreateButton = styled.button`
  min-height: 44px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SelectorOverlay = styled(ModalOverlay)`
  z-index: 1001;
`;

const SelectorCard = styled(ModalCard)`
  width: min(960px, calc(100vw - 32px));
`;
