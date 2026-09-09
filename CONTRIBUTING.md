# Contributing

Keep examples tied to the public React UI contracts. Use the components directly;
do not reproduce their styling or introduce preview-only versions of them.
Appearance edits must remain local and must never mutate System settings.

```sh
bun install --frozen-lockfile
bun run verify
```

Tests cover preview interactions and local state. The build uses the React
Compiler. Keep this repository independently installable without an enclosing
workspace, and keep source HTML readable.
