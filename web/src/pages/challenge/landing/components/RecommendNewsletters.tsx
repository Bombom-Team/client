import styled from '@emotion/styled';
import NewsletterCard from './NewsletterCard';
import { useDevice, type Device } from '@/hooks/useDevice';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';
import dailybyte from '#/assets/avif/dailybyte.avif';
import factContextPerspective from '#/assets/avif/fact-context-perspective.avif';
import h730 from '#/assets/avif/h730.avif';
import moneyNeverSleeps from '#/assets/avif/money-never-sleeps.avif';
import newneek from '#/assets/avif/newneek.avif';
import nyt from '#/assets/avif/nyt.avif';
import uppity from '#/assets/avif/uppity.avif';

const NEWSLETTER_RECOMMENDATIONS = [
  {
    name: '뉴닉',
    category: '트렌드/라이프',
    description: '세상이 궁금해?\n쉽고 재밌는 지식 플랫폼, 뉴닉!',
    imageSource: newneek,
  },
  {
    name: 'Daily Byte',
    category: '비즈/재테크',
    description: '하루 10분, 경제를 읽는 가장 쉬운 방법',
    imageSource: dailybyte,
  },
  {
    name: "NYT's THE Morning",
    category: '트렌드/라이프',
    description:
      'Make sense of the day’s news and ideas.\nTimes journalists guide you through what’s happening — and why it matters.',
    imageSource: nyt,
  },
  {
    name: '어피티',
    category: '비즈/재테크',
    description:
      '매일 아침 나에게 찾아오는 경제뉴스, 한국 경제 뉴스레터 1위 어피티입니다.',
    imageSource: uppity,
  },
  {
    name: '점선면',
    category: '시사/사회',
    description:
      '뉴스를 점(사실)/선(맥락)/면(관점)으로 분석해 입체적으로 전합니다.\n메일함에서 하루 10분으로 주요 뉴스를 모두 알 수 있습니다.',
    imageSource: factContextPerspective,
  },
  {
    name: '머니네버슬립',
    category: '비즈/재테크',
    description:
      '미국의 경제와 기업, 그리고 주식에 대해 이야기해요. 읽다 보면 어느새 지식이 수북하게 쌓여있을 거에요!\n남들과는 다른 지식을 쌓고 싶다면, 머니네버슬립만한 게 없어요',
    imageSource: moneyNeverSleeps,
  },
  {
    name: 'H:730',
    category: '시사/사회',
    description:
      '쉴 새 없이 쏟아지는 뉴스 더미에서 독자님께 꼭 필요한 뉴스를 골라 배달합니다.\n하루를 여는 에디터들의 편지와 함께 일목요연하게 브리핑합니다.',
    imageSource: h730,
  },
];

const RecommendNewsletters = () => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  return (
    <Container ref={visibleRef} device={device}>
      <ContentWrapper device={device}>
        <Title device={device}>챌린지 추천 뉴스레터</Title>
        <NewslettersGrid device={device}>
          {NEWSLETTER_RECOMMENDATIONS.map((newsletter, index) => (
            <NewsletterCardBox
              key={newsletter.name}
              isVisible={isVisible}
              index={index}
            >
              <NewsletterCard newsletter={newsletter} />
            </NewsletterCardBox>
          ))}
        </NewslettersGrid>
      </ContentWrapper>
    </Container>
  );
};

export default RecommendNewsletters;

const Container = styled.section<{ device: Device }>`
  position: relative;
  width: 100%;
  max-width: ${({ device }) => {
    if (device === 'mobile') return '400px';
    return device === 'tablet' ? '760px' : '1084px';
  }};

  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '0 20px' : '0 60px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading4 : theme.fonts.heading2};
  text-align: center;
`;

const NewslettersGrid = styled.div<{ device: Device }>`
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '24px')};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const NewsletterCardBox = styled.div<{ isVisible: boolean; index: number }>`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) =>
    isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition:
    opacity 0.5s ease-in-out,
    transform 0.5s ease-in-out;
  transition-delay: ${({ index }) => `${index * 100}ms`};
`;
