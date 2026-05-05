import NewsletterHero from './NewsletterHero';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof NewsletterHero> = {
  title: 'components/bombom/NewsletterHero',
  component: NewsletterHero,
};
export default meta;

type Story = StoryObj<typeof NewsletterHero>;

export const Default: Story = {};
