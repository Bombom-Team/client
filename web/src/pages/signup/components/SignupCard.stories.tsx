import SignupCard from './SignupCard';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'components/bombom/SignupCard',
  component: SignupCard,
} satisfies Meta<typeof SignupCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PC: Story = {
  args: {
    isMobile: false,
  },
};

export const Tablet: Story = {
  args: {
    isMobile: false,
  },
};

export const Mobile: Story = {
  args: {
    isMobile: true,
  },
};
