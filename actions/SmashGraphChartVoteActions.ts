"use server";

import type { formSchema } from "@/components/SmashGraphChartVoteForm";
import type { DBDocument } from "@/types/firebase/firestore";
import type { SmashGraphItemDocumentData } from "@/types/firebase/firestore";
import { docRef } from "@/utils/firestore";
import { increment, serverTimestamp, setDoc } from "firebase/firestore";
import type { z } from "zod";

export const voteItem = async (v: z.infer<typeof formSchema>) => {
  try {
    const ref = docRef("graph_item", v.id);
    await setDoc(
      ref,
      {
        count: increment(1) as unknown as number,
        updated_at: serverTimestamp(),
      } as Partial<DBDocument<SmashGraphItemDocumentData>>,
      { merge: true },
    );
  } catch (err) {
    console.error(err);
  }
};
