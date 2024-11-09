import SmashViewCounter from "@/components/SmashViewCounter";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SmashViewCounter> = {
	title: "Smash/SmashViewCounter",
	component: SmashViewCounter,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SmashViewCounter>;

export const Default: Story = {
	args: {
		data: {
			id: "id",
			title: "title",
			description: "description",
			type: "view",
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
			type: "view",
			count: 1234567890,
			status: "published",
			created_by_id: "created_by_id",
			updated_by_id: "updated_by_id",
			created_at_ms: new Date().getTime(),
			updated_at_ms: new Date().getTime(),
		},
	},
};
