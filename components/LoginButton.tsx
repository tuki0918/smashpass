"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LoaderCircle } from "lucide-react";
import type { FC } from "react";
import { useCallback, useState } from "react";

const LoginButton: FC = () => {
	const { login } = useAuth();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = useCallback(async () => {
		setIsLoading(true);
		await login();
		setIsLoading(false);
	}, [login]);

	return (
		<Button onClick={handleLogin} disabled={isLoading}>
			{isLoading && <LoaderCircle className="animate-spin" />}
			Login
		</Button>
	);
};

export default LoginButton;
