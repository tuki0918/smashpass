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
import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/utils/firebase";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string().optional(),
	count: z.preprocess(
		(v) => Number(v) || 0,
		z.number().int().nonnegative({
			message: "Count must be a nonnegative (>= 0) integer.",
		}),
	),
	status: z.enum(["published", "draft"]),
	created_by_id: z
		.string({
			message: "You must be logged in.",
		})
		.min(1, {
			message: "You must be logged in.",
		}),
});

// TODO: Must be restricted by Firestore security rules or server-side logic
const createNewItem = async (v: z.infer<typeof formSchema>) => {
	try {
		const collectionId = DB_FIRESTORE_SMASH_COLLECTION_NAME;
		const collectionRef = collection(db, collectionId);

		const data = {
			title: v.title,
			description: v.description,
			count: v.count,
			status: v.status,
			created_by_id: v.created_by_id,
			created_at: serverTimestamp(),
			updated_at: serverTimestamp(),
		};

		await addDoc(collectionRef, data);
	} catch (err) {
		console.error(err);
	}
};

const SmashCounterCreateForm: FC = () => {
	const router = useRouter();
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "no title",
			description: "",
			count: 0,
			status: "draft",
			created_by_id: "",
		},
	});

	useEffect(() => {
		if (user) {
			// fill in the created_by_id field with the user's uid
			form.setValue("created_by_id", user.uid);
		}
	}, [user, form]);

	const onSubmit = useCallback(
		async (values: z.infer<typeof formSchema>) => {
			setIsLoading(true);
			await createNewItem(values);
			setIsLoading(false);
			router.push("/smash");
		},
		[router],
	);

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
						name="count"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Count</FormLabel>
								<FormControl>
									<Input type="number" placeholder="0" {...field} />
								</FormControl>
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

					<FormField
						control={form.control}
						name="created_by_id"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input type="hidden" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" disabled={isLoading}>
						{isLoading && <LoaderCircle className="animate-spin" />}
						Create
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default SmashCounterCreateForm;
