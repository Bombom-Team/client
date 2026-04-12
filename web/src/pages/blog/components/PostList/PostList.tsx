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
  margin-top: ${({ device }) => (device === 'mobile' ? '3.5rem' : '5rem')};

  display: grid;
  gap: ${({ device }) => (device === 'mobile' ? '2.5rem' : '4rem 2.5rem')};

  grid-template-columns: ${({ device }) => {
    if (device === 'pc') return 'repeat(3, minmax(0, 1fr))';
    if (device === 'tablet') return 'repeat(2, minmax(0, 1fr))';
    return '1fr';
  }};
`;
