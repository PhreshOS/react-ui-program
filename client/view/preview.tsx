import { AppearanceProvider, Button, Flex, Surface, useAppearance, useThemedValue } from "@phreshos/react-ui"
import type { Appearance, DesktopPreferences as Preferences, Theme } from "@phreshos/core"
import { useEffect, useRef, useState } from "react"
import metadata from "../../package.json"
import Controls from "./controls"
import Examples, { components, type Component } from "./examples"

export default function Preview({ appearance, preferences }: { readonly appearance: Appearance, readonly preferences: Preferences }) {

    const [draft, setDraft] = useState<Appearance | null>(null)

    const [selectedTheme, setTheme] = useState<Theme | null>(null)

    const [component, setComponent] = useState<Component>("Button")

    const appearanceDialog = useRef<HTMLDialogElement>(null)

    const effectivePreferences = selectedTheme === null ? preferences : { ...preferences, theme: selectedTheme }
    const effectiveTheme = effectivePreferences.theme

    useEffect(() => { document.title = metadata.displayName }, [])

    return <AppearanceProvider appearance={draft ?? appearance} preferences={effectivePreferences}>
        <Workspace>
            <Surface className="component-sidebar">
                <h1>{metadata.displayName}</h1>
                <div className="component-navigation" role="navigation" aria-label="Components">
                    {components.map(name => <Button key={name} size="small" style={{ justifyContent: "flex-start" }} color={component === name ? "primary:base" : undefined}
                        aria-pressed={component === name} onPress={() => setComponent(name)}>{name}</Button>)}
                </div>
                <Button size="small" aria-haspopup="dialog" onPress={() => appearanceDialog.current?.showModal()}>Appearance</Button>
            </Surface>
            <Examples key={component} component={component} />
            <dialog ref={appearanceDialog} className="appearance-dialog" aria-labelledby="appearance-title">
                <Surface className="appearance-panel">
                    <Flex align="center" justify="between" gap="small">
                        <h2 id="appearance-title">Appearance</h2>
                        <Button size="small" onPress={() => appearanceDialog.current?.close()}>Close</Button>
                    </Flex>
                    <Flex gap="small" wrap>
                        <Button size="small" aria-pressed={selectedTheme === null} onPress={() => setTheme(null)}>Desktop</Button>
                        <Button size="small" aria-pressed={selectedTheme === "light"} onPress={() => setTheme("light")}>Light</Button>
                        <Button size="small" aria-pressed={selectedTheme === "dark"} onPress={() => setTheme("dark")}>Dark</Button>
                        <Button size="small" onPress={() => { setDraft(null); setTheme(null) }}>Reset</Button>
                    </Flex>
                    <p className="muted">Local preview only. Reset follows the Desktop again.</p>
                    <Controls appearance={draft ?? appearance} theme={effectiveTheme} onChange={setDraft} />
                </Surface>
            </dialog>
        </Workspace>
    </AppearanceProvider>
}

function Workspace({ children }: { readonly children: React.ReactNode }) {

    const appearance = useAppearance()

    const foreground = useThemedValue(appearance.colors).foreground

    return <div className="workspace" style={{ color: foreground }}>{children}</div>
}
