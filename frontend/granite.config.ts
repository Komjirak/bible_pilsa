import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
    appName: "komjirak-bible",
    brand: {
        displayName: "말씀필사",
        primaryColor: "#3182F6",
        icon: "https://static.toss.im/appsintoss/5277/5d9b8f52-2eba-4b03-93df-e77bb3241c73.png"
    },
    permissions: [],
    navigationBar: {
        withBackButton: true,
        withHomeButton: true
    },
    web: {
        port: 5173,
        commands: {
            dev: "npm run dev",
            build: "npm run build"
        }
    },
    webViewProps: {
        type: "partner"
    },
    outdir: "dist"
});
