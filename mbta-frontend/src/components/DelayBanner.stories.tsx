import type { Meta, StoryObj } from "@storybook/react";
import { DelayBanner } from "./DelayBanner";

const meta: Meta<typeof DelayBanner> = {
  title: "Transit/DelayBanner",
  component: DelayBanner,
};
export default meta;

type Story = StoryObj<typeof DelayBanner>;

export const WithAlerts: Story = {
  args: {
    alerts: [
      { id: "a1", header: "Delays due to signal issue", severity: 5, effect: "DELAY", updatedAt: new Date().toISOString(), activePeriod: [] },
      { id: "a2", header: "Track work", severity: 3, effect: "DETOUR", updatedAt: new Date().toISOString(), activePeriod: [] },
    ],
  },
};

export const NoAlerts: Story = {
  args: { alerts: [] },
};
