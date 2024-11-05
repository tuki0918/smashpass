import type { AtomData } from "@/types/atoms";
import type { UserInfo } from "firebase/auth";
import { atom } from "jotai";

export const userAtom = atom<AtomData<UserInfo>>(undefined);
