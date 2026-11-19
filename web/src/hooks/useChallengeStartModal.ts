import { useModal } from '@bombom/shared/ui-web';
import { useQuery } from '@tanstack/react-query';
import { useMatch, useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { queries } from '@/apis/queries';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/libs/googleAnalytics/gaEvents';
import {
  createChallengeStartModalDismissStorage,
  findStartModalChallenge,
  getDaysSinceStart,
} from '@/utils/challengeStartModal';
import type { Challenge } from '@/apis/challenge/challenge.api';

const trackChallengeStartModalEvent = (action: string, challengeId: number) => {
  trackEvent({
    category: 'Challenge',
    action,
    label: String(challengeId),
  });
};

export const useChallengeStartModal = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const memberId = userProfile?.id;

  const { data: challenges } = useQuery({
    ...queries.challenges(),
    enabled: memberId !== undefined,
  });

  const challengeDetailMatch = useMatch({
    from: '/_bombom/_main/challenge/$challengeId',
    shouldThrow: false,
  });
  const currentChallengeId = challengeDetailMatch?.params.challengeId;

  const { modalRef, isOpen, openModal, closeModal } = useModal({
    closeOnBackdropClick: false,
  });
  const hasOpenedRef = useRef(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [isDontShowChecked, setIsDontShowChecked] = useState(false);

  const targetChallenge = challenges
    ? findStartModalChallenge(challenges, new Date())
    : null;

  // 모달을 거치지 않고 챌린지 상세에 들어온 경우도 시작한 것으로 저장한다.
  useEffect(() => {
    if (!targetChallenge || memberId === undefined) return;
    if (currentChallengeId !== String(targetChallenge.id)) return;

    createChallengeStartModalDismissStorage(memberId, targetChallenge.id).set(
      true,
    );
  }, [targetChallenge, memberId, currentChallengeId]);

  // 접속(레이아웃 마운트)당 한 번만 연다.
  useEffect(() => {
    if (!targetChallenge || memberId === undefined) return;
    if (hasOpenedRef.current) return;

    const dismissStorage = createChallengeStartModalDismissStorage(
      memberId,
      targetChallenge.id,
    );
    if (dismissStorage.get()) return;

    hasOpenedRef.current = true;
    setChallenge(targetChallenge);
    openModal();
    trackChallengeStartModalEvent('시작 모달 노출', targetChallenge.id);
  }, [targetChallenge, memberId, openModal]);

  const dismiss = () => {
    if (!challenge || memberId === undefined) return;

    createChallengeStartModalDismissStorage(memberId, challenge.id).set(true);
  };

  const handleStart = () => {
    if (!challenge) return;

    dismiss();
    closeModal();
    trackChallengeStartModalEvent('시작 모달 시작 클릭', challenge.id);
    navigate({
      to: '/challenge/$challengeId',
      params: { challengeId: String(challenge.id) },
    });
  };

  const handleClose = () => {
    if (challenge) {
      if (isDontShowChecked) dismiss();
      trackChallengeStartModalEvent(
        isDontShowChecked ? '시작 모달 다시보지않음' : '시작 모달 닫기',
        challenge.id,
      );
    }
    closeModal();
  };

  const handleToggleDontShow = () => {
    setIsDontShowChecked((prev) => !prev);
  };

  return {
    modalRef,
    isOpen,
    challenge,
    dayIndex: challenge
      ? getDaysSinceStart(challenge.startDate, new Date()) + 1
      : 0,
    isDontShowChecked,
    handleStart,
    handleClose,
    handleToggleDontShow,
  };
};
