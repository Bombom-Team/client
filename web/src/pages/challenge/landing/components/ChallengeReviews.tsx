import { useDevice, useScrollVisible } from '@bombom/shared/ui-web';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import type { Device } from '@bombom/shared/ui-web';
import QuoteIcon from '#/assets/svg/quote.svg';

interface ChallengeReview {
  generation: number;
  content: string;
}

const CHALLENGE_REVIEWS: ChallengeReview[] = [
  {
    generation: 7,
    content:
      '처음엔 꾸준히 보기 어려워서 항상 탈락했는데 2번 연속으로 수료할 수 있어서 뿌듯해요ㅎㅎ\n사람들이 많이 참여했으면 좋겠어요',
  },
  {
    generation: 8,
    content:
      '이번 챌린지도 덕분에 매일 하나라도 읽을 수 있었어요. 이번에도 에세이나 자기계발 레터를 주로 읽었는데, 지친 하루에 공감과 위로를 받을 수 있어서 좋았습니다. 다른 참여자분들이 올린 코멘트를 통해서도 경제와 같이 제가 잘 읽지 않는 분야의 인사이트를 얻을 수 있어서 좋았어요.',
  },
  {
    generation: 6,
    content:
      '뉴스레터를 매일 챙겨보기가 쉽지 않은데, 그래도 챌린지 덕분에 꾸준히 읽을 수 있었던 것 같아요~! 동기부여 유지가 어려워서 개근하지 못한게 아쉽긴 하네요',
  },
  {
    generation: 6,
    content:
      '챌린지 덕분에 100% 달성할 수 있었습니다! 혼자서 뉴스레터를 항상 읽었었는데 다른사람들 리뷰도 보고 저도 뉴스레터 다읽고 리뷰를 남기니까 더 오래 기억에 남는 것 같네요 한달 동안 다들 고생 많으셨습니다!',
  },
  {
    generation: 4,
    content:
      '등하교할때 저의 심심함을 덜어주는 좋은 서비스였습니다! 이번엔 주로 경제뉴스레터만 읽었는데 세상의 흐름을 조금이라도 따라갈 수 있어서 좋았어요. 다음 챌린지에서는 다양한 카테고리의 뉴스레터를 읽어보려고요!',
  },
  {
    generation: 5,
    content:
      '이번 챌린지도 덕분에 뉴스레터를 챙겨 볼 수 있었습니다! 바쁜 삶 속에서도 뉴스레터를 읽어서 자기계발이나 시사지식을 얻을 수 있었어요. 다른분들도 열심히 참여해주시는 모습에 동기부여를 얻을 수 있었습니다! 다들 수고 많으셨어요~',
  },
  {
    generation: 5,
    content:
      '확실히 챌린지를 해야 더 잘 읽는 것 같아요.\n매일 많은 시간 읽을 수는 없지만 매일매일 조금씩 읽는게 참 많은 도움이 되는 것 같아요\n앞으로 더 나은 챌린지가 될 수 있도록 노력해볼게요!!',
  },
  {
    generation: 8,
    content:
      '이번 빠짐없이 참여한 제8기 챌린지를 통하여 급변하는 많은 세계정세와 지식들을 접할 수 있어서 좋았고 유익한 시간이었다. 제9기 챌린지에도 열심을 내어 진보를 가져오기를 기대한다.',
  },
  {
    generation: 5,
    content:
      '제5기 뉴스레터 챌린지를 통하여 세계와 국내 여러가지 지식과 정보를 한 눈에 볼 수 있어 좋았고 더불어 개인적인 많은 식견을 쌓을 수 있어서 좋았습니다~더 많은 유저들이 참여하여 다양한 정보와 지식을 함께 공유했으면 하는 바램입니다. 봄봄의 무궁한 발전을 기원합니다~^^',
  },
  {
    generation: 4,
    content:
      '챌린지 덕분에 안읽던 뉴스도 읽게되고 다양한 소식들을 접하니 좋았습니다!',
  },
  {
    generation: 8,
    content: '매일 뉴스레터를 읽을 수 있게 되었다! 한글날 빼고 전부 성공',
  },
  {
    generation: 6,
    content:
      '챌린지 성공을 위해서라도 어플을 들어와서 뉴스를 읽게 되고 리뷰를 쓰기 위해 뉴스를 꼼꼼히 읽게 되었다',
  },
  {
    generation: 5,
    content: '이번에도 챌린지를 통해 시대 흐름 배워갑니다~',
  },
];

// 후기를 번갈아 두 줄에 나눠 담아 줄마다 기수와 글 길이가 섞이게 한다.
const REVIEW_ROWS = [
  CHALLENGE_REVIEWS.filter((_, index) => index % 2 === 0),
  CHALLENGE_REVIEWS.filter((_, index) => index % 2 === 1),
];

