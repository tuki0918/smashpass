import { RealTimeSmashGraphChart } from "@/components/SmashGraphChart";
import { RealTimeSmashGraphChartVoteForm } from "@/components/SmashGraphChartVoteForm";
import { docRef, getDocByRef } from "@/utils/firestore";
import type { Metadata } from "next";

type Props = {
	params: { graphId: string };
};

export default async function Page({ params }: Props) {
	const { graphId } = params;
	return (
		<div className="min-h-screen flex flex-col md:flex-row items-center justify-center">
			<RealTimeSmashGraphChart docId={graphId} />
			<RealTimeSmashGraphChartVoteForm docId={graphId} />
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
