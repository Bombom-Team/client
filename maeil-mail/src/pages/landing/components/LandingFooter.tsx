import styled from '@emotion/styled';

const LandingFooter = () => {
  return (
    <Container>
      <FooterTitle>매일메일은 이제 봄봄 안에서만 제공돼요.</FooterTitle>
      <FooterBody>
        [텍스트] 문의/지원 경로, 정책 링크, 버전 히스토리 등 확정 문구 추가 가능
      </FooterBody>
    </Container>
  );
};

export default LandingFooter;

const Container = styled.footer`
  max-width: 1140px;
  margin: 0 auto 80px;
  padding: 48px 18px 0;
  border-top: 1px solid rgb(0 0 0 / 10%);

  @media (width >= 920px) {
    padding: 64px 28px 0;
  }
`;

const FooterTitle = styled.h2`
  margin-bottom: 8px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t8Bold};
  line-height: 1.45;
`;

const FooterBody = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  line-height: 1.72;
`;
