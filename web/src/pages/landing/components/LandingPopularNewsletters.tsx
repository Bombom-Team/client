import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import careet from '#/assets/avif/careet.avif';
import dailybyte from '#/assets/avif/dailybyte.avif';
import geeknews from '#/assets/avif/geeknews.avif';
import kkatalog from '#/assets/avif/kkatalog.avif';
import newneek from '#/assets/avif/newneek.avif';
import nyt from '#/assets/avif/nyt.avif';

const newsletters = [
  {
    name: '뉴닉',
    category: '트렌드/라이프',
    imageSource: newneek,
    description: '세상이 궁금해? 쉽고 재밌는 지식 플랫폼, 뉴닉!',
  },
  {
    name: 'Daily Byte',
    category: '비즈/재테크',
    imageSource: dailybyte,
    description: '하루 10분, 경제를 읽는 가장 쉬운 방법',
  },
  {
    name: '캐릿',
    category: '트렌드/라이프',
    imageSource: careet,
    description:
      'Z세대를 위한 트렌드 브리핑 뉴스레터. MZ세대가 주목하는 라이프스타일과 콘텐츠를 소개합니다.',
  },
  {
    name: '까탈로그',
    category: '트렌드/라이프',
    imageSource: kkatalog,
    description:
      '어떤 제품이 새로 나왔는지, 어떤 물건을 사면 행복해지는지. 에디터들이 까탈스럽게 골라 메일로 배달해드립니다. 디에디트 채널에 업로드 되는 영상과 리뷰, 신제품 소식을 한 번에 감상하세요.',
  },
  {
    name: '긱뉴스',
    category: 'IT/테크',
    imageSource: geeknews,
    description: '매주 월요일 아침, 지난 일주일 간의 긱뉴스',
  },
  {
    name: 'NYT',
    category: '트렌드/라이프',
    imageSource: nyt,
    description:
      'Clocking in at over 17 million readers, The NYT’s The Morning is the most popular newsletter in the world to date. Make sense of the day’s news and ideas. Times journalists guide you through what’s happening — and why it matters.',
  },
];

const LandingPopularNewsletters = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <TitleWrapper>
        <Title device={device}>인기 뉴스레터</Title>
        <Subtitle device={device}>
          봄봄과 함께 하고 있는 다양한 분야의 뉴스레터들
        </Subtitle>
      </TitleWrapper>
      <NewslettersGrid device={device}>
        {newsletters.map((newsletter) => (
          <NewsletterCard key={newsletter.name} device={device}>
            <NewsletterThumbnail
              src={newsletter.imageSource}
              alt={newsletter.name}
              device={device}
            />
            <NewsletterName device={device}>{newsletter.name}</NewsletterName>
            <NewsletterDescription device={device}>
              {newsletter.description}
            </NewsletterDescription>
          </NewsletterCard>
        ))}
      </NewslettersGrid>
      <RecommendPageLink to="/" device={device}>
        모든 뉴스레터 보기 →
      </RecommendPageLink>
    </Container>
  );
};

export default LandingPopularNewsletters;

const Container = styled.section<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'mobile' ? '400px' : '1084px')};
  padding: ${({ device }) =>
    device === 'mobile' ? '60px 20px' : '100px 60px'};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '40px' : '60px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading3 : theme.fonts.heading2};
  text-align: center;
`;

const Subtitle = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.bodyLarge};
  text-align: center;
`;

const NewslettersGrid = styled.div<{ device: Device }>`
  width: 100%;

  display: grid;
  gap: ${({ device }) => (device === 'mobile' ? '12px' : '16px')};

  grid-template-columns: ${({ device }) =>
    device === 'mobile' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'};
`;

const NewsletterCard = styled.div<{ device: Device }>`
  min-width: 0;
  padding: ${({ device }) => (device === 'mobile' ? '20px' : '24px')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '4px' : '8px')};
  flex-direction: column;
  align-items: stretch;

  background: ${({ theme }) => theme.colors.white};
`;

const NewsletterThumbnail = styled.img<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '40px' : '48px')};
  height: ${({ device }) => (device === 'mobile' ? '40px' : '48px')};
  border-radius: 8px;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const NewsletterName = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const NewsletterDescription = styled.p<{ device: Device }>`
  overflow: hidden;

  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body2};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const RecommendPageLink = styled(Link)<{ device: Device }>`
  padding: ${({ device }) => (device === 'mobile' ? '12px 24px' : '14px 32px')};
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 8px;

  display: flex;
  gap: 8px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};

  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.disabledBackground};
  }
`;
