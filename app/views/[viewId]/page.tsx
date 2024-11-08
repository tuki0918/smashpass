import { RealTimeSmashCounter } from "@/components/SmashCounter";
import type { DBDocument } from "@/types/firebase/firestore";
import type { SmashViewCounterDocumentData } from "@/types/firebase/firestore/models";
import { docRef, getDocByRef } from "@/utils/firestore";
import { increment, serverTimestamp, setDoc } from "firebase/firestore";
import type { Metadata } from "next";

type Props = {
	params: { viewId: string };
};

export default async function Page({ params }: Props) {
	const { viewId } = params;
	await incrementCount(viewId);
	return (
		<div className="min-h-screen flex items-center justify-center">
			<RealTimeSmashCounter docId={viewId} />
		</div>
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { viewId } = params;
	const data = await getDocByRef(docRef("view", viewId));

	if (data) {
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
		const ref = docRef("view", docId);
		const data = await getDocByRef(ref);

		if (data) {
			// Only increment if the document is published
			if (data.status !== "published") {
				return;
			}

			await setDoc(
				ref,
				{
					count: increment(1) as unknown as number,
					updated_at: serverTimestamp(),
				} as Partial<DBDocument<SmashViewCounterDocumentData>>,
				{ merge: true },
			);
		}
	} catch (err) {
		console.error(err);
	}
};
