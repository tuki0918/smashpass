import type { Metadata } from "next";
import "@/app/globals.css";
import { SITE_DESCRIPTION, SITE_NAME } from "@/constants";

export const metadata: Metadata = {
	title: {
		template: `%s - ${SITE_NAME}`,
		default: SITE_NAME,
	},
	description: SITE_DESCRIPTION,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
