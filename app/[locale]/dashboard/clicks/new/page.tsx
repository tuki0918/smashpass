import SmashClickCounterForm from "@/components/SmashClickCounterForm";
import { Link } from "@/utils/i18n";
import { MousePointerClick } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Create activity",
	};
}

export default async function Page() {
	// TODO: check registration limit
	return (
		<div className="py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex justify-center">
						<Link href={"/dashboard"}>
							<MousePointerClick color="#333333" size={48} />
						</Link>
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						New activity
					</p>
				</div>

				<div className="flex items-center justify-center">
					<SmashClickCounterForm />
				</div>
			</div>
		</div>
	);
}
