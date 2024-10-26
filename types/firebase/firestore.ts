import type { DocumentData } from "firebase/firestore";

export type DBDocument<T extends DocumentData> = T & { id: string };
export type DBCollection<T extends DocumentData> = DBDocument<T>[];

export type SmashCounterDocumentData = {
	count: number;
};
