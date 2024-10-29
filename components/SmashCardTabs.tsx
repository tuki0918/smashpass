"use client";

import { RealTimeSmashCardList } from "@/components/SmashCard";
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
import type { FC } from "react";
import { useEffect, useState } from "react";

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
	return (
		<Tabs defaultValue="all">
			<TabsList>
				<TabsTrigger value="all">All</TabsTrigger>
				<TabsTrigger value="published">Published</TabsTrigger>
				<TabsTrigger value="draft">Draft</TabsTrigger>
			</TabsList>
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
		if (user === null) {
			setData([]);
			return;
		}

		const uid = user.uid;
		const fetchData = async () => {
			const data = await getDocsByUserId(uid);
			setData(data);
		};
		fetchData();
	}, [user]);

	return <SmashCardTabs data={data} />;
};
