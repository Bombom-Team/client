import type { GetChallengeCommentCandidateArticlesResponse } from '@/apis/challenge/challenge.api';
import type { components } from '@/types/openapi';

export type Comment = components['schemas']['ChallengeCommentResponse'];

export type CandidateArticles = GetChallengeCommentCandidateArticlesResponse;
