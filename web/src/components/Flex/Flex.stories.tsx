import Flex from './Flex';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'components/common/Flex',
  component: Flex,
  argTypes: {
    direction: {
      control: 'select',
      options: ['row', 'column', 'row-reverse', 'column-reverse'],
    },
    justify: {
      control: 'select',
      options: [
        'flex-start',
        'flex-end',
        'center',
        'space-between',
        'space-around',
        'space-evenly',
      ],
    },
    align: {
      control: 'select',
      options: ['flex-start', 'flex-end', 'center', 'stretch', 'baseline'],
    },
    gap: {
      control: 'number',
    },
    wrap: {
      control: 'select',
      options: ['nowrap', 'wrap', 'wrap-reverse'],
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'nav', 'header', 'footer'],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '16px',
      backgroundColor: '#FE5E04',
      color: 'white',
      borderRadius: '8px',
    }}
  >
    {children}
  </div>
);

export const Default: Story = {
  args: {
    gap: 8,
  },
  render: (args) => (
    <Flex {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Flex>
  ),
};

export const AllJustifyOptions: Story = {
  render: () => (
    <Flex direction="column" gap={24}>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          justify: flex-start
        </p>
        <Flex
          justify="flex-start"
          gap={8}
          style={{ border: '1px solid #D7D7D7', padding: '12px' }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          justify: center
        </p>
        <Flex
          justify="center"
          gap={8}
          style={{ border: '1px solid #D7D7D7', padding: '12px' }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          justify: flex-end
        </p>
        <Flex
          justify="flex-end"
          gap={8}
          style={{ border: '1px solid #D7D7D7', padding: '12px' }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          justify: space-between
        </p>
        <Flex
          justify="space-between"
          gap={8}
          style={{ border: '1px solid #D7D7D7', padding: '12px' }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          justify: space-around
        </p>
        <Flex
          justify="space-around"
          gap={8}
          style={{ border: '1px solid #D7D7D7', padding: '12px' }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          justify: space-evenly
        </p>
        <Flex
          justify="space-evenly"
          gap={8}
          style={{ border: '1px solid #D7D7D7', padding: '12px' }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
    </Flex>
  ),
};

export const AllAlignOptions: Story = {
  render: () => (
    <Flex direction="column" gap={24}>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          align: flex-start
        </p>
        <Flex
          align="flex-start"
          gap={8}
          style={{
            border: '1px solid #D7D7D7',
            padding: '12px',
            height: '120px',
          }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>align: center</p>
        <Flex
          align="center"
          gap={8}
          style={{
            border: '1px solid #D7D7D7',
            padding: '12px',
            height: '120px',
          }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          align: flex-end
        </p>
        <Flex
          align="flex-end"
          gap={8}
          style={{
            border: '1px solid #D7D7D7',
            padding: '12px',
            height: '120px',
          }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
          align: stretch
        </p>
        <Flex
          align="stretch"
          gap={8}
          style={{
            border: '1px solid #D7D7D7',
            padding: '12px',
            height: '120px',
          }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
    </Flex>
  ),
};
