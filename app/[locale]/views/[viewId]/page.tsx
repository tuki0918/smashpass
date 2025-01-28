import { incrementCount } from "@/actions/SmashViewCounterActions";
import { RealTimeSmashViewCounter } from "@/components/SmashViewCounter";
import { docRef, getDocByRef } from "@/utils/firestore";
import type { Metadata } from "next";

type Props = {
  params: { viewId: string };
};

export default async function Page({ params }: Props) {
  const { viewId } = params;
  await incrementCount(viewId);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <RealTimeSmashViewCounter docId={viewId} />
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { viewId } = params;
  const data = await getDocByRef(docRef("view", viewId));

  if (data) {
    return {
      title: data.title,
      description: data.description,
    };
  }

  return {
    title: "Not Found",
  };
}
