import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/privacy-policy')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 개인정보 처리방침',
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <Container>
      <ContentWrapper>
        <Title>개인정보 처리방침</Title>
        <Intro>
          본 개인정보 처리방침은 모바일 기기용 <strong>봄봄 앱</strong>에
          적용됩니다. 서비스 제공자는 <strong>Antarctica</strong>이며, 본
          서비스는 &quot;있는 그대로&quot; 제공됩니다.
        </Intro>

        <Section>
          <SectionTitle>정보 수집 및 이용</SectionTitle>
          <Paragraph>
            앱은 다운로드 및 사용 시 아래와 같은 정보를 수집할 수 있습니다.
          </Paragraph>
          <List>
            <li>사용자의 인터넷 프로토콜 주소(IP 주소 등)</li>
            <li>방문 페이지, 방문 시간 및 날짜</li>
            <li>앱 사용 시간</li>
            <li>모바일 기기의 운영 체제</li>
          </List>
          <Paragraph>
            앱은 사용자의 정확한 위치 정보를 수집하지 않습니다. 다만, 대략적인
            지리적 위치를 파악하여 아래와 같은 목적으로 사용합니다.
          </Paragraph>
          <List>
            <li>위치 기반 서비스: 개인화된 콘텐츠 및 추천 제공</li>
            <li>분석 및 개선: 사용자 행동 분석, 앱 성능 개선</li>
            <li>
              제3자 서비스: 외부 서비스로 익명화된 정보를 전송하여 앱 개선
            </li>
          </List>
          <Paragraph>
            서비스 제공자는 중요 정보, 공지사항, 마케팅 홍보를 위해 수집된
            정보를 연락 수단으로 활용할 수 있습니다.
          </Paragraph>
          <Paragraph>
            더 나은 경험을 위해 특정 개인 식별 정보(이메일, 닉네임, 생년월일,
            성별 등)를 요청할 수 있으며, 이 정보는 본 방침에 명시된 대로 보유 및
            이용됩니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>제3자 접근</SectionTitle>
          <Paragraph>
            서비스 제공자는 익명화된 집계 정보를 주기적으로 외부 서비스에
            전송하여 서비스 개선에 활용합니다. 또한 아래와 같은 경우 사용자
            정보를 공개할 수 있습니다.
          </Paragraph>
          <List>
            <li>법적 요구: 법적 소환장 등 법률적 요구가 있을 때</li>
            <li>안전 보호: 사용자 및 타인의 안전 보호, 사기 조사 등</li>
            <li>
              신뢰하는 서비스 제공자: 독립적으로 정보를 사용하지 않고 본 방침을
              준수하는 경우
            </li>
          </List>
        </Section>

        <Section>
          <SectionTitle>거부 권리 및 데이터 보유</SectionTitle>
          <Paragraph>
            사용자는 앱을 삭제함으로써 모든 정보 수집을 중단할 수 있습니다.
          </Paragraph>
          <Paragraph>
            서비스 제공자는 사용자가 앱을 사용하는 동안 데이터를 보유합니다.
            데이터 삭제를 원하시면{' '}
            <MailLink href="mailto:bombom.news7@gmail.com">
              bombom.news7@gmail.com
            </MailLink>
            으로 연락 주시기 바랍니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>아동 관련 사항</SectionTitle>
          <Paragraph>
            만 13세 미만 아동의 데이터를 고의로 수집하거나 마케팅하지 않습니다.
          </Paragraph>
          <Paragraph>
            만약 아동이 개인정보를 제공한 것으로 의심되는 경우,
            <MailLink href="mailto:bombom.news7@gmail.com">
              bombom.news7@gmail.com
            </MailLink>
            으로 연락 주시면 필요한 조치를 취하겠습니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>변경 사항 및 동의</SectionTitle>
          <Paragraph>
            본 방침은 필요에 따라 수시로 변경될 수 있으며, 변경 사항은 본
            페이지에 업데이트됩니다. 지속적인 앱 사용은 변경 사항에 동의한
            것으로 간주됩니다.
          </Paragraph>
          <Paragraph>
            본 방침은 <strong>2025년 9월 10일</strong>부터 효력이 발생합니다. 앱
            사용을 통해 본 개인정보 처리방침에 따른 정보 처리에 동의함을
            의미합니다.
          </Paragraph>
        </Section>

        <Section>
          <SectionTitle>계정 삭제</SectionTitle>
          <Paragraph>
            사용자는 앱 내에서 직접 계정을 삭제할 수 있습니다.
          </Paragraph>
          <List>
            <li>
              앱 실행 후 프로필 클릭 &gt; 회원 탈퇴 버튼을 통해 언제든지 계정을
              삭제할 수 있습니다.
            </li>
            <li>
              계정을 삭제하면 모든 개인 정보 및 관련 데이터는 지체 없이
              삭제되며, 최대 90일 이내에 완전히 제거됩니다.
            </li>
            <li>
              계정 삭제 과정에서 문제가 발생할 경우,
              <MailLink href="mailto:bombom.news7@gmail.com">
                bombom.news7@gmail.com
              </MailLink>
              으로 문의해 주시기 바랍니다.
            </li>
          </List>
        </Section>

        <Section>
          <SectionTitle>문의</SectionTitle>
          <Paragraph>
            개인정보 관련 문의는 이메일
            <MailLink href="mailto:bombom.news7@gmail.com">
              bombom.news7@gmail.com
            </MailLink>
            으로 연락 바랍니다.
          </Paragraph>
        </Section>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.main`
  width: 100%;
  min-height: 100dvh;
  padding: 80px 20px;

  background-color: ${({ theme }) => theme.colors.white};
`;

const ContentWrapper = styled.article`
  width: min(100%, 840px);
  margin: 0 auto;

  display: flex;
  gap: 32px;
  flex-direction: column;

  word-break: keep-all;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t12Bold};
`;

const Intro = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t6Regular};
  line-height: 1.8;
`;

const Section = styled.section`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t9Bold};
`;

const Paragraph = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  line-height: 1.8;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 20px;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  line-height: 1.8;
`;

const MailLink = styled.a`
  margin: 0 4px;

  color: ${({ theme }) => theme.colors.primaryBomBom};

  text-decoration: underline;
`;
