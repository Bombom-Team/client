import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import LinkIcon from '#/assets/svg/link.svg';
import SparklesIcon from '#/assets/svg/sparkles.svg';

const SHARE_EVENT_FORM_URL = 'https://forms.gle/BwUfEcxVYSzwVuTc6';

const EventShareGuide = () => {
  return (
    <Container>
      <SparklesDecoration>
        <SparklesIcon width={120} height={120} />
      </SparklesDecoration>

      <HeaderWrapper>
        <BadgeBox>
          <BadgeText>BONUS EVENT</BadgeText>
        </BadgeBox>

        <Title>이벤트 소문내기!</Title>
        <Description>공유할수록 당첨 확률이 올라가요! 🚀</Description>
      </HeaderWrapper>

      <CardWrapper>
        <PrizeCard>
          <CountBadge>총 10명!</CountBadge>

          <PrizeHeaderWrapper>
            <CoffeeVisualBox className="coffee-visual">
              <CoffeeImage
                src="/assets/png/event-coffee.png"
                alt="메가커피 아메리카노"
              />
            </CoffeeVisualBox>

            <div>
              <PrizeName>
                메가커피
                <br />
                아메리카노(ICE)
              </PrizeName>
            </div>
          </PrizeHeaderWrapper>

          <StepWrapper>
            <StepRow>
              <StepBadge>STEP 1</StepBadge>
              <StepText>
                SNS, 블로그, 카페 등 어디든 이벤트를 공유해 주세요!
              </StepText>
            </StepRow>

            <StepRow>
              <StepBadge>STEP 2</StepBadge>
              <StepText>
                작성한 게시글의 <StepHighlight>URL</StepHighlight>을 복사해
                주세요.
              </StepText>
            </StepRow>

            <StepRow>
              <StepBadge>STEP 3</StepBadge>
              <StepText>
                아래 버튼을 눌러 2/23 오후 1시까지 구글 폼에 제출하면 완료!
              </StepText>
            </StepRow>
          </StepWrapper>

          <ButtonWrapper>
            <TipText>공유 URL 개수가 많을 수록 당첨 확률이 올라가요!</TipText>
            <ShareButton
              href={SHARE_EVENT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              공유 URL 인증하기
              <LinkIcon width={24} height={24} />
            </ShareButton>
          </ButtonWrapper>

          <NoticeWrapper direction="column" align="flex-start" gap={8}>
            <NoticeText>
              * 비공개 계정이나 삭제된 게시글은 당첨에서 제외될 수 있습니다.
            </NoticeText>
            <NoticeText>
              * 공유 이벤트 폼 제출 마감은 2026.02.23 13:00 입니다.
            </NoticeText>
          </NoticeWrapper>
        </PrizeCard>
      </CardWrapper>
    </Container>
  );
};

export default EventShareGuide;

const Container = styled.section`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 4rem 1.5rem;
  border-bottom: 0.25rem solid ${({ theme }) => theme.colors.black};

  background-color: #e1f5fe;
`;

const SparklesDecoration = styled.div`
  position: absolute;
  bottom: 2.5rem;
  left: -1.25rem;

  color: #bfdbfe;

  opacity: 0.3;
  transform: rotate(-12deg);
`;

const HeaderWrapper = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.content};
  margin-bottom: 2.5rem;

  text-align: center;
`;

const BadgeBox = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.5rem 1rem;
  border: 0.125rem solid ${({ theme }) => theme.colors.black};
  border-radius: 6.25rem;

  display: inline-block;

  background-color: ${({ theme }) => theme.colors.white};
`;

const BadgeText = styled.span`
  color: #2563eb;
  font: ${({ theme }) => theme.fonts.heading5};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.heading2};
  font-weight: 900;
  line-height: 1.1;
`;

const Description = styled.p`
  margin-top: 0.5rem;

  color: #4b5563;
  font: ${({ theme }) => theme.fonts.heading6};
  font-weight: 700;
`;

const CardWrapper = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.content};
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const PrizeCard = styled.div`
  overflow: hidden;
  position: relative;
  width: 100%;
  padding: 2rem;
  border: 0.25rem solid ${({ theme }) => theme.colors.black};
  border-radius: 2.5rem;
  box-shadow: 0.25rem 0.25rem 0 0 ${({ theme }) => theme.colors.black};

  background-color: ${({ theme }) => theme.colors.white};
`;

const CountBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 20;
  padding: 1rem 1.875rem;
  border-bottom: 0.25rem solid ${({ theme }) => theme.colors.black};
  border-left: 0.25rem solid ${({ theme }) => theme.colors.black};

  background-color: #facc15;
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.heading5};

  border-bottom-left-radius: 2.25rem;
`;

const PrizeHeaderWrapper = styled.div`
  margin-bottom: 2rem;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const CoffeeVisualBox = styled.div`
  position: relative;
  width: 9.375rem;
  height: 9.375rem;
  margin-bottom: 0.75rem;

  transition: transform 300ms ease;
`;

const CoffeeImage = styled.img`
  width: 6.25rem;
  height: auto;
  margin-bottom: 1.25rem;
`;

const PrizeName = styled.h3`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.heading3};
  font-weight: 900;
`;

const StepWrapper = styled.div`
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  border: 0.125rem dashed #bfdbfe;
  border-radius: 1.5rem;

  display: flex;
  gap: 1rem;
  flex-direction: column;

  background-color: rgb(239 246 255 / 50%);
`;

const StepRow = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
`;

const StepBadge = styled.div`
  margin-top: 0.125rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;

  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.body4};
  font-weight: 700;
`;

const StepText = styled.p`
  font: ${({ theme }) => theme.fonts.body1};
`;

const StepHighlight = styled.span`
  color: #2563eb;
  text-decoration: underline;
`;

const ButtonWrapper = styled.div`
  position: relative;
`;

const TipText = styled.p`
  margin-bottom: 1.25rem;

  color: ${({ theme }) => theme.colors.error};
  font: ${({ theme }) => theme.fonts.heading5};
  text-align: center;
`;

const ShareButton = styled.a`
  width: 100%;
  padding: 1.25rem;
  border: 0.25rem solid ${({ theme }) => theme.colors.black};
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;

  background-color: #2962ff;
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.heading4};
  font-weight: 900;

  transition: all 200ms ease;

  &:hover {
    box-shadow: none;
    transform: translateY(0.25rem);
  }
`;

const NoticeWrapper = styled(Flex)`
  width: 100%;
  padding-top: 1.5rem;
`;

const NoticeText = styled.p`
  color: #9ca3af;
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 500;
  text-align: left;
`;
