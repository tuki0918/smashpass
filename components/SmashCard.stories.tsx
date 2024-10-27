import type { Meta, StoryObj } from "@storybook/react";

import SmashCard from "./SmashCard";

const meta: Meta<typeof SmashCard> = {
	title: "Smash/SmashCard",
	component: SmashCard,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SmashCard>;

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
