"use client";

import { useFirestoreDoc } from "@/hooks/useFirestore";
import type {
	DBDocument,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { smashCounterAtom } from "@/utils/atoms";
import { useAtom } from "jotai";
import type { FC } from "react";
import { animated, useSpring } from "react-spring";

const SmashCounter: FC<{
	/** undefined: loading, null: not found */
	data: DBDocument<SmashCounterDocumentData> | undefined | null;
}> = ({ data }) => {
	const animation = useSpring({
		from: { opacity: 0.3, transform: "scale(0.5)" },
		to: { opacity: 1, transform: "scale(1)" },
		reset: true,
		config: { tension: 300, friction: 10 },
	});

	const content =
		data === undefined ? (
			<span>...</span>
		) : data === null ? (
			<span>Not found.</span>
		) : (
			<animated.span style={animation}>{data.count}</animated.span>
		);

	return <div className="text-6xl font-bold text-gray-600">{content}</div>;
};

export default SmashCounter;

export const SmashCounterWithAtom: FC<{ docId: string }> = ({ docId }) => {
	useFirestoreDoc(docId);
	const [data] = useAtom(smashCounterAtom);
	return <SmashCounter data={data} />;
};
