"use client";

import SmashCard from "@/components/SmashCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type { SmashOriginDocumentData } from "@/types/firebase/firestore/models";
import { docsQuery, getDocsByQuery } from "@/utils/firestore";
import { where } from "firebase/firestore";
import { PlusCircleIcon, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

const SmashCardTabs: FC<{
	data: CSDocumentWithId<SmashOriginDocumentData>[];
}> = ({ data }) => {
	const router = useRouter();
	const handleCreateItem = useCallback(() => {
		router.push("/dashboard/views/new");
	}, [router]);

	return (
		<Tabs defaultValue="all">
			<div className="space-between flex items-center">
				<TabsList className="mb-2">
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="published">Published</TabsTrigger>
					<TabsTrigger value="draft">Draft</TabsTrigger>
				</TabsList>
				<div className="ml-auto">
					<Button onClick={handleCreateItem}>
						<PlusCircleIcon className="mr-2 h-4 w-4" />
						Create item
					</Button>
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
