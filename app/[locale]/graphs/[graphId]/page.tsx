import { RealTimeSmashGraphChart } from "@/components/SmashGraphChart";
import { RealTimeSmashGraphChartVoteForm } from "@/components/SmashGraphChartVoteForm";
import { docRef, getDocByRef } from "@/utils/firestore";
import type { Metadata } from "next";

type Props = {
  params: { graphId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Page({ params, searchParams }: Props) {
  const { graphId } = params;
  const isAct = searchParams.act === "true";
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center">
      <RealTimeSmashGraphChart docId={graphId} />
      {isAct && <RealTimeSmashGraphChartVoteForm docId={graphId} />}
    </div>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { graphId } = params;
  const data = await getDocByRef(docRef("graph", graphId));

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
