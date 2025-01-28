"use client";

// import { Link } from "@/utils/i18n";
import { useTranslations } from "next-intl";

export default function Footer() {
	const t = useTranslations("Components/Footer");
	return (
		<footer className="bg-gray-50 p-8">
			<div className="container mx-auto">
				<p className="px-8 text-center text-sm text-muted-foreground">
					{/* <Link href="/" className="hover:text-primary">
						{t("terms_of_service")}
					</Link>{" "}
					<span className="mx-2">|</span>{" "}
					<Link href="/" className="hover:text-primary">
						{t("privacy_policy")}
					</Link>
					<span className="mx-2">|</span>{" "}
					<Link href="/" className="hover:text-primary">
						{t("tokushoho")}
					</Link>
					<span className="mx-2">|</span>{" "}
					<Link href="/" className="hover:text-primary">
						{t("contact")}
					</Link> */}
				</p>
			</div>
		</footer>
	);
}
