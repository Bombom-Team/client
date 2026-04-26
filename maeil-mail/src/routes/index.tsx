import { Flex, Text } from '@bombom/shared/ui-web';
import { createFileRoute } from '@tanstack/react-router';
import Logo from '@/assets/svg/maeilmail-logo.svg';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <Flex direction="column" align="center" justify="center">
      <Logo width={200} />
      <Text as="h1" font="t15Bold">
        메인 페이지
      </Text>
    </Flex>
  );
}
