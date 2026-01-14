import Flex from '@/components/Flex';
import type { PropsWithChildren } from 'react';

const CardHeader = ({ children }: PropsWithChildren) => {
  return (
    <Flex align="flex-start" justify="space-between">
      {children}
    </Flex>
  );
};

export default CardHeader;
