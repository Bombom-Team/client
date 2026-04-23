import { Flex, Text } from '@bombom/shared/ui-web';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <Flex direction="column" align="center" justify="center">
      <Text as="h1" font="t6Bold">
        매일메일
      </Text>
    </Flex>
  );
}
