import { lastResultStorage } from '../constants/sessionStorage';
import type { PostLiteracyQuizSubmissionResponse } from '@/apis/literacyQuiz/literacyQuiz.api';

export interface SavedLiteracyResult {
  attemptCode: string;
  invitedByCode: string | null;
  picks: number[][];
  result: PostLiteracyQuizSubmissionResponse;
  isNicknameRegistered: boolean;
}

const isNumberArrayList = (value: unknown): value is number[][] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      Array.isArray(item) && item.every((choice) => typeof choice === 'number'),
  );

const isSubmissionResponse = (
  value: unknown,
): value is PostLiteracyQuizSubmissionResponse => {
  if (typeof value !== 'object' || value === null) return false;
  const result = value as Partial<PostLiteracyQuizSubmissionResponse>;
  return (
    typeof result.correctCount === 'number' &&
    typeof result.elapsedSeconds === 'number' &&
    typeof result.ranked === 'boolean' &&
    Array.isArray(result.questions)
  );
};

const isSavedResult = (value: unknown): value is SavedLiteracyResult => {
  if (typeof value !== 'object' || value === null) return false;
  const saved = value as Partial<SavedLiteracyResult>;
  return (
    typeof saved.attemptCode === 'string' &&
    isNumberArrayList(saved.picks) &&
    isSubmissionResponse(saved.result) &&
    typeof saved.isNicknameRegistered === 'boolean'
  );
};

// 저장이 막혔거나 형식이 깨졌으면 저장된 결과가 없는 것으로 본다.
export const loadLastResult = (): SavedLiteracyResult | null => {
  const raw = lastResultStorage.get();
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isSavedResult(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const saveLastResult = (saved: SavedLiteracyResult) => {
  lastResultStorage.set(JSON.stringify(saved));
};

export const clearLastResult = () => {
  lastResultStorage.remove();
};

export const markLastResultNicknameRegistered = (attemptCode: string) => {
  const saved = loadLastResult();
  if (!saved || saved.attemptCode !== attemptCode) return;
  saveLastResult({ ...saved, isNicknameRegistered: true });
};
