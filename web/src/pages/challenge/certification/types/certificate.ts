import type { components } from '@/types/openapi';

export type Certificate = components['schemas']['CertificationInfoResponse'];

export type CertificateMedal = Certificate['medal'];
