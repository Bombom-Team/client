import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { challengesQueries } from '@/apis/challenges/challenges.query';
import { useCreateChallengeDailyGuideMutation } from '@/pages/challenges/hooks/useCreateChallengeDailyGuideMutation';
import { useDeleteChallengeDailyGuideMutation } from '@/pages/challenges/hooks/useDeleteChallengeDailyGuideMutation';
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
            challengeId={challengeId}
            guide={data}
            scheduleImageUrl={selectedSchedule.imageUrl}
            onDeleted={onClose}
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
  return guideType === 'COMMENT';
};

const isNoticeFieldVisibleGuideType = (guideType: string) => {
  return guideType === 'COMMENT' || guideType === 'REMIND';
};

const getDefaultUploadFileName = (fileName: string) => {
  return fileName.replace(/\.[^/.]+$/, '');
};

const getGuideNoticeDescription = (guideType: string) => {
  return guideType === 'COMMENT'
    ? 'COMMENT 타입은 공지 문구 입력이 필수입니다.'
    : 'REMIND 타입은 공지 문구를 입력하지 않아도 됩니다.';
};

const buildCreateGuideRequest = ({
  dayIndex,
  guideType,
  notice,
  selectedImageUrl,
  selectedImageFile,
  uploadFileName,
}: {
  dayIndex: number;
  guideType: 'READ' | 'COMMENT' | 'SHARING' | 'REMIND';
  notice: string;
  selectedImageUrl: string;
  selectedImageFile: File | null;
  uploadFileName: string;
}) => {
  return {
    dayIndex,
    type: guideType,
    fileName: selectedImageFile ? uploadFileName.trim() : undefined,
    imageUrl: selectedImageFile ? undefined : selectedImageUrl,
    notice: notice.trim() || undefined,
  };
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
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [isImageSelectorOpen, setIsImageSelectorOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { mutate: createDailyGuide, isPending } =
    useCreateChallengeDailyGuideMutation({
      challengeId,
      dayIndex: selectedSchedule.dayIndex,
    });

  const validateCreateForm = () => {
    if (!selectedImageUrl && !selectedImageFile) {
      alert('기존 이미지를 선택하거나 새 이미지를 업로드해주세요.');
      return false;
    }

    if (isNoticeRequiredGuideType(guideType) && !notice.trim()) {
      alert('COMMENT 타입은 공지 문구를 입력해주세요.');
      return false;
    }

    if (selectedImageFile && !uploadFileName.trim()) {
      alert('업로드할 이미지 파일명을 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleOpenPreview = () => {
    if (!validateCreateForm()) {
      return;
    }

    setIsPreviewOpen(true);
  };

  const handleCreate = () => {
    createDailyGuide({
      challengeId,
      image: selectedImageFile ?? undefined,
      request: buildCreateGuideRequest({
        dayIndex: selectedSchedule.dayIndex,
        guideType,
        notice,
        selectedImageUrl,
        selectedImageFile,
        uploadFileName,
      }),
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
        ) : selectedImageFile ? (
          <CreatePreviewWrapper>
            <UploadInfoBox>
              새 이미지 업로드 선택됨: {selectedImageFile.name}
            </UploadInfoBox>
          </CreatePreviewWrapper>
        ) : (
          <ModalStateText>선택된 이미지가 없습니다.</ModalStateText>
        )}
        <ActionButtonsWrapper>
          <SecondaryButton
            type="button"
            onClick={() => setIsImageSelectorOpen(true)}
          >
            기존 이미지 선택
          </SecondaryButton>
          <FileUploadLabel>
            새 이미지 업로드
            <HiddenFileInput
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) {
                  return;
                }

                setSelectedImageFile(file);
                setSelectedImageUrl('');
                setUploadFileName(getDefaultUploadFileName(file.name));
              }}
            />
          </FileUploadLabel>
        </ActionButtonsWrapper>
        <FormHelpText>
          기존 이미지 선택 또는 새 이미지 업로드 중 하나는 반드시 필요합니다.
        </FormHelpText>
      </FormGroup>

      {selectedImageFile && (
        <FormGroup>
          <FormLabel htmlFor="daily-guide-file-name">업로드 파일명</FormLabel>
          <FormInput
            id="daily-guide-file-name"
            type="text"
            value={uploadFileName}
            onChange={(event) => setUploadFileName(event.target.value)}
            placeholder="예: day1-read-guide"
          />
          <FormHelpText>
            확장자를 제외한 S3 저장 파일명을 입력합니다.
          </FormHelpText>
        </FormGroup>
      )}

      {isNoticeFieldVisibleGuideType(guideType) && (
        <FormGroup>
          <FormLabel htmlFor="daily-guide-notice">
            공지 문구
            {guideType === 'COMMENT' ? ' (필수)' : ' (선택)'}
          </FormLabel>
          <FormHelpText>{getGuideNoticeDescription(guideType)}</FormHelpText>
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
        onClick={handleOpenPreview}
        disabled={isPending}
      >
        생성 미리보기
      </CreateButton>

      {isImageSelectorOpen && (
        <ChallengeDailyGuideImageSelectorModal
          challengeId={challengeId}
          dayIndex={selectedSchedule.dayIndex}
          selectedImageUrl={selectedImageUrl}
          onClose={() => setIsImageSelectorOpen(false)}
          onSelect={(imageUrl) => {
            setSelectedImageUrl(imageUrl);
            setSelectedImageFile(null);
            setUploadFileName('');
            setIsImageSelectorOpen(false);
          }}
        />
      )}

      {isPreviewOpen && (
        <ChallengeDailyGuideCreatePreviewModal
          selectedSchedule={selectedSchedule}
          guideType={guideType}
          notice={notice}
          selectedImageUrl={selectedImageUrl}
          selectedImageFile={selectedImageFile}
          uploadFileName={uploadFileName}
          isPending={isPending}
          onClose={() => setIsPreviewOpen(false)}
          onConfirm={() => {
            handleCreate();
            setIsPreviewOpen(false);
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

const ChallengeDailyGuideCreatePreviewModal = ({
  selectedSchedule,
  guideType,
  notice,
  selectedImageUrl,
  selectedImageFile,
  uploadFileName,
  isPending,
  onClose,
  onConfirm,
}: {
  selectedSchedule: ChallengeSchedule;
  guideType: 'READ' | 'COMMENT' | 'SHARING' | 'REMIND';
  notice: string;
  selectedImageUrl: string;
  selectedImageFile: File | null;
  uploadFileName: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [previewImageUrl, setPreviewImageUrl] = useState(selectedImageUrl);

  useEffect(() => {
    if (selectedImageUrl) {
      setPreviewImageUrl(selectedImageUrl);
      return;
    }

    if (!selectedImageFile) {
      setPreviewImageUrl('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImageFile);
    setPreviewImageUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedImageFile, selectedImageUrl]);

  return (
    <SelectorOverlay onClick={onClose}>
      <ConfirmCard onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>생성 미리보기</ModalTitle>
          <CloseButton type="button" onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <ModalContentWrapper>
          <InfoGrid>
            <InfoRow>
              <InfoLabel>일차</InfoLabel>
              <InfoValue>
                {formatDayIndexLabel(selectedSchedule.dayIndex)}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>타입</InfoLabel>
              <InfoValue>{guideType}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>이미지 방식</InfoLabel>
              <InfoValue>
                {selectedImageFile ? '새 이미지 업로드' : '기존 이미지 선택'}
              </InfoValue>
            </InfoRow>
            {selectedImageFile && (
              <InfoRow>
                <InfoLabel>업로드 파일명</InfoLabel>
                <InfoValue>{uploadFileName}</InfoValue>
              </InfoRow>
            )}
          </InfoGrid>

          {isNoticeFieldVisibleGuideType(guideType) && (
            <SectionWrapper>
              <SectionTitle>공지 문구</SectionTitle>
              <NoticeBox>{notice.trim() || '-'}</NoticeBox>
            </SectionWrapper>
          )}

          <SectionWrapper>
            <SectionTitle>이미지 미리보기</SectionTitle>
            {previewImageUrl ? (
              <ImagePreview
                src={previewImageUrl}
                alt={`${formatDayIndexLabel(selectedSchedule.dayIndex)} 생성 미리보기`}
              />
            ) : (
              <ModalStateText>선택된 이미지가 없습니다.</ModalStateText>
            )}
            {selectedImageFile && (
              <FormHelpText>{selectedImageFile.name}</FormHelpText>
            )}
          </SectionWrapper>

          <ActionButtonsWrapper>
            <SecondaryButton
              type="button"
              onClick={onClose}
              disabled={isPending}
            >
              수정 계속하기
            </SecondaryButton>
            <CreateButton
              type="button"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? '생성 중...' : '이 내용으로 생성'}
            </CreateButton>
          </ActionButtonsWrapper>
        </ModalContentWrapper>
      </ConfirmCard>
    </SelectorOverlay>
  );
};

const ChallengeDailyGuideDeleteConfirmModal = ({
  guide,
  previewImageUrl,
  isPending,
  onClose,
  onConfirm,
}: {
  guide: ChallengeDailyGuide;
  previewImageUrl?: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <SelectorOverlay onClick={onClose}>
      <ConfirmCard onClick={(event) => event.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>데일리 가이드 삭제 확인</ModalTitle>
          <CloseButton type="button" onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>

        <WarningBox>
          삭제된 가이드는 복구할 수 없습니다. S3에 저장된 이미지는 삭제되지
          않습니다.
        </WarningBox>

        <ModalContentWrapper>
          <InfoGrid>
            <InfoRow>
              <InfoLabel>가이드 ID</InfoLabel>
              <InfoValue>{guide.id}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>일차</InfoLabel>
              <InfoValue>{formatDayIndexLabel(guide.dayIndex)}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>타입</InfoLabel>
              <InfoValue>{guide.type}</InfoValue>
            </InfoRow>
          </InfoGrid>

          {previewImageUrl && (
            <SectionWrapper>
              <SectionTitle>삭제 대상 이미지</SectionTitle>
              <ImagePreview
                src={previewImageUrl}
                alt={`${formatDayIndexLabel(guide.dayIndex)} 삭제 확인`}
              />
            </SectionWrapper>
          )}

          <ActionButtonsWrapper>
            <SecondaryButton
              type="button"
              onClick={onClose}
              disabled={isPending}
            >
              취소
            </SecondaryButton>
            <DangerButton
              type="button"
              onClick={onConfirm}
              disabled={isPending}
            >
              {isPending ? '삭제 중...' : '삭제 진행'}
            </DangerButton>
          </ActionButtonsWrapper>
        </ModalContentWrapper>
      </ConfirmCard>
    </SelectorOverlay>
  );
};

const ChallengeDailyGuideContent = ({
  challengeId,
  guide,
  scheduleImageUrl,
  onDeleted,
}: {
  challengeId: number;
  guide: ChallengeDailyGuide;
  scheduleImageUrl?: string;
  onDeleted: () => void;
}) => {
  const previewImageUrl = scheduleImageUrl || guide.imageUrl;
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const { mutate: deleteDailyGuide, isPending: isDeletePending } =
    useDeleteChallengeDailyGuideMutation({
      challengeId,
      dayIndex: guide.dayIndex,
      onSuccess: onDeleted,
    });

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

      {isNoticeFieldVisibleGuideType(guide.type) && (
        <SectionWrapper>
          <SectionTitle>공지 문구</SectionTitle>
          <NoticeBox>{guide.notice || '-'}</NoticeBox>
        </SectionWrapper>
      )}

      <DangerButton
        type="button"
        onClick={() => setIsDeleteConfirmOpen(true)}
        disabled={isDeletePending}
      >
        {isDeletePending ? '삭제 중...' : '데일리 가이드 삭제'}
      </DangerButton>

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

      {isDeleteConfirmOpen && (
        <ChallengeDailyGuideDeleteConfirmModal
          guide={guide}
          previewImageUrl={previewImageUrl}
          isPending={isDeletePending}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={() => {
            deleteDailyGuide({
              challengeId,
              guideId: guide.id,
            });
            setIsDeleteConfirmOpen(false);
          }}
        />
      )}
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

const FormInput = styled.input`
  min-height: 42px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const HiddenFileInput = styled.input`
  display: none;
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

const UploadInfoBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ActionButtonsWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const FileUploadLabel = styled.label`
  min-height: 42px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: inline-flex;
  align-items: center;
  justify-content: center;

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

const DangerButton = styled.button`
  min-height: 44px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.error};
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

const ConfirmCard = styled(ModalCard)`
  width: min(720px, calc(100vw - 32px));
`;

const WarningBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => `${theme.colors.warning}14`};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
`;
