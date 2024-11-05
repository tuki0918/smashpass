import type { AtomDBDocumentData, AtomData } from "@/types/atoms";
import type { SmashCounterDocumentData } from "@/types/firebase/firestore/models";
import type { UserInfo } from "firebase/auth";
import { atom } from "jotai";

export const smashCounterAtom =
	atom<AtomDBDocumentData<SmashCounterDocumentData>>(undefined);

export const userAtom = atom<AtomData<UserInfo>>(undefined);
