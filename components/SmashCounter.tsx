"use client";

import { DB_FIRESTORE_SMASH_COLLECTION_NAME } from "@/config/app";
import { useFirestoreDocumentSync } from "@/hooks/useFirestore";
import { cn } from "@/lib/utils";
import type { DBDocumentWithId } from "@/types/firebase/firestore";
import type { SmashCounterDocumentData } from "@/types/firebase/firestore/models";
import { docRef } from "@/utils/firestore";
import { type FC, useMemo } from "react";
import { animated, useSpring } from "react-spring";

const SmashCounter: FC<{
	/** undefined: loading, null: not found */
	data: DBDocumentWithId<SmashCounterDocumentData> | undefined | null;
}> = ({ data }) => {
	const animation = useSpring({
		from: { opacity: 0.3, transform: "scale(0.5)" },
		to: { opacity: 1, transform: "scale(1)" },
		reset: true,
		config: { tension: 300, friction: 10 },
	});

	const isPublished = data?.status === "published";

	const content =
		data === undefined ? (
			<span>...</span>
		) : data === null ? (
			<span>=</span>
		) : (
			<animated.span style={animation}>
				{new Intl.NumberFormat().format(data.count)}
			</animated.span>
		);

	return (
		<div
			className={cn("text-6xl font-bold", {
				"text-gray-600": isPublished, // active
				"text-gray-400": !isPublished, // inactive
			})}
		>
			{content}
		</div>
	);
};

export default SmashCounter;

export const RealTimeSmashCounter: FC<{ docId: string }> = ({ docId }) => {
	const ref = useMemo(
		() =>
			docRef<SmashCounterDocumentData>(
				DB_FIRESTORE_SMASH_COLLECTION_NAME,
				docId,
			),
		[docId],
	);
	const data = useFirestoreDocumentSync(ref);
	return <SmashCounter data={data} />;
};
