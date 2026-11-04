import { http, HttpResponse } from 'msw';
import { ENV } from '../../apis/env';
import type { InquiryUnreadStatus } from '@/apis/inquiry/inquiry.api';

const baseURL = ENV.baseUrl;

const INQUIRY_UNREAD_STATUS: InquiryUnreadStatus = { hasUnread: false };

export const inquiryHandlers = [
  http.get(`${baseURL}/inquiries/rooms/unread-status`, () => {
    return HttpResponse.json(INQUIRY_UNREAD_STATUS);
  }),
];
