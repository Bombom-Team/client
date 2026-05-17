import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Button from '@/components/Button/Button';
import { downloadApp } from '@/utils/downloadApp';
import logo from '#/assets/avif/logo.avif';

const InAppBrowserGuide = () => {
  return (
    <Container>
      <ContentWrapper>
        <LogoBox>
          <LogoImage src={logo} alt="봄봄 로고" />
        </LogoBox>
        <TextWrapper>
          <Title>인앱브라우저에서는{'\n'}구글 로그인이 어려워요</Title>
          <Description>
            카카오톡·인스타그램 등 인앱브라우저에서는 보안 정책상{'\n'}구글
            로그인이 제한돼요.{'\n'}봄봄 앱에서 1초 만에 로그인할 수 있어요.
          </Description>
        </TextWrapper>
      </ContentWrapper>
      <ActionWrapper>
        <OpenAppButton onClick={downloadApp}>봄봄 앱에서 열기</OpenAppButton>
        <BackLink to="/login">← 로그인으로 돌아가기</BackLink>
      </ActionWrapper>
    </Container>
  );
};

export default InAppBrowserGuide;

const Container = styled.main`
  min-height: 100vh;
  padding: 24px;

  display: flex;
  gap: 40px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const ContentWrapper = styled.div`
  width: min(100%, 420px);

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: center;
`;

const LogoBox = styled.div`
  overflow: hidden;
  width: 96px;
  height: 96px;
  border-radius: 24px;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primaryBomBom};
`;

const LogoImage = styled.img`
  width: 72px;
  height: 72px;

  object-fit: contain;
`;

const TextWrapper = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t10Bold};
  text-align: center;
  white-space: pre-line;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
  white-space: pre-line;
`;

const ActionWrapper = styled.div`
  width: min(100%, 420px);

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
`;

const OpenAppButton = styled(Button)`
  width: 100%;
  padding: 12px;

  font: ${({ theme }) => theme.fonts.t7Bold};
`;

const BackLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};

  text-decoration: none;
`;
