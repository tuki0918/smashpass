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
            className="text-5xl hover:cursor-pointer relative"
            whileHover={{
              scale: 1.2,
              rotate: [0, -10, 10, -5, 0],
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 12,
                rotate: {
                  duration: 0.6,
                  ease: "easeInOut",
                },
              },
            }}
            whileTap={{
              scale: 0.8,
              rotate: 360,
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.8)",
              filter: "brightness(1.5) hue-rotate(45deg)",
              transition: {
                type: "spring",
                stiffness: 600,
                damping: 10,
                rotate: {
                  duration: 0.3,
                  ease: "easeOut",
                },
              },
            }}
            animate={{
              filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
              filter: {
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
            onClick={async () => await incrementCount(data.id)}
            style={{
              textShadow: "0 0 10px rgba(59, 130, 246, 0.3)",
            }}
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
