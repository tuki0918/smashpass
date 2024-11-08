import SmashGraphChart from "@/components/SmashGraphChart";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SmashGraphChart> = {
	title: "Smash/SmashGraphChart",
	component: SmashGraphChart,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SmashGraphChart>;

export const Default: Story = {
	args: {
		data: {
			graph: {
				id: "id",
				title: "title",
				description: "description",
				status: "published",
				style: "pie-chart",
				created_by_id: "created_by_id",
				updated_by_id: "updated_by_id",
				created_at_ms: new Date().getTime(),
				updated_at_ms: new Date().getTime(),
			},
			graph_items: [
				{
					id: "id",
					title: "item 1",
					count: 1,
					graph_id: "graph_id",
					created_by_id: "created_by_id",
					updated_by_id: "updated_by_id",
					created_at_ms: new Date().getTime(),
					updated_at_ms: new Date().getTime(),
				},
				{
					id: "id",
					title: "item 2",
					count: 2,
					graph_id: "graph_id",
					created_by_id: "created_by_id",
					updated_by_id: "updated_by_id",
					created_at_ms: new Date().getTime(),
					updated_at_ms: new Date().getTime(),
				},
				{
					id: "id",
					title: "item 3",
					count: 3,
					graph_id: "graph_id",
					created_by_id: "created_by_id",
					updated_by_id: "updated_by_id",
					created_at_ms: new Date().getTime(),
					updated_at_ms: new Date().getTime(),
				},
				{
					id: "id",
					title: "item 9",
					count: 0,
					graph_id: "graph_id",
					created_by_id: "created_by_id",
					updated_by_id: "updated_by_id",
					created_at_ms: new Date().getTime(),
					updated_at_ms: new Date().getTime(),
				},
			],
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