// 줄마다 카드 수가 달라도 같은 속도로 흐르도록 재생 시간을 카드 수에 비례시킨다.
const SECONDS_PER_CARD = 12;

const ChallengeReviews = () => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);

  return (
    <Container ref={visibleRef} device={device} isVisible={isVisible}>
      <TitleWrapper device={device}>
        <Title device={device}>
          먼저 참여한 분들의 <Highlight>이야기</Highlight>
        </Title>
        <Description device={device}>
          챌린지에 참여한 분들이 직접 남긴 후기예요.
        </Description>
      </TitleWrapper>
      <RowList>
        {REVIEW_ROWS.map((reviews, rowIndex) => (
          <Row key={rowIndex}>
            <Track
              cardCount={reviews.length}
              isReverse={rowIndex % 2 === 1}
              isVisible={isVisible}
            >
              {/* 끊김 없이 이어 흐르도록 같은 목록을 한 번 더 붙이고, 복제본은 보조기기에서 숨긴다. */}
              {[false, true].map((isDuplicate) => (
                <ReviewList
                  key={String(isDuplicate)}
                  device={device}
                  isDuplicate={isDuplicate}
                  aria-hidden={isDuplicate}
                >
                  {reviews.map((review) => (
                    <ReviewCard key={review.content} device={device}>
                      <QuoteMark device={device} />
                      <ReviewContent device={device}>
                        {review.content}
                      </ReviewContent>
                      <Reviewer device={device}>
                        {review.generation}기 참가자
                      </Reviewer>
                    </ReviewCard>
                  ))}
                </ReviewList>
              ))}
            </Track>
          </Row>
        ))}
      </RowList>
    </Container>
  );
};

export default ChallengeReviews;

const marquee = keyframes`
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(-50%, 0, 0);
  }
`;

const Container = styled.section<{ device: Device; isVisible: boolean }>`
  width: 100%;
  max-width: 1084px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '24px')};
  flex-direction: column;
  align-items: center;

  animation: ${({ isVisible }) =>
    isVisible ? 'fade-in-up 1s ease forwards' : 'none'};

  opacity: 0;

  transform: translate3d(0, 40px, 0);

  @keyframes fade-in-up {
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
`;

const TitleWrapper = styled.div<{ device: Device }>`
  padding: 0 4px;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t11Bold : theme.fonts.t13Bold};
  text-align: center;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const Description = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t6Regular : theme.fonts.t7Regular};
  text-align: center;
`;

const RowList = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  overflow: hidden;
  width: 100%;
  padding: 12px 0 20px;

  mask-image: linear-gradient(
    90deg,
    transparent,
    rgb(0 0 0) 8%,
    rgb(0 0 0) 92%,
    transparent
  );

  @media (prefers-reduced-motion: reduce) {
    mask-image: none;
    overflow-x: auto;
  }
`;

const Track = styled.div<{
  cardCount: number;
  isReverse: boolean;
  isVisible: boolean;
}>`
  width: max-content;

  display: flex;

  animation: ${marquee} ${({ cardCount }) => cardCount * SECONDS_PER_CARD}s
    linear infinite;

  animation-direction: ${({ isReverse }) => (isReverse ? 'reverse' : 'normal')};
  animation-play-state: ${({ isVisible }) => (isVisible ? 'running' : 'paused')};

  &:hover {
    animation-play-state: paused;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const ReviewList = styled.ul<{ device: Device; isDuplicate: boolean }>`
  /* 목록 끝에도 카드 간격만큼 여백을 둬야 복제본과 이어지는 지점의 간격이 같다. */
  padding-right: ${({ device }) => (device === 'mobile' ? '12px' : '16px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '12px' : '16px')};

  @media (prefers-reduced-motion: reduce) {
    display: ${({ isDuplicate }) => (isDuplicate ? 'none' : 'flex')};
  }
`;

const ReviewCard = styled.li<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '280px' : '360px')};
  padding: ${({ device }) => (device === 'mobile' ? '20px' : '24px')};
  border-radius: 20px;
  box-shadow: 0 10px 24px rgb(0 0 0 / 6%);

  display: flex;
  gap: 12px;
  flex-direction: column;
  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.white};
`;

const QuoteMark = styled(QuoteIcon)<{ device: Device }>`
  width: ${({ device }) => (device === 'mobile' ? '20px' : '24px')};
  height: ${({ device }) => (device === 'mobile' ? '20px' : '24px')};

  color: ${({ theme }) => theme.colors.primaryBomBom};
`;

const ReviewContent = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t5Regular : theme.fonts.t6Regular};
  white-space: pre-line;
`;

const Reviewer = styled.span<{ device: Device }>`
  margin-top: auto;
  padding: 4px 12px;
  border-radius: 999px;

  align-self: flex-start;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
  color: ${({ theme }) => theme.colors.primaryBomBom};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t3Bold : theme.fonts.t4Bold};
`;
