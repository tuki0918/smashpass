import Header from "@/components/Header";
import SmashViewCounterForm from "@/components/SmashViewCounterForm";
import { Eye } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Create activity",
	};
}

export default async function Page() {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<Header />

			<div className="py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex justify-center">
							<Link href={"/dashboard"}>
								<Eye color="#333333" size={48} />
							</Link>
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							New activity
						</p>
					</div>

					<div className="flex items-center justify-center">
						<SmashViewCounterForm />
					</div>
				</div>
			</div>
		</div>
	);
}
