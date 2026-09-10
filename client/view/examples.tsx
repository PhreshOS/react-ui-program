import { Button, Flex, Grid, Panel, Surface, useAppearance, useColor, useResolveTheme, useScale, useSurface, useTheme } from "@phreshos/react-ui"
import { motion } from "motion/react"
import { useRef, useState } from "react"
import darkWallpaper from "../../../system/assets/bundled/dark-wallpaper.png"
import lightWallpaper from "../../../system/assets/bundled/light-wallpaper.png"
import Inputs, { inputComponents } from "./inputs"

export const components = ["Button", ...inputComponents, "Surface", "Panel", "Flex", "Grid", "Tokens"] as const

export type Component = typeof components[number]

export default function Examples({ component }: { readonly component: Component }) {

    return <div className="examples" role="region" aria-label={`${component} preview`} tabIndex={0}>
        <h2>{component}</h2>
        {component === "Button" && <Buttons />}
        {inputComponents.map(name => component === name ? <Inputs key={name} component={name} /> : null)}
        {component === "Surface" && <Surfaces />}
        {component === "Panel" && <Panel header={<h3 className="sample-padding">Panel header</h3>}>
            <div className="sample-padding"><p>Content inside the inset Surface.</p><Button>Action</Button></div>
        </Panel>}
        {component === "Flex" && <Flex gap="medium" wrap align="center"><Tiles /></Flex>}
        {component === "Grid" && <Grid columns={3} gap="medium"><Tiles /></Grid>}
        {component === "Tokens" && <Tokens />}
    </div>
}

function Buttons() {

    const [presses, setPresses] = useState(0)

    const [disabled, setDisabled] = useState(false)

    const [pending, setPending] = useState(false)

    return <Grid gap={24}>
        <h3>Colors</h3>
        <Flex gap="medium" wrap>
            <Button onPress={() => setPresses(value => value + 1)}>Neutral</Button>
            {(["primary", "secondary", "success", "warning", "danger", "info"] as const).map(color =>
                <Button key={color} color={color} onPress={() => setPresses(value => value + 1)}>{color}</Button>)}
        </Flex>
        <h3>Sizes</h3>
        <Flex gap="medium" wrap align="center">
            {(["xsmall", "small", "medium", "large", "xlarge"] as const).map(size =>
                <Button key={size} size={size} onPress={() => setPresses(value => value + 1)}>{size}</Button>)}
        </Flex>
        <h3>States</h3>
        <Flex gap="medium" wrap align="center">
            <label><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} /> Disabled</label>
            <label><input type="checkbox" checked={pending} onChange={event => setPending(event.target.checked)} /> Pending</label>
            <Button color="primary" disabled={disabled} pending={pending} onPress={() => setPresses(value => value + 1)}>Test button</Button>
        </Flex>
        <p role="status" aria-label="Button presses">Presses: {presses}</p>
    </Grid>
}

function Surfaces() {

    const appearance = useAppearance()

    const primary = useResolveTheme(appearance.primary)

    const secondary = useResolveTheme(appearance.secondary)

    return <Grid gap={24}>
        <p className="muted">Default material over a colored backdrop. Controls affect the shared Appearance, not custom Surface paint.</p>
        <div className="material-stage" style={{ background: `radial-gradient(at 20% 80%, ${primary}, transparent 65%), radial-gradient(at 90% 10%, ${secondary}, transparent 60%)` }}>
            <Surface className="sample-padding"><h3>Surface</h3><p>Default border, material, and radius. No automatic shadow.</p><Button>Action</Button></Surface>
        </div>
        <section className="surface-background-example" aria-labelledby="surface-background-title">
            <h3 id="surface-background-title">System wallpaper</h3>
            <DraggableSurface />
        </section>
        <Grid gap={16} className="sample-grid">
            <CustomSurface />
            <Surface color="soft" radius="large" className="sample-padding"><h3>Derived values</h3><p>Soft background, large radius.</p></Surface>
            <Surface color={primary} radius={18} className="sample-padding"><h3>Direct values</h3><p>Primary color, 18px radius.</p></Surface>
        </Grid>
    </Grid>
}

function DraggableSurface() {

    const surface = useSurface<HTMLDivElement>()

    const wallpaper = useTheme() === "dark" ? darkWallpaper : lightWallpaper

    const bounds = useRef<HTMLDivElement>(null)

    return <div ref={bounds} className="surface-background-stage" style={{ backgroundImage: `url(${wallpaper})` }}>
        <motion.div
            role="group"
            aria-label="Draggable Surface"
            drag
            dragConstraints={bounds}
            dragMomentum={false}
            style={{ width: "100px", height: "100px" }}
        >
            {surface.material}
            Drag this material
        </motion.div>
    </div>
}

function CustomSurface() {
    const surface = useSurface<HTMLDivElement>({ color: "soft", radius: "small" })

    return <div ref={surface.ref} style={surface.style} className="sample-padding">
        {surface.material}
        <h3>Custom host</h3>
        <p>A native div driven directly by useSurface.</p>
        <Button color="primary" surface={{ opacity: 0.6, backdrop: 0 }}>Material override</Button>
    </div>
}

function Tiles() {

    return <>{[1, 2, 3, 4, 5, 6].map(value => <Surface className="sample-padding" key={value}>{value}</Surface>)}</>
}

function Tokens() {

    const appearance = useAppearance()

    const primary = useResolveTheme(appearance.primary)

    const colors = useColor(primary)

    const spacing = useScale(useResolveTheme(appearance.spacing))

    return <Grid gap={24}>
        <h3>Primary color scale</h3>
        <Grid columns={5} gap="small">
            {Object.entries(colors).map(([name, value]) => <div key={name}><div className="swatch" style={{ background: value }} /><p>{name}</p></div>)}
        </Grid>
        <h3>Spacing scale</h3>
        {Object.entries(spacing).map(([name, value]) => <Flex key={name} gap="medium" align="center">
            <div style={{ width: value, height: 24, background: primary }} /><span>{name} · {value}px</span>
        </Flex>)}
    </Grid>
}
