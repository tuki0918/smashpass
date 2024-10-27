import { RealTimeSmashCardList } from "@/components/SmashCard";
import type {
	DBDocument,
	DBDocumentWithId,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const getDocsByUserId = async (
	userId: string,
): Promise<DBDocumentWithId<SmashCounterDocumentData>[]> => {
	const collectionId = "smash-view-counters";
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
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
						title
					</h1>
					<p className="text-lg text-gray-600 dark:text-gray-300">
						description
					</p>
				</div>

				<RealTimeSmashCardList data={data} />
			</div>
		</div>
	);
}
