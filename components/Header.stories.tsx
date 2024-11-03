import { AuthSessionContext } from "@/components/AuthSessionProvider";
import Header from "@/components/Header";
import type { Meta, StoryObj } from "@storybook/react";
import type { UserInfo } from "firebase/auth";

const user: UserInfo | null = {
	displayName: "test displayName",
	email: "test@example.com",
	phoneNumber: null,
	photoURL: null,
	providerId: "test providerId",
	uid: "test uid",
};
const login = () => Promise.resolve();
const logout = () => Promise.resolve();

const meta: Meta<typeof Header> = {
	title: "Site/Header",
	component: Header,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Default: Story = {
	args: {},
	render: (props) => (
		<AuthSessionContext.Provider value={{ user, login, logout }}>
			<Header {...props} />
		</AuthSessionContext.Provider>
	),
};
