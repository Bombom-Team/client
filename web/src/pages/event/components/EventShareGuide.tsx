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
  padding: 64px 24px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.black};

  background-color: #e1f5fe;
`;

const SparklesDecoration = styled.div`
  position: absolute;
  bottom: 40px;
  left: -20px;

  color: #bfdbfe;

  opacity: 0.3;
  transform: rotate(-12deg);
`;

const HeaderWrapper = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.content};
  margin-bottom: 40px;

  text-align: center;
`;

const BadgeBox = styled.div`
  margin-bottom: 12px;
  padding: 8px 16px;
  border: 2px solid ${({ theme }) => theme.colors.black};
  border-radius: 100px;

  display: inline-block;

  background-color: ${({ theme }) => theme.colors.white};
`;

const BadgeText = styled.span`
  color: #2563eb;
  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.t13Bold};
  font-weight: 900;
  line-height: 1.1;
`;

const Description = styled.p`
  margin-top: 8px;

  color: #4b5563;
  font: ${({ theme }) => theme.fonts.t6Bold};
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
  padding: 32px;
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: 40px;
  box-shadow: 4px 4px 0 0 ${({ theme }) => theme.colors.black};

  background-color: ${({ theme }) => theme.colors.white};
`;

const CountBadge = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 20;
  padding: 16px 30px;
  border-bottom: 4px solid ${({ theme }) => theme.colors.black};
  border-left: 4px solid ${({ theme }) => theme.colors.black};

  background-color: #facc15;
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.t7Bold};

  border-bottom-left-radius: 36px;
`;

const PrizeHeaderWrapper = styled.div`
  margin-bottom: 32px;

  display: flex;
  flex-direction: column;
  align-items: center;

  text-align: center;
`;

const CoffeeVisualBox = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  margin-bottom: 12px;

  transition: transform 300ms ease;
`;

const CoffeeImage = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 20px;
`;

const PrizeName = styled.h3`
  color: ${({ theme }) => theme.colors.black};
  font: ${({ theme }) => theme.fonts.t11Bold};
  font-weight: 900;
`;

const StepWrapper = styled.div`
  margin-bottom: 32px;
  padding: 20px 24px;
  border: 2px dashed #bfdbfe;
  border-radius: 24px;

  display: flex;
  gap: 16px;
  flex-direction: column;

  background-color: rgb(239 246 255 / 50%);
`;

const StepRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`;

const StepBadge = styled.div`
  margin-top: 2px;
  padding: 4px 8px;
  border-radius: 8px;

  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t1Regular};
  font-weight: 700;
`;

const StepText = styled.p`
  font: ${({ theme }) => theme.fonts.t6Regular};
`;

const StepHighlight = styled.span`
  color: #2563eb;
  text-decoration: underline;
`;

const ButtonWrapper = styled.div`
  position: relative;
`;

const TipText = styled.p`
  margin-bottom: 20px;

  color: ${({ theme }) => theme.colors.error};
  font: ${({ theme }) => theme.fonts.t7Bold};
  text-align: center;
`;

const ShareButton = styled.a`
  width: 100%;
  padding: 20px;
  border: 4px solid ${({ theme }) => theme.colors.black};
  border-radius: 16px;
  box-shadow: 0 2px 0 0 ${({ theme }) => theme.colors.black};

  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;

  background-color: #2962ff;
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t10Bold};
  font-weight: 900;

  transition: all 200ms ease;

  &:hover {
    box-shadow: none;
    transform: translateY(4px);
  }
`;

const NoticeWrapper = styled(Flex)`
  width: 100%;
  padding-top: 24px;
`;

const NoticeText = styled.p`
  color: #9ca3af;
  font: ${({ theme }) => theme.fonts.t5Regular};
  font-weight: 500;
  text-align: left;
`;
