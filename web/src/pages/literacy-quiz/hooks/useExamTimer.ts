import { useEffect, useState } from 'react';

const getElapsedSeconds = (startedAt: number) =>
  Math.max(0, Math.floor((Date.now() - startedAt) / 1000));

// 화면 표시용 타이머. 걸린 시간은 서버가 시작~제출 시각으로 다시 계산한다.
export const useExamTimer = (startedAt: number | null) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (startedAt === null) return;

    setElapsedSeconds(getElapsedSeconds(startedAt));
    const timerId = setInterval(() => {
      setElapsedSeconds(getElapsedSeconds(startedAt));
    }, 1000);

    return () => clearInterval(timerId);
  }, [startedAt]);

  return elapsedSeconds;
};
