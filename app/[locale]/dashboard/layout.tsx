import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { SITE_DESCRIPTION, SITE_NAME } from "@/config/app";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		template: `%s - ${SITE_NAME}`,
		default: "Dashboard",
	},
	description: SITE_DESCRIPTION,
};

export default function PageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<AuthSessionProvider>{children}</AuthSessionProvider>
		</>
	);
}
