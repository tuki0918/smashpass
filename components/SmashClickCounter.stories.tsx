import SmashClickCounter from "@/components/SmashClickCounter";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SmashClickCounter> = {
  title: "Smash/SmashClickCounter",
  component: SmashClickCounter,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SmashClickCounter>;

export const Default: Story = {
  args: {
    data: {
      id: "id",
      title: "Click Counter",
      description: "Test click counter",
      type: "click",
      status: "published",
      count: 42,
      icon: "🚀",
      created_by_id: "created_by_id",
      updated_by_id: "updated_by_id",
      created_at_ms: new Date().getTime(),
      updated_at_ms: new Date().getTime(),
    },
    isAct: true,
  },
};

export const Loading: Story = {
  args: {
    data: undefined,
    isAct: false,
  },
};

export const NotFound: Story = {
  args: {
    data: null,
    isAct: false,
  },
};

export const Inactive: Story = {
  args: {
    data: {
      id: "id",
      title: "Click Counter",
      description: "Test click counter",
      type: "click",
      status: "published",
      count: 42,
      icon: "🎯",
      created_by_id: "created_by_id",
      updated_by_id: "updated_by_id",
      created_at_ms: new Date().getTime(),
      updated_at_ms: new Date().getTime(),
    },
    isAct: false,
  },
};
