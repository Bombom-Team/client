import { theme } from '@bombom/shared/theme';
import { ThemeProvider } from '@emotion/react';
import { render, screen } from '@testing-library/react';
import InquiryMessageBubble from './InquiryMessageBubble';
import type { InquiryMessage } from '@/types/inquiry';

jest.mock('@bombom/shared/env', () => ({
  ENV: { baseUrl: 'https://api.example.com' },
}));

const renderBubble = (message: Partial<InquiryMessage>) =>
  render(
    <ThemeProvider theme={theme}>
      <InquiryMessageBubble
        message={{
          id: 1,
          roomId: 1,
          content: '안녕하세요',
          createdAt: '2026-11-03T10:00:00',
          ...message,
        }}
        isOwnMessage={message.senderType === 'USER'}
        isMobile={false}
        isDeletePending={false}
        onDelete={jest.fn()}
      />
    </ThemeProvider>,
  );

describe('InquiryMessageBubble', () => {
  it('어드민 메시지는 어드민 닉네임을 표시한다', () => {
    renderBubble({ senderType: 'ADMIN', adminId: 1, adminNickname: '김봄봄' });

    expect(screen.queryByText('김봄봄')).not.toBeNull();
  });

  it('어드민 닉네임이 없으면 봄봄 운영자로 표시한다', () => {
    renderBubble({ senderType: 'ADMIN', adminId: 1 });

    expect(screen.queryByText('봄봄 운영자')).not.toBeNull();
  });

  it('내가 보낸 메시지는 이름을 표시하지 않는다', () => {
    renderBubble({ senderType: 'USER' });

    expect(screen.queryByText('봄봄 운영자')).toBeNull();
  });
});
