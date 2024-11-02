"use client";

import LoginButton from "@/components/LoginButton";
import SiteTextLogo from "@/components/SiteTextLogo";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, useEffect } from "react";

const Main: FC = () => {
	const router = useRouter();
	const { user } = useAuth();

	useEffect(() => {
		if (user) {
			router.replace("/dashboard");
		}
	}, [router, user]);

	return (
		<div>
			<div className="scale-[3] mb-12 ml-2 mr-8">
				<SiteTextLogo />
			</div>
			<div className="flex items-center justify-center">
				<LoginButton />
			</div>
			<div className="my-4">
				<p className="px-8 text-center text-sm text-muted-foreground">
					<Link
						href="/terms"
						className="underline underline-offset-4 hover:text-primary"
					>
						Terms of Service
					</Link>{" "}
					<span className="mx-2">|</span>{" "}
					<Link
						href="/privacy"
						className="underline underline-offset-4 hover:text-primary"
					>
						Privacy Policy
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Main;
