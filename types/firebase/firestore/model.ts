import type { DB_FIRESTORE_COLLECTION_NAMES } from "@/constants";

export type CollectionName = keyof typeof DB_FIRESTORE_COLLECTION_NAMES;
export type CollectionDocumentDataMap = {
	view: SmashViewCounterDocumentData;
	click: SmashClickCounterDocumentData;
	graph: SmashGraphDocumentData;
	graph_item: SmashGraphItemDocumentData;
};

type DocumentMetaData = {
	created_by_id: string;
	updated_by_id: string;
};

type SmashStatus = "published" | "draft";
type SmashType = "view" | "click" | "graph";
export type SmashDocumentCommonData = DocumentMetaData & {
	title: string;
	description: string;
	status: SmashStatus;
	type: SmashType;
};

// Model types

export type SmashViewCounterDocumentData = SmashDocumentCommonData & {
	type: "view";
	count: number;
};

export type SmashClickCounterDocumentData = SmashDocumentCommonData & {
	type: "click";
	count: number;
	icon: string;
};

export type SmashGraphStyle = "pie-chart" | "bar-chart";
export type SmashGraphSort = "default" | "ranking";
export type SmashGraphDocumentData = SmashDocumentCommonData & {
	type: "graph";
	style: SmashGraphStyle;
	sort: SmashGraphSort;
};

// Sub Model types

export type SmashGraphItemDocumentData = DocumentMetaData & {
	title: string;
	count: number;
	graph_id: string;
	sort_order: number;
};
