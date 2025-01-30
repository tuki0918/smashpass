"use client";

import { useFirestoreDocumentSync } from "@/hooks/useFirestore";
import { cn } from "@/lib/utils";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type { DBDocument } from "@/types/firebase/firestore";
import type { SmashClickCounterDocumentData } from "@/types/firebase/firestore";
import { docRef, getDocByRef } from "@/utils/firestore";
import NumberFlow from "@number-flow/react";
import { increment, serverTimestamp, setDoc } from "firebase/firestore";
import { AnimatePresence, motion } from "framer-motion";
import { type FC, useMemo } from "react";

const SmashClickCounter: FC<{
  /** undefined: loading, null: not found */
  data: CSDocumentWithId<SmashClickCounterDocumentData> | undefined | null;
  isAct?: boolean;
}> = ({ data, isAct = false }) => {
  const isPublished = data?.status === "published";
  const icon = data?.icon;

  const content =
    data === undefined ? (
      <span>...</span>
    ) : data === null ? (
      <span>=</span>
    ) : (
      <div
        style={{
          fontVariantNumeric: "tabular-nums",
          // @ts-ignore
          "--number-flow-char-height": "0.85em",
        }}
      >
        <NumberFlow value={data.count} aria-hidden="true" willChange />
      </div>
    );

  return (
    <div className="flex items-center justify-center space-x-2 select-none">
      <span
        className={cn("text-6xl font-bold", {
          "text-gray-600": isPublished, // active
          "text-gray-400": !isPublished, // inactive
        })}
      >
        {content}
      </span>

      {data?.status === "published" && isAct ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            className="text-5xl hover:cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onClick={async () => await incrementCount(data.id)}
          >
            {icon}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="text-5xl">{icon}</span>
      )}
    </div>
  );
};

export default SmashClickCounter;

export const RealTimeSmashClickCounter: FC<{
  docId: string;
  isAct?: boolean;
}> = ({ docId, isAct = false }) => {
  // Prevent duplicate effect
  const ref = useMemo(() => docRef("click", docId), [docId]);
  const data = useFirestoreDocumentSync(ref);
  return <SmashClickCounter data={data} isAct={isAct} />;
};

// Consider network latency and execute on the client side (firestore rules)
const incrementCount = async (docId: string) => {
  try {
    const ref = docRef("click", docId);
    const data = await getDocByRef(ref);
    console.log("data", docId);

    if (data) {
      // Only increment if the document is published
      if (data.status !== "published") {
        return;
      }

      await setDoc(
        ref,
        {
          count: increment(1) as unknown as number,
        } as Partial<DBDocument<SmashClickCounterDocumentData>>,
        { merge: true },
      );
    }
  } catch (err) {
    console.error(err);
  }
};
