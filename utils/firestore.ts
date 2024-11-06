import { DB_FIRESTORE_COLLECTION_NAMES } from "@/config/app";
import type { CSDocumentWithId, DBDocument } from "@/types/firebase/firestore";
import type {
	CollectionDocumentDataMap,
	CollectionName,
} from "@/types/firebase/firestore/models";
import { db } from "@/utils/firebase";
import { doc, getDoc } from "firebase/firestore";
import type {
	DocumentData,
	DocumentReference,
	QueryDocumentSnapshot,
} from "firebase/firestore";

export const docRef = <
	K extends CollectionName,
	V extends DocumentData = CollectionDocumentDataMap[K],
>(
	collectionId: K,
	docId: string,
) => {
	const name = DB_FIRESTORE_COLLECTION_NAMES[collectionId];

	if (!name) {
		throw new Error(`Collection name not found for ${collectionId}`);
	}

	return _docRef<V>(name, docId);
};

const _docRef = <T extends DocumentData>(
	collectionId: string,
	docId: string,
) => {
	return (
		doc(db, collectionId, docId) as DocumentReference<
			CSDocumentWithId<T>,
			DBDocument<T>
		>
	).withConverter({
		toFirestore: (data: CSDocumentWithId<T>) => {
			const { id, ...rest } = data;
			return rest;
		},
		fromFirestore: (
			snapshot: QueryDocumentSnapshot<DBDocument<T>>,
			options,
		) => {
			// If the document does not exist, return null
			if (!snapshot.exists()) {
				return null;
			}

			// convert the document to a client side document
			const data = snapshot.data(options);
			return {
				...data,
				created_at: data.created_at.toDate(),
				updated_at: data.updated_at.toDate(),
				published_at: data.published_at?.toDate(),
				revised_at: data.revised_at?.toDate(),
				id: snapshot.id,
			};
		},
		// TODO: Refactor type
	}) as DocumentReference<CSDocumentWithId<T>, DBDocument<T>>;
};

export const getDocByRef = async <T extends DocumentData>(
	docRef: DocumentReference<CSDocumentWithId<T>, DBDocument<T>>,
): Promise<CSDocumentWithId<T> | null> => {
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	}
	return null;
};