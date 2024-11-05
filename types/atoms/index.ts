import type { DBDocumentWithId } from "@/types/firebase/firestore";
import type { DocumentData } from "firebase/firestore";

/** T: data, null: not found, undefined: loading data */
export type AtomData<T> = T | null | undefined;

export type AtomDBDocumentData<T extends DocumentData> = AtomData<
	DBDocumentWithId<T>
>;
