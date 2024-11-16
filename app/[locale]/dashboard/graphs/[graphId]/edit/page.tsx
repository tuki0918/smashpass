import Header from "@/components/Header";
import SmashGraphChartForm from "@/components/SmashGraphChartForm";
import {
	docRef,
	docsQuery,
	getDocByRef,
	getDocsByQuery,
} from "@/utils/firestore";
import { Link } from "@/utils/i18n/routing";
import { where } from "firebase/firestore";
import { ChartBarDecreasing } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Edit activity",
	};
}

type Props = {
	params: { graphId: string };
};

export default async function Page({ params }: Props) {
	const { graphId } = params;
	const [data, items] = await Promise.all([
		getDocByRef(docRef("graph", graphId)),
		getDocsByQuery(docsQuery("graph_item", [where("graph_id", "==", graphId)])),
	]);

	if (!data) {
		notFound();
	}

	const dataWithItems = {
		...data,
		// sort: asc
		items: items.sort((a, b) => a.sort_order - b.sort_order),
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<Header />

			<div className="py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex justify-center">
							<Link href={"/dashboard"}>
								<ChartBarDecreasing color="#333333" size={48} />
							</Link>
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							Edit activity
						</p>
					</div>

					<div className="flex items-center justify-center">
						<SmashGraphChartForm
							itemId={graphId}
							defaultValues={dataWithItems}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
