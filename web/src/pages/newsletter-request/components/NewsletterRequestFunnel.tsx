import { ApiError } from '@bombom/shared/apis';
import { Button, useModal, toast, useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import DoneTimeline from './DoneTimeline';
import DuplicateRequestSheet, {
  type DuplicateRelation,
} from './DuplicateRequestSheet';
import FunnelLayout from './FunnelLayout';
import FunnelTitle from './FunnelTitle';
import NameSuggestionList from './NameSuggestionList';
import RegisteredNewsletterCard from './RegisteredNewsletterCard';
import useCreateNewsletterRequestMutation from '../hooks/useCreateNewsletterRequestMutation';
import useNameSuggestions from '../hooks/useNameSuggestions';
import useToggleNewsletterRequestLikeMutation from '../hooks/useToggleNewsletterRequestLikeMutation';
import { getRequestCount } from '../utils/newsletterRequestDisplay';
import {
  isValidNewsletterUrl,
  toAbsoluteUrl,
  toHostLabel,
} from '../utils/newsletterRequestUrl';
import { queries } from '@/apis/queries';
import InputField from '@/components/InputField/InputField';
import RequireLoginCard from '@/components/RequireLoginCard/RequireLoginCard';
import { useAuth } from '@/contexts/AuthContext';
import type { NewsletterRequest } from '@/apis/newsletterRequests/newsletterRequests.api';
import type { ChangeEvent } from 'react';
import CheckIcon from '#/assets/svg/check.svg';
import ClockIcon from '#/assets/svg/clock.svg';

type FunnelStep = 'name' | 'link' | 'reason' | 'confirm' | 'done';

const QUESTION_STEPS: FunnelStep[] = ['name', 'link', 'reason', 'confirm'];
const NAME_MAX_LENGTH = 50;
const REASON_MAX_LENGTH = 200;
const BOARD_PATH = '/newsletter-requests';
const DUPLICATED_DATA_ERROR_CODE = 'M009';

type DuplicateTarget = {
  id: number;
  name: string;
  requestCount: number;
  relation: DuplicateRelation;
};

const toRelation = (
  request: Pick<NewsletterRequest, 'liked' | 'mine'> | undefined,
): DuplicateRelation => {
  if (request?.mine) return 'mine';
  if (request?.liked) return 'liked';
  return 'none';
};

interface HandleLinkNextParams {
  isFromSubmit?: boolean;
}

const formatElapsed = (milliseconds: number) => {
  const seconds = Math.max(1, Math.round(milliseconds / 1000));
  if (seconds < 60) return `${seconds}초`;
  return `${Math.floor(seconds / 60)}분 ${seconds % 60}초`;
};

const NewsletterRequestFunnel = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();
  const startedAtRef = useRef(Date.now());
  const [step, setStep] = useState<FunnelStep>('name');
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [reason, setReason] = useState('');
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [elapsed, setElapsed] = useState<string | null>(null);
  const [duplicateTarget, setDuplicateTarget] =
    useState<DuplicateTarget | null>(null);
  // 링크 확인 결과 이미 봄봄에 있는 뉴스레터. 이동하지 않고 입력창 아래에 보여준다.
  const [registeredNewsletterId, setRegisteredNewsletterId] = useState<
    number | null
  >(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const nameFieldRef = useRef<HTMLDivElement>(null);
  const registeredNoticeRef = useRef<HTMLParagraphElement>(null);
  // 링크 확인 응답이 늦게 와도 지금 화면과 맞을 때만 반영하려고 최신 값을 따로 둔다.
  const latestUrlRef = useRef(url);
  const latestStepRef = useRef(step);
  useLayoutEffect(() => {
    latestUrlRef.current = url;
    latestStepRef.current = step;
  }, [url, step]);
  const duplicateModal = useModal({
    onClose: () => setDuplicateTarget(null),
  });
  const suggestions = useNameSuggestions(name);
  // 스크린리더에는 목록 전체 대신 결과 개수만 알린다.
  const suggestionSummary = suggestions.hasResults
    ? `봄봄에 있는 뉴스레터 ${suggestions.newsletters.length}개, 신청 중 ${suggestions.requests.length}개`
    : '';
  const device = useDevice();
  const isMobile = device === 'mobile';

  // 모바일은 키보드가 결과를 가리기 쉬워서, 결과가 처음 뜰 때 이름 입력칸을 화면 위쪽으로 올린다.
  // 단계 이동으로는 다시 올리지 않도록 결과가 생길 때만 반응한다.
  useEffect(() => {
    if (
      isMobile &&
      suggestions.hasResults &&
      latestStepRef.current === 'name'
    ) {
      nameFieldRef.current?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  }, [isMobile, suggestions.hasResults]);

  // 링크 확인 결과로 '다음' 버튼이 사라지므로, 포커스를 안내 문구로 옮겨 스크린리더가 읽게 한다.
  useEffect(() => {
    if (registeredNewsletterId) registeredNoticeRef.current?.focus();
  }, [registeredNewsletterId]);

  const { mutate: createRequest, isPending: isCreating } =
    useCreateNewsletterRequestMutation({
      onSuccess: () => {
        setElapsed(formatElapsed(Date.now() - startedAtRef.current));
        setStep('done');
      },
      onError: (error) => {
        if (
          error instanceof ApiError &&
          error.rawBody?.code === DUPLICATED_DATA_ERROR_CODE
        ) {
          handleLinkNext({ isFromSubmit: true });
          return;
        }
        toast.error('신청하지 못했어요. 잠시 후 다시 시도해 주세요.');
      },
    });
  const { mutate: toggleLike, isPending: isLiking } =
    useToggleNewsletterRequestLikeMutation();

  const stepNumber = QUESTION_STEPS.indexOf(step) + 1;

  const goBack = () => {
    const previousStep = QUESTION_STEPS[stepNumber - 2];
    if (!previousStep) {
      navigate({ to: BOARD_PATH });
      return;
    }
    setStep(previousStep);
  };

  const openDuplicateSheet = (target: DuplicateTarget) => {
    setDuplicateTarget(target);
    duplicateModal.openModal();
  };

  // 이름 단계 검색 결과에서 바로 공감한다. 결과 목록이 새로고침되며 '공감함'으로 바뀐다.
  const handleSuggestionLike = (request: NewsletterRequest) => {
    toggleLike({ newsletterRequestId: request.id, liked: false });
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setUrlError(null);
    setRegisteredNewsletterId(null);
  };

  const resetLink = () => {
    setUrl('');
    setRegisteredNewsletterId(null);
    urlInputRef.current?.focus();
  };

  const handleLinkNext = async ({
    isFromSubmit = false,
  }: HandleLinkNextParams = {}) => {
    if (!isValidNewsletterUrl(url)) {
      setUrlError(
        '링크 형식이 맞지 않아요. https://로 시작하는 주소를 넣어 주세요.',
      );
      return;
    }
    const requestedUrl = url;
    const requestedStep = step;
    // 확인하는 사이 링크를 고쳤거나 다른 단계로 갔다면 지난 결과는 버린다.
    const isStale = () =>
      latestUrlRef.current !== requestedUrl ||
      latestStepRef.current !== requestedStep;
    setIsChecking(true);
    try {
      const check = await queryClient.fetchQuery(
        queries.newsletterRequestCheck({ url: toAbsoluteUrl(requestedUrl) }),
      );
      if (isStale()) return;
      if (check.result === 'REGISTERED' && check.newsletterId) {
        // 신청 직전 중복으로 돌아온 경우에만 링크 단계로 되돌려 결과를 보여준다.
        if (isFromSubmit) setStep('link');
        setRegisteredNewsletterId(check.newsletterId);
        return;
      }
      if (check.result === 'REQUESTED' && check.newsletterRequestId) {
        const requests = await queryClient.fetchQuery(
          queries.newsletterRequests(),
        );
        if (isStale()) return;
        const found = requests.find(
          (request) => request.id === check.newsletterRequestId,
        );
        openDuplicateSheet({
          id: check.newsletterRequestId,
          name: found?.name ?? name,
          requestCount: found ? getRequestCount(found) : 1,
          relation: toRelation(found),
        });
        return;
      }
      setStep('reason');
    } catch {
      // 확인하는 사이 고친 링크의 실패는 알리지 않는다.
      if (isStale()) return;
      toast.error('링크를 확인하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = () => {
    createRequest({
      name: name.trim(),
      url: toAbsoluteUrl(url),
      reason: reason.trim() || undefined,
      isNotificationEnabled,
    });
  };

  const handleLike = () => {
    if (!duplicateTarget || duplicateTarget.relation !== 'none') return;
    toggleLike(
      { newsletterRequestId: duplicateTarget.id, liked: false },
      { onSuccess: () => navigate({ to: BOARD_PATH }) },
    );
  };

  const goToMyRequests = () => {
    navigate({ to: BOARD_PATH, search: { tab: 'mine' } });
  };

  if (!isLoggedIn) {
    return <RequireLoginCard />;
  }

  if (step === 'done') {
    return (
      <DoneContainer>
        <DoneHeroWrapper>
          <CheckCircle>
            <CheckIcon width={32} height={32} />
          </CheckCircle>
          {elapsed && (
            <ElapsedBox>
              <ClockIcon width={14} height={14} />
              {elapsed} 만에 신청했어요
            </ElapsedBox>
          )}
          <FunnelTitle
            title="신청을 받았어요"
            description={
              isNotificationEnabled
                ? `${name.trim()} 등록되면 알려드릴게요.`
                : '진행 상황은 내 신청에서 확인할 수 있어요.'
            }
          />
        </DoneHeroWrapper>
        <DoneTimeline />
        <PrimaryButton onClick={goToMyRequests}>내 신청 보기</PrimaryButton>
      </DoneContainer>
    );
  }

  return (
    <>
      <FunnelLayout
        step={stepNumber}
        totalStep={QUESTION_STEPS.length}
        onBack={goBack}
        footer={
          <>
            {step === 'name' && (
              <PrimaryButton
                disabled={!name.trim()}
                onClick={() => setStep('link')}
              >
                {suggestions.hasResults
                  ? '찾는 게 없어요, 새로 신청할게요'
                  : '다음'}
              </PrimaryButton>
            )}
            {step === 'link' &&
              (registeredNewsletterId ? (
                <TextButton variant="transparent" onClick={resetLink}>
                  다른 링크로 다시 입력하기
                </TextButton>
              ) : (
                <PrimaryButton
                  disabled={!url.trim() || isChecking}
                  onClick={() => handleLinkNext()}
                >
                  다음
                </PrimaryButton>
              ))}
            {step === 'reason' && (
              <ButtonRow>
                <SecondaryButton
                  variant="outlined"
                  onClick={() => {
                    setReason('');
                    setStep('confirm');
                  }}
                >
                  건너뛰기
                </SecondaryButton>
                <PrimaryButton
                  disabled={!reason.trim()}
                  onClick={() => setStep('confirm')}
                >
                  다음
                </PrimaryButton>
              </ButtonRow>
            )}
            {step === 'confirm' && (
              <PrimaryButton
                disabled={isCreating || isChecking}
                onClick={handleSubmit}
              >
                신청하기
              </PrimaryButton>
            )}
          </>
        }
      >
        {step === 'name' && (
          <>
            <FunnelTitle
              showTimePromise
              title={
                <>
                  어떤 뉴스레터를
                  <br />
                  받고 싶나요?
                </>
              }
              description="뉴스레터 이름을 알려주세요."
            />
            <NameFieldWrapper ref={nameFieldRef}>
              <InputField
                name="newsletter-name"
                label="뉴스레터 이름"
                inputValue={name}
                onInputChange={(event) =>
                  setName(event.target.value.slice(0, NAME_MAX_LENGTH))
                }
                placeholder="예: 주간 개발 노트"
              />
            </NameFieldWrapper>
            <VisuallyHiddenStatus role="status">
              {suggestionSummary}
            </VisuallyHiddenStatus>
            <NameSuggestionList
              keyword={suggestions.keyword}
              requests={suggestions.requests}
              newsletters={suggestions.newsletters}
              isLikePending={isLiking}
              onLike={handleSuggestionLike}
            />
          </>
        )}
        {step === 'link' && (
          <>
            <FunnelTitle
              title={
                <>
                  {name.trim()}의
                  <br />
                  링크를 알려주세요
                </>
              }
              description="구독 페이지나 홈페이지 링크면 돼요. 나머지 정보는 봄봄이 찾아서 채워요."
            />
            <InputField
              name="newsletter-url"
              label="뉴스레터 링크"
              type="url"
              inputMode="url"
              inputValue={url}
              onInputChange={handleUrlChange}
              placeholder="https://"
              errorString={urlError}
              ref={urlInputRef}
            />
            {registeredNewsletterId && (
              <>
                <RegisteredNotice
                  ref={registeredNoticeRef}
                  role="status"
                  tabIndex={-1}
                >
                  이 링크의 뉴스레터는 이미 봄봄에 있어요
                </RegisteredNotice>
                <RegisteredNewsletterCard
                  newsletterId={registeredNewsletterId}
                  variant="tinted"
                />
              </>
            )}
          </>
        )}
        {step === 'reason' && (
          <>
            <FunnelTitle
              title={
                <>
                  이 뉴스레터를
                  <br />
                  추천하는 이유가 있나요?
                </>
              }
              description="적어 주시면 검토할 때 큰 도움이 돼요."
            />
            <ReasonField>
              <FieldLabel htmlFor="newsletter-reason">
                추천 이유 (선택)
              </FieldLabel>
              <ReasonTextarea
                id="newsletter-reason"
                value={reason}
                maxLength={REASON_MAX_LENGTH}
                placeholder="예: 매주 개발 트렌드를 짧게 정리해줘서 출근길에 읽기 좋아요"
                onChange={(event) => setReason(event.target.value)}
              />
              <Counter>
                {reason.length}/{REASON_MAX_LENGTH}
              </Counter>
            </ReasonField>
          </>
        )}
        {step === 'confirm' && (
          <>
            <FunnelTitle
              title="이렇게 신청할게요"
              description="신청 후에는 봄봄이 이름, 소개, 분야, 발행 주기 같은 정보를 자동으로 모아요."
            />
            <SummaryList>
              <SummaryRow>
                <SummaryTerm>이름</SummaryTerm>
                <SummaryValue>{name.trim()}</SummaryValue>
                <EditButton type="button" onClick={() => setStep('name')}>
                  수정
                </EditButton>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>링크</SummaryTerm>
                <SummaryValue>{toHostLabel(url)}</SummaryValue>
                <EditButton type="button" onClick={() => setStep('link')}>
                  수정
                </EditButton>
              </SummaryRow>
              <SummaryRow>
                <SummaryTerm>추천 이유</SummaryTerm>
                <SummaryValue isMuted={!reason.trim()}>
                  {reason.trim() || '적지 않았어요'}
                </SummaryValue>
                <EditButton type="button" onClick={() => setStep('reason')}>
                  수정
                </EditButton>
              </SummaryRow>
            </SummaryList>
            <NotifyLabel htmlFor="newsletter-notify">
              등록되면 알림 받기
              <NotifyCheckbox
                id="newsletter-notify"
                type="checkbox"
                checked={isNotificationEnabled}
                onChange={(event) =>
                  setIsNotificationEnabled(event.target.checked)
                }
              />
            </NotifyLabel>
          </>
        )}
      </FunnelLayout>

      {duplicateTarget && (
        <DuplicateRequestSheet
          modalRef={duplicateModal.modalRef}
          isOpen={duplicateModal.isOpen}
          closeModal={duplicateModal.closeModal}
          name={duplicateTarget.name}
          requestCount={duplicateTarget.requestCount}
          relation={duplicateTarget.relation}
          isPending={isLiking}
          onLike={handleLike}
          onViewMine={goToMyRequests}
        />
      )}
    </>
  );
};

export default NewsletterRequestFunnel;

const PrimaryButton = styled(Button)`
  width: 100%;
  height: 52px;

  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const SecondaryButton = styled(Button)`
  width: 100%;
  height: 52px;

  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const TextButton = styled(Button)`
  width: 100%;
  height: 48px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  text-decoration: underline;
`;

const NameFieldWrapper = styled.div`
  scroll-margin-top: 16px;
`;

const VisuallyHiddenStatus = styled.p`
  overflow: hidden;
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;

  white-space: nowrap;

  clip: rect(0 0 0 0);
`;

const RegisteredNotice = styled.p`
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t4Bold};
`;

const ButtonRow = styled.div`
  display: grid;
  gap: 8px;

  grid-template-columns: 1fr 2fr;
`;

const ReasonField = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const FieldLabel = styled.label`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const ReasonTextarea = styled.textarea`
  height: 132px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};

  resize: none;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryBomBom};
  }
`;

const Counter = styled.span`
  align-self: flex-end;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};

  font-variant-numeric: tabular-nums;
`;

const SummaryList = styled.dl`
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};

  display: flex;
  flex-direction: column;
`;

const SummaryRow = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  display: grid;
  gap: 12px;
  align-items: baseline;

  grid-template-columns: 72px minmax(0, 1fr) auto;
`;

const SummaryTerm = styled.dt`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const SummaryValue = styled.dd<{ isMuted?: boolean }>`
  color: ${({ theme, isMuted }) =>
    isMuted ? theme.colors.textTertiary : theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Regular};

  overflow-wrap: anywhere;
`;

const EditButton = styled.button`
  padding: 4px;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t4Regular};

  text-decoration: underline;
`;

const NotifyLabel = styled.label`
  padding: 16px;
  border-radius: 12px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const NotifyCheckbox = styled.input`
  width: 20px;
  height: 20px;

  accent-color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const DoneContainer = styled.div`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 48px 4px 24px;

  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const DoneHeroWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const CheckCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};
`;

const ElapsedBox = styled.span`
  padding: 4px 12px;
  border-radius: 999px;

  display: inline-flex;
  gap: 4px;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primaryDark};
  font: ${({ theme }) => theme.fonts.t4Bold};

  font-variant-numeric: tabular-nums;
`;
