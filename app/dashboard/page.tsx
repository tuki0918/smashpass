import Header from "@/components/Header";
import { SmashCardTabsForLoggedInUser } from "@/components/SmashCardTabs";
import { Activity } from "lucide-react";

export default async function Page() {
	return (
		<div>
			<Header />

			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex justify-center">
							<Activity color="#333333" size={48} />
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							My activities
						</p>
					</div>

					<SmashCardTabsForLoggedInUser />
				</div>
			</div>
		</div>
	);
}
