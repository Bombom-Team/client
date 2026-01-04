import type { components } from '@/types/openapi';
import type { GetChallengeCommentCandidateArticlesResponse } from '@/apis/challenge/challenge.api';

export type Comment = components['schemas']['ChallengeCommentResponse'];

export type CandidateArticles = GetChallengeCommentCandidateArticlesResponse;
