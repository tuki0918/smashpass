import type { DBDocument, DBDocumentWithId } from "@/types/firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import type { DocumentData, DocumentReference } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useFirestoreDocumentSync = <T extends DocumentData>(
	docRef: DocumentReference<DBDocumentWithId<T>, DBDocument<T>>,
) => {
	/** T: data, null: not found, undefined: loading data */
	const [data, setData] = useState<DBDocumentWithId<T> | null | undefined>(
		undefined,
	);

	useEffect(() => {
		const unsubscribe = onSnapshot(docRef, (doc) => {
			const data = doc.exists() ? doc.data() : null;
			setData(data);
		});

		return () => unsubscribe();
	}, [docRef]);

	return data;
};
