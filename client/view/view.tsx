import { DesktopProvider, SystemProvider, useResolvedDesktopPreferences, useSystemAppearance } from "@phreshos/react"
import { desktop, system } from "@phreshos/client"
import Preview from "./preview"
import "./style.css"

export default function View() {

    return <SystemProvider system={system} fallback={<div role="status">Opening System…</div>}>
        <DesktopProvider desktop={desktop} fallback={<div role="status">Opening Desktop…</div>}>
            <ConnectedPreview />
        </DesktopProvider>
    </SystemProvider>
}

function ConnectedPreview() {

    const appearance = useSystemAppearance()

    const preferences = useResolvedDesktopPreferences()

    return <Preview appearance={appearance} preferences={preferences} />
}
