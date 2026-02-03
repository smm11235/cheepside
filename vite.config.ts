import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
	base: "/cheepside/",
	plugins: [react()],
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			"@game": resolve(__dirname, "src/game"),
			"@ui": resolve(__dirname, "src/ui"),
			"@shared": resolve(__dirname, "src/shared"),
			"@assets": resolve(__dirname, "src/assets"),
		},
	},
});
