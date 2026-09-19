import { defineConfig } from "@phreshos/core"
import metadata from "./package.json"

export default defineConfig({
    identity: "react-ui",
    name: metadata.displayName,
    description: metadata.description,
    version: metadata.version,
    categories: ["Development"],
    keywords: ["react", "components", "appearance", "preview"],
    buildCommand: "npm run build",
    client: {
        location: "dist/client",
        size: { width: 1100, height: 760 },
        devCommand: "vite --config vite.client.ts"
    }
})
