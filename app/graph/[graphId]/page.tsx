import { RealTimeSmashGraphChart } from "@/components/SmashGraphChart";
import { docRef, getDocByRef } from "@/utils/firestore";
import type { Metadata } from "next";

type Props = {
	params: { graphId: string };
};

export default async function Page({ params }: Props) {
	const { graphId } = params;
	return (
		<div className="min-h-screen flex items-center justify-center">
			<div>
				<RealTimeSmashGraphChart docId={graphId} />
			</div>
		</div>
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { graphId } = params;
	const data = await getDocByRef(docRef("graph", graphId));

	if (data) {
		return {
			title: data.title,
			description: data.description,
		};
	}

	return {
		title: "Not Found",
	};
}
