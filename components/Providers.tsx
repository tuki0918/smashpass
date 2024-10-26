"use client";

import { Provider } from "jotai";
import type { FC, ReactNode } from "react";

const Providers: FC<{
	children: ReactNode;
}> = ({ children }) => {
	return <Provider>{children}</Provider>;
};

export default Providers;
