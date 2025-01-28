import type { DBDocumentWithId } from "@/types/firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import type { AtomData } from "./atom";

export type AtomDBDocumentData<T extends DocumentData> = AtomData<
  DBDocumentWithId<T>
>;
