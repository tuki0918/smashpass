"use server";

import type { DBDocument } from "@/types/firebase/firestore";
import type { SmashViewCounterDocumentData } from "@/types/firebase/firestore/models";
import { docRef } from "@/utils/firestore";
import { increment, setDoc } from "firebase/firestore";
import { z } from "zod";

const formSchema = z.object({
	id: z.string().min(1),
});

export const voteItem = async (v: z.infer<typeof formSchema>) => {
	try {
		const ref = docRef("graph_item", v.id);
		await setDoc(
			ref,
			{
				count: increment(1) as unknown as number,
			} as Partial<DBDocument<SmashViewCounterDocumentData>>,
			{ merge: true },
		);
	} catch (err) {
		console.error(err);
	}
};
