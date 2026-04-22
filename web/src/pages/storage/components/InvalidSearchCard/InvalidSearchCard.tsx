import styled from '@emotion/styled';
import EmptySearchIcon from '#/assets/svg/empty-search.svg';

function InvalidSearchCard() {
  return (
    <Container>
      <EmptySearchIconWrapper>
        <EmptySearchIcon width={100} height={100} />
      </EmptySearchIconWrapper>

      <EmptyTitle>
        {`더 정확한 검색을 위해\n두 글자 이상 입력해주세요.`}
      </EmptyTitle>
    </Container>
  );
}

export default InvalidSearchCard;

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 22px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptySearchIconWrapper = styled.div`
  padding: 38px;
`;

const EmptyTitle = styled.h3`
  background: linear-gradient(90deg, #181818 0%, #f96 100%);
  background-clip: text;
  font: ${({ theme }) => theme.fonts.t11Bold};
  text-align: center;

  -webkit-text-fill-color: transparent;
`;
