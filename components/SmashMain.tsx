import type { FC } from "react";
import { SmashCounterWithAtom } from "./SmashCounter";

const SmashMain: FC<{ docId: string }> = ({ docId }) => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<SmashCounterWithAtom docId={docId} />
		</div>
	);
};

export default SmashMain;
