"use client";

import LoginButton from "@/components/LoginButton";
import SiteTextLogo from "@/components/SiteTextLogo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FC, useEffect } from "react";

const Main: FC = () => {
	const router = useRouter();
	const { user, isLoading } = useAuth();

	useEffect(() => {
		if (user) {
			router.replace("/dashboard");
		}
	}, [router, user]);

	if (user) return null;
	return <>{isLoading ? <AuthWaitCompleted /> : <LoginForm />}</>;
};

export default Main;

const LoginForm: FC = () => {
	return (
		<Card>
			<CardHeader>{/* ... */}</CardHeader>
			<CardContent>
				<div className="p-8 pb-0 max-w-[420px]">
					<div className="scale-[3] mb-12 ml-2 mr-8">
						<SiteTextLogo />
					</div>

					<p className="mb-8 text-gray-500">
						"123++" is a real-time online counter service that can be shared
						with the audience.
					</p>

					<div className="flex items-center justify-center mb-8">
						<LoginButton />
					</div>

					<Separator className="my-4" />

					<div className="my-4">
						<p className="px-8 text-center text-sm text-muted-foreground">
							<Link
								href="/"
								className="underline underline-offset-4 hover:text-primary"
							>
								Terms of Service
							</Link>{" "}
							<span className="mx-2">|</span>{" "}
							<Link
								href="/"
								className="underline underline-offset-4 hover:text-primary"
							>
								Privacy Policy
							</Link>
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const AuthWaitCompleted: FC = () => {
	return (
		<div className="min-h-screen flex items-center justify-center">
			<LoaderCircle color="#999999" size={48} className="animate-spin" />
		</div>
	);
};
