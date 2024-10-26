"use client";

import type {
	DBDocument,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
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
			<span className="text-6xl font-bold text-gray-600">...</span>
		) : data === null ? (
			<span className="text-6xl font-bold text-gray-600">Not found.</span>
		) : (
			<animated.span
				style={animation}
				className="text-6xl font-bold text-gray-600"
			>
				{data.count}
			</animated.span>
		);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="flex items-center justify-center space-x-6 w-32 h-32">
				{content}
			</div>
		</div>
	);
};

export default SmashCounter;
