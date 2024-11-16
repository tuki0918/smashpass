"use server";

import type { formSchema } from "@/components/SmashViewCounterForm";
import { DB_FIRESTORE_COLLECTION_NAMES } from "@/config/app";
import type { DBDocument } from "@/types/firebase/firestore";
import type { SmashViewCounterDocumentData } from "@/types/firebase/firestore/models";
import { db } from "@/utils/firebase";
import { docRef } from "@/utils/firestore";
import { deleteDoc } from "firebase/firestore";
import {
	addDoc,
	collection,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import type { z } from "zod";

export const deleteItem = async (id: string) => {
	try {
		await deleteDoc(docRef("view", id));
	} catch (err) {
		console.error(err);
	}
};

export const saveItem = async (
	id: string | null,
	v: z.infer<typeof formSchema>,
) => {
	try {
		const collectionId = DB_FIRESTORE_COLLECTION_NAMES.view;
		const collectionRef = collection(db, collectionId);

		const values: Omit<
			SmashViewCounterDocumentData,
			"created_by_id" | "updated_by_id"
		> = {
			title: v.title,
			description: v.description,
			type: "view",
			count: v.count,
			status: v.status,
		};

		if (id) {
			// update
			const data: Partial<DBDocument<SmashViewCounterDocumentData>> = {
				...values,
				updated_by_id: v.user_id,
				updated_at: serverTimestamp() as Timestamp,
			};
			await updateDoc(docRef("view", id), data);
		} else {
			// create
			const data: DBDocument<SmashViewCounterDocumentData> = {
				...values,
				created_by_id: v.user_id,
				updated_by_id: v.user_id,
				created_at: serverTimestamp() as Timestamp,
				updated_at: serverTimestamp() as Timestamp,
			};
			await addDoc(collectionRef, data);
		}
	} catch (err) {
		console.error(err);
	}
};
