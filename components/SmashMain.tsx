"use client";

import { useFirestoreDoc } from "@/hooks/useFirestore";
import { smashCounterAtom } from "@/utils/atoms";
import { useAtom } from "jotai";
import type { FC } from "react";
import SmashCounter from "./SmashCounter";

const SmashMain: FC<{ docId: string }> = ({ docId }) => {
	useFirestoreDoc(docId);
	const [data] = useAtom(smashCounterAtom);

	return (
		<div className="min-h-screen flex items-center justify-center">
			<SmashCounter data={data} />
		</div>
	);
};

export default SmashMain;
