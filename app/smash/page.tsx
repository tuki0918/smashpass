import Header from "@/components/Header";
import { RealTimeSmashCardList } from "@/components/SmashCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import type {
	DBDocument,
	DBDocumentWithId,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Activity } from "lucide-react";

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

export default async function Page() {
	const data = await getDocsByUserId("xxxxx");

	return (
		<div>
			<Header />

			<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="text-center mb-12">
						<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex justify-center">
							<Activity color="#333333" size={48} />
						</h1>
						<p className="text-lg text-gray-600 dark:text-gray-300">
							My activities
						</p>
					</div>

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
				</div>
			</div>
		</div>
	);
}
