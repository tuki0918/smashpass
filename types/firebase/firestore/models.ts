import type { DB_FIRESTORE_COLLECTION_NAMES } from "@/config/app";

export type CollectionName = keyof typeof DB_FIRESTORE_COLLECTION_NAMES;
export type CollectionDocumentDataMap = {
	smash: SmashCounterDocumentData;
};

export type SmashCounterStatus = "published" | "draft";
export type SmashCounterDocumentData = {
	title: string;
	description: string;
	count: number;
	status: SmashCounterStatus;
	created_by_id: string;
	updated_by_id: string;
};
