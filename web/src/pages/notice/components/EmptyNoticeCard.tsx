import styled from '@emotion/styled';
import sadBom from '#/assets/avif/sad-bom.avif';

const EmptyNoticeCard = () => {
  return (
    <Container>
      <EmptySearchIconWrapper>
        {' '}
        <img width={200} src={sadBom} alt="empty" />
      </EmptySearchIconWrapper>

      <EmptyTitle>아직 등록된 공지사항이 없어요</EmptyTitle>

      <DescriptionWrapper>
        <Lead>공지사항이 등록되면 이 페이지에서 확인하실 수 있습니다.</Lead>
      </DescriptionWrapper>
    </Container>
  );
};

export default EmptyNoticeCard;

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 60px 24px;

  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptySearchIconWrapper = styled.div`
  padding: 20px;
`;

const EmptyTitle = styled.h2`
  margin: 0;

  background: linear-gradient(90deg, #181818 0%, #f96 100%);
  background-clip: text;
  font: ${({ theme }) => theme.fonts.heading4};
  text-align: center;

  -webkit-text-fill-color: transparent;
`;

const DescriptionWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Lead = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
  text-align: center;
`;
