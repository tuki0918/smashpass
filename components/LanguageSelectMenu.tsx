"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { routing, usePathname, useRouter } from "@/utils/i18n";
import type { Locale } from "@/utils/i18n";
import { useLocale } from "next-intl";
import { type FC, useCallback, useMemo } from "react";

const LanguageSelectMenu: FC = () => {
	const router = useRouter();
	const pathname = usePathname();
	const locale = useLocale();
	const defaultLocale = routing.locales.includes(locale as Locale)
		? locale
		: routing.defaultLocale;

	const selectLanguage = useCallback(
		(language: Locale) => {
			router.replace(pathname, { locale: language });
		},
		[router, pathname],
	);

	return (
		<div className="flex items-center justify-center">
			<Select onValueChange={selectLanguage} defaultValue={defaultLocale}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select a Language" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="ja">日本語</SelectItem>
					<SelectItem value="en">English</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default LanguageSelectMenu;
