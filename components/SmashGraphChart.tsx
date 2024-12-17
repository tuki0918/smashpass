"use client";

import SmashGraphBarChart from "@/components/SmashGraphBarChart";
import SmashGraphPieChart from "@/components/SmashGraphPieChart";
import {
	useFirestoreDocumentSync,
	useFirestoreDocumentsSync,
} from "@/hooks/useFirestore";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type {
	SmashGraphDocumentData,
	SmashGraphItemDocumentData,
} from "@/types/firebase/firestore/models";
import { docRef, docsQuery, getDocsByQuery } from "@/utils/firestore";
import { where } from "firebase/firestore";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

type SmashGraphChartData = {
	graph: CSDocumentWithId<SmashGraphDocumentData>;
	graph_items: CSDocumentWithId<SmashGraphItemDocumentData>[];
};

const SmashGraphChart: FC<{
	/** undefined: loading, null: not found */
	data: SmashGraphChartData | undefined | null;
}> = ({ data }) => {
	if (!data || data.graph_items.length === 0) {
		return (
			<div className="text-6xl font-bold text-gray-400">
				<span>{data === undefined ? "..." : "="}</span>
			</div>
		);
	}

	const chartData = useMemo(() => {
		return data.graph_items.map((item) => ({
			title: item.title,
			count: item.count,
			fill: `hsl(var(--chart-${(item.sort_order % 5) + 1}))`,
		}));
	}, [data.graph_items]);

	if (data.graph.style === "bar-chart") {
		return <SmashGraphBarChart data={chartData} />;
	}

	return <SmashGraphPieChart data={chartData} />;
};

export default SmashGraphChart;

export const RealTimeSmashGraphChart: FC<{ docId: string }> = ({ docId }) => {
	// Prevent duplicate effect
	const ref = useMemo(() => docRef("graph", docId), [docId]);
	const graph = useFirestoreDocumentSync(ref);
	const [items, setItems] = useState<
		CSDocumentWithId<SmashGraphItemDocumentData>[]
	>([]);

	useEffect(() => {
		if (graph) {
			const fetchData = async () => {
				const q = docsQuery("graph_item", [where("graph_id", "==", graph.id)]);
				const data = await getDocsByQuery(q);
				setItems(data);
			};
			fetchData();
		}
	}, [graph]);
	const data = graph ? { graph, graph_items: items } : graph;
	return <RealTimeSmashGraphChartSync data={data} />;
};

export const RealTimeSmashGraphChartSync: FC<{
	data: SmashGraphChartData | undefined | null;
}> = ({ data }) => {
	// Prevent duplicate effect
	const docRefs = useMemo(() => {
		if (data?.graph_items === undefined) return [];
		return data.graph_items.map((item) => docRef("graph_item", item.id));
	}, [data?.graph_items]);

	const items = useFirestoreDocumentsSync(docRefs);
	const filteredItems = items.filter((x) => !!x);
	const sortedItems =
		data?.graph.sort === "ranking"
			? filteredItems.sort((a, b) => b.count - a.count)
			: filteredItems.sort((a, b) => a.sort_order - b.sort_order);

	const chartData = data
		? { graph: data.graph, graph_items: sortedItems }
		: data;
	return <SmashGraphChart data={chartData} />;
};
