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
        't1Regular',
        't1Bold',
        't2Regular',
        't2Bold',
        't3Regular',
        't3Bold',
        't4Regular',
        't4Bold',
        't5Regular',
        't5Bold',
        't6Regular',
        't6Bold',
        't7Regular',
        't7Bold',
        't8Regular',
        't8Bold',
        't9Regular',
        't9Bold',
        't10Regular',
        't10Bold',
        't11Regular',
        't11Bold',
        't12Regular',
        't12Bold',
        't13Regular',
        't13Bold',
        't14Regular',
        't14Bold',
        't15Regular',
        't15Bold',
        't16Regular',
        't16Bold',
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Text font="t1Regular">t1 Regular - 10px/14px</Text>
      <Text font="t1Bold">t1 Bold - 10px/14px</Text>
      <Text font="t2Regular">t2 Regular - 11px/15px</Text>
      <Text font="t2Bold">t2 Bold - 11px/15px</Text>
      <Text font="t3Regular">t3 Regular - 12px/16px</Text>
      <Text font="t3Bold">t3 Bold - 12px/16px</Text>
      <Text font="t4Regular">t4 Regular - 13px/18px</Text>
      <Text font="t4Bold">t4 Bold - 13px/18px</Text>
      <Text font="t5Regular">t5 Regular - 14px/19px</Text>
      <Text font="t5Bold">t5 Bold - 14px/19px</Text>
      <Text font="t6Regular">t6 Regular - 16px/22px</Text>
      <Text font="t6Bold">t6 Bold - 16px/22px</Text>
      <Text font="t7Regular">t7 Regular - 18px/24px</Text>
      <Text font="t7Bold">t7 Bold - 18px/24px</Text>
      <Text font="t8Regular">t8 Regular - 20px/27px</Text>
      <Text font="t8Bold">t8 Bold - 20px/27px</Text>
      <Text font="t9Regular">t9 Regular - 22px/30px</Text>
      <Text font="t9Bold">t9 Bold - 22px/30px</Text>
      <Text font="t10Regular">t10 Regular - 24px/32px</Text>
      <Text font="t10Bold">t10 Bold - 24px/32px</Text>
      <Text font="t11Regular">t11 Regular - 28px/38px</Text>
      <Text font="t11Bold">t11 Bold - 28px/38px</Text>
      <Text font="t12Regular">t12 Regular - 30px/40px</Text>
      <Text font="t12Bold">t12 Bold - 30px/40px</Text>
      <Text font="t13Regular">t13 Regular - 34px/46px</Text>
      <Text font="t13Bold">t13 Bold - 34px/46px</Text>
      <Text font="t14Regular">t14 Regular - 40px/54px</Text>
      <Text font="t14Bold">t14 Bold - 40px/54px</Text>
      <Text font="t15Regular">t15 Regular - 48px/64px</Text>
      <Text font="t15Bold">t15 Bold - 48px/64px</Text>
      <Text font="t16Regular">t16 Regular - 56px/76px</Text>
      <Text font="t16Bold">t16 Bold - 56px/76px</Text>
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
