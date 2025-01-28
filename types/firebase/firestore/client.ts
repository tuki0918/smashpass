import type { DocumentData } from "firebase/firestore";
import type { DBDocumentId } from "./db";

export type CSDocumentId = DBDocumentId;
export type CSDocumentDate = {
	created_at_ms: number;
	updated_at_ms: number;
	published_at_ms?: number;
	revised_at_ms?: number;
};

export type CSDocument<T extends DocumentData> = T & CSDocumentDate;
export type CSDocumentWithId<T extends DocumentData> = CSDocument<T> &
	CSDocumentId;
export type CSCollection<T extends DocumentData> = CSDocument<T>[];
