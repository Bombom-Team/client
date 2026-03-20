import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

interface PostContentProps {
  content: string;
}

const PostContent = ({ content }: PostContentProps) => {
  const device = useDevice();

  return (
    <Container device={device}>
      <Content device={device}>{content}</Content>
    </Container>
  );
};

export default PostContent;

const Container = styled.article<{ device: Device }>`
  max-width: ${({ device }) => (device === 'mobile' ? '100%' : '720px')};
  margin: 0 auto;

  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Content = styled.p<{ device: Device }>`
  margin-bottom: 16px;
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body1 : theme.fonts.bodyLarge};
`;
