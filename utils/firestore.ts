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
	const ref = doc(db, collectionId, docId) as DocumentReference<
		CSDocumentWithId<T>,
		DBDocument<T>
	>;
	return ref.withConverter<CSDocumentWithId<T>, DBDocument<T>>({
		toFirestore: (data: CSDocumentWithId<T>): DBDocument<T> => {
			const {
				id,
				created_at_ms,
				updated_at_ms,
				published_at_ms,
				revised_at_ms,
				...rest
			} = data;
			// TODO: mismatch created_at, updated_at, published_at, revised_at
			return rest as unknown as DBDocument<T>;
		},
		fromFirestore: (
			snapshot: QueryDocumentSnapshot<DBDocument<T>>,
			options,
		): CSDocumentWithId<T> => {
			// convert the document to a client side document
			const { created_at, updated_at, published_at, revised_at, ...rest } =
				snapshot.data(options);
			return {
				...rest,
				created_at_ms: created_at.toMillis(),
				updated_at_ms: updated_at.toMillis(),
				published_at_ms: published_at?.toMillis(),
				revised_at_ms: revised_at?.toMillis(),
				id: snapshot.id,
			} as unknown as CSDocumentWithId<T>;
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
