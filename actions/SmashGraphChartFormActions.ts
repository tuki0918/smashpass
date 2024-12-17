"use server";

import type { formSchema } from "@/components/SmashGraphChartForm";
import { DB_FIRESTORE_COLLECTION_NAMES } from "@/config/app";
import type { DBDocument } from "@/types/firebase/firestore";
import type {
	SmashGraphDocumentData,
	SmashGraphItemDocumentData,
} from "@/types/firebase/firestore/models";
import { db } from "@/utils/firebase";
import { docRef, docsQuery, getDocsByQuery } from "@/utils/firestore";
import {
	addDoc,
	collection,
	deleteDoc,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import type { Timestamp } from "firebase/firestore";
import { where } from "firebase/firestore";
import type { z } from "zod";

export const saveItem = async (
	id: string | null,
	v: z.infer<typeof formSchema>,
) => {
	try {
		// TODO: check permission
		const collectionId = DB_FIRESTORE_COLLECTION_NAMES.graph;
		const collectionRef = collection(db, collectionId);

		const values: Omit<
			SmashGraphDocumentData,
			"created_by_id" | "updated_by_id"
		> = {
			title: v.title,
			description: v.description,
			type: "graph",
			style: v.style,
			sort: v.sort,
			status: v.status,
		};

		if (id) {
			// update
			const data: Partial<DBDocument<SmashGraphDocumentData>> = {
				...values,
				updated_by_id: v.user_id,
				updated_at: serverTimestamp() as Timestamp,
			};
			await updateDoc(docRef("graph", id), data);
		} else {
			// TODO: transaction
			const collectionItemId = DB_FIRESTORE_COLLECTION_NAMES.graph_item;
			const collectionItemRef = collection(db, collectionItemId);

			// create
			const data: DBDocument<SmashGraphDocumentData> = {
				...values,
				created_by_id: v.user_id,
				updated_by_id: v.user_id,
				created_at: serverTimestamp() as Timestamp,
				updated_at: serverTimestamp() as Timestamp,
			};

			const doc = await addDoc(collectionRef, data);

			const item_values: Omit<
				SmashGraphItemDocumentData,
				"created_by_id" | "updated_by_id"
			>[] = v.items
				// remove empty items
				.filter((item) => item.title.length > 0)
				// map to item values
				.map((item, i) => ({
					title: item.title,
					// TODO: default count for graph
					count: 1,
					sort_order: i + 1,
					graph_id: doc.id,
				}));

			// create graph and items
			await Promise.all(
				item_values.map((item) => {
					const itemData: DBDocument<SmashGraphItemDocumentData> = {
						...item,
						created_by_id: v.user_id,
						updated_by_id: v.user_id,
						created_at: serverTimestamp() as Timestamp,
						updated_at: serverTimestamp() as Timestamp,
					};
					return addDoc(collectionItemRef, itemData);
				}),
			);
		}
	} catch (err) {
		console.error(err);
	}
};

export const deleteItem = async (id: string) => {
	try {
		// TODO: check permission
		const items = await getDocsByQuery(
			docsQuery("graph_item", [where("graph_id", "==", id)]),
		);
		// TODO: transaction
		await deleteDoc(docRef("graph", id));
		await Promise.all(
			items.map((item) => {
				return deleteDoc(docRef("graph_item", item.id));
			}),
		);
	} catch (err) {
		console.error(err);
	}
};
