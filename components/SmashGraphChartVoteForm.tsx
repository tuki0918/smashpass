"use client";

import { voteItem } from "@/actions/SmashGraphChartVoteActions";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
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
import { useRouter } from "@/utils/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { where } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type SmashGraphChartData = {
	graph: CSDocumentWithId<SmashGraphDocumentData>;
	graph_items: CSDocumentWithId<SmashGraphItemDocumentData>[];
};

export const formSchema = z.object({
	id: z.string().min(1),
});

const SmashGraphChartVoteForm: FC<{
	/** undefined: loading, null: not found */
	data: SmashGraphChartData | undefined | null;
}> = ({ data }) => {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {},
	});

	const onSubmit = useCallback(
		async (values: z.infer<typeof formSchema>) => {
			setIsLoading(true);
			await voteItem(values);
			setIsLoading(false);

			toast({
				title: "Voted",
				description: "Your vote has been counted.",
			});

			router.push(`/graphs/${data?.graph.id}`);
			router.refresh();
		},
		[data, toast, router],
	);

	if (!data || data.graph_items.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center justify-center w-full">
			<div className="my-10 mx-auto md:my-0 md:h-full w-full">
				<div className="bg-white rounded-xl shadow-lg p-8 mx-8">
					<h1 className="text-3xl font-bold text-neutral-800 mb-2">
						{data.graph.title}
					</h1>
					<p className="text-neutral-600 mb-4">{data.graph.description}</p>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="id"
								render={({ field }) => (
									<FormItem className="space-y-3">
										<FormLabel className="text-lg font-medium">
											Select a item
										</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value}
												className="grid grid-cols-1 md:grid-cols-2 gap-4"
											>
												{data.graph_items.map((item) => (
													<FormItem key={item.title}>
														<FormControl>
															<RadioGroupItem
																value={item.id}
																className="peer sr-only"
															/>
														</FormControl>
														<FormLabel className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-muted/50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
															<span className="text-xl mb-1">{item.title}</span>
														</FormLabel>
													</FormItem>
												))}
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{data.graph.status === "published" ? (
								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading && <LoaderCircle className="animate-spin" />}
									Vote
								</Button>
							) : (
								<Button type="submit" className="w-full" disabled>
									Out of voting period.
								</Button>
							)}
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default SmashGraphChartVoteForm;

export const RealTimeSmashGraphChartVoteForm: FC<{ docId: string }> = ({
	docId,
}) => {
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
	return <RealTimeSmashGraphChartVoteFormSync data={data} />;
};

export const RealTimeSmashGraphChartVoteFormSync: FC<{
	data: SmashGraphChartData | undefined | null;
}> = ({ data }) => {
	// Prevent duplicate effect
	const docRefs = useMemo(() => {
		if (data?.graph_items === undefined) return [];
		return data.graph_items.map((item) => docRef("graph_item", item.id));
	}, [data?.graph_items]);

	const items = useFirestoreDocumentsSync(docRefs);
	const filteredItems = items.filter((x) => !!x);

	const chartData = data
		? { graph: data.graph, graph_items: filteredItems }
		: data;
	return <SmashGraphChartVoteForm data={chartData} />;
};
