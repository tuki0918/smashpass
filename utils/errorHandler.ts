import type { ToastActionElement } from "@/components/ui/toast";
import type * as React from "react";

type ToastFunction = (params: {
	title?: string;
	description: string;
	variant?: "default" | "destructive" | null | undefined;
	action?: ToastActionElement;
}) => void;

export const handleError = (error: unknown, toast: ToastFunction) => {
	console.error(error);
	if (error instanceof Error) {
		toast({
			title: "Error",
			description: error.message,
			variant: "destructive",
		});
	} else {
		toast({
			title: "Error",
			description: "An error occurred",
			variant: "destructive",
		});
	}
};

export const handleErrorWithLoading =
	(
		toast: ToastFunction,
		setLoading: React.Dispatch<React.SetStateAction<boolean>>,
	) =>
	async (
		action: () => Promise<void>,
		callback?: (toast: ToastFunction) => void,
	) => {
		try {
			setLoading(true);
			await action();
			setLoading(false);
			if (callback) {
				callback(toast);
			}
		} catch (error) {
			setLoading(false);
			handleError(error, toast);
		}
	};
