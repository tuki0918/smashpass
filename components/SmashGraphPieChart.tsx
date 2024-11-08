"use client";

import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { FC } from "react";
import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

const SmashGraphPieChart: FC<{
	data: {
		title: string;
		count: number;
		fill: string;
	}[];
}> = ({ data }) => {
	const config = useMemo(() => {
		return data.reduce(
			(acc, curr) => {
				acc[curr.title] = {
					label: curr.title,
					color: curr.fill,
				};
				return acc;
			},
			{} as Record<string, { label: string; color: string }>,
		);
	}, [data]);

	const total = useMemo(() => {
		return data.reduce((acc, curr) => acc + curr.count, 0);
	}, [data]);

	return (
		<ChartContainer config={config} className="h-[250px] w-full">
			<PieChart>
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Pie
					data={data}
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
				<ChartLegend content={<ChartLegendContent />} />
			</PieChart>
		</ChartContainer>
	);
};

export default SmashGraphPieChart;
