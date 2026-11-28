import styled from '@emotion/styled';
import { createLink } from '@tanstack/react-router';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import { getRecommendation } from '../utils/getRecommendation';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { createSlug } from '@/utils/url';

type NewsletterClickTarget = 'card' | 'subscribe';

interface NewsletterRecommendationsProps {
  correctCount: number;
  logoById: Map<number, string>;
  onNewsletterClick: (
    newsletterId: number,
    position: number,
    target: NewsletterClickTarget,
  ) => void;
}

// 맞힌 개수별 하루 5분 문구와 뉴스레터 2개. 카드와 '10초 만에 구독하기'는 봄봄 뉴스레터 상세로 간다.
const NewsletterRecommendations = ({
  correctCount,
  logoById,
  onNewsletterClick,
}: NewsletterRecommendationsProps) => {
  const { titleLines, newsletters } = getRecommendation(correctCount);

  return (
    <>
      <Title>
        {titleLines.map((line, index) => (
          <TitleLine key={line}>
            {index > 0 && <br />}
            {line}
          </TitleLine>
        ))}
      </Title>
      <List>
        {newsletters.map((newsletter, index) => {
          const linkParams = {
            newsletterId: String(newsletter.id),
            name: createSlug(newsletter.name, String(newsletter.id)),
          };

          return (
            <Item key={newsletter.id}>
              <CardLink
                to="/newsletters/$newsletterId/$name"
                params={linkParams}
                onClick={() =>
                  onNewsletterClick(newsletter.id, index + 1, 'card')
                }
              >
                <Logo
                  src={logoById.get(newsletter.id) ?? ''}
                  alt=""
                  loading="lazy"
                />
                <CardBody>
                  <Name>{newsletter.name}</Name>
                  {index === 0 && <FirstBadge>먼저 읽기</FirstBadge>}
                  <Readers>
                    <ReadersIcon
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        cx="9"
                        cy="8"
                        r="3.4"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M2.8 19c.6-3.3 3.2-5.2 6.2-5.2s5.6 1.9 6.2 5.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="17"
                        cy="9"
                        r="2.6"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M16.5 14.1c2.6.1 4.4 1.8 4.9 4.6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </ReadersIcon>
                    <ReadersText>
                      <ReadersCount>
                        {newsletter.subscriberCount.toLocaleString('ko-KR')}명
                      </ReadersCount>
                      이 봄봄에서 읽고 있어요
                    </ReadersText>
                  </Readers>
                  <Description>{newsletter.description}</Description>
                </CardBody>
              </CardLink>
              <SubscribeLink
                to="/newsletters/$newsletterId/$name"
                params={linkParams}
                onClick={() =>
                  onNewsletterClick(newsletter.id, index + 1, 'subscribe')
                }
              >
                <BoltIcon viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z"
                    fill="currentColor"
                  />
                </BoltIcon>
                10초 만에 구독하기
              </SubscribeLink>
            </Item>
          );
        })}
      </List>
    </>
  );
};

export default NewsletterRecommendations;

const Title = styled.h3`
  margin: 0;

  font: 400 5.2cqw/1.25 ${LITERACY_FONTS.display};

  overflow-wrap: anywhere;
  word-break: keep-all;
`;

const TitleLine = styled.span``;

const List = styled.div`
  display: grid;
  gap: 2cqw;
`;

const Item = styled.div`
  padding: 3cqw;
  border: 1px solid ${LITERACY_COLORS.line};
  border-radius: 3.4cqw;

  display: grid;
  gap: 2.4cqw;

  background: ${({ theme }) => theme.colors.white};
`;

const CardAnchor = styled.a`
  display: grid;
  gap: 3cqw;
  align-items: start;

  color: ${LITERACY_COLORS.ink};

  grid-template-columns: 12cqw minmax(0, 1fr);
  text-decoration: none;
`;

const Logo = styled(ImageWithFallback)`
  width: 12cqw;
  height: 12cqw;
  border: 1px solid ${LITERACY_COLORS.logoBorder};
  border-radius: 2.8cqw;

  background: ${({ theme }) => theme.colors.white};

  object-fit: contain;
`;

const CardBody = styled.div``;

const Name = styled.b`
  font: 700 max(13.5px, 3.8cqw) ${LITERACY_FONTS.head};
`;

const FirstBadge = styled.span`
  margin-left: 1.6cqw;
  padding: 0.4cqw 1.8cqw;
  border-radius: 999px;

  background: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};
  font: 800 2.7cqw ${LITERACY_FONTS.body};
  vertical-align: 0.4cqw;
`;

const Readers = styled.span`
  margin-top: 0.8cqw;

  display: flex;
  gap: 1.2cqw;
  align-items: center;

  color: ${LITERACY_COLORS.brandDeep};
  font: 600 max(11.5px, 3cqw) ${LITERACY_FONTS.body};
`;

const ReadersIcon = styled.svg`
  width: 3.8cqw;
  height: 3.8cqw;

  flex: none;
`;

const ReadersText = styled.span``;

const ReadersCount = styled.b`
  color: ${LITERACY_COLORS.brandDeep};
  font: 800 max(12px, 3.2cqw) ${LITERACY_FONTS.body};

  font-variant-numeric: tabular-nums;
`;

const Description = styled.p`
  margin: 0.8cqw 0 0;

  color: ${LITERACY_COLORS.sub};
  font-size: max(12px, 3.2cqw);
  line-height: 1.55;

  overflow-wrap: anywhere;
  word-break: keep-all;
`;

const SubscribeAnchor = styled.a`
  width: 100%;
  padding: 2.8cqw 2cqw;
  border: 0;
  border-radius: 2.8cqw;

  display: flex;
  gap: 1.4cqw;
  align-items: center;
  justify-content: center;

  background: ${LITERACY_COLORS.creamDeep};
  color: ${LITERACY_COLORS.brandDeep};
  font: 800 max(12.5px, 3.4cqw) ${LITERACY_FONTS.body};

  box-sizing: border-box;

  cursor: pointer;
  text-decoration: none;
  transition:
    background 0.2s,
    color 0.2s;

  &:hover {
    background: ${LITERACY_COLORS.subscribeHover};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 2px;
  }
`;

const BoltIcon = styled.svg`
  width: 3.8cqw;
  height: 3.8cqw;
`;

const CardLink = createLink(CardAnchor);

const SubscribeLink = createLink(SubscribeAnchor);
