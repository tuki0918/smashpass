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

export type DBDocument<T extends DocumentData> = T & DBDocumentDate;
export type DBDocumentWithId<T extends DocumentData> = DBDocument<T> &
	DBDocumentId;
export type DBCollection<T extends DocumentData> = DBDocument<T>[];

export type CSDocumentId = DBDocumentId;
export type CSDocumentDate = {
	created_at: Date;
	updated_at: Date;
	published_at?: Date;
	revised_at?: Date;
};

export type CSDocument<T extends DocumentData> = T & CSDocumentDate;
export type CSDocumentWithId<T extends DocumentData> = CSDocument<T> &
	CSDocumentId;
export type CSCollection<T extends DocumentData> = CSDocument<T>[];
