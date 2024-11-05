import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import type { DBDocumentWithId } from "@/types/firebase/firestore";
import type { SmashCounterDocumentData } from "@/types/firebase/firestore/models";
import { docRef } from "@/utils/firestore";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

// TODO: support for some collection
export const useFirestoreDocumentSync = (docId: string) => {
	const [data, setData] = useState<
		DBDocumentWithId<SmashCounterDocumentData> | undefined | null
	>(undefined);

	useEffect(() => {
		const collectionId = DB_FIRESTORE_SMASH_COLLECTION_NAME;
		// TODO: FirestoreDataConverter
		const unsubscribe = onSnapshot(
			docRef<SmashCounterDocumentData>(collectionId, docId),
			(doc) => {
				const data = !doc.exists()
					? null
					: {
							...doc.data(),
							id: doc.id,
						};
				setData(data);
			},
		);

		return () => unsubscribe();
	}, [docId]);

	return data;
};
