import type { DB_FIRESTORE_COLLECTION_NAMES } from "@/config/app";

export type CollectionName = keyof typeof DB_FIRESTORE_COLLECTION_NAMES;
export type CollectionDocumentDataMap = {
	view: SmashViewCounterDocumentData;
	click: SmashClickCounterDocumentData;
	graph: SmashGraphDocumentData;
	graph_item: SmashGraphItemDocumentData;
};

type OriginDocumentData = {
	created_by_id: string;
	updated_by_id: string;
};

type SmashOriginStatus = "published" | "draft";
type SmashOriginType = "view" | "click" | "graph";
export type SmashOriginDocumentData = OriginDocumentData & {
	title: string;
	description: string;
	status: SmashOriginStatus;
	type: SmashOriginType;
};

// Origin types

export type SmashViewCounterDocumentData = SmashOriginDocumentData & {
	type: "view";
	count: number;
};

export type SmashClickCounterDocumentData = SmashOriginDocumentData & {
	type: "click";
	count: number;
	icon: string;
};

export type SmashGraphStyle = "pie-chart" | "bar-chart";
export type SmashGraphDocumentData = SmashOriginDocumentData & {
	type: "graph";
	style: SmashGraphStyle;
};

// Sub types

export type SmashGraphItemDocumentData = OriginDocumentData & {
	title: string;
	count: number;
	graph_id: string;
	sort_order: number;
};
