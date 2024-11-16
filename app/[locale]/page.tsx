import LanguageSelectMenu from "@/components/LanguageSelectMenu";
import Main from "@/components/Main";

export default function Page() {
	return (
		<div className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<div>
				<Main />

				<div className="mt-12">
					<LanguageSelectMenu />
				</div>
			</div>
		</div>
	);
}
