"use client";

import LoginButton from "@/components/LoginButton";
import SiteTextLogo from "@/components/SiteTextLogo";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import type { FC } from "react";

const Main: FC = () => {
	const router = useRouter();
	const { user } = useAuth();

	if (user) {
		router.push("/smash");
		return null;
	}

	return (
		<div>
			<div className="scale-[2] my-8 ml-2 mr-8">
				<SiteTextLogo />
			</div>
			<div className="flex items-center justify-center">
				<LoginButton />
			</div>
		</div>
	);
};

export default Main;
