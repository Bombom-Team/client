import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import Accordion from '@/components/Accordion/Accordion';
import Badge from '@/components/Badge/Badge';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import MenuIcon from '#/assets/svg/menu.svg';

const contents = [
  {
    noticeId: 0,
    categoryName: 'update',
    title: '봄이가 10단계로 새롭게 업데이트됐어요!',
    content:
      '안녕하세요 봄봄입니다. 이번 겨울, 봄봄을 더 재미있게 이용하실 수 있도록 대규모 업데이트를 진행하였습니다. 봄이 10단계 업그레이드 봄이를 아껴주신 여러분 덕분에 봄이가 드디어 10단계까지 성장할 수 있게 되었습니다.',
    createdAt: '2025-12-09T14:53:03.183Z',
  },
  {
    noticeId: 1,
    categoryName: 'notice',
    title: '서버 이전 작업으로 인한 서비스 중단 공지 (11.27~11.28)',
    content: 'string',
    createdAt: '2025-12-12T14:53:03.183Z',
  },
  {
    noticeId: 2,
    categoryName: 'update',
    title: '앱에서 알림을 받을 수 있어요 !',
    content: 'string',
    createdAt: '2025-12-15T14:53:03.183Z',
  },
];

export const Route = createFileRoute('/_bombom/notice')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 공지사항',
      },
      {
        name: 'robots',
        content: 'noindex, nofollow',
      },
    ],
  }),
  component: NoticePage,
});

function NoticePage() {
  const { data: notices } = useQuery(queries.notices());
  const device = useDevice();

  const sortedContents = [...contents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const [openNoticeId, setOpenNoticeId] = useState<number | null>(
    sortedContents[0]?.noticeId ?? null,
  );
  const handleToggle = (noticeId: number) => {
    setOpenNoticeId((prev) => (prev === noticeId ? null : noticeId));
  };

  return (
    <Container>
      <TitleWrapper>
        <TitleIconBox>
          <StyledMenuIcon color={theme.colors.white} />
        </TitleIconBox>
        <Title>공지사항</Title>
      </TitleWrapper>

      <ContentWrapper device={device}>
        {sortedContents.map((content) => {
          const isOpen = openNoticeId === content.noticeId;

          return (
            <Accordion
              key={content.noticeId}
              isOpen={isOpen}
              onToggle={() => handleToggle(content.noticeId)}
            >
              <Accordion.Header
                isOpen={isOpen}
                onToggle={() => handleToggle(content.noticeId)}
              >
                <HeaderTextWrapper>
                  <Badge text={content.categoryName} variant="outlineDefault" />
                  <AccordionTitle>{content.title}</AccordionTitle>
                  <AccordionDescription>
                    {content.createdAt.split('T')[0]}
                  </AccordionDescription>
                </HeaderTextWrapper>
              </Accordion.Header>

              <Accordion.Content isOpen={isOpen}>
                {content.content.split('.').map((text, idx) => (
                  <AccordionContent key={idx}>{text}</AccordionContent>
                ))}
              </Accordion.Content>
            </Accordion>
          );
        })}
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: flex-start;

  box-sizing: border-box;
`;

const StyledMenuIcon = styled(MenuIcon)`
  display: block;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const TitleIconBox = styled.div`
  width: 28px;
  height: 28px;
  padding: 6px;
  border-radius: 14px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.heading3};
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
`;

const HeaderTextWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const AccordionTitle = styled.span`
  font: ${({ theme }) => theme.fonts.heading6};
`;

const AccordionDescription = styled.span`
  font: ${({ theme }) => theme.fonts.body3};
`;

const AccordionContent = styled.div`
  width: 100%;
`;
