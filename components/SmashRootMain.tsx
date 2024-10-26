import type { FC } from "react";
import { SmashCounterWithAtom } from "./SmashCounter";

const SmashRootMain: FC<{ docId: string }> = ({ docId }) => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<SmashCounterWithAtom docId={docId} />
		</div>
	);
};

export default SmashRootMain;
