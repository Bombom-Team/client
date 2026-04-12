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

export const AllFonts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Text font="heading1">Heading 1 - 3rem/3.75rem</Text>
      <Text font="heading2">Heading 2 - 2.125rem/3.125rem</Text>
      <Text font="heading3">Heading 3 - 1.75rem/2.375rem</Text>
      <Text font="heading4">Heading 4 - 1.5rem/2rem</Text>
      <Text font="heading5">Heading 5 - 1.125rem/1.75rem</Text>
      <Text font="heading6">Heading 6 - 1rem/1.5rem</Text>
      <Text font="bodyLarge">Body Large - 1.125rem/1.75rem</Text>
      <Text font="body1">Body 1 - 1rem/1.5rem</Text>
      <Text font="body2">Body 2 - 0.875rem/1.375rem</Text>
      <Text font="body3">Body 3 - 0.75rem/1.25rem</Text>
      <Text font="body4">Body 4 - 0.625rem/1.125rem</Text>
      <Text font="caption">Caption - 0.75rem/1.125rem</Text>
    </div>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Text color="primary">Primary</Text>
      <Text color="primaryDark">Primary Dark</Text>
      <Text color="primaryLight">Primary Light</Text>
      <Text color="textPrimary">Text Primary</Text>
      <Text color="textSecondary">Text Secondary</Text>
      <Text color="textTertiary">Text Tertiary</Text>
      <Text color="icons">Icons</Text>
      <Text color="disabledText">Disabled Text</Text>
      <div style={{ backgroundColor: '#000', padding: '0.5rem' }}>
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
