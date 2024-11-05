import type { DBDocument, DBDocumentWithId } from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import { doc } from "firebase/firestore";
import type { DocumentData, DocumentReference } from "firebase/firestore";

export const docRef = <T extends DocumentData>(
	collectionId: string,
	docId: string,
) => {
	return doc(db, collectionId, docId) as DocumentReference<
		DBDocumentWithId<T>,
		DBDocument<T>
	>;
};
