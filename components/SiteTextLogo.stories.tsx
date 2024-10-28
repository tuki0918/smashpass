import SiteTextLogo from "@/components/SiteTextLogo";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SiteTextLogo> = {
	title: "Site/SiteTextLogo",
	component: SiteTextLogo,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SiteTextLogo>;

export const Default: Story = {};
