"use server";

import type { formSchema } from "@/components/SmashViewCounterForm";
import { DB_FIRESTORE_COLLECTION_NAMES } from "@/constants";
import type { DBDocument } from "@/types/firebase/firestore";
import type { SmashViewCounterDocumentData } from "@/types/firebase/firestore";
import { db } from "@/utils/firebase";
import { docRef, getDocByRef } from "@/utils/firestore";
import { deleteDoc } from "firebase/firestore";
import {
	addDoc,
	collection,
	increment,
	serverTimestamp,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import type { z } from "zod";

export const deleteItem = async (id: string) => {
	try {
		// TODO: check permission
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
		// TODO: check permission
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

export const incrementCount = async (docId: string) => {
	try {
		const ref = docRef("view", docId);
		const data = await getDocByRef(ref);

		if (data) {
			// Only increment if the document is published
			if (data.status !== "published") {
				return;
			}

			await setDoc(
				ref,
				{
					count: increment(1) as unknown as number,
					updated_at: serverTimestamp(),
				} as Partial<DBDocument<SmashViewCounterDocumentData>>,
				{ merge: true },
			);
		}
	} catch (err) {
		console.error(err);
	}
};
