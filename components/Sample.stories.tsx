import Sample from "@/components/Sample";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Sample> = {
  title: "Sample",
  component: Sample,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sample>;

export const Default: Story = {
  args: {
    text: "text",
  },
};
