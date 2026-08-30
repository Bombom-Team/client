import styled from '@emotion/styled';

interface SupportContactCtaProps {
  onContactClick: () => void;
}

const SupportContactCta = ({ onContactClick }: SupportContactCtaProps) => {
  return (
    <Container>
      <Description>
        원하는 답변을 찾지 못하셨나요? 1:1 문의를 통해 도와드릴게요.
      </Description>
      <ContactButton type="button" onClick={onContactClick}>
        1:1 문의하기
      </ContactButton>
    </Container>
  );
};

export default SupportContactCta;

export type { SupportContactCtaProps };

const Container = styled.div`
  width: 100%;
  margin-top: 16px;
  padding: 24px 16px;
  border-radius: 12px;

  display: flex;
  gap: 12px;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.colors.disabledBackground};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t4Regular};
  text-align: center;
`;

const ContactButton = styled.button`
  padding: 8px 16px;
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.primaryBomBom};
  color: ${({ theme }) => theme.colors.white};
  font: ${({ theme }) => theme.fonts.t5Bold};
`;
