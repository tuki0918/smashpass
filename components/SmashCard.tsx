"use client";

import SmashClickCounter, {
	RealTimeSmashClickCounter,
} from "@/components/SmashClickCounter";
import { RealTimeSmashGraphChart } from "@/components/SmashGraphChart";
import SmashViewCounter, {
	RealTimeSmashViewCounter,
} from "@/components/SmashViewCounter";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type { SmashOriginDocumentData } from "@/types/firebase/firestore/models";
import { Link } from "@/utils/i18n/routing";
import { ExternalLink, Eye, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";

const SmashCard: FC<{
	/** undefined: loading, null: not found */
	data: CSDocumentWithId<SmashOriginDocumentData> | undefined | null;
}> = ({ data }) => {
	const t = useTranslations("Components/SmashCard");
	if (data === undefined) {
		return (
			<Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
				<div className="aspect-video relative overflow-hidden bg-slate-200">
					<div className="h-full flex items-center justify-center">
						{/* TODO: data.type check */}
						<SmashViewCounter data={undefined} />
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
						{/* TODO: data.type check */}
						<SmashViewCounter data={null} />
					</div>
				</div>

				<CardHeader>
					<CardTitle className="text-2xl">Error</CardTitle>
					<CardDescription className="text-sm text-gray-500 dark:text-gray-400">
						{t("result/empty")}
					</CardDescription>
				</CardHeader>
			</Card>
		);
	}

	return (
		<Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
			<div className={"aspect-square relative overflow-hidden bg-slate-200"}>
				<div className="h-full flex items-center justify-center">
					{(() => {
						switch (data.type) {
							case "click":
								return <RealTimeSmashClickCounter docId={data.id} />;
							case "view":
								return <RealTimeSmashViewCounter docId={data.id} />;
							case "graph":
								return <RealTimeSmashGraphChart docId={data.id} />;
							default:
								// biome-ignore lint/correctness/noSwitchDeclarations:
								const _: never = data.type;
								return <div>Error</div>;
						}
					})()}
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
						{(() => {
							switch (data.type) {
								case "click":
									return t("type/clicks");
								case "view":
									return t("type/views");
								case "graph":
									return t("type/votes");
								default:
									// biome-ignore lint/correctness/noSwitchDeclarations:
									const _: never = data.type;
									return "unknown";
							}
						})()}
					</Badge>
				</div>

				{/* Hover overlay with icons */}
				<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-8 backdrop-blur-sm">
					<Link
						href={(() => {
							switch (data.type) {
								case "click":
									return `/clicks/${data.id}`;
								case "view":
									return `/views/${data.id}`;
								case "graph":
									return `/graphs/${data.id}`;
								default:
									// biome-ignore lint/correctness/noSwitchDeclarations:
									const _: never = data.type;
									return "#";
							}
						})()}
						className="flex p-2 px-4 bg-white/90 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200"
					>
						<Eye className="mr-2 h-6 w-6 text-gray-800" /> {t("link/view")}
					</Link>
					<Link
						href={(() => {
							switch (data.type) {
								case "click":
									return `/dashboard/clicks/${data.id}/edit`;
								case "view":
									return `/dashboard/views/${data.id}/edit`;
								case "graph":
									return `/dashboard/graphs/${data.id}/edit`;
								default:
									// biome-ignore lint/correctness/noSwitchDeclarations:
									const _: never = data.type;
									return "#";
							}
						})()}
						type="button"
						className="flex p-2 px-4 bg-white/90 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200"
					>
						<Pencil className="mr-2 h-6 w-6 text-gray-800" /> {t("link/edit")}
					</Link>

					{data.type === "click" && (
						<div className="absolute bottom-12">
							<Link
								href={`/clicks/${data.id}?act=true`}
								className="flex py-2 px-14 bg-white/90 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200"
							>
								{t("link/action")} <ExternalLink className="ml-2" />
							</Link>
						</div>
					)}

					{data.type === "graph" && (
						<div className="absolute bottom-12">
							<Link
								href={`/graphs/${data.id}/vote`}
								className="flex py-2 px-14 bg-white/90 rounded-full hover:bg-white transform hover:scale-110 transition-all duration-200"
							>
								{t("link/vote")} <ExternalLink className="ml-2" />
							</Link>
						</div>
					)}
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
