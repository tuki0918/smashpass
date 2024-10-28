import Header from "@/components/Header";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Header> = {
	title: "Site/Header",
	component: Header,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
	args: {},
};
