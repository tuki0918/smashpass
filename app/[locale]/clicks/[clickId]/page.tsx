import { RealTimeSmashClickCounter } from "@/components/SmashClickCounter";
import { docRef, getDocByRef } from "@/utils/firestore";
import type { Metadata } from "next";

type Props = {
	params: { clickId: string };
};

export default async function Page({ params }: Props) {
	const { clickId } = params;
	return (
		<div className="min-h-screen flex items-center justify-center">
			<RealTimeSmashClickCounter docId={clickId} />
		</div>
	);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { clickId } = params;
	const data = await getDocByRef(docRef("click", clickId));

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
