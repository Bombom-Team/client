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

export const Column: Story = {
  args: {
    direction: 'column',
    gap: 12,
  },
  render: (args) => (
    <Flex {...args}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
    </Flex>
  ),
};

export const CenterAligned: Story = {
  args: {
    justify: 'center',
    align: 'center',
    gap: 16,
  },
  render: (args) => (
    <Flex {...args} style={{ height: '200px', border: '1px solid #D7D7D7' }}>
      <Box>Centered Item 1</Box>
      <Box>Centered Item 2</Box>
    </Flex>
  ),
};

export const SpaceBetween: Story = {
  args: {
    justify: 'space-between',
    align: 'center',
  },
  render: (args) => (
    <Flex {...args} style={{ padding: '20px', border: '1px solid #D7D7D7' }}>
      <Box>Left</Box>
      <Box>Center</Box>
      <Box>Right</Box>
    </Flex>
  ),
};

export const WithGap4px: Story = {
  args: {
    gap: 4,
  },
  render: (args) => (
    <Flex {...args}>
      <Box>4px</Box>
      <Box>gap</Box>
      <Box>spacing</Box>
    </Flex>
  ),
};

export const WithGap8px: Story = {
  args: {
    gap: 8,
  },
  render: (args) => (
    <Flex {...args}>
      <Box>8px</Box>
      <Box>gap</Box>
      <Box>spacing</Box>
    </Flex>
  ),
};

export const WithGap16px: Story = {
  args: {
    gap: 16,
  },
  render: (args) => (
    <Flex {...args}>
      <Box>16px</Box>
      <Box>gap</Box>
      <Box>spacing</Box>
    </Flex>
  ),
};

export const WithGap24px: Story = {
  args: {
    gap: 24,
  },
  render: (args) => (
    <Flex {...args}>
      <Box>24px</Box>
      <Box>gap</Box>
      <Box>spacing</Box>
    </Flex>
  ),
};

export const Wrapped: Story = {
  args: {
    wrap: 'wrap',
    gap: 12,
  },
  render: (args) => (
    <Flex {...args} style={{ maxWidth: '300px' }}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
      <Box>Item 6</Box>
    </Flex>
  ),
};

export const ColumnReverse: Story = {
  args: {
    direction: 'column-reverse',
    gap: 8,
  },
  render: (args) => (
    <Flex {...args}>
      <Box>First (Bottom)</Box>
      <Box>Second</Box>
      <Box>Third (Top)</Box>
    </Flex>
  ),
};

export const ComplexLayout: Story = {
  render: () => (
    <Flex direction="column" gap={16}>
      <Flex justify="space-between" align="center" gap={12}>
        <Box>Header Left</Box>
        <Box>Header Right</Box>
      </Flex>
      <Flex gap={12}>
        <Box>Sidebar</Box>
        <Flex direction="column" gap={8} style={{ flex: 1 }}>
          <Box>Content 1</Box>
          <Box>Content 2</Box>
          <Box>Content 3</Box>
        </Flex>
      </Flex>
      <Flex justify="center" gap={8}>
        <Box>Footer Item 1</Box>
        <Box>Footer Item 2</Box>
        <Box>Footer Item 3</Box>
      </Flex>
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
          style={{ border: '1px solid #D7D7D7', padding: '12px', height: '120px' }}
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
          style={{ border: '1px solid #D7D7D7', padding: '12px', height: '120px' }}
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
          style={{ border: '1px solid #D7D7D7', padding: '12px', height: '120px' }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
      <div>
        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>align: stretch</p>
        <Flex
          align="stretch"
          gap={8}
          style={{ border: '1px solid #D7D7D7', padding: '12px', height: '120px' }}
        >
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
        </Flex>
      </div>
    </Flex>
  ),
};
