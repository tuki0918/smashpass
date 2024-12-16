import SmashViewCounterForm from "@/components/SmashViewCounterForm";
import { docRef, getDocByRef } from "@/utils/firestore";
import { Link } from "@/utils/i18n/routing";
import { Eye } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Edit activity",
	};
}

type Props = {
	params: { viewId: string };
};

export default async function Page({ params }: Props) {
	const { viewId } = params;
	const data = await getDocByRef(docRef("view", viewId));

	if (!data) {
		notFound();
	}

	return (
		<div className="py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex justify-center">
						<Link href={"/dashboard"}>
							<Eye color="#333333" size={48} />
						</Link>
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						Edit activity
					</p>
				</div>

				<div className="flex items-center justify-center">
					<SmashViewCounterForm itemId={viewId} defaultValues={data} />
				</div>
			</div>
		</div>
	);
}
