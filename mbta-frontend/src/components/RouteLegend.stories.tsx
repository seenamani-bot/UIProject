import type { Meta, StoryObj } from "@storybook/react";
import { RouteLegend } from "./RouteLegend";

const meta: Meta<typeof RouteLegend> = {
  title: "Transit/RouteLegend",
  component: RouteLegend,
};
export default meta;

type Story = StoryObj<typeof RouteLegend>;

export const Example: Story = { };
