"use client";

import SmashCard from "@/components/SmashCard";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type { SmashOriginDocumentData } from "@/types/firebase/firestore/models";
import { docsQuery, getDocsByQuery } from "@/utils/firestore";
import { Link } from "@/utils/i18n/routing";
import { where } from "firebase/firestore";
import { ChartBarDecreasing, Eye, PlusCircleIcon, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";
import type { FC } from "react";
import { useEffect, useState } from "react";

const SmashCardTabs: FC<{
	data: CSDocumentWithId<SmashOriginDocumentData>[];
}> = ({ data }) => {
	const t = useTranslations("Components/SmashCardTabs");
	return (
		<Tabs defaultValue="all">
			<div className="space-between flex items-center">
				<TabsList className="mb-2">
					<TabsTrigger value="all">{t("tab/all")}</TabsTrigger>
					<TabsTrigger value="published">{t("tab/published")}</TabsTrigger>
					<TabsTrigger value="draft">{t("tab/draft")}</TabsTrigger>
				</TabsList>
				<div className="ml-auto">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>
								<PlusCircleIcon className="h-4 w-4" />
								{t("button/create")}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<Link href="/dashboard/views/new">
								<DropdownMenuItem className="hover:cursor-pointer">
									<Eye className="h-4 w-4" />
									{t("button/menu/views")}
								</DropdownMenuItem>
							</Link>
							<Link href="/dashboard/graphs/new">
								<DropdownMenuItem className="hover:cursor-pointer">
									<ChartBarDecreasing className="h-4 w-4" />
									{t("button/menu/votes")}
								</DropdownMenuItem>
							</Link>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<TabsContent value="all">
				<RealTimeSmashCardList data={data} />
			</TabsContent>
			<TabsContent value="published">
				<RealTimeSmashCardList
					data={data.filter((item) => item.status === "published")}
				/>
			</TabsContent>
			<TabsContent value="draft">
				<RealTimeSmashCardList
					data={data.filter((item) => item.status === "draft")}
				/>
			</TabsContent>
		</Tabs>
	);
};

export default SmashCardTabs;

export const RealTimeSmashCardList: FC<{
	data: CSDocumentWithId<SmashOriginDocumentData>[];
}> = ({ data }) => {
	const t = useTranslations("Components/SmashCardTabs");
	if (data.length === 0) {
		return (
			<div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
				<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
					<SearchX color="#999999" size={64} />
					<h3 className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-300">
						{t("results/empty")}
					</h3>
				</div>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{data.map((doc) => (
				<SmashCard key={doc.id} data={doc} />
			))}
		</div>
	);
};

// TODO: server-side auth logic
export const SmashCardTabsForLoggedInUser: FC = () => {
	const [data, setData] = useState<CSDocumentWithId<SmashOriginDocumentData>[]>(
		[],
	);

	const { user } = useAuth();

	useEffect(() => {
		if (!user) {
			setData([]);
			return;
		}

		const uid = user.uid;
		const fetchData = async () => {
			const q1 = docsQuery("view", [where("created_by_id", "==", uid)]);
			const q2 = docsQuery("graph", [where("created_by_id", "==", uid)]);
			const [data1, data2] = await Promise.all([
				getDocsByQuery(q1),
				getDocsByQuery(q2),
			]);
			const sortedData = [...data1, ...data2].sort(
				(a, b) => b.updated_at_ms - a.updated_at_ms,
			);
			setData(sortedData);
		};
		fetchData();
	}, [user]);

	return <SmashCardTabs data={data} />;
};
