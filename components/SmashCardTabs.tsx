"use client";

import { RealTimeSmashCardList } from "@/components/SmashCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import { useAuth } from "@/hooks/useAuth";
import type {
	DBDocument,
	DBDocumentWithId,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";

const getDocsByUserId = async (
	userId: string,
): Promise<DBDocumentWithId<SmashCounterDocumentData>[]> => {
	const collectionId = DB_FIRESTORE_SMASH_COLLECTION_NAME;
	const q = query(
		collection(db, collectionId),
		where("created_by_id", "==", userId),
	);
	const querySnapshot = await getDocs(q);
	const data = querySnapshot.docs.map((doc) => ({
		...(doc.data() as DBDocument<SmashCounterDocumentData>),
		id: doc.id,
	}));

	return data;
};

const SmashCardTabs: FC<{
	data: DBDocumentWithId<SmashCounterDocumentData>[];
}> = ({ data }) => {
	const router = useRouter();
	const handleCreateItem = useCallback(() => {
		router.push("/dashboard/smash/new");
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
		DBDocumentWithId<SmashCounterDocumentData>[]
	>([]);

	const { user } = useAuth();

	useEffect(() => {
		if (!user) {
			setData([]);
			return;
		}

		const uid = user.uid;
		const fetchData = async () => {
			const data = await getDocsByUserId(uid);
			// Sort by updated_at desc (reason: Composite index required on firestore.)
			const sortedData = data.sort(
				(a, b) => b.updated_at.toMillis() - a.updated_at.toMillis(),
			);
			setData(sortedData);
		};
		fetchData();
	}, [user]);

	return <SmashCardTabs data={data} />;
};
