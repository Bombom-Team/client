import styled from '@emotion/styled';
import MobilePostList from './MobilePostList';
import PCPostList from './PCPostList';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const PostList = () => {
  const device = useDevice();

  if (device === 'mobile') {
    return <MobilePostList />;
  }

  return <PCPostList />;
};

export default PostList;

export const CardWrapper = styled.section<{ device: Device }>`
  margin-top: ${({ device }) => (device === 'mobile' ? '56px' : '80px')};

  display: grid;
  gap: ${({ device }) => (device === 'mobile' ? '40px' : '64px 40px')};

  grid-template-columns: ${({ device }) =>
    device === 'mobile' ? '1fr' : 'repeat(auto-fit, minmax(320px, 1fr))'};
`;
