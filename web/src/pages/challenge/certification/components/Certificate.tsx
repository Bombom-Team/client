import styled from '@emotion/styled';
import type { RefObject } from 'react';

interface CertificateProps {
  nickname: string;
  challengeName: string;
  generation: number;
  startDate: string;
  endDate: string;
  ref: RefObject<HTMLDivElement | null>;
}

const Certificate = ({
  nickname,
  challengeName,
  generation,
  startDate,
  endDate,
  // medal,
  // medalCondition,
  ref,
}: CertificateProps) => {
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  return (
    <CertificateWrapper ref={ref}>
      <CertificateInner>
        <Header>
          <Logo>BOMBOM</Logo>
          <Title>수료증</Title>
        </Header>

        <Content>
          <UserName>{nickname}</UserName>
          <Description>
            위 사람은 봄봄 {challengeName} {generation}기 챌린지를
            <br />
            성실히 수행하였기에 이 수료증을 수여합니다.
          </Description>

          <Stats>
            <StatItem>
              <StatLabel>달성률</StatLabel>
            </StatItem>
            <StatDivider />
            <StatItem>
              <StatLabel>완료일</StatLabel>
            </StatItem>
          </Stats>

          <Period>
            {formattedStartDate} ~ {formattedEndDate}
          </Period>
        </Content>

        <Footer>
          <FooterText>봄봄 독서 챌린지</FooterText>
        </Footer>
      </CertificateInner>
    </CertificateWrapper>
  );
};

export default Certificate;

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

const CertificateWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);

  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primaryLight} 0%,
    ${({ theme }) => theme.colors.white} 50%,
    ${({ theme }) => theme.colors.primaryLight} 100%
  );

  aspect-ratio: 3 / 4;

  box-sizing: border-box;
`;

const CertificateInner = styled.div`
  width: 100%;
  height: 100%;
  padding: 32px 24px;
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 12px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.body2};
  font-weight: 700;
  letter-spacing: 4px;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
`;

const Content = styled.div`
  display: flex;
  gap: 24px;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UserName = styled.h2`
  color: ${({ theme }) => theme.colors.primary};
  font: ${({ theme }) => theme.fonts.heading1};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
  line-height: 1.6;
  text-align: center;
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
`;

const StatItem = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
`;

const StatDivider = styled.div`
  width: 1px;
  height: 40px;

  background-color: ${({ theme }) => theme.colors.stroke};
`;

const Period = styled.p`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;

const Footer = styled.div`
  display: flex;
  gap: 4px;
  flex-direction: column;
  align-items: center;
`;

const FooterText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
`;
