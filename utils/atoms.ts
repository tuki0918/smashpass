import type {
	DBDocument,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import { atom } from "jotai";

export const smashCounterAtom = atom<
	DBDocument<SmashCounterDocumentData> | undefined
>(undefined);
