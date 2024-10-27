import type { Meta, StoryObj } from "@storybook/react";
import { Timestamp } from "firebase/firestore";

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
			created_at: Timestamp.fromDate(new Date()),
			updated_at: Timestamp.fromDate(new Date()),
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

export const LargeInt: Story = {
	args: {
		data: {
			id: "id",
			title: "title",
			description: "description",
			count: 1234567890,
			status: "published",
			created_by_id: "created_by_id",
			created_at: Timestamp.fromDate(new Date()),
			updated_at: Timestamp.fromDate(new Date()),
		},
	},
};
