import type { DocumentData } from "firebase/firestore";

export type DBDocument<T extends DocumentData> = T & { id: string };
export type DBCollection<T extends DocumentData> = DBDocument<T>[];

export type SmashCounterStatus = "published" | "draft";
export type SmashCounterDocumentData = {
	title: string;
	description: string;
	count: number;
	status: SmashCounterStatus;
	created_by_id: string;
};
