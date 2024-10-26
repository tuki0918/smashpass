import type { FC } from "react";

const Sample: FC<{
	text: string;
}> = ({ text }) => {
	return <div className="flex items-center justify-center">{text}</div>;
};

export default Sample;
