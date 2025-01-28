import SmashCard from "@/components/SmashCard";
import type { Meta, StoryObj } from "@storybook/react";

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
      type: "view",
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
      status: "published",
      created_by_id: "created_by_id",
      updated_by_id: "updated_by_id",
      created_at_ms: new Date().getTime(),
      updated_at_ms: new Date().getTime(),
    },
  },
};
