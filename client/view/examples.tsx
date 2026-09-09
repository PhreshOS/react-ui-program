import { Button, Flex, Grid, Panel, Surface, useAppearance, useColor, useResolveTheme, useScale } from "@phreshos/react-ui"
import { useState } from "react"

const components = ["Button", "Surface", "Panel", "Flex", "Grid", "Tokens"] as const

export default function Examples() {

    const [component, setComponent] = useState<typeof components[number]>("Button")

    return <div className="examples">
        <Flex gap="small" wrap aria-label="Components">
            {components.map(name => <Button key={name} color={component === name ? "primary" : undefined}
                aria-pressed={component === name} onPress={() => setComponent(name)}>{name}</Button>)}
        </Flex>
        <h2>{component}</h2>
        {component === "Button" && <Buttons />}
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
            <Surface className="sample-padding"><h3>Surface</h3><p>Border, material, radius, and shadow use React UI defaults.</p><Button>Action</Button></Surface>
        </div>
    </Grid>
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
