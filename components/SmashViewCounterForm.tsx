"use client";

import { deleteItem, saveItem } from "@/actions/SmashViewCounterActions";
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
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@/utils/i18n/routing";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const formSchema = z.object({
	title: z.string().min(2, {
		message: "Title must be at least 2 characters.",
	}),
	description: z.string(),
	count: z.preprocess(
		(v) => Number(v) || 0,
		z.number().int().nonnegative({
			message: "Count must be a nonnegative (>= 0) integer.",
		}),
	),
	status: z.enum(["published", "draft"]),
	user_id: z
		.string({
			message: "You must be logged in.",
		})
		.min(1, {
			message: "You must be logged in.",
		}),
});

const SmashViewCounterForm: FC<{
	itemId?: string;
	defaultValues?: Partial<z.infer<typeof formSchema>>;
}> = ({ itemId = null, defaultValues }) => {
	const isCreate = !itemId;
	const router = useRouter();
	const { user } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingDelete, setIsLoadingDelete] = useState(false);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: defaultValues?.title || "No title",
			description: defaultValues?.description || "",
			count: defaultValues?.count || 0,
			status: defaultValues?.status || "draft",
			user_id: defaultValues?.user_id || "",
		},
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
			router.refresh();
		},
		[itemId, router],
	);

	const handleDelete = useCallback(async () => {
		if (!itemId) {
			return;
		}

		// TODO: dialog
		if (confirm("Are you sure you want to delete this item?")) {
			setIsLoadingDelete(true);
			await deleteItem(itemId);
			setIsLoadingDelete(false);
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
							<Button
								variant="destructive"
								disabled={isLoadingDelete}
								onClick={handleDelete}
							>
								{isLoadingDelete && <LoaderCircle className="animate-spin" />}
								Delete
							</Button>
						)}
					</div>
				</form>
			</Form>
		</div>
	);
};

export default SmashViewCounterForm;
