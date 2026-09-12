import { appearanceLimits, type Appearance, type Theme } from "@phreshos/core"
import { useState } from "react"

export const palette = ["background", "foreground", "primary", "secondary", "success", "warning", "danger", "info"] as const

export default function Controls({ appearance, theme, onChange }: {
    readonly appearance: Appearance
    readonly theme: Theme
    readonly onChange: (appearance: Appearance) => void
}) {

    return <div className="control-list">
        {palette.map(name => <label key={name} className="field">
            <span>{name}</span>
            <ColorInput key={`${theme}:${appearance.colors[theme][name]}`} name={name} value={appearance.colors[theme][name]}
                onChange={value => onChange({
                    ...appearance,
                    colors: {
                        ...appearance.colors,
                        [theme]: { ...appearance.colors[theme], [name]: value }
                    }
                })} />
        </label>)}
        {(["spacing", "radius"] as const).map(name => <Range key={name} name={name} value={appearance[name]} limits={appearanceLimits[name]}
            onChange={value => onChange({ ...appearance, [name]: value })} />)}
        <h3>Material</h3>
        {Object.entries(appearanceLimits.material).map(([name, limits]) => {

            const key = name as keyof typeof appearanceLimits.material

            return <Range key={key} name={key} value={appearance.material[theme][key]} limits={limits}
                onChange={value => onChange({ ...appearance, material: { ...appearance.material, [theme]: { ...appearance.material[theme], [key]: value } } })} />
        })}
        <h3>Shadow</h3>
        {Object.entries(appearanceLimits.shadow).map(([name, limits]) => {

            const key = name as keyof typeof appearanceLimits.shadow

            return <Range key={key} name={`shadow ${key}`} value={appearance.shadow[theme][key]} limits={limits}
                onChange={value => onChange({ ...appearance, shadow: { ...appearance.shadow, [theme]: { ...appearance.shadow[theme], [key]: value } } })} />
        })}
    </div>
}

function ColorInput({ name, value, onChange }: { readonly name: string, readonly value: string, readonly onChange: (value: string) => void }) {

    const [draft, setDraft] = useState(value)

    const [invalid, setInvalid] = useState(false)

    function apply() {

        const valid = CSS.supports("color", draft)

        setInvalid(!valid)

        if (valid) onChange(draft)
    }

    return <>
        <input aria-label={name} aria-invalid={invalid} value={draft} onChange={event => setDraft(event.target.value)}
            onBlur={apply} onKeyDown={event => { if (event.key === "Enter") apply() }} />
        {invalid && <span role="alert">Enter a valid CSS color.</span>}
    </>
}

function Range({ name, value, limits, onChange }: {
    readonly name: string
    readonly value: number
    readonly limits: { readonly minimum: number, readonly maximum: number }
    readonly onChange: (value: number) => void
}) {

    return <label className="field">
        <span>{name} <output>{value}</output></span>
        <input type="range" aria-label={name} min={limits.minimum} max={limits.maximum} step={limits.maximum <= 3 ? 0.01 : 1}
            value={value} onChange={event => onChange(event.target.valueAsNumber)} />
    </label>
}
