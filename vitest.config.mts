/// <reference types="vitest" />
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	test: {
		environment: "jsdom",
		globals: true,
	},
	resolve: {
		alias: [{ find: "@", replacement: resolve(__dirname, ".") }],
	},
});
