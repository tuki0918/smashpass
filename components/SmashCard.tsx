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
import { useFirestoreDoc } from "@/hooks/useFirestore";
import type {
	DBDocument,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { smashCounterAtom } from "@/utils/atoms";
import { useAtom } from "jotai";
import { Eye, Pencil } from "lucide-react";
import Link from "next/link";
import type { FC } from "react";

const SmashCard: FC<{
	/** undefined: loading, null: not found */
	data: DBDocument<SmashCounterDocumentData> | undefined | null;
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

				{/* Status badge */}
				<div className="absolute bottom-4 right-4">
					<Badge variant="outline" className="bg-white">
						{data.status}
					</Badge>
				</div>

				{/* Hover overlay with icons */}
				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-8 backdrop-blur-sm">
					<Link href={`/smash/${data.id}`}>
						<button
							type="button"
							className="p-2 bg-white/90 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200"
						>
							<Eye className="h-5 w-5 text-gray-800" />
						</button>
					</Link>
					<button
						type="button"
						className="p-2 bg-white/90 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200"
					>
						<Pencil className="h-5 w-5 text-gray-800" />
					</button>
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
	useFirestoreDoc(docId);
	const [data] = useAtom(smashCounterAtom);
	return <SmashCard data={data} />;
};
