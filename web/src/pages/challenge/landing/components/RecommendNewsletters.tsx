import styled from '@emotion/styled';
import { useState } from 'react';
import Badge from '@/components/Badge/Badge';
import { useDevice, type Device } from '@/hooks/useDevice';
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
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const handleCardClick = (index: number) => {
    setSelectedCard((prev) => (prev === index ? null : index));
  };

  return (
    <Container device={device}>
      <ContentWrapper device={device}>
        <Title device={device}>챌린지 추천 뉴스레터</Title>
        <NewslettersGrid device={device}>
          {NEWSLETTER_RECOMMENDATIONS.map((newsletter, index) => (
            <NewsletterCard
              key={newsletter.name}
              device={device}
              onClick={() => handleCardClick(index)}
            >
              <CardInner
                className="card-inner"
                isFlipped={selectedCard === index}
              >
                <CardFront className="card-front">
                  <ThumbnailBox>
                    <Thumbnail
                      src={newsletter.imageSource}
                      alt={`${newsletter.name} 로고`}
                    />
                    <CategoryBadge device={device} text={newsletter.category} />
                  </ThumbnailBox>
                </CardFront>
                <CardBack className="card-back">
                  <NewsletterName device={device}>
                    {newsletter.name}
                  </NewsletterName>
                  <NewsletterDescription device={device}>
                    {newsletter.description}
                  </NewsletterDescription>
                </CardBack>
              </CardInner>
            </NewsletterCard>
          ))}
        </NewslettersGrid>
      </ContentWrapper>
    </Container>
  );
};

export default RecommendNewsletters;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => {
    if (device === 'mobile') return '400px';
    return device === 'tablet' ? '760px' : '1084px';
  }};
  padding: 0 0 100px;

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

const NewsletterCard = styled.article<{ device: Device }>`
  position: relative;
  width: ${({ device }) => {
    if (device === 'mobile') return 'calc((100% - 16px) / 2)';
    if (device === 'tablet') return 'calc((100% - 48px) / 3)';
    return '200px';
  }};

  flex: 0 0 auto;

  aspect-ratio: 1;

  cursor: pointer;
  perspective: 1200px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px) rotateX(18deg) rotateY(-10deg);

    .card-front,
    .card-back {
      box-shadow:
        0 2px 4px rgb(0 0 0 / 4%),
        0 6px 12px rgb(0 0 0 / 8%),
        0 12px 24px rgb(0 0 0 / 10%),
        0 24px 48px rgb(0 0 0 / 14%);
    }
  }
`;

const CardInner = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;

  transform: ${({ isFlipped }) =>
    isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  transform-style: preserve-3d;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
`;

const cardFaceStyles = `
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 3%),
    0 2px 6px rgb(0 0 0 / 5%),
    0 8px 16px rgb(0 0 0 / 8%),
    0 16px 32px rgb(0 0 0 / 10%);

  backface-visibility: hidden;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    position: absolute;
    inset: 0;
    border: 1px solid rgb(0 0 0 / 4%);
    border-radius: 12px;
    content: '';
    pointer-events: none;
  }
`;

const CardFront = styled.div`
  ${cardFaceStyles}
  overflow: hidden;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const CardBack = styled.div`
  ${cardFaceStyles}
  padding: 24px;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    145deg,
    #fafafa 0%,
    ${({ theme }) => theme.colors.white} 100%
  );
  text-align: center;

  transform: rotateY(180deg);
`;

const ThumbnailBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
  object-position: center;
`;

const CategoryBadge = styled(Badge)<{ device: Device }>`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  padding: 6px 12px;
  border-radius: 24px;
  box-shadow:
    0 1px 3px rgb(0 0 0 / 6%),
    0 2px 8px rgb(0 0 0 / 4%),
    inset 0 0 0 1px rgb(0 0 0 / 4%);

  background: rgb(255 255 255 / 92%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.caption};

  backdrop-filter: blur(8px);
`;

const NewsletterName = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const NewsletterDescription = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body3};

  opacity: 0.85;
`;
