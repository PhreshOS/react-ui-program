# React UI Preview

A Client-only PhreshOS Program for exploring the actual components exported by
[@phreshos/react-ui](https://github.com/PhreshOS/react-ui): Button, Input,
Textarea, Checkbox, Radio, Switch, Select, Slider, Surface, Panel, Flex, and
Grid, plus color and spacing scales.

Browse components in the sidebar. The remaining space belongs to the selected
example, with responsive sample columns and independent scrolling. Open
Appearance for the local theme controls; they do not occupy a permanent column.

The preview follows Desktop appearance. Theme, palette, material, radius,
spacing, and shadow controls are local to the preview. Reset restores the
current Desktop values. Nothing is saved or written to System settings, and
the Program declares no permissions or Server endpoint.

## Development

With PhreshOS running and Node.js 24.15 or newer installed:

```sh
npm install
npm run dev
```

Use `npm run verify` to type-check, test, and build. Use `npm run pack` to
produce a Program archive. Bun can run the same scripts.

This preview currently targets the latest Core and React UI source builds,
including the independent shadow setting and experimental Surface-based controls. The local
dependencies are updated to those builds. A fresh install from npm requires
releases containing those changes; older published builds do not satisfy the
preview's current contracts.

See the [PhreshOS documentation](https://docs.phreshos.com) for installation
and Program development, and the [React UI repository](https://github.com/PhreshOS/react-ui)
for the component contracts. The preview consumes those contracts; it does not
reimplement the components.
