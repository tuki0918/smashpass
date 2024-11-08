"use client";

import { RealTimeSmashCardList } from "@/components/SmashCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type { SmashViewCounterDocumentData } from "@/types/firebase/firestore/models";
import { docsQuery, getDocsByQuery } from "@/utils/firestore";
import { where } from "firebase/firestore";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

const SmashCardTabs: FC<{
	data: CSDocumentWithId<SmashViewCounterDocumentData>[];
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

// TODO: server-side auth logic
export const SmashCardTabsForLoggedInUser: FC = () => {
	const [data, setData] = useState<
		CSDocumentWithId<SmashViewCounterDocumentData>[]
	>([]);

	const { user } = useAuth();

	useEffect(() => {
		if (!user) {
			setData([]);
			return;
		}

		const uid = user.uid;
		const fetchData = async () => {
			const q = docsQuery("view", [where("created_by_id", "==", uid)]);
			const data = await getDocsByQuery(q);
			// Sort by updated_at_ms desc (reason: Composite index required on firestore.)
			const sortedData = data.sort((a, b) => b.updated_at_ms - a.updated_at_ms);
			setData(sortedData);
		};
		fetchData();
	}, [user]);

	return <SmashCardTabs data={data} />;
};
