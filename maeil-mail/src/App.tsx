import { Button, Flex, Text } from '@bombom/shared/ui-web';

const App = () => {
  return (
    <Flex direction="column" align="center" justify="center">
      <Text as="h1" font="t6Bold">
        매일메일
      </Text>
      <Button variant="filled">시작하기</Button>
    </Flex>
  );
};

export default App;
