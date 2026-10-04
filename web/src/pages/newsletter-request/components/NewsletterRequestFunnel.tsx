import { ApiError } from '@bombom/shared/apis';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import DoneTimeline from './DoneTimeline';
import DuplicateRequestSheet from './DuplicateRequestSheet';
import FunnelLayout from './FunnelLayout';
import FunnelTitle from './FunnelTitle';
import NameSuggestionList from './NameSuggestionList';
import useCreateNewsletterRequestMutation from '../hooks/useCreateNewsletterRequestMutation';
import useToggleNewsletterRequestLikeMutation from '../hooks/useToggleNewsletterRequestLikeMutation';
import {
  isValidNewsletterUrl,
  toAbsoluteUrl,
  toHostLabel,
} from '../utils/newsletterRequestUrl';
import { queries } from '@/apis/queries';
import Button from '@/components/Button/Button';
import InputField from '@/components/InputField/InputField';
import useModal from '@/components/Modal/useModal';
import RequireLoginCard from '@/components/RequireLoginCard/RequireLoginCard';
import { toast } from '@/components/Toast/utils/toastActions';
import { useAuth } from '@/contexts/AuthContext';
import { getRequestCount } from '@/types/newsletterRequest';
import type {
  NewsletterRequest,
  NewsletterSuggestion,
} from '@/types/newsletterRequest';
import type { ChangeEvent } from 'react';
import CheckIcon from '#/assets/svg/check.svg';
import ClockIcon from '#/assets/svg/clock.svg';

type FunnelStep = 'name' | 'link' | 'reason' | 'confirm' | 'done';

const QUESTION_STEPS: FunnelStep[] = ['name', 'link', 'reason', 'confirm'];
const NAME_MAX_LENGTH = 50;
const REASON_MAX_LENGTH = 200;
const BOARD_PATH = '/newsletter-requests';

type DuplicateTarget = {
  id: number;
  name: string;
  requestCount: number;
};

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
  const duplicateModal = useModal({
    onClose: () => setDuplicateTarget(null),
  });

  const { mutate: createRequest, isPending: isCreating } =
    useCreateNewsletterRequestMutation({
      onSuccess: () => {
        setElapsed(formatElapsed(Date.now() - startedAtRef.current));
        setStep('done');
      },
      onError: (error) => {
        if (error instanceof ApiError && error.status === 400) {
          handleLinkNext();
          return;
        }
        toast.error('신청하지 못했어요. 잠시 후 다시 시도해 주세요.');
      },
    });
  const { mutate: toggleLike, isPending: isLiking } =
    useToggleNewsletterRequestLikeMutation({
      onSuccess: () => navigate({ to: BOARD_PATH }),
    });

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

  const handleRequestSelect = (request: NewsletterRequest) => {
    openDuplicateSheet({
      id: request.id,
      name: request.name,
      requestCount: getRequestCount(request),
    });
  };

  const handleNewsletterSelect = (newsletter: NewsletterSuggestion) => {
    toast.info(`${newsletter.name}은(는) 이미 봄봄에 있어요.`);
    navigate({
      to: '/newsletters/$newsletterId',
      params: { newsletterId: String(newsletter.newsletterId) },
    });
  };

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setUrlError(null);
  };

  const handleLinkNext = async () => {
    if (!isValidNewsletterUrl(url)) {
      setUrlError(
        '링크 형식이 맞지 않아요. https://로 시작하는 주소를 넣어 주세요.',
      );
      return;
    }
    setIsChecking(true);
    try {
      const check = await queryClient.fetchQuery(
        queries.newsletterRequestCheck({ url: toAbsoluteUrl(url) }),
      );
      if (check.result === 'REGISTERED' && check.newsletterId) {
        toast.info('이미 봄봄에 있는 뉴스레터예요.');
        navigate({
          to: '/newsletters/$newsletterId',
          params: { newsletterId: String(check.newsletterId) },
        });
        return;
      }
      if (check.result === 'REQUESTED' && check.newsletterRequestId) {
        const requests = await queryClient.fetchQuery(
          queries.newsletterRequests(),
        );
        const found = requests.find(
          (request) => request.id === check.newsletterRequestId,
        );
        openDuplicateSheet({
          id: check.newsletterRequestId,
          name: found?.name ?? name,
          requestCount: found ? getRequestCount(found) : 1,
        });
        return;
      }
      setStep('reason');
    } catch {
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
    if (!duplicateTarget) return;
    toggleLike({
      newsletterRequestId: duplicateTarget.id,
      liked: false,
    });
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
        <PrimaryButton
          onClick={() => navigate({ to: BOARD_PATH, search: { tab: 'mine' } })}
        >
          내 신청 보기
        </PrimaryButton>
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
                다음
              </PrimaryButton>
            )}
            {step === 'link' && (
              <PrimaryButton
                disabled={!url.trim() || isChecking}
                onClick={handleLinkNext}
              >
                다음
              </PrimaryButton>
            )}
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
              <PrimaryButton disabled={isCreating} onClick={handleSubmit}>
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
            <InputField
              name="newsletter-name"
              label="뉴스레터 이름"
              inputValue={name}
              onInputChange={(event) =>
                setName(event.target.value.slice(0, NAME_MAX_LENGTH))
              }
              placeholder="예: 주간 개발 노트"
            />
            <NameSuggestionList
              keyword={name}
              onRequestSelect={handleRequestSelect}
              onNewsletterSelect={handleNewsletterSelect}
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
            />
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
          isPending={isLiking}
          onLike={handleLike}
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
