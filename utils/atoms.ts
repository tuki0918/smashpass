import type {
	DBDocumentWithId,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { atom } from "jotai";

export const smashCounterAtom = atom<
	DBDocumentWithId<SmashCounterDocumentData> | undefined | null
>(undefined);
