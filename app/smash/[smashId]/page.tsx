import { RealTimeSmashCounter } from "@/components/SmashCounter";
import { db } from "@/utils/firebase";
import { doc, getDoc, increment, setDoc } from "firebase/firestore";

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

// TODO: Must be restricted by Firestore security rules
const incrementCount = async (docId: string) => {
	try {
		// TODO: collectionId
		const collectionId = "smash-view-counters";
		const docRef = doc(db, collectionId, docId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			await setDoc(
				docRef,
				{
					count: increment(1),
				},
				{ merge: true },
			);
		}
	} catch (err) {
		console.error(err);
	}
};
