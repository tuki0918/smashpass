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
		<>
			<SmashCounter data={data} />
		</>
	);
};

export default SmashMain;
