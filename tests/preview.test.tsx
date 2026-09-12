import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterAll, afterEach, beforeAll, expect, it } from "vitest"
import { defaultAppearance } from "@phreshos/core"
import Preview from "../client/view/preview"
import config from "../phresh.config"

// JSDOM does not implement the native dialog's top-layer operations.
const dialogDescriptors = Object.getOwnPropertyDescriptors(HTMLDialogElement.prototype)

beforeAll(() => {

    Object.defineProperties(HTMLDialogElement.prototype, {
        showModal: { configurable: true, value(this: HTMLDialogElement) { this.open = true } },
        close: { configurable: true, value(this: HTMLDialogElement) {

            this.open = false
            this.dispatchEvent(new Event("close"))
        } }
    })
})

afterEach(cleanup)

afterAll(() => {

    for (const name of ["showModal", "close"]) {

        if (dialogDescriptors[name]) Object.defineProperty(HTMLDialogElement.prototype, name, dialogDescriptors[name])
        else Reflect.deleteProperty(HTMLDialogElement.prototype, name)
    }
})

it("declares a Client-only Program with no permissions", () => {

    expect(config.server).toBeUndefined()

    expect(config.client?.permissions).toBeUndefined()
})

it("edits locally and resets to the latest Desktop appearance", async () => {

    const user = userEvent.setup()

    const view = render(<Preview appearance={defaultAppearance} theme="light" />)

    await user.click(screen.getByRole("button", { name: "Appearance" }))

    fireEvent.change(screen.getByRole("slider", { name: "radius" }), { target: { value: "18" } })

    expect((screen.getByRole("slider", { name: "radius" }) as HTMLInputElement).value).toBe("18")

    expect(defaultAppearance.radius).toBe(10)

    view.rerender(<Preview appearance={{ ...defaultAppearance, radius: 8 }} theme="dark" />)

    expect((screen.getByRole("slider", { name: "radius" }) as HTMLInputElement).value).toBe("18")

    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect((screen.getByRole("slider", { name: "radius" }) as HTMLInputElement).value).toBe("8")

    expect((screen.getByRole("textbox", { name: "background" }) as HTMLInputElement).value).toBe(defaultAppearance.colors.dark.background)
})

it("switches theme without inferring colors from its name", async () => {

    const user = userEvent.setup()

    render(<Preview appearance={{
        ...defaultAppearance,
        colors: {
            light: { ...defaultAppearance.colors.light, background: "#111111" },
            dark: { ...defaultAppearance.colors.dark, background: "#eeeeee" }
        }
    }} theme="light" />)

    await user.click(screen.getByRole("button", { name: "Appearance" }))

    expect((screen.getByRole("textbox", { name: "background" }) as HTMLInputElement).value).toBe("#111111")

    await user.click(screen.getByRole("button", { name: "Dark" }))

    expect((screen.getByRole("textbox", { name: "background" }) as HTMLInputElement).value).toBe("#eeeeee")
})

it("exercises Button activation, disabled and pending states", async () => {

    const user = userEvent.setup()

    render(<Preview appearance={defaultAppearance} theme="light" />)

    const button = screen.getByRole("button", { name: "Test button" })

    await user.click(button)

    expect(screen.getByRole("status", { name: "Button presses" }).textContent).toBe("Presses: 1")

    await user.click(screen.getByRole("checkbox", { name: "Disabled" }))

    await user.click(button)

    expect(screen.getByRole("status", { name: "Button presses" }).textContent).toBe("Presses: 1")

    await user.click(screen.getByRole("checkbox", { name: "Disabled" }))

    await user.click(screen.getByRole("checkbox", { name: "Pending" }))

    await user.click(button)

    expect(screen.getByRole("status", { name: "Button presses" }).textContent).toBe("Presses: 1")
})

it("renders every component example", async () => {

    const user = userEvent.setup()

    render(<Preview appearance={defaultAppearance} theme="light" />)

    for (const name of ["Input", "Textarea", "Checkbox", "Radio", "Switch", "Select", "Slider", "Surface", "Panel", "Flex", "Grid", "Tokens", "Button"]) {

        const button = within(screen.getByRole("navigation", { name: "Components" })).getByRole("button", { name })

        await user.click(button)

        expect(screen.getByRole("heading", { name, level: 2 })).toBeTruthy()
        expect(button.getAttribute("aria-pressed")).toBe("true")
        expect(screen.getByRole("region", { name: `${name} preview` })).toBeTruthy()
    }
})

it("renders a draggable Surface over a repository-owned wallpaper stage", async () => {

    const user = userEvent.setup()

    render(<Preview appearance={defaultAppearance} theme="light" />)

    await user.click(screen.getByRole("button", { name: "Surface" }))

    const surface = screen.getByRole("group", { name: "Draggable Surface" })
    const resolvedForeground = document.createElement("div")
    resolvedForeground.style.color = defaultAppearance.colors.light.foreground

    expect(surface.className).toBe("")
    expect(surface.style.background).toBe("transparent")
    expect(surface.style.position).toBe("relative")
    expect(surface.style.isolation).toBe("isolate")
    expect(surface.style.borderRadius).toBe("10px")
    expect(surface.style.color).toBe(resolvedForeground.style.color)
    expect(surface.querySelector("[data-material]")).toBeTruthy()
    expect(surface.parentElement?.style.backgroundImage).not.toBe("")
    expect(surface.closest(".workspace")?.getAttribute("style")).not.toContain("background")
})

it("keeps Appearance out of the browsing area until requested and retains edits after closing", async () => {

    const user = userEvent.setup()

    render(<Preview appearance={defaultAppearance} theme="light" />)

    expect(screen.queryByRole("dialog")).toBeNull()
    expect(screen.queryByRole("slider", { name: "radius" })).toBeNull()

    await user.click(screen.getByRole("button", { name: "Appearance" }))

    const dialog = screen.getByRole("dialog", { name: "Appearance" })

    fireEvent.change(within(dialog).getByRole("slider", { name: "radius" }), { target: { value: "18" } })
    await user.click(within(dialog).getByRole("button", { name: "Close" }))

    expect(screen.queryByRole("dialog")).toBeNull()

    await user.click(screen.getByRole("button", { name: "Input" }))
    await user.click(screen.getByRole("button", { name: "Appearance" }))

    expect((screen.getByRole("slider", { name: "radius" }) as HTMLInputElement).value).toBe("18")
})

it("exercises the input's controlled value and disabled state", async () => {

    const user = userEvent.setup()

    render(<Preview appearance={defaultAppearance} theme="light" />)

    await user.click(screen.getByRole("button", { name: "Input" }))
    await user.type(screen.getByRole("textbox", { name: "Try Input" }), "Example")

    expect(screen.getByRole("status", { name: "Input value" }).textContent).toBe('Value: "Example"')

    await user.click(screen.getByRole("checkbox", { name: "Disabled" }))

    expect((screen.getByRole("textbox", { name: "Try Input" }) as HTMLInputElement).disabled).toBe(true)
})
