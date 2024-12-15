"use client";

import { incrementCount } from "@/actions/SmashClickCounterActions";
import { useFirestoreDocumentSync } from "@/hooks/useFirestore";
import { cn } from "@/lib/utils";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type { SmashClickCounterDocumentData } from "@/types/firebase/firestore/models";
import { docRef } from "@/utils/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { type FC, useMemo } from "react";

const SmashClickCounter: FC<{
	/** undefined: loading, null: not found */
	data: CSDocumentWithId<SmashClickCounterDocumentData> | undefined | null;
	isAct?: boolean;
}> = ({ data, isAct = false }) => {
	const isPublished = data?.status === "published";
	const icon = data?.icon;

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
		<div className="flex items-center justify-center space-x-2 select-none">
			<span
				className={cn("text-6xl font-bold", {
					"text-gray-600": isPublished, // active
					"text-gray-400": !isPublished, // inactive
				})}
			>
				{content}
			</span>

			{data?.status === "published" && isAct ? (
				<AnimatePresence mode="popLayout">
					<motion.span
						className="text-5xl hover:cursor-pointer"
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
						onClick={async () => await incrementCount(data.id)}
					>
						{icon}
					</motion.span>
				</AnimatePresence>
			) : (
				<span className="text-5xl">{icon}</span>
			)}
		</div>
	);
};

export default SmashClickCounter;

export const RealTimeSmashClickCounter: FC<{
	docId: string;
	isAct?: boolean;
}> = ({ docId, isAct = false }) => {
	// Prevent duplicate effect
	const ref = useMemo(() => docRef("click", docId), [docId]);
	const data = useFirestoreDocumentSync(ref);
	return <SmashClickCounter data={data} isAct={isAct} />;
};
