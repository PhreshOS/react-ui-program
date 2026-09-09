import { AppearanceProvider, Button, Flex, Grid, Surface, useAppearance, useResolveTheme } from "@phreshos/react-ui"
import type { Appearance, Theme } from "@phreshos/core"
import { useEffect, useState } from "react"
import metadata from "../../package.json"
import Controls from "./controls"
import Examples from "./examples"

export default function Preview({ appearance, theme }: { readonly appearance: Appearance, readonly theme: Theme }) {

    const [draft, setDraft] = useState<Appearance | null>(null)

    const [selectedTheme, setTheme] = useState<Theme | null>(null)

    const effectiveTheme = selectedTheme ?? theme

    useEffect(() => { document.title = metadata.displayName }, [])

    return <AppearanceProvider appearance={draft ?? appearance} theme={effectiveTheme}>
        <Workspace>
            <Flex align="center" justify="between" gap="medium" wrap>
                <div><h1>{metadata.displayName}</h1><p className="muted">{metadata.description}</p></div>
                <Flex gap="small" wrap>
                    <Button aria-pressed={selectedTheme === null} onPress={() => setTheme(null)}>Desktop</Button>
                    <Button aria-pressed={selectedTheme === "light"} onPress={() => setTheme("light")}>Light</Button>
                    <Button aria-pressed={selectedTheme === "dark"} onPress={() => setTheme("dark")}>Dark</Button>
                    <Button onPress={() => { setDraft(null); setTheme(null) }}>Reset</Button>
                </Flex>
            </Flex>
            <Grid className="preview-layout" gap={16}>
                <Surface className="controls">
                    <h2>Appearance</h2>
                    <p className="muted">Local preview only. Reset follows the Desktop again.</p>
                    <Controls appearance={draft ?? appearance} theme={effectiveTheme} onChange={setDraft} />
                </Surface>
                <Examples />
            </Grid>
        </Workspace>
    </AppearanceProvider>
}

function Workspace({ children }: { readonly children: React.ReactNode }) {

    const appearance = useAppearance()

    const background = useResolveTheme(appearance.background)

    const foreground = useResolveTheme(appearance.foreground)

    return <div className="workspace" style={{ color: foreground, background }}>{children}</div>
}
