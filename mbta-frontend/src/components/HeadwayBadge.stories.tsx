import type { Meta, StoryObj } from "@storybook/react";
import { HeadwayBadge } from "./HeadwayBadge";

const meta: Meta<typeof HeadwayBadge> = {
  title: "Transit/HeadwayBadge",
  component: HeadwayBadge,
};
export default meta;

type Story = StoryObj<typeof HeadwayBadge>;

export const Example: Story = {
  args: {
    headways: [
      { directionId: 0, minGapMinutes: 4, computedAt: new Date().toISOString() },
      { directionId: 1, minGapMinutes: 6, computedAt: new Date().toISOString() },
    ],
  },
};
