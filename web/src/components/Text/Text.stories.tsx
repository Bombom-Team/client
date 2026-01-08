import Text from './Text';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'components/common/Text',
  component: Text,
  argTypes: {
    color: {
      control: 'select',
      options: [
        'primary',
        'primaryDark',
        'primaryLight',
        'primaryInfo',
        'textPrimary',
        'textSecondary',
        'textTertiary',
        'icons',
        'stroke',
        'dividers',
        'disabledText',
        'disabledBackground',
        'white',
        'black',
        'red',
        'error',
        'info',
        'success',
        'backgroundHover',
      ],
    },
    font: {
      control: 'select',
      options: [
        'heading1',
        'heading2',
        'heading3',
        'heading4',
        'heading5',
        'heading6',
        'bodyLarge',
        'body1',
        'body2',
        'body3',
        'body4',
        'caption',
      ],
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '기본 텍스트입니다',
  },
};

export const Primary: Story = {
  args: {
    children: 'Primary 색상 텍스트',
    color: 'primary',
  },
};

export const Heading1: Story = {
  args: {
    children: 'Heading 1 텍스트',
    font: 'heading1',
    as: 'h1',
  },
};

export const Heading2: Story = {
  args: {
    children: 'Heading 2 텍스트',
    font: 'heading2',
    as: 'h2',
  },
};

export const Heading3: Story = {
  args: {
    children: 'Heading 3 텍스트',
    font: 'heading3',
    as: 'h3',
  },
};

export const SecondaryText: Story = {
  args: {
    children: '보조 텍스트입니다',
    color: 'textSecondary',
    font: 'body2',
  },
};

export const Caption: Story = {
  args: {
    children: 'Caption 텍스트입니다',
    font: 'caption',
    color: 'textTertiary',
  },
};

export const ErrorText: Story = {
  args: {
    children: '에러 메시지입니다',
    color: 'error',
    font: 'body2',
  },
};

export const SuccessText: Story = {
  args: {
    children: '성공 메시지입니다',
    color: 'success',
    font: 'body2',
  },
};

export const AsSpan: Story = {
  args: {
    children: 'span 태그로 렌더링됩니다',
    as: 'span',
    color: 'primary',
  },
};

export const AllFonts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text font="heading1">Heading 1 - 48px/60px</Text>
      <Text font="heading2">Heading 2 - 34px/50px</Text>
      <Text font="heading3">Heading 3 - 28px/38px</Text>
      <Text font="heading4">Heading 4 - 24px/32px</Text>
      <Text font="heading5">Heading 5 - 18px/28px</Text>
      <Text font="heading6">Heading 6 - 16px/24px</Text>
      <Text font="bodyLarge">Body Large - 18px/28px</Text>
      <Text font="body1">Body 1 - 16px/24px</Text>
      <Text font="body2">Body 2 - 14px/22px</Text>
      <Text font="body3">Body 3 - 12px/20px</Text>
      <Text font="body4">Body 4 - 10px/18px</Text>
      <Text font="caption">Caption - 12px/18px</Text>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Text color="primary">Primary</Text>
      <Text color="primaryDark">Primary Dark</Text>
      <Text color="primaryLight">Primary Light</Text>
      <Text color="textPrimary">Text Primary</Text>
      <Text color="textSecondary">Text Secondary</Text>
      <Text color="textTertiary">Text Tertiary</Text>
      <Text color="icons">Icons</Text>
      <Text color="disabledText">Disabled Text</Text>
      <div style={{ backgroundColor: '#000', padding: '8px' }}>
        <Text color="white">White</Text>
      </div>
      <Text color="black">Black</Text>
      <Text color="red">Red</Text>
      <Text color="error">Error</Text>
      <Text color="info">Info</Text>
      <Text color="success">Success</Text>
    </div>
  ),
};
