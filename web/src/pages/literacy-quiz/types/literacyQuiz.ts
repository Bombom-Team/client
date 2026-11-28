export interface LiteracyQuestion {
  stemHtml: string;
  passageHtml: string;
  choices: string[];
  isMulti: boolean;
}

export type LiteracyPhase = 'cover' | 'exam' | 'result' | 'review';

export type LeaveReason = 'blur' | 'hidden' | 'printscreen';

export type TimerState = 'normal' | 'warn' | 'over';

export interface GrowthStage {
  name: string;
  description: string;
  skill: string;
}

export type GrowthImageKey =
  | 'egg'
  | 'hatch'
  | 'chick'
  | 'front'
  | 'owl'
  | 'book'
  | 'mag'
  | 'cap'
  | 'spark';

export interface GrowthLayer {
  image: GrowthImageKey | 'sleep';
  left: number;
  top: number;
  width?: number;
}

export interface RecommendedNewsletter {
  id: number;
  name: string;
  description: string;
  subscriberCount: number;
}
