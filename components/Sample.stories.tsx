import type { Meta, StoryObj } from "@storybook/react";

import Sample from "./Sample";

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
