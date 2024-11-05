import type { DBDocumentWithId } from "@/types/firebase/firestore";
import type { SmashCounterDocumentData } from "@/types/firebase/firestore/models";
import type { UserInfo } from "firebase/auth";
import { atom } from "jotai";

/** T: data, null: not found, undefined: loading data */
type AtomData<T> = T | null | undefined;

export const smashCounterAtom = atom<
	DBDocumentWithId<SmashCounterDocumentData> | undefined | null
>(undefined);

export const userAtom = atom<AtomData<UserInfo>>(undefined);
