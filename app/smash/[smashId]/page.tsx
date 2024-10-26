import SmashMain from "@/components/SmashMain";

type Props = {
	params: { smashId: string };
};

export default function Page({ params }: Props) {
	const { smashId } = params;
	return (
		<div className="h-screen flex items-center justify-center">
			<SmashMain docId={smashId} />
		</div>
	);
}
