import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SITE_DESCRIPTION, SITE_NAME } from "@/constants";
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
			<AuthSessionProvider>
				<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
					<Header />
					{children}
					<Footer />
				</div>
			</AuthSessionProvider>
		</>
	);
}
