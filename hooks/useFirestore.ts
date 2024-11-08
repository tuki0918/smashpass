import type { CSDocumentWithId, DBDocument } from "@/types/firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import type { DocumentData, DocumentReference } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useFirestoreDocumentSync = <T extends DocumentData>(
	docRef: DocumentReference<CSDocumentWithId<T>, DBDocument<T>>,
) => {
	/** T: data, null: not found, undefined: loading data */
	const [data, setData] = useState<CSDocumentWithId<T> | null | undefined>(
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

export const useFirestoreDocumentsSync = <T extends DocumentData>(
	docRefs: DocumentReference<CSDocumentWithId<T>, DBDocument<T>>[],
) => {
	/** T: data, null: not found, undefined: loading data */
	const [data, setData] = useState<(CSDocumentWithId<T> | null | undefined)[]>(
		new Array(docRefs.length).fill(undefined),
	);

	useEffect(() => {
		const unsubscribes = docRefs.map((docRef, index) =>
			onSnapshot(docRef, (doc) => {
				const newData = doc.exists() ? doc.data() : null;
				setData((prevData) => {
					const updatedData = [...prevData];
					updatedData[index] = newData;
					return updatedData;
				});
			}),
		);

		return () => {
			for (const unsubscribe of unsubscribes) {
				unsubscribe();
			}
		};
	}, [docRefs]);

	return data;
};
