"use client";

import SmashGraphPieChart from "@/components/SmashGraphPieChart";
import { useFirestoreDocumentSync } from "@/hooks/useFirestore";
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
		return data.graph_items.map((item, i) => ({
			title: item.title,
			count: item.count,
			fill: `hsl(var(--chart-${(i % 5) + 1}))`,
		}));
	}, [data.graph_items]);

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
				const sorted_data = data.sort((a, b) => a.sort_order - b.sort_order);
				setItems(sorted_data);
			};
			fetchData();
		}
	}, [graph]);

	const data = graph ? { graph, graph_items: items } : graph;
	return <SmashGraphChart data={data} />;
};
