import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import type { DBDocument } from "@/types/firebase/firestore";
import type { SmashCounterDocumentData } from "@/types/firebase/firestore/models";
import { smashCounterAtom } from "@/utils/atoms";
import { docRef } from "@/utils/firestore";
import { onSnapshot } from "firebase/firestore";
import { useAtom } from "jotai";
import { useEffect } from "react";

// TODO: support for some collection
export const useFirestoreSyncDocWithAtom = (docId: string) => {
	const [data, setData] = useAtom(smashCounterAtom);

	useEffect(() => {
		const collectionId = DB_FIRESTORE_SMASH_COLLECTION_NAME;
		// TODO: FirestoreDataConverter
		const unsubscribe = onSnapshot(
			docRef<SmashCounterDocumentData>(collectionId, docId),
			(doc) => {
				const data = !doc.exists()
					? null
					: {
							...(doc.data() as DBDocument<SmashCounterDocumentData>),
							id: doc.id,
						};
				setData(data);
			},
		);

		return () => unsubscribe();
	}, [docId, setData]);

	return data;
};
