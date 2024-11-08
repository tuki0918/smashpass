import type { DB_FIRESTORE_COLLECTION_NAMES } from "@/config/app";

export type CollectionName = keyof typeof DB_FIRESTORE_COLLECTION_NAMES;
export type CollectionDocumentDataMap = {
	smash: SmashCounterDocumentData;
	graph: SmashGraphDocumentData;
	graph_item: SmashGraphItemDocumentData;
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

export type SmashGraphStyle = "pie-chart" | "bar-chart";
export type SmashGraphStatus = "published" | "draft";
export type SmashGraphDocumentData = {
	title: string;
	description: string;
	status: SmashGraphStatus;
	style: SmashGraphStyle;
	created_by_id: string;
	updated_by_id: string;
};

export type SmashGraphItemDocumentData = {
	title: string;
	count: number;
	graph_id: string;
	created_by_id: string;
	updated_by_id: string;
};
