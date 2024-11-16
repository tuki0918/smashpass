import { routing } from "@/utils/i18n/routing";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export const config = {
	// Match only internationalized pathnames
	matcher: [
		// Match all pathnames except for
		// - … if they start with `/api`, `/_next` or `/_vercel`
		// - … the ones containing a dot (e.g. `favicon.ico`)
		"/((?!api|_next|_vercel|.*\\..*).*)",
	],
};
