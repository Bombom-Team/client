import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import { LITERACY_COLORS, LITERACY_FONTS } from '../constants/style';
import logo from '#/assets/avif/logo.avif';

const PcHeader = () => {
  return (
    <Container>
      <Brand>
        <BrandLogo src={logo} alt="" />
        봄봄
      </Brand>
      <PageTitle>제1회 봄봄 문해력 평가</PageTitle>
      <HomeLink to="/" data-keep-enter>
        봄봄 홈 →
      </HomeLink>
    </Container>
  );
};

export default PcHeader;

const Container = styled.header`
  height: 56px;
  padding: 0 28px;
  border-bottom: 1px solid ${LITERACY_COLORS.paperLine};

  display: flex;
  gap: 16px;
  flex-shrink: 0;
  align-items: center;

  background: ${LITERACY_COLORS.paper};
  color: ${LITERACY_COLORS.ink};
  font: 700 15px ${LITERACY_FONTS.head};
`;

const Brand = styled.span`
  display: flex;
  gap: 8px;
  align-items: center;

  font-weight: 900;
`;

const BrandLogo = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 8px;
`;

const PageTitle = styled.span`
  padding-left: 16px;
  border-left: 1px solid ${LITERACY_COLORS.paperLine};

  color: ${LITERACY_COLORS.sub};
`;

const HomeLink = styled(Link)`
  margin-left: auto;

  color: ${LITERACY_COLORS.sub};
  font-size: 14px;

  text-decoration: none;
`;
