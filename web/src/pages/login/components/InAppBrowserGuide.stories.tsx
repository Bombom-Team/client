import InAppBrowserGuide from './InAppBrowserGuide';
import type { Meta, StoryObj } from '@storybook/react-webpack5';

const meta = {
  title: 'components/bombom/InAppBrowserGuide',
  component: InAppBrowserGuide,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof InAppBrowserGuide>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
