"use client";

import { useFirestoreDocumentSync } from "@/hooks/useFirestore";
import { cn } from "@/lib/utils";
import type { CSDocumentWithId } from "@/types/firebase/firestore";
import type { SmashViewCounterDocumentData } from "@/types/firebase/firestore";
import { docRef } from "@/utils/firestore";
import NumberFlow from "@number-flow/react";
import { type FC, useMemo } from "react";

const SmashViewCounter: FC<{
  /** undefined: loading, null: not found */
  data: CSDocumentWithId<SmashViewCounterDocumentData> | undefined | null;
}> = ({ data }) => {
  const isPublished = data?.status === "published";

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
    <div
      className={cn("select-none text-6xl font-bold", {
        "text-gray-600": isPublished, // active
        "text-gray-400": !isPublished, // inactive
      })}
    >
      {content}
    </div>
  );
};

export default SmashViewCounter;

export const RealTimeSmashViewCounter: FC<{ docId: string }> = ({ docId }) => {
  // Prevent duplicate effect
  const ref = useMemo(() => docRef("view", docId), [docId]);
  const data = useFirestoreDocumentSync(ref);
  return <SmashViewCounter data={data} />;
};
