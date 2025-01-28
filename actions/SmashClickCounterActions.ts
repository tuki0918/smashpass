"use server";

import type { formSchema } from "@/components/SmashClickCounterForm";
import { DB_FIRESTORE_COLLECTION_NAMES } from "@/constants";
import type { DBDocument } from "@/types/firebase/firestore";
import type { SmashClickCounterDocumentData } from "@/types/firebase/firestore/models";
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
		// TODO: check permission
		await deleteDoc(docRef("click", id));
	} catch (err) {
		console.error(err);
	}
};

export const saveItem = async (
	id: string | null,
	v: z.infer<typeof formSchema>,
) => {
	try {
		// TODO: check permission
		const collectionId = DB_FIRESTORE_COLLECTION_NAMES.click;
		const collectionRef = collection(db, collectionId);

		const values: Omit<
			SmashClickCounterDocumentData,
			"created_by_id" | "updated_by_id"
		> = {
			title: v.title,
			description: v.description,
			type: "click",
			count: v.count,
			icon: v.icon,
			status: v.status,
		};

		if (id) {
			// update
			const data: Partial<DBDocument<SmashClickCounterDocumentData>> = {
				...values,
				updated_by_id: v.user_id,
				updated_at: serverTimestamp() as Timestamp,
			};
			await updateDoc(docRef("click", id), data);
		} else {
			// create
			const data: DBDocument<SmashClickCounterDocumentData> = {
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
