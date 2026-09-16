import { AlertDialog, Button, ContextMenu, Dialog, DropdownMenu, Flex, Grid, Menu, Panel, Popover, Surface, Tooltip, useAppearance, useColor, usePreferences, useScale, useThemedValue } from "@phreshos/react-ui"
import { motion } from "motion/react"
import { useRef, useState } from "react"
import darkWallpaper from "../assets/dark-wallpaper.png"
import lightWallpaper from "../assets/light-wallpaper.png"
import Inputs, { inputComponents } from "./inputs"

export const components = ["Button", ...inputComponents, "Surface", "Panel", "Popover", "DropdownMenu", "ContextMenu", "Dialog", "AlertDialog", "Tooltip", "Flex", "Grid", "Tokens"] as const

export type Component = typeof components[number]

export default function Examples({ component }: { readonly component: Component }) {

    return <div className="examples" role="region" aria-label={`${component} preview`} tabIndex={0}>
        <h2>{component}</h2>
        {component === "Button" && <Buttons />}
        {inputComponents.map(name => component === name ? <Inputs key={name} component={name} /> : null)}
        {component === "Surface" && <Surfaces />}
        {component === "Panel" && <Panel>
            <Panel.Header><h3 className="sample-padding">Panel header</h3></Panel.Header>
            <Panel.Content><div className="sample-padding"><p>Content inside the inset Surface.</p><Button>Action</Button></div></Panel.Content>
        </Panel>}
        {component === "Popover" && <Popover>
            <Popover.Trigger>Open popover</Popover.Trigger>
            <Popover.Content>
                <Popover.Dialog aria-label="Example popover" style={{ padding: 12 }}>
                    <Popover.Title>Popover</Popover.Title>
                    <p>Anchored non-modal content.</p>
                    <Popover.Close>Close</Popover.Close>
                </Popover.Dialog>
            </Popover.Content>
        </Popover>}
        {component === "DropdownMenu" && <DropdownMenu>
            <DropdownMenu.Trigger>Open menu</DropdownMenu.Trigger>
            <DropdownMenu.Content><ExampleMenu /></DropdownMenu.Content>
        </DropdownMenu>}
        {component === "ContextMenu" && <ContextMenu>
            <ContextMenu.Trigger><button className="sample-padding">Right-click this target</button></ContextMenu.Trigger>
            <ContextMenu.Content><ExampleMenu /></ContextMenu.Content>
        </ContextMenu>}
        {component === "Dialog" && <Dialog>
            <Dialog.Trigger>Open dialog</Dialog.Trigger>
            <Dialog.Backdrop isDismissable>
                <Dialog.Content>
                    <Dialog.Header><Dialog.Title>Dialog</Dialog.Title><Dialog.Description>Modal content with explicit structural parts.</Dialog.Description></Dialog.Header>
                    <Dialog.Body>Dialog body</Dialog.Body>
                    <Dialog.Footer><Dialog.Close>Close</Dialog.Close></Dialog.Footer>
                </Dialog.Content>
            </Dialog.Backdrop>
        </Dialog>}
        {component === "AlertDialog" && <AlertDialog>
            <AlertDialog.Trigger color="danger:base">Delete</AlertDialog.Trigger>
            <AlertDialog.Backdrop>
                <AlertDialog.Content>
                    <AlertDialog.Header><AlertDialog.Title>Delete permanently?</AlertDialog.Title><AlertDialog.Description>This action requires an explicit decision.</AlertDialog.Description></AlertDialog.Header>
                    <AlertDialog.Footer><AlertDialog.Close>Cancel</AlertDialog.Close><AlertDialog.Close color="danger:base">Delete</AlertDialog.Close></AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog.Backdrop>
        </AlertDialog>}
        {component === "Tooltip" && <Tooltip delay={0}>
            <Tooltip.Trigger>Focus or hover</Tooltip.Trigger>
            <Tooltip.Content>Contextual description</Tooltip.Content>
        </Tooltip>}
        {component === "Flex" && <Flex gap="medium" wrap align="center"><Tiles /></Flex>}
        {component === "Grid" && <Grid columns={3} gap="medium"><Tiles /></Grid>}
        {component === "Tokens" && <Tokens />}
    </div>
}

function ExampleMenu() {
    return <Menu aria-label="Example actions">
        <Menu.Item onAction={() => undefined}>Open</Menu.Item>
        <Menu.Item onAction={() => undefined}>Rename</Menu.Item>
        <Menu.Separator />
        <Menu.Item color="danger:base" onAction={() => undefined}>Delete</Menu.Item>
    </Menu>
}

function Buttons() {

    const [presses, setPresses] = useState(0)

    const [disabled, setDisabled] = useState(false)

    const [pending, setPending] = useState(false)

    return <Grid gap={24}>
        <h3>Colors</h3>
        <Flex gap="medium" wrap>
            <Button onPress={() => setPresses(value => value + 1)}>Default</Button>
            {(["primary", "secondary", "success", "warning", "danger", "info"] as const).map(color =>
                <Button key={color} color={`${color}:base`} onPress={() => setPresses(value => value + 1)}>{color}</Button>)}
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
            <Button color="primary:base" disabled={disabled} pending={pending} onPress={() => setPresses(value => value + 1)}>Test button</Button>
        </Flex>
        <p role="status" aria-label="Button presses">Presses: {presses}</p>
    </Grid>
}

function Surfaces() {

    const appearance = useAppearance()

    const { primary, secondary } = useThemedValue(appearance.colors)

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
            <Surface color="background:soft" radius="large" className="sample-padding"><h3>Derived values</h3><p>Soft background, large radius.</p></Surface>
            <Surface color={primary} radius={18} className="sample-padding"><h3>Direct values</h3><p>Primary color, 18px radius.</p></Surface>
        </Grid>
    </Grid>
}

function DraggableSurface() {
    const wallpaper = usePreferences().theme === "dark" ? darkWallpaper : lightWallpaper

    const bounds = useRef<HTMLDivElement>(null)

    return <div ref={bounds} className="surface-background-stage" style={{ backgroundImage: `url(${wallpaper})` }}>
        <Surface
            as={motion.div}
            role="group"
            aria-label="Draggable Surface"
            drag
            dragConstraints={bounds}
            dragMomentum={false}
            style={{ width: 100, height: 100 }}
        >
            Drag this Surface
        </Surface>
    </div>
}

function CustomSurface() {
    return <Surface color="background:soft" radius="small" className="sample-padding">
        <h3>Custom material</h3>
        <p>A Surface owns one material and uses a div as its default host.</p>
        <Button color="primary:base" material={{ opacity: 0.6, backdrop: 0 }}>Material override</Button>
    </Surface>
}

function Tiles() {

    return <>{[1, 2, 3, 4, 5, 6].map(value => <Surface className="sample-padding" key={value}>{value}</Surface>)}</>
}

function Tokens() {

    const appearance = useAppearance()

    const primary = useThemedValue(appearance.colors).primary

    const colors = useColor(primary)

    const spacing = useScale(appearance.spacing)

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
