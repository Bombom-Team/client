import { theme } from '@bombom/shared/theme';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { queries } from '@/apis/queries';
import Accordion from '@/components/Accordion/Accordion';
import Badge from '@/components/Badge/Badge';
import { useDevice } from '@/hooks/useDevice';
import EmptyNoticeCard from '@/pages/notice/components/EmptyNoticeCard';
import type { Device } from '@/hooks/useDevice';
import MenuIcon from '#/assets/svg/menu.svg';

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

  const [openNoticeId, setOpenNoticeId] = useState<number | null | undefined>(
    null,
  );

  useEffect(() => {
    if (notices?.content?.length) {
      setOpenNoticeId(notices?.content[0]?.noticeId);
    }
  }, [notices]);

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
        {notices?.content?.length === 0 && <EmptyNoticeCard />}
        {notices?.content?.map((content) => {
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
                {content.content.split('\n').map((text, idx) => (
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
