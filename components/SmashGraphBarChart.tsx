"use client";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import type { FC } from "react";
import { useMemo } from "react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const SmashGraphBarChart: FC<{
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
	return (
		<ChartContainer config={config} className="h-[250px] w-11/12">
			<BarChart
				accessibilityLayer
				data={data}
				layout="vertical"
				margin={{
					left: 0,
				}}
			>
				<YAxis
					dataKey="title"
					type="category"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
				/>
				<XAxis dataKey="count" type="number" hide />
				<ChartTooltip
					cursor={false}
					content={<ChartTooltipContent hideLabel />}
				/>
				<Bar dataKey="count" layout="vertical" radius={5} />
			</BarChart>
		</ChartContainer>
	);
};

export default SmashGraphBarChart;
