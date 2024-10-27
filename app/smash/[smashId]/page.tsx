import { RealTimeSmashCounter } from "@/components/SmashCounter";

type Props = {
	params: { smashId: string };
};

export default function Page({ params }: Props) {
	const { smashId } = params;
	return (
		<div className="min-h-screen flex items-center justify-center">
			<RealTimeSmashCounter docId={smashId} />
		</div>
	);
}
