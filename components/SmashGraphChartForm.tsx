"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DB_FIRESTORE_COLLECTION_NAMES } from "@/config/app";
import { useAuth } from "@/hooks/useAuth";
import type { DBDocument } from "@/types/firebase/firestore";
import type {
	SmashGraphDocumentData,
	SmashGraphItemDocumentData,
} from "@/types/firebase/firestore/models";
import { db } from "@/utils/firebase";
import { docRef, docsQuery, getDocsByQuery } from "@/utils/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	addDoc,
	collection,
	deleteDoc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { where } from "firebase/firestore";
import { LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

const MIN_ITEMS_LENGTH = 2;

const formSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string(),
	status: z.enum(["published", "draft"]),
	style: z.enum(["pie-chart", "bar-chart"]),
	user_id: z
		.string({
			message: "You must be logged in.",
		})
		.min(1, {
			message: "You must be logged in.",
		}),
	items: z
		.array(
			z.object({
				title: z.string().min(1, {
					message: "Title must be at least 1 characters.",
				}),
			}),
		)
		.min(MIN_ITEMS_LENGTH, {
			message: `At least ${MIN_ITEMS_LENGTH} items are required.`,
		}),
});

const saveItem = async (id: string | null, v: z.infer<typeof formSchema>) => {
	try {
		const collectionId = DB_FIRESTORE_COLLECTION_NAMES.graph;
		const collectionRef = collection(db, collectionId);

		const values: Omit<
			SmashGraphDocumentData,
			"created_by_id" | "updated_by_id"
		> = {
			title: v.title,
			description: v.description,
			type: "graph",
			style: v.style,
			status: v.status,
		};

		if (id) {
			// update
			const data: Partial<DBDocument<SmashGraphDocumentData>> = {
				...values,
				updated_by_id: v.user_id,
				updated_at: serverTimestamp() as Timestamp,
			};
			await updateDoc(docRef("graph", id), data);
		} else {
			// TODO: transaction
			const collectionItemId = DB_FIRESTORE_COLLECTION_NAMES.graph_item;
			const collectionItemRef = collection(db, collectionItemId);

			// create
			const data: DBDocument<SmashGraphDocumentData> = {
				...values,
				created_by_id: v.user_id,
				updated_by_id: v.user_id,
				created_at: serverTimestamp() as Timestamp,
				updated_at: serverTimestamp() as Timestamp,
			};

			const doc = await addDoc(collectionRef, data);

			const item_values: Omit<
				SmashGraphItemDocumentData,
				"created_by_id" | "updated_by_id"
			>[] = v.items
				// remove empty items
				.filter((item) => item.title.length > 0)
				// map to item values
				.map((item, i) => ({
					title: item.title,
					// TODO: default count for graph
					count: 1,
					sort_order: i + 1,
					graph_id: doc.id,
				}));

			// create graph and items
			await Promise.all(
				item_values.map((item) => {
					const itemData: DBDocument<SmashGraphItemDocumentData> = {
						...item,
						created_by_id: v.user_id,
						updated_by_id: v.user_id,
						created_at: serverTimestamp() as Timestamp,
						updated_at: serverTimestamp() as Timestamp,
					};
					return addDoc(collectionItemRef, itemData);
				}),
			);
		}
	} catch (err) {
		console.error(err);
	}
};

// TODO: server-side logic
const deleteItem = async (id: string) => {
	try {
		const items = await getDocsByQuery(
			docsQuery("graph_item", [where("graph_id", "==", id)]),
		);
		// TODO: transaction
		await deleteDoc(docRef("graph", id));
		await Promise.all(
			items.map((item) => {
				return deleteDoc(docRef("graph_item", item.id));
			}),
		);
	} catch (err) {
		console.error(err);
	}
};

const SmashGraphChartForm: FC<{
	itemId?: string;
	defaultValues?: Partial<z.infer<typeof formSchema>>;
}> = ({ itemId = null, defaultValues }) => {
	const isCreate = !itemId;
	const router = useRouter();
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: defaultValues?.title || "No title",
			description: defaultValues?.description || "",
			status: defaultValues?.status || "draft",
			style: defaultValues?.style || "pie-chart",
			user_id: defaultValues?.user_id || "",
			items: defaultValues?.items || [
				{
					title: "",
				},
				{
					title: "",
				},
			],
		},
	});

	const { fields, append, remove } = useFieldArray({
		name: "items",
		control: form.control,
	});

	useEffect(() => {
		if (user) {
			// fill in the user_id field with the user's uid
			form.setValue("user_id", user.uid);
		}
	}, [user, form]);

	const onSubmit = useCallback(
		async (values: z.infer<typeof formSchema>) => {
			setIsLoading(true);
			await saveItem(itemId, values);
			setIsLoading(false);
			router.push("/dashboard");
		},
		[itemId, router],
	);

	const handleDelete = useCallback(async () => {
		if (!itemId) {
			return;
		}

		// TODO: dialog
		if (confirm("Are you sure you want to delete this item?")) {
			setIsLoading(true);
			await deleteItem(itemId);
			setIsLoading(false);
			router.push("/dashboard");
		}
	}, [itemId, router]);

	return (
		<div className="w-4/5 md:w-3/5 lg:w-1/2">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Title</FormLabel>
								<FormControl>
									<Input placeholder="title" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Description</FormLabel>
								<FormControl>
									<Textarea placeholder="..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="style"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Style</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a style" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="pie-chart">Pie Chart</SelectItem>
										<SelectItem value="bar-chart">Bar Chart</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Status</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a verified email to display" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="draft">draft</SelectItem>
										<SelectItem value="published">published</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div>
						Items
						<div className="flex items-center justify-between rounded-lg border px-4 my-2">
							<div className="my-4">
								{fields.map((field, index) => (
									<div className="flex my-4 space-x-2" key={field.id}>
										<FormField
											control={form.control}
											name={`items.${index}.title`}
											render={({ field }) => (
												<FormItem>
													<FormControl>
														<Input
															{...field}
															className="min-w-[320px]"
															placeholder="name"
															disabled={!isCreate}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
										{isCreate && fields.length > MIN_ITEMS_LENGTH && (
											<Button
												type="button"
												variant="outline"
												onClick={() => remove(index)}
											>
												<Trash2 />
											</Button>
										)}
									</div>
								))}
							</div>

							{isCreate && (
								<div className="mx-auto">
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => append({ title: "" })}
									>
										Add Item
									</Button>
								</div>
							)}
						</div>
					</div>

					<FormField
						control={form.control}
						name="user_id"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input type="hidden" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="flex items-center justify-between">
						<Button type="submit" disabled={isLoading}>
							{isLoading && <LoaderCircle className="animate-spin" />}
							{isCreate ? "Create" : "Update"}
						</Button>

						{/* TODO: confirm */}
						{!isCreate && (
							<Button variant="destructive" onClick={handleDelete}>
								Delete
							</Button>
						)}
					</div>
				</form>
			</Form>
		</div>
	);
};

export default SmashGraphChartForm;
