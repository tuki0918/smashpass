import Header from "@/components/Header";
import SmashCounterForm from "@/components/SmashCounterForm";
import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import type { SmashCounterDocumentData } from "@/types/firebase/firestore/models";
import { docRef, getDocByRef } from "@/utils/firestore";
import { Activity } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: "Edit activity",
	};
}

type Props = {
	params: { smashId: string };
};

export default async function Page({ params }: Props) {
	const { smashId } = params;
	const collectionId = DB_FIRESTORE_SMASH_COLLECTION_NAME;
	const data = await getDocByRef(
		docRef<SmashCounterDocumentData>(collectionId, smashId),
	);

	if (!data) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<Header />

			<div className="py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex justify-center">
							<Link href={"/dashboard"}>
								<Activity color="#333333" size={48} />
							</Link>
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							Edit activity
						</p>
					</div>

					<div className="flex items-center justify-center">
						<SmashCounterForm itemId={smashId} defaultValues={data} />
					</div>
				</div>
			</div>
		</div>
	);
}
