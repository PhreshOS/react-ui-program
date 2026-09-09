import { useState } from "react"
import {
    Checkbox, Flex, Grid, Input, Radio, RadioGroup, Select, Slider, Switch, Textarea,
    type ControlColor, type ScaleLevel
} from "@phreshos/react-ui"

export const inputComponents = ["Input", "Textarea", "Checkbox", "Radio", "Switch", "Select", "Slider"] as const

export type InputComponent = typeof inputComponents[number]

export default function Inputs({ component }: { readonly component: InputComponent }) {

    const [disabled, setDisabled] = useState(false)
    const [readOnly, setReadOnly] = useState(false)
    const [invalid, setInvalid] = useState(false)
    const [mixed, setMixed] = useState(false)
    const canReadOnly = component !== "Select" && component !== "Slider"
    const canValidate = component !== "Slider"

    return <Grid gap={24}>
        <h3>Interaction</h3>
        <Flex gap="medium" wrap>
            <Checkbox label="Disabled" checked={disabled} onChange={setDisabled} />
            {canReadOnly && <Checkbox label="Read only" checked={readOnly} onChange={setReadOnly} />}
            {canValidate && <Checkbox label="Invalid" checked={invalid} onChange={setInvalid} />}
            {component === "Checkbox" && <Checkbox label="Mixed" checked={mixed} onChange={setMixed} />}
        </Flex>
        <Example component={component} label={`Try ${component}`} disabled={disabled} readOnly={canReadOnly && readOnly}
            invalid={canValidate && invalid} mixed={mixed} showValue />
        <h3>Sizes</h3>
        <Grid className="sample-grid" gap="medium">
            {(["xsmall", "small", "medium", "large", "xlarge"] as const).map(size =>
                <Example key={size} component={component} label={`${size} ${component}`} size={size} />)}
        </Grid>
        <h3>Colors</h3>
        <Grid className="sample-grid" gap="medium">
            {(["primary", "secondary", "success", "warning", "danger", "info"] as const).map(color =>
                <Example key={color} component={component} label={`${color} ${component}`} color={color} />)}
        </Grid>
    </Grid>
}

function Example({ component, label, size, color, disabled, readOnly, invalid, mixed, showValue }: Readonly<{
    component: InputComponent
    label: string
    size?: ScaleLevel
    color?: ControlColor
    disabled?: boolean
    readOnly?: boolean
    invalid?: boolean
    mixed?: boolean
    showValue?: boolean
}>) {

    const [text, setText] = useState("")
    const [checked, setChecked] = useState(true)
    const [choice, setChoice] = useState<string | null>("one")
    const [number, setNumber] = useState(50)
    const properties = { label, size, color, disabled }
    const field = { ...properties, invalid, description: showValue ? "This value belongs only to the preview." : undefined, errorMessage: "Example validation error." }
    const value = component === "Checkbox" || component === "Switch" ? checked
        : component === "Radio" || component === "Select" ? choice
        : component === "Slider" ? number : text

    return <>
        {component === "Input" && <Input {...field} placeholder="Enter text" readOnly={readOnly} value={text} onChange={setText} />}
        {component === "Textarea" && <Textarea {...field} placeholder="Enter multiple lines" readOnly={readOnly} value={text} onChange={setText} />}
        {component === "Checkbox" && <Checkbox {...field} readOnly={readOnly} checked={checked} indeterminate={mixed} onChange={setChecked} />}
        {component === "Switch" && <Switch {...field} readOnly={readOnly} checked={checked} onChange={setChecked} />}
        {component === "Radio" && <RadioGroup {...field} readOnly={readOnly} value={choice} onChange={setChoice} orientation="horizontal">
            <Radio label="One" value="one" /><Radio label="Two" value="two" /><Radio label="Unavailable" value="unavailable" disabled />
        </RadioGroup>}
        {component === "Select" && <Select {...field} value={choice} onChange={setChoice} options={[
            { value: "one", label: "One" }, { value: "two", label: "Two" }, { value: "unavailable", label: "Unavailable", disabled: true }
        ]} />}
        {component === "Slider" && <Slider {...properties} value={number} onChange={setNumber} minValue={0} maxValue={100} step={5} />}
        {showValue && <p role="status" aria-label="Input value">Value: {JSON.stringify(value)}</p>}
    </>
}
