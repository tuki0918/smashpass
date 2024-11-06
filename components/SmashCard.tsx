"use client";

import SmashCounter from "@/components/SmashCounter";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import { useFirestoreDocumentSync } from "@/hooks/useFirestore";
import type {
	CSDocumentWithId,
	DBDocumentWithId,
} from "@/types/firebase/firestore";
import type { SmashCounterDocumentData } from "@/types/firebase/firestore/models";
import { docRef } from "@/utils/firestore";
import { Eye, Pencil, SearchX } from "lucide-react";
import Link from "next/link";
import { type FC, useMemo } from "react";

const SmashCard: FC<{
	/** undefined: loading, null: not found */
	data: CSDocumentWithId<SmashCounterDocumentData> | undefined | null;
}> = ({ data }) => {
	if (data === undefined) {
		return (
			<Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
				<div className="aspect-video relative overflow-hidden bg-slate-200">
					<div className="h-full flex items-center justify-center">
						<SmashCounter data={data} />
					</div>

					{/* Status badge */}
					<div className="absolute bottom-4 right-4">
						<Skeleton className="h-4 w-20" />
					</div>
				</div>

				<CardHeader>
					<CardTitle className="text-2xl">
						<Skeleton className="h-6 w-full" />
					</CardTitle>
					<div className="text-sm text-gray-500 dark:text-gray-400">
						<Skeleton className="h-3.5 w-full my-0.5" />
						<Skeleton className="h-3.5 w-full my-0.5" />
						<Skeleton className="h-3.5 w-3/4 my-0.5" />
					</div>
				</CardHeader>
			</Card>
		);
	}

	if (data === null) {
		return (
			<Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
				<div className="aspect-video relative overflow-hidden bg-slate-200">
					<div className="h-full flex items-center justify-center">
						<SmashCounter data={data} />
					</div>
				</div>

				<CardHeader>
					<CardTitle className="text-2xl">Error</CardTitle>
					<CardDescription className="text-sm text-gray-500 dark:text-gray-400">
						Not found.
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
			<div className="aspect-video relative overflow-hidden bg-slate-200">
				<div className="h-full flex items-center justify-center">
					<SmashCounter data={data} />
				</div>

				{/* Connecting animation */}
				{data.status === "published" && (
					<div className="flex h-3 w-3 absolute top-2 right-2">
						<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
						<span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
					</div>
				)}

				{/* Status badge */}
				<div className="absolute bottom-4 right-4">
					<Badge variant="outline" className="bg-white">
						{data.status}
					</Badge>
				</div>

				{/* Hover overlay with icons */}
				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-8 backdrop-blur-sm">
					<Link
						href={`/smash/${data.id}`}
						className="p-2 bg-white/90 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200"
					>
						<Eye className="h-10 w-10 md:h-6 md:w-6 text-gray-800" />
					</Link>
					<Link
						href={`/dashboard/smash/${data.id}/edit`}
						type="button"
						className="p-2 bg-white/90 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200"
					>
						<Pencil className="h-10 w-10 md:h-6 md:w-6 text-gray-800" />
					</Link>
				</div>
			</div>

			<CardHeader>
				<CardTitle className="text-2xl">{data.title}</CardTitle>
				<CardDescription className="text-sm text-gray-500 dark:text-gray-400">
					{data.description}
				</CardDescription>
			</CardHeader>
		</Card>
	);
};

export default SmashCard;

export const RealTimeSmashCard: FC<{ docId: string }> = ({ docId }) => {
	// Prevent duplicate effect
	const ref = useMemo(
		() =>
			docRef<SmashCounterDocumentData>(
				DB_FIRESTORE_SMASH_COLLECTION_NAME,
				docId,
			),
		[docId],
	);
	const data = useFirestoreDocumentSync(ref);
	return <SmashCard data={data} />;
};

export const RealTimeSmashCardList: FC<{
	data: DBDocumentWithId<SmashCounterDocumentData>[];
}> = ({ data }) => {
	if (data.length === 0) {
		return (
			<div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
				<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
					<SearchX color="#999999" size={64} />
					<h3 className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
						No items found.
					</h3>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{data.map((doc) => (
				<RealTimeSmashCard key={doc.id} docId={doc.id} />
			))}
		</div>
	);
};
