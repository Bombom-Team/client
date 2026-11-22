import { trackEvent } from '@/libs/googleAnalytics/gaEvents';

type SignupSourceEventAction =
  | '가입 경로 모달 노출'
  | '가입 경로 저장'
  | '추천 카테고리 선택'
  | '추천 다음 4개 보기'
  | '추천 뉴스레터 구독 클릭'
  | '구독 마치고 시작하기 클릭'
  | '추천 건너뛰기 클릭';

interface TrackSignupSourceEventParams {
  action: SignupSourceEventAction;
  label?: string;
  value?: number;
}

// GA4 BigQuery 내보내기에서 event_name(action)과 event_label로 찾는다.
// 추천 구독 클릭의 label은 newsletterId라서 subscribe 테이블과 연결해 실제 구독 전환을 볼 수 있다.
export const trackSignupSourceEvent = ({
  action,
  label,
  value,
}: TrackSignupSourceEventParams) => {
  trackEvent({ category: 'SignupSource', action, label, value });
};
