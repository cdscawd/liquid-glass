---
name: liquid-glass-component
description: >-
  Generates React Liquid Glass components (SVG displacement map + backdrop-filter
  refraction). Use when creating or extending *LiquidGlass components, liquid
  glass UI, glassmorphism with edge refraction, useLiquidGlassEffect, or when
  the user imports this skill to scaffold glass buttons, cards, inputs, overlays,
  switches, or similar components matching the liquid-glass library pattern.
---

# Liquid Glass Component Generator

Generate **Liquid Glass** React components: SVG displacement refraction + `backdrop-filter`, shared via `useLiquidGlassEffect`.

## When to apply

- User asks to **create / add / scaffold** a `*LiquidGlass` component
- User mentions liquid glass, glass refraction, displacement map, or `glassParams`
- User imported this skill to reproduce the liquid-glass component style

## Prerequisites

Before generating, verify the target project has:

```
src/lib/liquid-glass/     # hook + filter + provider (do NOT duplicate)
src/styles/_variables.scss
src/styles/_glass-mixins.scss
src/styles/global.scss    # .filter-liquid-glass
```

If missing, tell the user to copy `src/lib/liquid-glass/` and `src/styles/` from the liquid-glass repo first. **Never re-implement** `generateDisplacementMap`, `LiquidGlassFilter`, or `BACKDROP_FILTER` inside a component.

If `.cursor/rules/liquid-glass-components.mdc` exists in the repo, read it and follow the component inventory — extend existing components before creating duplicates.

## Generation workflow

Copy and track progress:

```
- [ ] 1. Classify request (archetype + host element)
- [ ] 2. Check existing components — extend vs new
- [ ] 3. Create ComponentNameLiquidGlass/ (tsx + scss + index.ts)
- [ ] 4. Wire barrel export in components/index.ts
- [ ] 5. Add minimal demo (DemoSections or App)
- [ ] 6. npm run build
- [ ] 7. Update liquid-glass-components.mdc inventory if present
```

### Step 1 — Pick archetype

| Archetype | Use when | Glass filters | Reference |
|-----------|----------|---------------|-----------|
| **basic-host** | Static container, divider, badge, card shell | 1 on host | `DividerLiquidGlass` |
| **interactive** | Button, icon button, clickable control | 1 on host + `glass-interactive` | `ButtonLiquidGlass` |
| **input-host** | Input, textarea — glass on wrapper, inner native control transparent | 1 on wrapper | `InputLiquidGlass` |
| **thumb-slider** | Switch, segmented slider — track has filter, thumb is SCSS only | 1 on track only | `SwitchLiquidGlass` |
| **overlay-portal** | Modal, drawer, toast, popover | 1 per panel + overlay mixin | `ModalLiquidGlass` |
| **list-single** | List rows — one filter on container, rows use bg highlight | 1 on list container | `ListLiquidGlass` |

**Hard rules**

- 1 glass host = 1 `useLiquidGlassEffect` = 1 `LiquidGlassFilter`
- Never nest backdrop-filter (parent filter + child filter)
- Lists/tables: single container filter, not per-row
- Measure inner size with `clientWidth` / `clientHeight` when positioning children inside bordered hosts

### Step 2 — Naming

| Item | Rule | Example |
|------|------|---------|
| Component | `{Semantic}LiquidGlass` | `ChipLiquidGlass` |
| Directory | `src/components/ChipLiquidGlass/` | |
| Props | `{Semantic}LiquidGlassProps` | |
| Size type | `{Semantic}LiquidGlassSize` | `'sm' \| 'md' \| 'lg'` |
| CSS root | `{kebab}-liquid-glass` | `chip-liquid-glass` |
| Modifiers | `--sm`, `--primary`, `--checked` | |

Replace `{Semantic}` / `{kebab}` consistently (e.g. `Chip` / `chip`).

### Step 3 — Required API surface

Every glass host exposes:

```tsx
interface XxxLiquidGlassProps extends /* native HTML attrs */ {
  glassParams?: LiquidGlassParams  // borderRadius | edgeFalloff | strength
  variant?: LiquidGlassVariant     // when semantic colors needed
  className?: string
  style?: CSSProperties
}
```

Optional by archetype: `size`, `thumbGlassParams`, `fillGlassParams`, `panelGlassParams`.

Param merge priority: `props.glassParams` > hook `preset` > `LiquidGlassProvider` > constants.

### Step 4 — Shape presets

Use `GLASS_SHAPE` — never hardcode `999`, `24`, `6`:

| Shape | Constant | Typical components |
|-------|----------|-------------------|
| default | `GLASS_SHAPE.default` | Card, Input, Modal |
| pill | `GLASS_SHAPE.pill` | Button, Switch, Badge chip |
| dock | `GLASS_SHAPE.dock` | Dock |
| badge | `GLASS_SHAPE.badge` | Badge tag |

```tsx
useLiquidGlassEffect<HTMLDivElement>(glassParams, {
  preset: { borderRadius: GLASS_SHAPE.pill },
  baseClass: 'chip-liquid-glass',
  variant,
})
```

### Step 5 — SCSS mixins

```scss
@use '../../styles/glass-mixins' as *;

.chip-liquid-glass {
  @include glass-surface;          // always
  @include glass-variant-modifiers; // if variant prop
  @include glass-text;             // if text inside
  @include glass-interactive;       // buttons only
  @include glass-focus-ring;        // custom focus (switch, slider)
  @include glass-input-host;        // input/textarea wrapper
  @include glass-thumb;             // draggable thumb (visual only)
  @include glass-overlay-backdrop;  // modal/drawer mask
}
```

Colors/borders/shadows: **only** `$glass-*` tokens from `_variables.scss`. Layout/size in component SCSS. Inline `borderRadius` from hook wins over SCSS radius.

### Step 6 — Files to create

For component `{Semantic}LiquidGlass` / `{kebab}`:

1. `{Semantic}LiquidGlass.tsx` — see [templates.md](templates.md)
2. `{Semantic}LiquidGlass.scss` — root `.{{kebab}}-liquid-glass`
3. `index.ts` — re-export component + types + default

Barrel (`src/components/index.ts`):

```ts
export { ChipLiquidGlass, type ChipLiquidGlassProps, type ChipLiquidGlassSize } from './ChipLiquidGlass'
```

### Step 7 — Demo block

Add a minimal demo section with:

- Default usage
- `size` variants (if applicable)
- One `glassParams` preset example
- Disabled state (if interactive)

Follow existing demo patterns in `src/demo/DemoSections.tsx` and `demoNav.ts`.

### Step 8 — Validate

```bash
npm run build
```

Fix TypeScript and SCSS errors before finishing.

## Decision tree (extend vs new)

```
Same UX as existing component?
├─ Yes → extend props/variants on existing *LiquidGlass
└─ No → new component
    ├─ Needs portal? → overlay-portal archetype
    ├─ Native input inside? → input-host
    ├─ Draggable thumb? → thumb-slider (track filter only)
    ├─ Many rows? → list-single
    └─ Clickable? → interactive : basic-host
```

## Forbidden

- Copying displacement map / filter logic into components
- CSS `filter: blur()` as fake liquid glass
- Hardcoded `rgba(255,255,255,0.06)`, `999`, `1.15`
- Parent + child both with backdrop-filter
- Per-row glass filters in lists
- Git commit unless user asks

## Additional resources

- Code templates per archetype: [templates.md](templates.md)
- Full repo conventions: `.cursor/rules/liquid-glass-components.mdc` (if present)
