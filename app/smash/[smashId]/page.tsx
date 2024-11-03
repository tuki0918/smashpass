import { RealTimeSmashCounter } from "@/components/SmashCounter";
import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import type {
	DBDocument,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import {
	doc,
	getDoc,
	increment,
	serverTimestamp,
	setDoc,
} from "firebase/firestore";
import type { Metadata } from "next";

type Props = {
	params: { smashId: string };
};

export default async function Page({ params }: Props) {
	const { smashId } = params;
	await incrementCount(smashId);
	return (
		<div className="min-h-screen flex items-center justify-center">
			<RealTimeSmashCounter docId={smashId} />
		</div>
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { smashId } = params;
	const docId = smashId;

	const collectionId = DB_FIRESTORE_SMASH_COLLECTION_NAME;
	const docRef = doc(db, collectionId, docId);
	const docSnap = await getDoc(docRef);

	if (docSnap.exists()) {
		const data = docSnap.data() as DBDocument<SmashCounterDocumentData>;
		return {
			title: data.title,
			description: data.description,
		};
	}

	return {
		title: "Not Found",
	};
}

// TODO: Must be restricted by Firestore security rules
const incrementCount = async (docId: string) => {
	try {
		const collectionId = DB_FIRESTORE_SMASH_COLLECTION_NAME;
		const docRef = doc(db, collectionId, docId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			const data = docSnap.data() as DBDocument<SmashCounterDocumentData>;
			// Only increment if the document is published
			if (data.status !== "published") {
				return;
			}

			await setDoc(
				docRef,
				{
					count: increment(1),
					updated_at: serverTimestamp(),
				},
				{ merge: true },
			);
		}
	} catch (err) {
		console.error(err);
	}
};
