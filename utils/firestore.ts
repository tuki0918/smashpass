import type { DBDocument, DBDocumentWithId } from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import { doc } from "firebase/firestore";
import type {
	DocumentData,
	DocumentReference,
	QueryDocumentSnapshot,
} from "firebase/firestore";

export const docRef = <T extends DocumentData>(
	collectionId: string,
	docId: string,
) => {
	return (
		doc(db, collectionId, docId) as DocumentReference<
			DBDocumentWithId<T>,
			DBDocument<T>
		>
	).withConverter({
		toFirestore: (data: DBDocumentWithId<T>) => {
			const { id, ...rest } = data;
			return rest;
		},
		fromFirestore: (
			snapshot: QueryDocumentSnapshot<DBDocumentWithId<T>, DBDocument<T>>,
			options,
		) => {
			const data = snapshot.data(options);
			return {
				...data,
				id: snapshot.id,
			};
		},
	});
};
