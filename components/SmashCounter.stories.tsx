import SmashCounter from "@/components/SmashCounter";
import type { Meta, StoryObj } from "@storybook/react";
import { Timestamp } from "firebase/firestore";

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
			updated_by_id: "updated_by_id",
			created_at_ms: new Date().getTime(),
			updated_at_ms: new Date().getTime(),
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
			updated_by_id: "updated_by_id",
			created_at_ms: new Date().getTime(),
			updated_at_ms: new Date().getTime(),
		},
	},
};
