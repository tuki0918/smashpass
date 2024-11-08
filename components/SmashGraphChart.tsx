"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type {
	SmashGraphDocumentData,
	SmashGraphItemDocumentData,
} from "@/types/firebase/firestore/models";
import type { FC } from "react";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

type SmashGraphChartData = {
	graph: CSDocumentWithId<SmashGraphDocumentData>;
	graph_items: CSDocumentWithId<SmashGraphItemDocumentData>[];
};

type PieChartData = {
	title: string;
	count: number;
	fill: string;
}[];

const SmashGraphChart: FC<{
	/** undefined: loading, null: not found */
	data: SmashGraphChartData | undefined | null;
}> = ({ data }) => {
	if (!data) {
		return (
			<div className="text-6xl font-bold text-gray-400">
				<span>{data === undefined ? "..." : "="}</span>
			</div>
		);
	}

	const total = useMemo(() => {
		return data.graph_items.reduce((acc, curr) => acc + curr.count, 0);
	}, [data.graph_items]);

	const pieChartData = useMemo(() => {
		const items: PieChartData = data.graph_items.map((item, i) => ({
			title: item.title,
			count: item.count,
			fill: `hsl(var(--chart-${(i % 5) + 1}))`,
		}));
		return items;
	}, [data.graph_items]);

	return (
		<Card className="flex flex-col">
			<CardHeader className="items-center pb-0">
				<CardTitle>{data.graph.title}</CardTitle>
				{data.graph.description !== "" && (
					<CardDescription>{data.graph.description}</CardDescription>
				)}
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={{}}
					className="mx-auto aspect-square max-h-[250px]"
				>
					<PieChart>
						<ChartTooltip
							cursor={false}
							content={<ChartTooltipContent hideLabel />}
						/>
						<Pie
							data={pieChartData}
							dataKey="count"
							nameKey="title"
							innerRadius={60}
							strokeWidth={5}
						>
							<Label
								content={({ viewBox }) => {
									if (viewBox && "cx" in viewBox && "cy" in viewBox) {
										return (
											<text
												x={viewBox.cx}
												y={viewBox.cy}
												textAnchor="middle"
												dominantBaseline="middle"
											>
												<tspan
													x={viewBox.cx}
													y={viewBox.cy}
													className="fill-foreground text-3xl font-bold"
												>
													{total.toLocaleString()}
												</tspan>
												<tspan
													x={viewBox.cx}
													y={(viewBox.cy || 0) + 24}
													className="fill-muted-foreground"
												>
													Voted
												</tspan>
											</text>
										);
									}
								}}
							/>
						</Pie>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
};

export default SmashGraphChart;

export const RealTimeSmashGraphChart: FC<{ docId: string }> = ({ docId }) => {
	return <SmashGraphChart data={undefined} />;
};
