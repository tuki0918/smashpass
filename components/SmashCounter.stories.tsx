import type { Meta, StoryObj } from "@storybook/react";

import SmashCounter from "./SmashCounter";

const meta: Meta<typeof SmashCounter> = {
	title: "Smash/SmashCounter",
	component: SmashCounter,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SmashCounter>;

export const Default: Story = {
	args: {
		data: {
			id: "id",
			title: "title",
			description: "description",
			count: 0,
			status: "published",
			created_by_id: "created_by_id",
		},
	},
};

export const Loading: Story = {
	args: {
		data: undefined,
	},
};

export const NotFound: Story = {
	args: {
		data: null,
	},
};
