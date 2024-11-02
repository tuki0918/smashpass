import { SITE_DESCRIPTION, SITE_NAME } from "@/config/app";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: `Dashboard - ${SITE_NAME}`,
	description: SITE_DESCRIPTION,
};

export default function PageLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <>{children}</>;
}
