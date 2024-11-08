import { DB_FIRESTORE_COLLECTION_NAMES } from "@/config/app";
import type { CSDocumentWithId, DBDocument } from "@/types/firebase/firestore";
import type {
	CollectionDocumentDataMap,
	CollectionName,
} from "@/types/firebase/firestore/models";
import { db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import type {
	DocumentData,
	DocumentReference,
	Query,
	QueryConstraint,
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
): DocumentReference<CSDocumentWithId<T>, DBDocument<T>> => {
	return doc(db, collectionId, docId).withConverter<
		CSDocumentWithId<T>,
		DBDocument<T>
	>({
		toFirestore: (data) => {
			// exclude client fields from the document
			const {
				id,
				created_at_ms,
				updated_at_ms,
				published_at_ms,
				revised_at_ms,
				...rest
			} = data;
			return {
				// contains server fields, but is not type-safe
				...(rest as unknown as DBDocument<T>),
			};
		},
		fromFirestore: (
			snapshot: QueryDocumentSnapshot<DBDocument<T>>,
			options,
		): CSDocumentWithId<T> => {
			// convert the document to a client side document
			const { created_at, updated_at, published_at, revised_at, ...rest } =
				snapshot.data(options);
			return {
				...(rest as unknown as T),
				created_at_ms: created_at.toMillis(),
				updated_at_ms: updated_at.toMillis(),
				published_at_ms: published_at?.toMillis(),
				revised_at_ms: revised_at?.toMillis(),
				id: snapshot.id,
			};
		},
	});
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

export const docsQuery = <
	K extends CollectionName,
	V extends DocumentData = CollectionDocumentDataMap[K],
>(
	collectionId: K,
	queryConstraints: QueryConstraint[] = [],
) => {
	const name = DB_FIRESTORE_COLLECTION_NAMES[collectionId];

	if (!name) {
		throw new Error(`Collection name not found for ${collectionId}`);
	}

	return _docsQuery<V>(name, queryConstraints);
};

export const _docsQuery = <T extends DocumentData>(
	collectionId: string,
	queryConstraints: QueryConstraint[] = [],
) => {
	return query(collection(db, collectionId), ...queryConstraints).withConverter<
		CSDocumentWithId<T>,
		DBDocument<T>
	>({
		toFirestore: (data) => {
			// exclude client fields from the document
			const {
				id,
				created_at_ms,
				updated_at_ms,
				published_at_ms,
				revised_at_ms,
				...rest
			} = data;
			return {
				// contains server fields, but is not type-safe
				...(rest as unknown as DBDocument<T>),
			};
		},
		fromFirestore: (
			snapshot: QueryDocumentSnapshot<DBDocument<T>>,
			options,
		): CSDocumentWithId<T> => {
			// convert the document to a client side document
			const { created_at, updated_at, published_at, revised_at, ...rest } =
				snapshot.data(options);
			return {
				...(rest as unknown as T),
				created_at_ms: created_at.toMillis(),
				updated_at_ms: updated_at.toMillis(),
				published_at_ms: published_at?.toMillis(),
				revised_at_ms: revised_at?.toMillis(),
				id: snapshot.id,
			};
		},
	});
};

export const getDocsByQuery = async <T extends DocumentData>(
	q: Query<CSDocumentWithId<T>, DBDocument<T>>,
) => {
	const querySnapshot = await getDocs(q);
	const data = querySnapshot.docs.map((doc) => ({
		...doc.data(),
	}));

	return data;
};
