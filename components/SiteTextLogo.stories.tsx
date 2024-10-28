import type { Meta, StoryObj } from "@storybook/react";

import SiteTextLogo from "./SiteTextLogo";

const meta: Meta<typeof SiteTextLogo> = {
	title: "Site/SiteTextLogo",
	component: SiteTextLogo,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SiteTextLogo>;

export const Default: Story = {};
