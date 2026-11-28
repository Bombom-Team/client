import styled from '@emotion/styled';

const StopwatchIcon = () => {
  return (
    <Container viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="13" r="8" stroke="currentColor" strokeWidth="2.4" />
      <path
        d="M12 9v4l2.5 2M9 2h6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </Container>
  );
};

export default StopwatchIcon;

const Container = styled.svg`
  width: 4.6cqw;
  height: 4.6cqw;
`;
