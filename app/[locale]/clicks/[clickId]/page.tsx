import { RealTimeSmashClickCounter } from "@/components/SmashClickCounter";
import { docRef, getDocByRef } from "@/utils/firestore";
import type { Metadata } from "next";

type Props = {
  params: { clickId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: Props) {
  const { clickId } = params;
  const isAct = searchParams.act === "true";
  return (
    <div className="min-h-screen flex items-center justify-center">
      <RealTimeSmashClickCounter docId={clickId} isAct={isAct} />
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clickId } = params;
  const data = await getDocByRef(docRef("click", clickId));

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
