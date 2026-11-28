import { useMemo, useState } from 'react';
import { visitorIdStorage } from '../constants/localStorage';
import { createVisitorId } from '../utils/createVisitorId';

// 로그인 없이 같은 사람의 시도를 묶는 id. 저장이 막힌 환경에서도 이번 방문 동안은 같은 값을 쓴다.
export const useVisitorId = () => {
  const [visitor] = useState(() => {
    const storedId = visitorIdStorage.get();
    if (storedId) return { visitorId: storedId, hasStoredBefore: true };

    const visitorId = createVisitorId();
    visitorIdStorage.set(visitorId);
    return { visitorId, hasStoredBefore: false };
  });

  return useMemo(() => visitor, [visitor]);
};
