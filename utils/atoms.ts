import type {
	DBDocumentWithId,
	SmashCounterDocumentData,
} from "@/types/firebase/firestore";
import type { UserInfo } from "firebase/auth";
import { atom } from "jotai";

export const smashCounterAtom = atom<
	DBDocumentWithId<SmashCounterDocumentData> | undefined | null
>(undefined);

export const userAtom = atom<UserInfo | null>(null);
