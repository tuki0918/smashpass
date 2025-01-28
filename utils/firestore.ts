import { DB_FIRESTORE_COLLECTION_NAMES } from "@/constants";
import type { CSDocumentWithId, DBDocument } from "@/types/firebase/firestore";
import type {
  CollectionDocumentDataMap,
  CollectionName,
} from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs, query } from "firebase/firestore";
import type {
  DocumentData,
  DocumentReference,
  Query,
  QueryConstraint,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

const toFirestoreConverter = <T extends DocumentData>(
  data: CSDocumentWithId<T>,
): DBDocument<T> => {
  const {
    id,
    created_at_ms,
    updated_at_ms,
    published_at_ms,
    revised_at_ms,
    ...rest
  } = data;
  return {
    ...(rest as unknown as DBDocument<T>),
  };
};

const fromFirestoreConverter = <T extends DocumentData>(
  snapshot: QueryDocumentSnapshot<DBDocument<T>>,
  options?: SnapshotOptions,
): CSDocumentWithId<T> => {
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
};

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

  return _doc<V>(name, docId);
};

const _doc = <T extends DocumentData>(
  collectionId: string,
  docId: string,
): DocumentReference<CSDocumentWithId<T>, DBDocument<T>> => {
  return doc(db, collectionId, docId).withConverter({
    toFirestore: toFirestoreConverter,
    fromFirestore: fromFirestoreConverter,
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

  return _query<V>(name, queryConstraints);
};

export const _query = <T extends DocumentData>(
  collectionId: string,
  queryConstraints: QueryConstraint[] = [],
): Query<CSDocumentWithId<T>, DBDocument<T>> => {
  return query(collection(db, collectionId), ...queryConstraints).withConverter(
    {
      toFirestore: toFirestoreConverter,
      fromFirestore: fromFirestoreConverter,
    },
  ) as Query<CSDocumentWithId<T>, DBDocument<T>>;
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
