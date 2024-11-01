import Header from "@/components/Header";
import SmashCounterForm from "@/components/SmashCounterForm";
import {
	DB_FIRESTORE_SMASH_COLLECTION_NAME,
	SITE_DESCRIPTION,
	SITE_NAME,
} from "@/config/app";
import type {
	DBDocument,
	DBDocumentWithId,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Activity } from "lucide-react";
import type { Metadata } from "next";

const getDocById = async (
	docId: string,
): Promise<DBDocumentWithId<SmashCounterDocumentData> | null> => {
	const collectionId = DB_FIRESTORE_SMASH_COLLECTION_NAME;
	const docRef = doc(db, collectionId, docId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const data = {
			...(docSnap.data() as DBDocument<SmashCounterDocumentData>),
			id: docSnap.id,
		};
		return data;
	}
	return null;
};

export async function generateMetadata(): Promise<Metadata> {
	return {
		title: `Edit activity - ${SITE_NAME}`,
		description: SITE_DESCRIPTION,
	};
}

type Props = {
	params: { smashId: string };
};

export default async function Page({ params }: Props) {
	const { smashId } = params;

	const data = await getDocById(smashId);
	if (!data) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Activity not found</p>
			</div>
		);
	}

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
