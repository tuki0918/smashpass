import type { DocumentData, Timestamp } from "firebase/firestore";

export type DBDocumentId = {
	id: string;
};
export type DBDocumentDate = {
	created_at: Timestamp;
	updated_at: Timestamp;
	published_at?: Timestamp;
	revised_at?: Timestamp;
};

export type DBDocument<T extends DocumentData> = T &
	DBDocumentDate &
	DBDocumentId;
export type DBCollection<T extends DocumentData> = DBDocument<T>[];

export type SmashCounterStatus = "published" | "draft";
export type SmashCounterDocumentData = {
	title: string;
	description: string;
	count: number;
	status: SmashCounterStatus;
	created_by_id: string;
};
