"use client";

import { useFirestoreDocumentSync } from "@/hooks/useFirestore";
import { cn } from "@/libs/utils";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type { SmashViewCounterDocumentData } from "@/types/firebase/firestore/models";
import { docRef } from "@/utils/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { type FC, useMemo } from "react";

const SmashViewCounter: FC<{
	/** undefined: loading, null: not found */
	data: CSDocumentWithId<SmashViewCounterDocumentData> | undefined | null;
}> = ({ data }) => {
	const isPublished = data?.status === "published";

	const content =
		data === undefined ? (
			<span>...</span>
		) : data === null ? (
			<span>=</span>
		) : (
			<AnimatePresence mode="popLayout">
				<motion.div
					key={data.count}
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -20, opacity: 0 }}
				>
					{new Intl.NumberFormat().format(data.count)}
				</motion.div>
			</AnimatePresence>
		);

	return (
		<div
			className={cn("select-none text-6xl font-bold", {
				"text-gray-600": isPublished, // active
				"text-gray-400": !isPublished, // inactive
			})}
		>
			{content}
		</div>
	);
};

export default SmashViewCounter;

export const RealTimeSmashViewCounter: FC<{ docId: string }> = ({ docId }) => {
	// Prevent duplicate effect
	const ref = useMemo(() => docRef("view", docId), [docId]);
	const data = useFirestoreDocumentSync(ref);
	return <SmashViewCounter data={data} />;
};
