import PCHeader from './PCHeader';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta: Meta<typeof PCHeader> = {
  title: 'components/common/PCHeader',
  component: PCHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      story: {
        inline: false,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PCHeader>;

export const Default: Story = {
  render: () => {
    const activeNav = 'today';
    return <PCHeader activeNav={activeNav} />;
  },
};
