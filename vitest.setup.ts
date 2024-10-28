import nextConfig from "@/next.config.mjs";

vi.mock("next/config", () => {
	return {
		default: () => nextConfig,
	};
});
