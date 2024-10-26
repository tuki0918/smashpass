import type {
	DBDocument,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { smashCounterAtom } from "@/utils/atoms";
import { db } from "@/utils/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

// TODO: support for some collection
export const useFirestoreDoc = (docId: string) => {
	// TODO: collectionId
	const collectionId = "smash-view-counters";
	const setData = useSetAtom(smashCounterAtom);

	useEffect(() => {
		// TODO: FirestoreDataConverter
		const unsubscribe = onSnapshot(doc(db, collectionId, docId), (doc) => {
			const data = !doc.exists()
				? null
				: {
						...(doc.data() as DBDocument<SmashCounterDocumentData>),
						id: doc.id,
					};
			setData(data);
		});

		return () => unsubscribe();
	}, [docId, setData]);
};
