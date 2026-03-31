import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
    appName: "komjirak-bible",
    brand: {
        displayName: "말씀필사",
        primaryColor: "#3182F6",
        icon: "https://static.toss.im/appsintoss/5277/16db1b4a-6c5f-4c30-bdaa-4a3c53e8fd26.png"
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
