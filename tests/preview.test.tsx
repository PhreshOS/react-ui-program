import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, expect, it } from "vitest"
import { standardAppearance } from "@phreshos/core"
import Preview from "../client/view/preview"
import config from "../phresh.config"

afterEach(cleanup)

it("declares a Client-only Program with no permissions", () => {

    expect(config.server).toBeUndefined()

    expect(config.client?.permissions).toBeUndefined()
})

it("edits locally and resets to the latest Desktop appearance", async () => {

    const user = userEvent.setup()

    const view = render(<Preview appearance={standardAppearance} theme="light" />)

    fireEvent.change(screen.getByRole("slider", { name: "radius" }), { target: { value: "18" } })

    expect((screen.getByRole("slider", { name: "radius" }) as HTMLInputElement).value).toBe("18")

    expect(standardAppearance.radius.light).toBe(10)

    view.rerender(<Preview appearance={{ ...standardAppearance, radius: { light: 8 } }} theme="dark" />)

    expect((screen.getByRole("slider", { name: "radius" }) as HTMLInputElement).value).toBe("18")

    await user.click(screen.getByRole("button", { name: "Reset" }))

    expect((screen.getByRole("slider", { name: "radius" }) as HTMLInputElement).value).toBe("8")

    expect((screen.getByRole("textbox", { name: "background" }) as HTMLInputElement).value).toBe(standardAppearance.background.dark)
})

it("switches theme without inferring colors from its name", async () => {

    const user = userEvent.setup()

    render(<Preview appearance={{ ...standardAppearance, background: { light: "#111111", dark: "#eeeeee" } }} theme="light" />)

    expect((screen.getByRole("textbox", { name: "background" }) as HTMLInputElement).value).toBe("#111111")

    await user.click(screen.getByRole("button", { name: "Dark" }))

    expect((screen.getByRole("textbox", { name: "background" }) as HTMLInputElement).value).toBe("#eeeeee")
})

it("exercises Button activation, disabled and pending states", async () => {

    const user = userEvent.setup()

    render(<Preview appearance={standardAppearance} theme="light" />)

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

    render(<Preview appearance={standardAppearance} theme="light" />)

    for (const name of ["Surface", "Panel", "Flex", "Grid", "Tokens", "Button"]) {

        await user.click(screen.getByRole("button", { name }))

        expect(screen.getByRole("heading", { name, level: 2 })).toBeTruthy()
    }
})
